import Realm, { ObjectSchema,BSON } from "realm";
import { PRODUCT_SCHEMA_NAME } from "./schemaNames";
import { ProductModel } from "../../../model/product";

export class Product extends Realm.Object<ProductModel> {
  id!: BSON.ObjectId;
  name!: string;
  unit!: string;
  price!: number;
  stock!: number;
  type?: string;
  note?: string;

  static schema : ObjectSchema = {
    name: PRODUCT_SCHEMA_NAME,
    primaryKey: "id",
    properties: {
      id: 'objectId',
      name: "string",
      unit: "string",
      price: "double",
      stock: "int",
      type: "string?",
      note: "string?",
    },
  };
}