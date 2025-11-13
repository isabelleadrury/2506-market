import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder, addProductToOrder } from "#db/queries/orders";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");
async function seed() {
  // TODO]
  // 10 products
  await createProduct("Apples", "Fresh red apples", 1.5);
  await createProduct("Bananas", "Ripe yellow bananas", 0.99);
  await createProduct("Coffee", "Ground Arabica coffee", 9.99);
  await createProduct("Bread", "Whole grain loaf", 3.49);
  await createProduct("Milk", "1 gallon whole milk", 2.99);
  await createProduct("Eggs", "Dozen cage-free eggs", 3.79);
  await createProduct("Orange Juice", "No pulp OJ", 4.5);
  await createProduct("Cereal", "Honey oat cereal", 4.25);
  await createProduct("Pasta", "Italian spaghetti", 1.89);
  await createProduct("Olive Oil", "Extra virgin olive oil", 8.99);

  //user
  const user = await createUser("sunsetlover", "password123");

  //user order
  const order = await createOrder(new Date(), "Order successful!", user.id);
  for (let productId = 1; productId <= 5; productId++) {
    await addProductToOrder(order.id, productId, 1);
  }
}
