import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import { Order } from '../schemas/order';

export const useOrdersByDate = (targetDate: Date) => {
  const allOrders = useQuery(Order);

  const orders = useMemo(() => {
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return allOrders
      .filtered('createdAt >= $0 AND createdAt <= $1', startOfDay, endOfDay)
      .sorted('createdAt', true);
  }, [allOrders, targetDate]);

  const { totalRevenue, orderCount } = useMemo(() => {
    let revenue = 0;
    orders.forEach(order => {
      revenue += order.total;
    });

    return {
      totalRevenue: revenue,
      orderCount: orders.length,
    };
  }, [orders]);

  return { orders, totalRevenue, orderCount };
};
