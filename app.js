import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#db/queries/users";
const app = express();
app.use(getUserFromToken);
app.use("/users", usersRouter);

export default app;
