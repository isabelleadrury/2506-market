import express from "express";
import ordersRouter from "#api/orders";
import productsRouter from "#api/products";
import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/orders", ordersRouter);
app.use("/products", productsRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);

    case "23505":

    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
