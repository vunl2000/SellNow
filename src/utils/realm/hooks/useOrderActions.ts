import { useRealm } from '@realm/react';
import { BSON } from 'realm';
import { Customer } from '../schemas/customer';
import { Product } from '../schemas/product';
import { Order } from '../schemas/order';
import moment from 'moment';
import {
  CUSTOMER_SCHEMA_NAME,
  ORDER_SCHEMA_NAME,
  PRODUCT_SCHEMA_NAME,
} from '../schemas/schemaNames';

export const useOrderActions = () => {
  const realm = useRealm();

  const addOrder = (
    customerId: string,
    cartItems: { productId: string; qty: number; price: number }[],
    quickAddName?: string,
    note?: string,
    customDate?: Date,
  ) => {
    realm.write(() => {
      let finalCustomer: Customer | null = null;

      if (customerId === 'QUICK_ADD') {
        const timeString = moment().format('HH:mm');
        const defaultName = `KH mới lúc ${timeString}`;

        finalCustomer = realm.create<Customer>(CUSTOMER_SCHEMA_NAME, {
          id: new BSON.UUID().toHexString(),
          name: quickAddName || defaultName,
          phone: '',
          type: 'vang_lai',
          address: '',
          createdAt: new Date(),
        });
      } else {
        finalCustomer = realm.objectForPrimaryKey<Customer>(
          CUSTOMER_SCHEMA_NAME,
          customerId,
        );
      }

      if (!finalCustomer) throw new Error('Không tìm thấy khách hàng!');

      let totalAmount = 0;

      const orderItemsToSave = cartItems.map(item => {
        const product = realm.objectForPrimaryKey<Product>(
          PRODUCT_SCHEMA_NAME,
          item.productId,
        );
        if (!product) throw new Error(`Sản phẩm không tồn tại!`);

        product.stock = Number(product.stock) - Number(item.qty);
        totalAmount += Number(item.qty) * Number(item.price);

        return {
          product: product,
          productName: product.name,
          qty: Number(item.qty),
          price: Number(item.price),
        };
      });

      const todayStr = moment().format('YYMMDD');
      const prefix = `DH${todayStr}-`;

      const latestOrderToday = realm
        .objects<Order>(ORDER_SCHEMA_NAME)
        .filtered('orderCode BEGINSWITH $0', prefix)
        .sorted('orderCode', true)[0];

      let nextSequence = 1;
      if (latestOrderToday && latestOrderToday.orderCode) {
        const lastSeqString = latestOrderToday.orderCode.split('-')[1];
        const lastSeqNumber = parseInt(lastSeqString, 10);

        if (!isNaN(lastSeqNumber)) {
          nextSequence = lastSeqNumber + 1;
        }
      }
      const paddedSequence = nextSequence.toString().padStart(3, '0');
      const newOrderCode = `${prefix}${paddedSequence}`;

      realm.create(ORDER_SCHEMA_NAME, {
        id: new BSON.UUID().toHexString(),
        orderCode: newOrderCode,
        customer: finalCustomer,
        items: orderItemsToSave,
        total: totalAmount,
        note: note || '',
        createdAt: customDate ? customDate : new Date(),
      });
    });
  };

  const updateOrder = (
    orderId: string,
    newCustomerId: string,
    newCartItems: { productId: string; qty: number; price: number }[],
    quickAddName?: string,
    newNote?: string,
  ) => {
    realm.write(() => {
      const orderToUpdate = realm.objectForPrimaryKey<Order>('Order', orderId);
      if (!orderToUpdate) throw new Error('Không tìm thấy đơn hàng cần sửa!');

      let finalCustomer: Customer | null = null;

      if (newCustomerId === 'QUICK_ADD') {
        const timeString = moment().format('HH:mm');
        const defaultName = `KH mới lúc ${timeString}`;

        finalCustomer = realm.create<Customer>(CUSTOMER_SCHEMA_NAME, {
          id: new BSON.UUID().toHexString(),
          name: quickAddName || defaultName,
          phone: '',
          type: 'vang_lai',
          address: '',
          createdAt: new Date(),
        });
      } else {
        finalCustomer = realm.objectForPrimaryKey<Customer>(
          CUSTOMER_SCHEMA_NAME,
          newCustomerId,
        );
      }

      if (!finalCustomer) throw new Error('Không tìm thấy khách hàng!');
      orderToUpdate.items.forEach(item => {
        if (item.product) {
          item.product.stock = Number(item.product.stock) + Number(item.qty);
        }
      });

      realm.delete(orderToUpdate.items);

      let newTotalAmount = 0;
      const newOrderItems = newCartItems.map(item => {
        const product = realm.objectForPrimaryKey<Product>(
          PRODUCT_SCHEMA_NAME,
          item.productId,
        );
        if (!product) throw new Error(`Sản phẩm không tồn tại!`);

        product.stock = Number(product.stock) - Number(item.qty);
        newTotalAmount += Number(item.qty) * Number(item.price);

        return {
          product: product,
          productName: product.name,
          qty: Number(item.qty),
          price: Number(item.price),
        };
      });

      orderToUpdate.customer = finalCustomer;
      orderToUpdate.items = newOrderItems as any;
      orderToUpdate.total = newTotalAmount;
      orderToUpdate.note = newNote || '';
    });
  };

  const deleteOrder = (orderId: string) => {
    realm.write(() => {
      const orderToDelete = realm.objectForPrimaryKey<Order>(
        ORDER_SCHEMA_NAME,
        orderId,
      );

      if (orderToDelete) {
        orderToDelete.items.forEach(item => {
          if (item.product) {
            item.product.stock = Number(item.product.stock) + Number(item.qty);
          }
        });

        realm.delete(orderToDelete);
      }
    });
  };

  return { addOrder, updateOrder, deleteOrder };
};
