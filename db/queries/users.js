import express from "express";
const router = express.Router();

import bycrypt from "bcrypt";
import { signToken } from "#utils/jwt";
import { getUserByUsername, createUser } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import requireUser from "#middleware/requireUser";

// POST

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await getUserByUsername(username);
    if (existingUser) return res.status(409).send("Username already taken.");
    const hashedPassword = await bycrypt.hash(password, 10);
    const newUser = await createUser(username, hashedPassword);

    const token = signToken({ id: newUser.id });
    res.send({ user: newUser, token });
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).send("Invalid username or password!");
    const isValid = await bycrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send("Invalid username or password!");

    const token = signToken({ id: user.id });
    res.send({ user, token });
  }
);

// GET
router.get("/me", requireUser, (req, res) => {
  res.send(req.user);
});

export default router;
