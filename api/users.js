import express from "express";
const router = express.Router();
export default router;
import { createUser, getUserByEmailAndPassword } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
