import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCustomers } from '../../../utils/realm/hooks/useCustomers';
import { CustomerModel } from '../../../model/customer';
import moment from 'moment';

export interface SelectCustomerModalRef {
  open: (currentSelectedId?: string) => void;
  close: () => void;
}

interface Props {
  onSelect: (customer: CustomerModel) => void;
}

const COLOR_PALETTE = [
  { bg: '#DBEAFE', text: '#2563EB' },
  { bg: '#D1FAE5', text: '#059669' },
  { bg: '#FEE2E2', text: '#EF4444' },
  { bg: '#FEF3C7', text: '#D97706' },
  { bg: '#EDE9FE', text: '#7C3AED' },
  { bg: '#FCE7F3', text: '#DB2777' },
  { bg: '#F3F4F6', text: '#4B5563' },
];

const SelectCustomerModal = forwardRef<SelectCustomerModalRef, Props>(
  ({ onSelect }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Lưu ID khách hàng đang được chọn
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // 🚀 HOOK TÌM KIẾM KHÁCH HÀNG TỰ ĐỘNG
    const { customers } = useCustomers(searchText);

    useImperativeHandle(ref, () => ({
      open: currentSelectedId => {
        setSelectedId(currentSelectedId || null);
        setSearchText('');
        setIsVisible(true);
      },
      close: () => setIsVisible(false),
    }));
    const handleQuickAdd = () => {
      const timeString = moment().format('HH:mm');
      const fakeCustomer = {
        id: 'QUICK_ADD',
        name: `KH mới lúc ${timeString}`,
      };
      onSelect(fakeCustomer as any);
      setIsVisible(false);
    };

    const handleSelectCustomer = (customer: CustomerModel) => {
      setSelectedId(customer.id);
      onSelect(customer);
      setIsVisible(false);
    };

    const renderHeader = () => (
      <TouchableOpacity
        style={styles.quickAddBtn}
        activeOpacity={0.7}
        onPress={handleQuickAdd}
      >
        <View style={[styles.avatarContainer, { backgroundColor: '#FEF08A' }]}>
          <Ionicons name="flash" size={24} color="#CA8A04" />
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>Thêm nhanh khách vãng lai</Text>
          <Text style={styles.customerPhone}>
            Tự động lưu: KH mới lúc {moment().format('HH:mm')}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CA8A04" />
      </TouchableOpacity>
    );

    const renderItem = ({
      item,
      index,
    }: {
      item: CustomerModel;
      index: number;
    }) => {
      const isSelected = selectedId === item.id;
      const theme = COLOR_PALETTE[index % COLOR_PALETTE.length];

      const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : '?';

      return (
        <TouchableOpacity
          style={[
            styles.customerItem,
            isSelected && styles.customerItemSelected,
          ]}
          activeOpacity={0.7}
          onPress={() => handleSelectCustomer(item)}
        >
          <View style={[styles.avatarContainer, { backgroundColor: theme.bg }]}>
            <Text style={[styles.avatarText, { color: theme.text }]}>
              {firstLetter}
            </Text>
          </View>

          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{item.name}</Text>

            {item.phone && (
              <Text style={styles.customerPhone}>{item.phone}</Text>
            )}
          </View>

          <View style={[styles.radio, isSelected && styles.radioSelected]}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="#FFFFFF" />
            )}
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <Modal visible={isVisible} animationType="slide" transparent={true}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setIsVisible(false)}
                style={styles.iconBtn}
              >
                <Ionicons name="close-outline" size={28} color="#111827" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Chọn Khách Hàng</Text>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="person-add" size={24} color="#2563EB" />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm tên hoặc SĐT..."
                value={searchText}
                onChangeText={setSearchText}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText('')}>
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>

            <FlatList
              data={customers}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              initialNumToRender={8}
              maxToRenderPerBatch={8}
              windowSize={5}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 40,
                    color: '#9CA3AF',
                  }}
                >
                  Không tìm thấy khách hàng nào.
                </Text>
              }
            />
          </View>
        </SafeAreaView>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  iconBtn: { padding: 4 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: { flex: 1, fontSize: 16, color: '#111827', marginLeft: 8 },

  listContent: { paddingHorizontal: 16, paddingBottom: 40 },

  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1,
  },
  customerItemSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },

  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: 'bold' },

  customerInfo: { flex: 1 },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  customerPhone: { fontSize: 14, color: '#6B7280' },

  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  quickAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEFCE8',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE047',
    borderStyle: 'dashed',
  },
});

export default SelectCustomerModal;
