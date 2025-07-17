import { api } from "./api";

export async function importFakeProducts() {
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();

  const formatted = data.map((item: any) => ({
    name: item.title,
    price: item.price,
    description: item.description,
    image: item.image,
  }));

  // Sequential import (можно заменить на параллельный при необходимости)
  for (const product of formatted) {
    try {
      await api.post("/products", product);
    } catch (err) {
      console.error("Failed to import:", product.name, err);
    }
  }
}
