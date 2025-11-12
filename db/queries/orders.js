import db from "#db/client";

export async function createOrder(date, note, userId) {
  const sql = `
INSERT INTO orders (user_id, date, note)
VALUES ($1, $2, $3)
RETURNING *;
`;
  const {
    rows: [order],
  } = await db.query(sql, [userId, date, note]);
  return order;
}

export async function addProductToOrder(orderId, productId, quantity) {
  const sql = `
	INSERT INTO orders_products (order_id, product_id, quantity)
	VALUES ($1, $2, $3)
	RETURNING *;
	`;
  const {
    rows: [orderProduct],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orderProduct;
}

export async function getOrdersByUserId(id) {
  const sql = `
	SELECT *
	FROM orders
	WHERE user_id = $1
	`;
  const { rows: orders } = await db.query(sql, [id]);
  return orders;
}

// export async function getOrdersByProductIdAndUserId(productId, userId) {
//   const sql = `
// 	SELECT *
// 	FROM orders_products
// 	WHERE product_id = $1
// 	AND user_id = $2
// 	`;
//   const { rows: orders } = await db.query(sql, [productId, userId]);
//   return orders;
// }

export async function getOrderById(id) {
  const sql = `
	SELECT *
	FROM orders
	WHERE id = $1
	`;
  const {
    rows: [order],
  } = await db.query(sql, [id]);
  return order;
}
