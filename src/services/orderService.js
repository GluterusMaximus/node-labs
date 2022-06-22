import OrderDto from '../dtos/orderDto.js';
import Order from '../models/orderModel.js';

class OrderService {
  async create(data) {
    const createdOrder = await Order.create(data);

    if (!createdOrder) throw new Error('Order creation failed');

    return new OrderDto(createdOrder);
  }

  async get(id) {
    const order = await Order.findById(id);

    if (!order) throw new Error('Order not found!');

    return new OrderDto(order);
  }

  async getUserOrders(user) {
    const orders = await Order.find({ user });
    return orders.map(order => new OrderDto(order));
  }

  async getAll() {
    const orders = await Order.find({});
    return orders.map(order => new OrderDto(order));
  }

  async update(id, updatedData) {
    const order = await Order.findById(id);

    if (!order) throw new Error('Order not found');

    order.shippingAddress = updatedData.shippingAddress;
    order.orderItems = updatedData.orderItems;
    order.taxPrice = updatedData.taxPrice;
    order.shippingPrice = updatedData.shippingPrice;
    order.totalPrice = updatedData.totalPrice;
    order.user = updatedData.user;

    const updatedOrder = await order.save();

    return new OrderDto(updatedOrder);
  }

  async delete(id) {
    const order = await Order.findById(id);

    if (!order) throw new Error('Order not found!');

    return await order.remove();
  }
}

export default new OrderService();
