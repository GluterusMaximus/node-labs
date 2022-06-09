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

const router = express.Router();

router.route('/').post(protect, placeOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router
  .route('/:id')
  .get(protect, admin, getOrderById)
  .put(protect, admin, updateOrder)
  .delete(protect, admin, deleteOrder);

export default router;
