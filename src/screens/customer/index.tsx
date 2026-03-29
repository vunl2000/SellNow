import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  ListRenderItemInfo,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import AddCustomerModal, {
  AddCustomerModalRef,
} from './components/AddCustomerModal';
import CustomerCard from './components/CustomerCard';
import { useCustomers } from '../../utils/realm/hooks/useCustomers';
import { CustomerModel } from '../../model/customer';

const CustomerScreen = ({ navigation }: any) => {
  const modalRef = useRef<AddCustomerModalRef>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { customers, addCustomer, updateCustomer, deleteCustomer } =
    useCustomers(searchQuery);

  const handleSaveCustomer = (data: CustomerModel) => {
    if (data.id) updateCustomer(data.id, data);
    else addCustomer(data as CustomerModel);
  };

  const handleCustomerPress = useCallback((customerData: CustomerModel) => {
    modalRef.current?.open(customerData, 'view');
  }, []);

  const handleDeleteCustomer = useCallback(
    (customerData: CustomerModel) => {
      Alert.alert(
        'Xoá khách hàng',
        `Bạn có chắc chắn muốn xoá khách hàng "${customerData.name}" không? Hành động này không thể hoàn tác.`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xoá',
            style: 'destructive',
            onPress: () => {
              deleteCustomer(customerData.id);
            },
          },
        ],
      );
    },
    [deleteCustomer],
  );

  const renderEmptyState = () => {
    if (searchQuery.trim() !== '') {
      return (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIconCircle, { width: 60, height: 60 }]}>
            <Ionicons name="search-outline" size={40} color="#CBD5E1" />
          </View>
          <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
          <Text style={styles.emptySubtitle}>
            Không tìm thấy "{searchQuery}". Thử kiểm tra lại chính tả hoặc tìm
            bằng từ khóa khác xem nhé!
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <Ionicons name="people-outline" size={80} color="#CBD5E1" />
        </View>
        <Text style={styles.emptyTitle}>Chưa có khách hàng</Text>
        <Text style={styles.emptySubtitle}>
          Danh sách của bạn đang trống. Hãy thêm khách hàng để quản lý thông tin
          liên hệ và địa chỉ giao hàng thuận tiện hơn!
        </Text>
      </View>
    );
  };

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<CustomerModel>) => {
      return (
        <CustomerCard
          item={item}
          onPress={handleCustomerPress}
          onDelete={handleDeleteCustomer}
        />
      );
    },
    [handleCustomerPress],
  );

  const keyExtractor = useCallback((item: any) => item.id, []);
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.iconButton}
            >
              <Ionicons name="menu-outline" size={32} color="#111827" />
            </TouchableOpacity>
          </View>

          <Text style={styles.headerTitle}>Khách hàng</Text>

          <View style={styles.headerRight} />
        </View>
        {(customers.length > 0 || searchQuery !== '') && (
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#6B7280"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm khách hàng..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== '' && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            )}
          </View>
        )}

        <FlatList
          data={customers}
          keyExtractor={keyExtractor}
          ListEmptyComponent={renderEmptyState}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          updateCellsBatchingPeriod={50}
        />

        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => modalRef.current?.open()}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <AddCustomerModal ref={modalRef} onSave={handleSaveCustomer} />
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
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    paddingRight: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 0,
    minHeight: 40,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
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
  iconButton: {
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  emptyIconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CustomerScreen;
