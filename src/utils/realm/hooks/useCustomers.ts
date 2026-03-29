import { useCallback, useMemo } from 'react';
import { useRealm, useQuery } from '@realm/react';
import { BSON } from 'realm';
import { Customer } from '../schemas/customer';
import { CustomerModel } from '../../../model/customer';

export const useCustomers = (searchQuery: string = '') => {
  const realm = useRealm();

  const customers = useQuery(Customer);

  const filteredCustomers = useMemo(() => {
    let result = customers;

    if (searchQuery.trim()) {
      result = result.filtered(
        'name CONTAINS[c] $0 OR phone CONTAINS[c] $0',
        searchQuery.trim(),
      );
    }

    const sortedResult = result.sorted('name', false);

    return sortedResult.map(
      (customer): CustomerModel => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        type: customer.type as any,
        address: customer.address,
        map: customer.map,
        note: customer.note,
        createdAt: customer.createdAt,
      }),
    );
  }, [customers, searchQuery]);

  const addCustomer = useCallback(
    (data: CustomerModel) => {
      realm.write(() => {
        realm.create(Customer, {
          ...data,
          id: new BSON.ObjectId().toHexString(),
          createdAt: new Date(),
        });
      });
    },
    [realm],
  );

  const updateCustomer = useCallback(
    (id: string, data: Partial<CustomerModel>) => {
      const customerToUpdate = realm.objectForPrimaryKey(Customer, id);

      if (customerToUpdate) {
        realm.write(() => {
          if (data.name !== undefined) customerToUpdate.name = data.name;
          if (data.phone !== undefined) customerToUpdate.phone = data.phone;
          if (data.type !== undefined) customerToUpdate.type = data.type;
          if (data.address !== undefined)
            customerToUpdate.address = data.address;
          if (data.map !== undefined) customerToUpdate.map = data.map;
          if (data.note !== undefined) customerToUpdate.note = data.note;
        });
      }
    },
    [realm],
  );

  const deleteCustomer = useCallback(
    (id: string) => {
      const customerToDelete = realm.objectForPrimaryKey(Customer, id);

      if (customerToDelete) {
        realm.write(() => {
          realm.delete(customerToDelete);
        });
      }
    },
    [realm],
  );

  return {
    customers: filteredCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
