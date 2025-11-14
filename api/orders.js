import express from "express";
import requireUser from "#middleware/requireUser";
import {
  createOrder,
  getOrderById,
  getOrdersByUserId,
  addProductToOrder,
  getProductsByOrderId,
  getOrdersByProductIdAndUserId, // make sure this exists
} from "#db/queries/orders";
import { getProductById } from "#db/queries/products";

const router = express.Router();

// ⚡ Apply auth middleware to all routes
router.use(requireUser);

//////////////////////////
// ORDERS ROUTES
//////////////////////////

// Create a new order
router.post("/", async (req, res) => {
  const { date, note } = req.body;
  if (!date) return res.status(400).send("Missing 'date' in request body.");

  const order = await createOrder(date, note || "", req.user.id);
  res.status(201).send(order);
});

// Get all orders for the logged-in user
router.get("/", async (req, res) => {
  const orders = await getOrdersByUserId(req.user.id);
  res.status(200).send(orders);
});

// Load order by :id parameter
router.param("id", async (req, res, next, id) => {
  const order = await getOrderById(id);
  if (!order) return res.status(404).send("Order not found.");
  req.order = order;
  next();
});

// Get a specific order by id
router.get("/:id", (req, res) => {
  if (req.user.id !== req.order.user_id) {
    return res.status(403).send("You are not authorized to view this order.");
  }
  res.status(200).send(req.order);
});

// Add a product to a specific order
router.post("/:id/products", async (req, res) => {
  const { productId, quantity } = req.body;

  if (req.user.id !== req.order.user_id) {
    return res.status(403).send("You are not authorized to modify this order.");
  }

  if (!productId || !quantity) {
    return res
      .status(400)
      .send("Missing 'productId' or 'quantity' in request body.");
  }

  const product = await getProductById(productId);
  if (!product) return res.status(400).send("Product does not exist.");

  const orderProduct = await addProductToOrder(
    req.order.id,
    productId,
    quantity
  );
  res.status(201).send(orderProduct);
});

// Get all products in a specific order
router.get("/:id/products", async (req, res) => {
  if (req.user.id !== req.order.user_id) {
    return res
      .status(403)
      .send("You are not authorized to view this order's products");
  }

  const products = await getProductsByOrderId(req.order.id);
  res.status(200).send(products);
});

//////////////////////////
// PRODUCT ORDERS ROUTE
//////////////////////////

// Get all orders for a specific product made by the logged-in user
router.get("/products/:id/orders", async (req, res) => {
  const productId = req.params.id;
  const product = await getProductById(productId);

  if (!product) return res.status(404).send("Product not found.");

  const orders = await getOrdersByProductIdAndUserId(productId, req.user.id);
  res.status(200).send(orders);
});

export default router;
