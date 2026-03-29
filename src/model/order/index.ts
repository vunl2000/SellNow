import { OrderItemModel } from '../order-item';

export interface OrderModel {
  id: string;
  orderCode: string;
  customer: any;
  items: OrderItemModel[];
  total: number;
  note?: string;
  createdAt: Date;
}
