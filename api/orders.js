import express from "express";
const router = express.Router();
export default router;

import { getOrderById, getOrdersByUserId } from "#db/queries/orders";
import requireUser from "#middleware/requireUser";
router.use(requireUser);

router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.send(orders);
});

router.params("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order not found.");
  req.order = order;
  next();
});

router.get("/:id", (req, res) => {
  if (req.user.id !== req.order.user.id) {
    return res.status(403).send("You are not authorized to view this order.");
  }
  res.send(req.order);
});
