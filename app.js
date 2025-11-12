import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";

const app = express();
app.use(getUserFromToken);
app.use("/users", usersRouter);

export default app;
