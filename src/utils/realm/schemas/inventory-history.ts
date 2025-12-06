import Realm,{ BSON, ObjectSchema } from "realm";
import { INVENTORY_SCHEMA_NAME } from "./schemaNames";
import { InventoryHistoryModel } from "../../../model/inventory-history";

export class InventoryHistory extends Realm.Object<InventoryHistoryModel>{
  _id!: BSON.ObjectId;
  productId!: BSON.ObjectId;
  qty!: number;
  type!: "import" | "export";
  note?: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: INVENTORY_SCHEMA_NAME,
    primaryKey: "_id",
    properties: {
      _id: "objectId",
      productId: "objectId",
      qty: "double",
      type: "string",
      note: "string?",
      createdAt: "date",
    },
  };
}