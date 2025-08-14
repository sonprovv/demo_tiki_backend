const Joi = require('joi');

const imageSchema = Joi.object({
    base_url: Joi.string().required(),
    is_gallery: Joi.boolean().required(),
    label: Joi.string().allow(null),
    large_url: Joi.string().required(),
    medium_url: Joi.string().required(),
    position: Joi.number().allow(null),
    small_url: Joi.string().required(),
    thumbnail_url: Joi.string().required(),
});

const authorSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    slug: Joi.string().required(),
});

const categorySchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    is_leaf: Joi.boolean().required(),
});

const currentSellerSchema = Joi.object({
    id: Joi.number().required(),
    sku: Joi.string().required(),
    name: Joi.string().required(),
    link: Joi.string().required(),
    logo: Joi.string().required(),
    price: Joi.number().required(),
    product_id: Joi.string().required(),
    store_id: Joi.number().required(),
    is_best_store: Joi.boolean().required(),
    is_offline_installment_supported: Joi.boolean().allow(null),
});

const specificationSchema = Joi.object({
    name: Joi.string().required(),
    attributes: Joi.array().items(
        Joi.object({
            code: Joi.string().required(),
            name: Joi.string().required(),
            value: Joi.string().required(),
        })
    ).required(),
});

const newBookSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required',
        'any.required': 'Name is required',
    }),
    authors: Joi.array()
        .items(authorSchema)
        .required()
        .messages({
            'array.base': 'Authors must be an array',
            'any.required': 'Authors is required',
        }),
    description: Joi.string().optional().allow(''),
    original_price: Joi.number().optional(),
    list_price: Joi.number().optional(),
    rating_average: Joi.number().optional(),
    short_description: Joi.string().optional().allow(''),
    book_cover: Joi.string().optional().allow(null),
    images: Joi.array().items(imageSchema).optional().default([]),
    categories: categorySchema.optional(),
    current_seller: currentSellerSchema.optional(),
    specifications: Joi.array().items(specificationSchema).optional(),
});

const bookSchema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    book_cover: Joi.string().allow(null),
    images: Joi.array().items(imageSchema).required(),
    list_price: Joi.number().required(),
    original_price: Joi.number().required(),
    description: Joi.string().required(),
    short_description: Joi.string().allow(null),
    rating_average: Joi.number().required(),
    quantity_sold: Joi.object({
        text: Joi.string().required(),
        value: Joi.number().required(),
    }).required(),
    authors: Joi.array().items(authorSchema).required(),
    categories: categorySchema.required(),
    current_seller: currentSellerSchema.required(),
    specifications: Joi.array().items(specificationSchema).optional(),
});

export { bookSchema, newBookSchema };