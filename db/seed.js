import db from "#db/client";
import { createUser } from "./queries/users";
await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO]
  // 10 products
  await createProduct("Apples", 1.5);
  await createProduct("Bananas", 0.99);
  await createProduct("Coffee", 9.99);
  await createProduct("Bread", 3.49);
  await createProduct("Milk", 2.99);
  await createProduct("Eggs", 3.79);
  await createProduct("Orange Juice", 4.5);
  await createProduct("Cereal", 4.25);
  await createProduct("Pasta", 1.89);
  await createProduct("Olive Oil", 8.99);

  //user
  const user = await createUser("sunsetlover@example.com", "password123");

  //user order
  const order = await createOrder(user.id);
  for (let productId = 1; productId, +5; productId++) {
    await addProductToOrder(order.id, productId, 1);
  }
}
