export interface ProductModel {
  id: string;
  name: string;
  price: number;
  stock: number;
  type?: string;
  note?: string;
  createdAt: Date;
}
