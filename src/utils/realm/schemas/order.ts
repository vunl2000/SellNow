import Realm, { ObjectSchema,BSON } from "realm";
import {ORDER_SCHEMA_NAME} from "./schemaNames";
import {Customer} from "./customer";
import {OrderItem} from "./order-item";
import { OrderModel } from "../../../model/order";

export class Order extends Realm.Object<OrderModel> {
  _id!: BSON.ObjectId;
  customerId!: BSON.ObjectId;
  items!: Realm.List<OrderItem>;
  total!: number;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: ORDER_SCHEMA_NAME,
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      customerId: "objectId",
      items: { type: "list", objectType: "OrderItem" },
      total: "double",
      createdAt: "date",
    },
  };
}