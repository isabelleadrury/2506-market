import express from "express";
const router = express.Router();
export default router;

import { getProductById, getProducts } from "#db/queries/products";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";
import { createOrder } from "#db/queries/orders";

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
  const product = req.product;
  res.send(product);
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
