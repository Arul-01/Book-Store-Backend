const express=require("express");
const { createOrder, getMyOrders, getAllOrders,paymentstatus }= require("../controllers/orderController.js");
const { protect, adminOnly } =require("../middleware/authMiddleware.js");

const Orderrouter = express.Router();


Orderrouter.post("/", protect, createOrder);
Orderrouter.get("/myorders", protect, getMyOrders);

Orderrouter.get("/all", protect, adminOnly, getAllOrders);
Orderrouter.patch("/:id", protect, adminOnly,paymentstatus);


module.exports=Orderrouter;


