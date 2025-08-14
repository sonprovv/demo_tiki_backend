import { Router, Request, Response } from "express";
import { Books, NewBook } from "../model/book";
import path from "path";
import fs from "fs";
const { bookSchema, newBookSchema } = require("../schema/book");

const router = Router();
let books: Books[] = [];
const dataFilePath = path.join(__dirname, '..', '..', 'data.json');

const saveBooksToFile = (books: Books[]) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(books, null, 2));
};

function loadBooksFromFile() {
  try {
    const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
    books = JSON.parse(fileContent);
  } catch (err) {
    console.error(err);
  }
}
loadBooksFromFile();

/**
 * GET /books
 */
router.get("/", (_req: Request, res: Response) => {
  res.json(books);
});

/**
 * POST /books
 */
router.post("/", (req: Request, res: Response) => {
  const { error, value } = newBookSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  const newBook: NewBook = value;
  const book: Books = { id: Date.now().toString(), ...req.body, ...newBook };
  books.push(book);
  saveBooksToFile(books);
  res.status(201).json(book);
});

/**
 * GET /books/:id
 */
router.get("/:id", (req: Request, res: Response) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
});

/**
 * PUT /books/:id
 */
router.put("/:id", (req: Request, res: Response) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const updateSchema = bookSchema.fork(Object.keys(bookSchema.describe().keys), (schema: any) => schema.optional()).fork(['id'], (schema: any) => schema.forbidden());
  
  const { error, value } = updateSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  books[index] = { ...books[index], ...value };
  saveBooksToFile(books);
  res.json(books[index]);
});

/**
 * DELETE /books/:id
 */
router.delete("/:id", (req: Request, res: Response) => {
  const index = books.findIndex(b => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  books.splice(index, 1);
  saveBooksToFile(books);
  res.json({ message: "Book deleted successfully" });
});

export default router;
