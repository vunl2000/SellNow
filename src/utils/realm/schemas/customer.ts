
import Realm, { ObjectSchema,BSON } from "realm";
import { CUSTOMER_SCHEMA_NAME } from "./schemaNames";
import { CustomerModel } from "../../../model/customer";

export class Customer extends Realm.Object<CustomerModel> {
  id!: BSON.ObjectId;
  name!: string;
  phone!: string;
  address!: string;
  note?: string;
  createdAt!: Date;

  static schema : ObjectSchema = {
    name: CUSTOMER_SCHEMA_NAME,
    primaryKey: "id",
    properties: {
      id: 'objectId',
      name: "string",
      phone: "string",
      address: "string",
      note: "string?",
      createdAt: "date",
    },
  };
}