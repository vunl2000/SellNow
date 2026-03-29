import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import Ionicons from '@react-native-vector-icons/ionicons';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderCard from './components/OrderCard';
import DatePicker from 'react-native-date-picker';
import { useOrdersByDate } from '../../utils/realm/hooks/useOrdersByDate';
moment.locale('vi');

type Props = {};

const daysInVietnamese: string[] = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

const HomeScreen = ({ navigation }: any) => {
  const [date, setDate] = useState(new Date());
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const { orders, totalRevenue, orderCount } = useOrdersByDate(date);

  const dayName = daysInVietnamese[date.getDay()];
  const dateString = moment(date).format('DD/MM');
  const formattedDate = `${dayName}, ${dateString}`;

  const isToday = moment(date).isSame(moment(), 'day');
  const revenueTitle = isToday
    ? 'Tổng doanh thu hôm nay'
    : `Doanh thu ngày ${dateString}`;
  const sectionTitle = isToday ? 'Đơn hàng hôm nay' : 'Danh sách đơn hàng';

  const handlePressCard = useCallback((order: any) => {
    const safeOrder = {
      id: order.id,
      orderCode: order.orderCode,
      total: order.total,
      note: order.note,
      createdAt: order.createdAt?.toISOString(),

      customer: order.customer
        ? {
            id: order.customer.id,
            name: order.customer.name,
          }
        : null,

      items: order.items.map((item: any) => ({
        qty: item.qty,
        price: item.price,
        productName: item.productName,
        product: item.product
          ? {
              id: item.product.id,
            }
          : null,
      })),
    };

    navigation.navigate('CreateOrderScreen', { orderToEdit: safeOrder });
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => {
      return <OrderCard order={item} index={index} onPress={handlePressCard} />;
    },
    [handlePressCard],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.iconButton}
          >
            <Ionicons name="menu-outline" size={28} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đơn hàng</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setOpenDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={28} color="#111827" />
          </TouchableOpacity>
        </View>

        <View style={styles.fixedHeaderArea}>
          <Text style={styles.dateTitle}>{formattedDate}</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>{revenueTitle}</Text>
            <Text style={styles.summaryAmount}>
              {totalRevenue.toLocaleString('vi-VN')}đ
            </Text>
            {orderCount > 0 && (
              <Text style={styles.summarySubtext}>
                từ {orderCount} đơn hàng
              </Text>
            )}
          </View>

          {orderCount > 0 && (
            <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          )}
        </View>

        <View style={styles.listWrapper}>
          <FlatList
            data={orders}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            ListEmptyComponent={
              <Text
                style={{ textAlign: 'center', marginTop: 40, color: '#9CA3AF' }}
              >
                Không có đơn hàng nào trong ngày này.
              </Text>
            }
          />
        </View>

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('CreateOrderScreen', { initialDate: date })
          }
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <DatePicker
          modal
          mode="date"
          open={openDatePicker}
          date={date}
          locale="vi"
          title="Chọn ngày xem doanh thu"
          confirmText="Chọn"
          cancelText="Hủy"
          onConfirm={selectedDate => {
            setOpenDatePicker(false);
            setDate(selectedDate);
          }}
          onCancel={() => {
            setOpenDatePicker(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
    textAlign: 'center',
  },

  iconButton: {
    padding: 8,
  },
  fixedHeaderArea: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  dateTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#D0E8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 15,
    color: '#4B5563',
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  summarySubtext: {
    fontSize: 15,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
    flexGrow: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});

export default HomeScreen;
