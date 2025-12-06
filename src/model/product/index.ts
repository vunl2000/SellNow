export interface ProductModel {
  id: string;
  name: string;
  unit: string; // kg | bao | tan
  price: number;
  stock: number;
  type?: string;
  note?: string;
}