import asyncHandler from 'express-async-handler';
import convertCurrency from '../utils/convertCurrency.js';
import { validationResult } from 'express-validator';
import tokenService from '../services/tokenService.js';
import orderService from '../services/orderService.js';

// @desc     Create a new order
// @route    POST /api/orders
// @access   Private
const placeOrder = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid order data', errors: errors.array() };
  }

  const {
    orderItems,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
    currency,
  } = req.body;
  let convertedShipping, convertedTax, convertedTotal;
  try {
    [convertedShipping, convertedTax, convertedTotal] = await convertCurrency(
      currency,
      [shippingPrice, taxPrice, totalPrice]
    );
  } catch (axiosErr) {
    res.status(axiosErr.response?.status || 500);
    throw new Error(
      `Cannot convert currency: ${axiosErr.response?.data?.error?.message}`
    );
  }

  try {
    const { id: user } = tokenService.parseToken(req);

    const createdData = await orderService.create({
      orderItems,
      shippingAddress,
      shippingPrice: convertedShipping,
      taxPrice: convertedTax,
      totalPrice: convertedTotal,
      user,
    });
    res.status(201).json(createdData);
  } catch (error) {
    res.status(400);
    next(error);
  }
});

// @desc     Get an order by id
// @route    GET /api/orders/:id
// @access   Private/Admin
const getOrderById = asyncHandler(async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const orderData = await orderService.get(orderId);
    res.json(orderData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Get logged in user orders
// @route    GET /api/orders/myorders
// @access   Private
const getMyOrders = asyncHandler(async (req, res, next) => {
  try {
    const { id: user } = tokenService.parseToken(req);
    const ordersData = await orderService.getUserOrders(user);
    res.json(ordersData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private/Admin
const getOrders = asyncHandler(async (req, res, next) => {
  try {
    const ordersData = await orderService.getAll();
    res.json(ordersData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Update order by id
// @route    PUT /api/orders/:id
// @access   Private/Admin
const updateOrder = asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw { message: 'Invalid order data', errors: errors.array() };
  }

  try {
    const { shippingAddress, orderItems, taxPrice, shippingPrice, totalPrice } =
      req.body;
    const orderId = req.params.id;
    const { id: user } = tokenService.parseToken(req);

    const updatedData = await orderService.update(orderId, {
      shippingAddress,
      orderItems,
      taxPrice,
      shippingPrice,
      totalPrice,
      user,
    });
    res.status(201).json(updatedData);
  } catch (error) {
    res.status(404);
    next(error);
  }
});

// @desc     Delete an order
// @route    DELETE /api/orders/:id
// @access   Private/Admin
const deleteOrder = asyncHandler(async (req, res, next) => {
  try {
    const orderId = req.params.id;
    await orderService.delete(orderId);
    res.json({ message: 'Order removed' });
  } catch (error) {
    res.status(404);
    next(error);
  }
});

export {
  placeOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrder,
  deleteOrder,
};
