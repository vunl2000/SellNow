import Realm, { ObjectSchema } from 'realm';
import { Product } from './product'; // Import schema Product
import { ORDER_ITEM_SCHEMA_NAME } from './schemaNames';
import { OrderItemModel } from '../../../model/order-item';

export class OrderItem extends Realm.Object<OrderItemModel> {
  product!: Product;
  productName!: string;
  qty!: number;
  price!: number;

  static schema: ObjectSchema = {
    name: ORDER_ITEM_SCHEMA_NAME,
    embedded: true, //  Đóng gói chặt vào Order
    properties: {
      product: 'Product', // LIÊN KẾT: Trỏ thẳng sang bảng Product
      productName: 'string', // Lưu vết tên
      qty: 'double', // Lưu số thập phân (nửa cân, 1 lạng...)
      price: 'double', // Lưu giá trị tiền
    },
  };
}
