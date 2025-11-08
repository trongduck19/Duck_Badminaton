import express from 'express';
import {
  getAllOrders,
  getOrderById,
  getUserOrders,
  placeOrderCOD,
  placeOrderStripe,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';
import authUser from '../middlewares/authUser.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.get('/user', authUser, getUserOrders);
orderRouter.get('/seller', authSeller, getAllOrders);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.get('/:id', getOrderById, authUser);
orderRouter.put('/status/:id', updateOrderStatus, authSeller);
orderRouter.delete('/:id', authSeller, deleteOrder);

export default orderRouter;
