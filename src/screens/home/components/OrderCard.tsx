import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import { Order } from '../../../utils/realm/schemas/order';

interface OrderCardProps {
  order: Order;
  index?: number;
  onPress: (order: Order) => void;
}

const COLOR_PALETTE = [
  { bg: '#DBEAFE', icon: '#2563EB' }, // Blue
  { bg: '#D1FAE5', icon: '#059669' }, // Green
  { bg: '#FEE2E2', icon: '#EF4444' }, // Red
  { bg: '#FEF3C7', icon: '#D97706' }, // Amber
  { bg: '#EDE9FE', icon: '#7C3AED' }, // Purple
  { bg: '#FCE7F3', icon: '#DB2777' }, // Pink
  { bg: '#F3F4F6', icon: '#4B5563' }, // Slate
];

const OrderCard: React.FC<OrderCardProps> = memo(
  ({ order, index = 0, onPress }) => {
    const formatPrice = (num: number) => num.toLocaleString('vi-VN') + 'đ';

    const allItemsSummary =
      order.items.length > 0
        ? order.items.map(item => `${item.productName}`).join(', ')
        : 'Chưa có hàng';

    const theme = COLOR_PALETTE[index % COLOR_PALETTE.length];

    return (
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        android_ripple={{ color: 'rgba(0,0,0,0.06)', borderless: false }}
        onPress={() => onPress(order)}
      >
        <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
          <Ionicons name="receipt-outline" size={24} color={theme.icon} />
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.customerName}>
            {order.customer?.name || 'Khách lẻ'}
          </Text>
          <Text style={styles.timeText}>
            {moment(order.createdAt).format('HH:mm')} • {order.orderCode}
          </Text>

          <Text
            style={styles.itemsSummary}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {allItemsSummary}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.totalPrice}>{formatPrice(order.total)}</Text>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
          </View>
          <Text style={styles.itemCountText}>
            {order.items.length} mặt hàng
          </Text>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardPressed: {
    opacity: Platform.OS === 'ios' ? 0.7 : 0.9,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContainer: { flex: 1 },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  timeText: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  itemsSummary: { fontSize: 14, color: '#4B5563' },
  rightContainer: { alignItems: 'flex-end', justifyContent: 'center' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 6,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  itemCountText: { fontSize: 13, color: '#6B7280' },
});

export default OrderCard;
