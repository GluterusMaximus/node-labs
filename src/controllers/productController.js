import asyncHandler from 'express-async-handler';
import { validationResult } from 'express-validator';
import productService from '../services/productService.js';
import tokenService from '../services/tokenService.js';

// @desc     Fetch all products
// @route    GET /api/products
// @access   Public
const getProducts = asyncHandler(async (req, res, next) => {
  try {
    const productsData = await productService.getAll();
    res.json(productsData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Fetch single product
// @route    GET /api/products/:id
// @access   Public
const getProductById = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;
    const productData = await productService.get(productId);
    res.json(productData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Delete a product
// @route    DELETE /api/products/:id
// @access   Private/Admin
const deleteProduct = asyncHandler(async (req, res, next) => {
  try {
    const productId = req.params.id;
    await productService.delete(productId);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Create a new product
// @route    POST /api/products
// @access   Private/Admin
const createProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid product data', errors: errors.array() };
  }

  try {
    const { name, price, description, brand, category, countInStock } =
      req.body;
    const { id: user } = tokenService.parseToken(req);

    const createdData = await productService.create({
      name,
      price,
      description,
      brand,
      category,
      countInStock,
      user,
    });
    res.status(201).json(createdData);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

// @desc     Update a product
// @route    PUT /api/products/:id
// @access   Private/Admin
const updateProduct = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid product data', errors: errors.array() };
  }

  try {
    const { name, price, description, brand, category, countInStock } =
      req.body;
    const productId = req.params.id;
    const { id: user } = tokenService.parseToken(req);

    const updatedData = await productService.update(productId, {
      name,
      price,
      description,
      brand,
      category,
      countInStock,
      user,
    });
    res.status(201).json(updatedData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Create new review
// @route    POST /api/products/:id/reviews
// @access   Private
const createProductReview = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid review data', errors: errors.array() };
  }

  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const { id: user } = tokenService.parseToken(req);

    await productService.addReview(productId, { rating, comment, user });

    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(400);
    next(error);
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};
