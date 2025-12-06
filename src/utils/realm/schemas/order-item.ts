import Realm, { ObjectSchema,BSON } from "realm";
import { Product } from "./product";
import { ORDER_ITEM_SCHEMA_NAME } from "./schemaNames";
import { OrderItemModel } from "../../../model/order-item";

export class OrderItem extends Realm.Object<OrderItemModel> {
  _id!: BSON.ObjectId;
  productId!: Product;
  qty!: number;
  price!: number; 

  static schema:ObjectSchema = {
    name: ORDER_ITEM_SCHEMA_NAME,
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      productId: "objectId",
      qty: "double",
      price: "double",
    },
  };
}