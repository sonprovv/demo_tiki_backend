import express from "express";
import cors from "cors";
import route from "./routes/route";

const app = express();
const PORT = 2100;

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Routes
app.use("/books", route);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
