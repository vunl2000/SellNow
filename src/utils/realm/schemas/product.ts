import Realm, { ObjectSchema, BSON } from 'realm';
import { PRODUCT_SCHEMA_NAME } from './schemaNames';
import { ProductModel } from '../../../model/product';

export class Product extends Realm.Object<ProductModel> {
  id!: string;
  name!: string;
  price!: number;
  stock!: number;
  type?: string;
  note?: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: PRODUCT_SCHEMA_NAME,
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      price: 'double',
      stock: 'double',
      type: 'string?',
      note: 'string?',
      createdAt: 'date',
    },
  };
}
