import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';

import { useStatistics } from '../../utils/realm/hooks/useStatistics';
import { FilterType } from '../../model/daily-report';
import { BackupModal } from './components/BackupModal';
import { useDatabaseManager } from '../../utils/realm/hooks/useDatabaseManager';
import { useExcelManager } from '../../utils/realm/hooks/useExcelManager';
import { ExcelModal } from './components/ExcelModal';
import { LoadingOverlay } from './components/LoadingOverlay';
import { useProducts } from '../../utils/realm/hooks/useProducts';

const StatisticsScreen = ({ navigation }: any) => {
  const [filterType, setFilterType] = useState<FilterType>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [showBackupModal, setShowBackupModal] = useState(false);
  const { backupDatabase, restoreDatabase } = useDatabaseManager();

  const { generateUniqueSKU } = useProducts();

  const [showExcelModal, setShowExcelModal] = useState(false);
  const {
    exportOrdersThisMonth,
    exportProducts,
    exportCustomers,
    importProducts,
    importCustomers,
    isLoading,
  } = useExcelManager();

  const stats = useStatistics(selectedDate, filterType);
  const formatMoney = (val: number) => val.toLocaleString('vi-VN') + ' đ';

  const getDateLabel = () => {
    switch (filterType) {
      case 'day':
        return 'NGÀY CHỌN';
      case 'week':
        return 'TUẦN CHỌN';
      case 'month':
        return 'THÁNG CHỌN';
      default:
        return 'THỜI GIAN';
    }
  };

  const getDateDisplay = () => {
    switch (filterType) {
      case 'day':
        return moment(selectedDate).format('DD/MM/YYYY');
      case 'week':
        const startOfWeek = moment(selectedDate)
          .startOf('isoWeek')
          .format('DD/MM');
        const endOfWeek = moment(selectedDate)
          .endOf('isoWeek')
          .format('DD/MM/YYYY');
        return `${startOfWeek} - ${endOfWeek}`;
      case 'month':
        return moment(selectedDate).format('[Tháng] MM, YYYY');
      default:
        return moment(selectedDate).format('DD [Tháng] MM, YYYY');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuBtn}
        >
          <Ionicons name="menu-outline" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thống kê</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.container}>
        <View style={styles.datePickerCard}>
          <View style={styles.dateIconBox}>
            <Ionicons name="calendar-outline" size={24} color="#2563EB" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.labelSmall}>{getDateLabel()}</Text>
            <Text style={styles.dateText}>{getDateDisplay()}</Text>
          </View>
          <TouchableOpacity
            style={styles.btnSelect}
            onPress={() => setOpen(true)}
          >
            <Text style={styles.btnSelectText}>Chọn</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabContainer}>
          {['Ngày', 'Tuần', 'Tháng'].map((label, index) => {
            const types: FilterType[] = ['day', 'week', 'month'];
            const type = types[index];
            const isActive = filterType === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => setFilterType(type)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, paddingHorizontal: 16 }}
        >
          <StatCard
            label="Doanh thu tổng"
            value={formatMoney(stats.totalRevenue)}
            icon="cash-outline"
            iconBg="#DBEAFE"
            iconColor="#2563EB"
          />

          <StatCard
            label="Số lượng đơn hàng"
            value={`${stats.orderCount} đơn`}
            icon="receipt-outline"
            iconBg="#EEF2FF"
            iconColor="#6366F1"
          />

          <StatCard
            label="Khối lượng đã bán"
            value={`${stats.totalWeight.toLocaleString('vi-VN')} kg`}
            icon="bag-handle-outline"
            iconBg="#D1FAE5"
            iconColor="#059669"
          />
        </ScrollView>

        <View style={styles.footer}>
          <FooterButton
            icon="download-outline"
            label="Sao lưu"
            type="secondary"
            onPress={() => setShowBackupModal(true)}
          />
          <FooterButton
            icon="document-text-outline"
            label="Xuất Excel"
            type="primary"
            onPress={() => setShowExcelModal(true)}
          />
        </View>
      </View>

      <DatePicker
        modal
        open={open}
        date={selectedDate}
        mode="date"
        title="Chọn ngày thống kê"
        confirmText="Đồng ý"
        cancelText="Hủy"
        onConfirm={date => {
          setOpen(false);
          setSelectedDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />

      <BackupModal
        visible={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        onBackup={backupDatabase}
        onRestore={restoreDatabase}
      />

      <ExcelModal
        visible={showExcelModal}
        onClose={() => setShowExcelModal(false)}
        onExportOrders={() => exportOrdersThisMonth(selectedDate)}
        onExportProducts={exportProducts}
        onExportCustomers={exportCustomers}
        onImportProducts={() => importProducts(generateUniqueSKU)}
        onImportCustomers={importCustomers}
      />

      <LoadingOverlay
        visible={isLoading}
        message="Đang nạp dữ liệu từ Excel..."
      />
    </SafeAreaView>
  );
};

const StatCard = ({ label, value, icon, iconBg, iconColor }: any) => (
  <View style={styles.card}>
    <View style={{ flex: 1 }}>
      <Text style={styles.labelSmall}>{label}</Text>
      <Text style={styles.mainValue}>{value}</Text>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}
      ></View>
    </View>
    <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
  </View>
);

const FooterButton = ({ icon, label, type, onPress }: any) => (
  <TouchableOpacity
    style={type === 'primary' ? styles.btnPrimary : styles.btnSecondary}
    onPress={onPress}
  >
    <Ionicons
      name={icon}
      size={20}
      color={type === 'primary' ? '#FFF' : '#111827'}
    />
    <Text
      style={
        type === 'primary' ? styles.btnTextPrimary : styles.btnTextSecondary
      }
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  datePickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 16,
    padding: 12,
    borderRadius: 16,
    elevation: 1,
  },
  dateIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelSmall: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  btnSelect: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnSelectText: { fontWeight: '700', color: '#1E293B' },

  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    padding: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#2563EB' },
  tabLabel: { fontSize: 15, fontWeight: '600', color: '#64748B' },
  tabLabelActive: { color: '#FFF' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  mainValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  subValue: { fontSize: 13, fontWeight: '600' },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnPrimary: {
    flex: 2,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnTextSecondary: { fontSize: 16, fontWeight: '700', color: '#111827' },
  btnTextPrimary: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});

export default StatisticsScreen;
