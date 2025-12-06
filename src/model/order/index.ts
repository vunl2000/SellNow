import { OrderItemModel } from "../order-item";

export interface OrderModel {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}