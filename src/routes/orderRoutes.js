import express from 'express';
import {
  placeOrder,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { body } from 'express-validator';

const router = express.Router();

router
  .route('/')
  .post(protect, body('orderItems').isArray({ min: 1 }), placeOrder)
  .get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router
  .route('/:id')
  .get(protect, admin, getOrderById)
  .put(protect, admin, body('orderItems').isArray({ min: 1 }), updateOrder)
  .delete(protect, admin, deleteOrder);

export default router;
