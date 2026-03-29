import { useMemo } from 'react';
import { useQuery } from '@realm/react';
import moment from 'moment';
import { Order } from '../schemas/order';
import { FilterType } from '../../../model/daily-report';

export const useStatistics = (selectedDate: Date, filterType: FilterType) => {
  const orders = useQuery(Order);

  const stats = useMemo(() => {
    const start =
      filterType === 'week'
        ? moment(selectedDate).startOf('isoWeek').toDate()
        : moment(selectedDate).startOf(filterType).toDate();
    const end =
      filterType === 'week'
        ? moment(selectedDate).endOf('isoWeek').toDate()
        : moment(selectedDate).endOf(filterType).toDate();

    const filteredOrders = orders.filtered(
      'createdAt >= $0 AND createdAt <= $1',
      start,
      end,
    );
    let totalRevenue = 0;
    let totalWeight = 0;

    filteredOrders.forEach(order => {
      totalRevenue += order.total;
      order.items.forEach(item => {
        totalWeight += Number(item.qty) || 0;
      });
    });

    return {
      totalRevenue,
      totalWeight,
      orderCount: filteredOrders.length,
    };
  }, [orders, filterType, selectedDate]);

  return stats;
};
