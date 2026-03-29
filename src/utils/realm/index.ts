import { AnyRealmObject } from '@realm/react/dist/helpers';
import { ObjectSchema, RealmObjectConstructor } from 'realm';
import { Customer } from './schemas/customer';
// import { InventoryHistory } from "./schemas/inventory-history";
import { OrderItem } from './schemas/order-item';
import { Order } from './schemas/order';
import { Product } from './schemas/product';

export const schemas:
  | (RealmObjectConstructor<AnyRealmObject> | ObjectSchema)[]
  | undefined = [Customer, OrderItem, Order, Product];
