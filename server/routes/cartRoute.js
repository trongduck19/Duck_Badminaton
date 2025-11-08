import authUser from "../middlewares/authUser.js";
import { updateCart } from "../controllers/cartController.js";
import express from "express";

const cartRouter = express.Router();

//Update User CartData : /api/cart/update
cartRouter.post("/update", authUser, updateCart);

export default cartRouter;
