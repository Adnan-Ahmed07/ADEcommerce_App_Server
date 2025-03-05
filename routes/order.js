import express from "express";
import { CreateOrder, createTransaction, getOrdersByUserId } from "../controllers/order.js";


const router = express.Router();
router.post('/transaction',createTransaction);
router.get('/:userId',getOrdersByUserId);
router.post('/',CreateOrder);

export default router;