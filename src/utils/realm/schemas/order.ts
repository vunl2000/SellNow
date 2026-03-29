import Realm, { ObjectSchema } from 'realm';
import { Customer } from './customer'; // Import schema Customer
import { OrderItem } from './order-item';
import { ORDER_SCHEMA_NAME, ORDER_ITEM_SCHEMA_NAME } from './schemaNames';
import { OrderModel } from '../../../model/order';

export class Order extends Realm.Object<OrderModel> {
  id!: string;
  orderCode!: string;
  customer!: Customer;
  items!: Realm.List<OrderItem>;
  total!: number;
  note?: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: ORDER_SCHEMA_NAME,
    primaryKey: 'id',
    properties: {
      id: 'string',
      orderCode: 'string',
      customer: 'Customer', // LIÊN KẾT: Trỏ thẳng sang bảng Customer
      note: 'string?',
      items: { type: 'list', objectType: ORDER_ITEM_SCHEMA_NAME }, // LIÊN KẾT: Danh sách các OrderItem
      total: 'double',
      createdAt: 'date',
    },
  };
}
