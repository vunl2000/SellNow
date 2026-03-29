import Realm, { ObjectSchema, BSON } from 'realm';
import { CUSTOMER_SCHEMA_NAME } from './schemaNames';
import { CustomerModel } from '../../../model/customer';

export class Customer extends Realm.Object<CustomerModel> {
  id!: string;
  name!: string;
  phone!: string;
  type!: string;
  address!: string;
  map?: string;
  note?: string;
  createdAt!: Date;

  static schema: ObjectSchema = {
    name: CUSTOMER_SCHEMA_NAME,
    primaryKey: 'id',
    properties: {
      id: 'string',
      name: 'string',
      phone: 'string',
      type: 'string',
      address: 'string',
      map: 'string?',
      note: 'string?',
      createdAt: 'date',
      orders: {
        type: 'linkingObjects',
        objectType: 'Order',
        property: 'customer',
      },
    },
  };
}
