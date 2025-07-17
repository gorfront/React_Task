export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  ownerId: string;
}
