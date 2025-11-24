const Order=require("../models/orderModel.js");


const createOrder = async (req, res) => {
  try {
    const { orderItems, totalAmount, shippingAddress, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      user: userId,
      orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Order creation failed", error: error.message });
  }
};


const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate("orderItems.book");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};


const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch all orders", error: error.message });
  }
};
const paymentstatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { isPaid, paymentMethod } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update fields
    order.isPaid = isPaid;
    order.paidAt = isPaid ? new Date() : null;

    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }

    await order.save();

    res.json({
      message: "Payment status updated",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating payment status", error: error.message });
  }
};


module.exports={createOrder,getMyOrders,getAllOrders,paymentstatus};
