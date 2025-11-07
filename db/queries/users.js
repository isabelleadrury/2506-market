import bcrypt from "bcrypt";
import db from "#db/client";

export async function createUser(email, password) {
  const sql = `
	INSERT INTO users
	(email,password)
	VALUES
	($1, $2)
	RETURNING *`;
  const hashedPassword = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [email, hashedPassword]);
  return user;
}

export async function getUserByEmailAndPassword(email, password) {
  const sql = `
	SELECT *
	FROM users
	WHERE email = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;
  return user;
}

export async function getUserById(id) {
  const sql = `
	SELECT *
	FROM users
	WHERE id = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
