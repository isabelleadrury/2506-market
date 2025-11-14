import db from "#db/client";
import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder, addProductToOrder } from "#db/queries/orders";
import { faker } from "@faker-js/faker";

await db.connect();
await seed();

async function seed() {
  try {
    const products = [];
    // 10 products

    for (let i = 0; i < 10; i++) {
      const product = await createProduct(
        faker.commerce.productName(),
        faker.commerce.productDescription(),
        Number(faker.commerce.price({ min: 1, max: 99, dec: 2 }))
      );
      products.push(product);
    }

    //user
    const user = await createUser("sunsetlover", "password123");

    //user order
    const order = await createOrder(
      faker.date.recent().toISOString(),
      "Order successful",
      user.id
    );

    for (let i = 0; i < 5; i++) {
      await addProductToOrder(
        order.id,
        products[i].id,
        faker.number.int({ min: 1, max: 5 })
      );
    }
    console.log("🌱 Database seeded.");
  } catch (error) {
    console.error("Error occurred in seed.js", error);
  }
}

await db.end();
