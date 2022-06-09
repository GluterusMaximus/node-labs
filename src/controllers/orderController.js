import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import { ORDER_NOT_FOUND_MESSAGE } from '../constants/errorConstants.js';

// @desc     Create a new order
// @route    POST /api/orders
// @access   Private
const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, shippingPrice, taxPrice, totalPrice } =
    req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json({
      _id: createdOrder._id,
      orderItems: createdOrder.orderItems,
      shippingAddress: createdOrder.shippingAddress,
      shippingPrice: createdOrder.shippingPrice,
      taxPrice: createdOrder.taxPrice,
      totalPrice: createdOrder.totalPrice,
    });
  }
});

// @desc     Get an order by id
// @route    GET /api/orders/:id
// @access   Private/Admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .select('-__v');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error(ORDER_NOT_FOUND_MESSAGE);
  }
});

// @desc     Get logged in user orders
// @route    GET /api/orders/myorders
// @access   Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).select('-__v');

  res.json(orders);
});

// @desc     Get all orders
// @route    GET /api/orders
// @access   Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'id name')
    .select('-__v');

  res.json(orders);
});

// @desc     Update order by id
// @route    PUT /api/orders/:id
// @access   Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    user,
    orderItems,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.shippingAddress = shippingAddress;
    order.user = user;
    order.orderItems = orderItems;
    order.taxPrice = taxPrice;
    order.shippingPrice = shippingPrice;
    order.totalPrice = totalPrice;

    const updatedOrder = await order.save();
    res.status(201).json({
      _id: updatedOrder._id,
      orderItems: updatedOrder.orderItems,
      shippingAddress: updatedOrder.shippingAddress,
      shippingPrice: updatedOrder.shippingPrice,
      taxPrice: updatedOrder.taxPrice,
      totalPrice: updatedOrder.totalPrice,
    });
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc     Delete an order
// @route    DELETE /api/orders/:id
// @access   Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404);
    throw new Error('Order not found!');
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
