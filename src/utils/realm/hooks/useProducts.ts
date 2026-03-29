import { useCallback, useMemo } from 'react';
import { useRealm, useQuery } from '@realm/react';
import { Product } from '../schemas/product';
import { ProductModel } from '../../../model/product';

export const useProducts = (searchQuery: string = '') => {
  const realm = useRealm();

  const products = useQuery(Product);

  const formattedProducts = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      result = result.filtered(
        'name CONTAINS[c] $0 OR id CONTAINS[c] $0',
        searchQuery.trim(),
      );
    }

    const sortedResult = result.sorted('name', false);

    return sortedResult.map(
      (product): ProductModel => ({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        type: product.type,
        note: product.note,
        createdAt: product.createdAt,
      }),
    );
  }, [products, searchQuery]);

  const addProduct = useCallback(
    (data: ProductModel) => {
      realm.write(() => {
        realm.create(Product, {
          ...data,
          createdAt: new Date(),
        });
      });
    },
    [realm],
  );

  const updateProduct = useCallback(
    (id: string, data: Partial<ProductModel>) => {
      const productToUpdate = realm.objectForPrimaryKey(Product, id);

      if (productToUpdate) {
        realm.write(() => {
          if (data.name !== undefined) productToUpdate.name = data.name;
          if (data.price !== undefined) productToUpdate.price = data.price;
          if (data.stock !== undefined) productToUpdate.stock = data.stock;
          if (data.type !== undefined) productToUpdate.type = data.type;
          if (data.note !== undefined) productToUpdate.note = data.note;
        });
      }
    },
    [realm],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const productToDelete = realm.objectForPrimaryKey(Product, id);

      if (productToDelete) {
        realm.write(() => {
          realm.delete(productToDelete);
        });
      }
    },
    [realm],
  );

  const checkSKUExists = useCallback(
    (sku: string) => {
      const existingProduct = realm.objectForPrimaryKey(Product, sku);
      return !!existingProduct;
    },
    [realm],
  );

  const generateUniqueSKU = useCallback(() => {
    let isUnique = false;
    let newSKU = '';
    while (!isUnique) {
      const randomPart = Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase();
      newSKU = `SKU${randomPart}`;
      if (!checkSKUExists(newSKU)) {
        isUnique = true;
      }
    }
    return newSKU;
  }, [checkSKUExists]);

  return {
    products: formattedProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    checkSKUExists,
    generateUniqueSKU,
  };
};
