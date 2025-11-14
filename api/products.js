import express from "express";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import { getProductById, getProducts } from "#db/queries/products";
import { createOrder, getOrdersByProductIdAndUserId } from "#db/queries/orders";

const router = express.Router();

router.get("/", async (req, res) => {
  const products = await getProducts();
  res.send(products);
});

router.param("id", async (req, res, next, id) => {
  const product = await getProductById(id);
  if (!product) return res.status(404).send("Product not found.");
  req.product = product;
  next();
});

router.get("/:id", async (req, res) => {
  res.send(req.product);
});

router.post(
  "/:id/orders",
  requireUser,
  requireBody(["date", "note"]),
  async (req, res) => {
    const { date, note } = req.body;
    const order = await createOrder(req.product.id, req.user.id, date, note);
    res.status(201).send(order);
  }
);

router.get("/:id/orders", requireUser, async (req, res) => {
  const orders = await getOrdersByProductIdAndUserId(
    req.product.id,
    req.user.id
  );
  res.send(orders);
});

export default router;
