import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

import { useOrderActions } from '../../utils/realm/hooks/useOrderActions';
import SelectProductModal, {
  SelectProductModalRef,
} from './components/SelectProductModal';
import SelectCustomerModal, {
  SelectCustomerModalRef,
} from './components/SelectCustomerModal';

const PRODUCT_COLOR_PALETTE = [
  { bg: '#DBEAFE', icon: '#2563EB' },
  { bg: '#D1FAE5', icon: '#059669' },
  { bg: '#FEE2E2', icon: '#EF4444' },
  { bg: '#FEF3C7', icon: '#D97706' },
  { bg: '#EDE9FE', icon: '#7C3AED' },
  { bg: '#FCE7F3', icon: '#DB2777' },
  { bg: '#F3F4F6', icon: '#4B5563' },
];

const CreateOrderScreen = ({ navigation, route }: any) => {
  const passedOrder = route.params?.orderToEdit;
  const initialDate = route.params?.initialDate;
  const [mode, setMode] = useState<'create' | 'view' | 'edit'>(
    passedOrder ? 'view' : 'create',
  );

  const { addOrder, updateOrder, deleteOrder } = useOrderActions();

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>('');
  const [cartItems, setCartItems] = useState<any[]>([]);

  const selectProductRef = useRef<SelectProductModalRef>(null);
  const selectCustomerRef = useRef<SelectCustomerModalRef>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const loadOrderData = () => {
    if (passedOrder) {
      setEditingOrderId(passedOrder.id);
      setSelectedCustomerId(passedOrder.customer?.id || '');
      setSelectedCustomerName(passedOrder.customer?.name || '');
      setNote(passedOrder.note || '');
      setShowNoteInput(!!passedOrder.note);

      const mappedItems = passedOrder.items.map((item: any) => ({
        productId: item.product?.id,
        productName: item.productName,
        price: item.price,
        qty: item.qty.toString(),
      }));
      setCartItems(mappedItems);
    } else {
      setCartItems([]);
      setSelectedCustomerId('');
      setSelectedCustomerName('');
      setNote('');
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [passedOrder]);

  const totalRevenue = cartItems.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * item.price,
    0,
  );
  const formatPrice = (num: number) => num.toLocaleString('vi-VN') + 'đ';

  const handleBack = () => {
    if (mode === 'edit') {
      setMode('view');
      loadOrderData();
    } else {
      navigation.goBack();
    }
  };

  const handleDeleteOrder = () => {
    Alert.alert('Xác nhận xóa', `Bạn có chắc chắn muốn xóa đơn hàng này?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => {
          if (editingOrderId) {
            deleteOrder(editingOrderId);
            navigation.goBack();
          }
        },
      },
    ]);
  };

  const handleSubmit = () => {
    try {
      if (!selectedCustomerId) {
        Alert.alert('Lỗi', 'Vui lòng chọn khách hàng!');
        return;
      }
      if (cartItems.length === 0) {
        Alert.alert('Lỗi', 'Giỏ hàng đang trống!');
        return;
      }

      const invalidItems = cartItems.filter(
        item => (Number(item.qty) || 0) <= 0 || Number(item.price) <= 0,
      );
      const validItems = cartItems.filter(
        item => (Number(item.qty) || 0) > 0 && Number(item.price) > 0,
      );

      if (invalidItems.length > 0) {
        Alert.alert(
          'Cảnh báo',
          `Đã loại bỏ ${invalidItems.length} sản phẩm 0đ. Kiểm tra lại trước khi lưu!`,
          [{ text: 'OK' }],
        );
        setCartItems(validItems);
        return;
      }

      const itemsToSave = validItems.map(item => ({
        productId: item.productId,
        qty: Number(item.qty),
        price: Number(item.price),
      }));

      if (mode === 'edit' && editingOrderId) {
        updateOrder(
          editingOrderId,
          selectedCustomerId,
          itemsToSave,
          selectedCustomerName,
          note,
        );
      } else {
        addOrder(
          selectedCustomerId,
          itemsToSave,
          selectedCustomerName,
          note,
          initialDate ? new Date(initialDate) : new Date(),
        );
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const handleUpdateQty = (productId: string, newQty: string) => {
    const formattedQty = newQty.replace(/,/g, '.');
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, qty: formattedQty } : item,
      ),
    );
  };

  const handleConfirmProducts = (selectedProducts: any[]) => {
    setCartItems(prevCart => {
      const newCart = prevCart.filter(cartItem =>
        selectedProducts.some(p => p.id === cartItem.productId),
      );
      selectedProducts.forEach(product => {
        if (!newCart.find(item => item.productId === product.id)) {
          newCart.push({
            productId: product.id,
            productName: product.name,
            qty: '1',
            price: product.price,
          });
        }
      });
      return newCart;
    });
  };

  const renderViewMode = () => (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 180 }}
      >
        <View style={styles.viewCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderCode}>
              Mã Đơn #{passedOrder?.orderCode}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Thời gian tạo</Text>
            <Text style={styles.dataValue}>
              {moment(passedOrder?.createdAt).format('HH:mm, DD/MM/YYYY')}
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Khách hàng</Text>
            <Text style={styles.dataValue}>
              {passedOrder?.customer?.name || 'Khách lẻ'}
            </Text>
          </View>
        </View>

        <View style={styles.viewCard}>
          <Text style={styles.cardTitle}>Sản phẩm đã mua</Text>
          <View style={styles.divider} />
          {cartItems.map((item, index) => {
            const theme =
              PRODUCT_COLOR_PALETTE[index % PRODUCT_COLOR_PALETTE.length];
            return (
              <View key={index} style={styles.productItemView}>
                <View
                  style={[
                    styles.productImageContainer,
                    { backgroundColor: theme.bg },
                  ]}
                >
                  <Ionicons name="cube-outline" size={32} color={theme.icon} />
                </View>
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.productName}</Text>
                  <Text style={styles.productCalculation}>{`${
                    item.qty
                  } x ${formatPrice(item.price)}`}</Text>
                </View>
                <Text style={styles.productSubtotal}>
                  {formatPrice(item.qty * item.price)}
                </Text>
              </View>
            );
          })}
        </View>

        {!!note && (
          <View style={styles.viewCard}>
            <Text style={styles.cardTitle}>Ghi chú</Text>
            <View style={styles.divider} />
            <Text style={styles.noteText}>{note}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footerView}>
        <View style={styles.footerDataContainer}>
          <View style={styles.totalDataRow}>
            <Text style={styles.dataLabel}>Tạm tính ({cartItems.length})</Text>
            <Text style={styles.dataValueBold}>
              {formatPrice(totalRevenue)}
            </Text>
          </View>
          <View style={styles.totalDataRow}>
            <Text style={styles.dataLabel}>Giảm giá</Text>
            <Text style={styles.dataValueBold}>0đ</Text>
          </View>
          <Text
            style={styles.dashedDivider}
            ellipsizeMode="clip"
            numberOfLines={1}
          >
            ----------------------------------------------------------------------------------------------------------
          </Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabelTitle}>Tổng tiền</Text>
            <Text style={styles.totalAmountValue}>
              {formatPrice(totalRevenue)}
            </Text>
          </View>
        </View>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteOrder}
          >
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
            <Text style={styles.deleteButtonText}>Xóa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setMode('edit')}
          >
            <Ionicons name="pencil-outline" size={20} color="#2563EB" />
            <Text style={styles.editButtonText}>Sửa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderFormMode = () => (
    <>
      <View style={styles.searchWrap}>
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={0.8}
          onPress={() =>
            selectProductRef.current?.open(
              cartItems.map(item => item.productId),
            )
          }
        >
          <Ionicons
            name="search-outline"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 10 }}
          />
          <Text style={{ flex: 1, fontSize: 16, color: '#9CA3AF' }}>
            Chạm để thêm sản phẩm...
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addScanButton}
          onPress={() =>
            selectProductRef.current?.open(
              cartItems.map(item => item.productId),
            )
          }
        >
          <Ionicons name="add" size={24} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {cartItems.map((item, index) => (
            <View key={index} style={styles.productCardForm}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() =>
                  setCartItems(prev =>
                    prev.filter(p => p.productId !== item.productId),
                  )
                }
              >
                <Ionicons name="close-circle" size={24} color="#EF4444" />
              </TouchableOpacity>
              <View style={styles.productDetailsForm}>
                <Text style={styles.productNameForm}>{item.productName}</Text>
                <Text style={styles.productPriceForm}>
                  Đơn giá: {formatPrice(item.price)}
                </Text>
              </View>
              <View style={styles.productInputRow}>
                <View style={styles.inputGroupContainer}>
                  <Text style={styles.inputGroupLabel}>Số lượng</Text>
                  <View style={styles.quantityInputGroup}>
                    <TextInput
                      ref={el => {
                        inputRefs.current[index] = el;
                      }}
                      style={styles.quantityInput}
                      keyboardType="decimal-pad"
                      value={item.qty}
                      onChangeText={val => handleUpdateQty(item.productId, val)}
                      selectTextOnFocus
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={() => {
                        if (index < cartItems.length - 1) {
                          inputRefs.current[index + 1]?.focus();
                        } else {
                          inputRefs.current[index]?.blur();
                        }
                      }}
                    />
                  </View>
                </View>
                <View style={styles.inputGroupContainer}>
                  <Text style={styles.inputGroupLabel}>Thành tiền</Text>
                  <TextInput
                    style={styles.subtotalInput}
                    value={formatPrice((Number(item.qty) || 0) * item.price)}
                    editable={false}
                  />
                </View>
              </View>
            </View>
          ))}

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() =>
                selectCustomerRef.current?.open(selectedCustomerId)
              }
            >
              <View style={styles.actionBtnIconBox}>
                <Ionicons name="person-add-outline" size={20} color="#2563EB" />
              </View>
              <Text style={styles.actionBtnText}>
                {selectedCustomerName
                  ? selectedCustomerName
                  : 'Chọn khách hàng'}
              </Text>
              <Ionicons
                name="chevron-forward-outline"
                size={20}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            {!showNoteInput ? (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => setShowNoteInput(true)}
              >
                <View style={styles.actionBtnIconBox}>
                  <Ionicons name="create-outline" size={20} color="#2563EB" />
                </View>
                <Text style={styles.actionBtnText}>Thêm ghi chú</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.noteInputContainer}>
                <View style={styles.noteHeader}>
                  <Text style={styles.inputGroupLabel}>Ghi chú đơn hàng</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowNoteInput(false);
                      setNote('');
                    }}
                  >
                    <Ionicons name="close-circle" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.noteInput}
                  placeholder="VD: Khách dặn giao buổi sáng..."
                  multiline={true}
                  value={note}
                  onChangeText={setNote}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footerForm}>
          <View style={styles.totalRowForm}>
            <Text style={styles.totalLabelForm}>Tổng cộng</Text>
            <Text style={styles.totalAmountForm}>
              {formatPrice(totalRevenue)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.createOrderButton}
            onPress={handleSubmit}
          >
            <Text style={styles.createOrderText}>
              {mode === 'edit' ? 'Cập Nhật Đơn Bán' : 'Tạo Đơn Bán'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.iconButton}>
          <Ionicons
            name={mode === 'edit' ? 'close' : 'arrow-back'}
            size={26}
            color="#111827"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {mode === 'view'
            ? 'Chi tiết Đơn hàng'
            : mode === 'edit'
            ? 'Sửa Đơn Hàng'
            : 'Tạo Đơn Bán'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {mode === 'view' ? renderViewMode() : renderFormMode()}

      <SelectProductModal
        ref={selectProductRef}
        onConfirm={handleConfirmProducts}
      />
      <SelectCustomerModal
        ref={selectCustomerRef}
        onSelect={customer => {
          setSelectedCustomerId(customer.id);
          setSelectedCustomerName(customer.name);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  iconButton: { padding: 4 },
  content: { flex: 1, padding: 16 },

  viewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCode: { fontSize: 18, fontWeight: '700', color: '#111827' },
  statusBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: '#059669', fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16 },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataLabel: { fontSize: 15, color: '#6B7280' },
  dataValue: { fontSize: 15, fontWeight: '500', color: '#111827' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  productItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productDetails: { flex: 1 },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productCalculation: { fontSize: 14, color: '#6B7280' },
  productSubtotal: { fontSize: 16, fontWeight: '700', color: '#111827' },
  noteText: { fontSize: 15, color: '#6B7280', fontStyle: 'italic' },
  footerView: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  footerDataContainer: { padding: 16 },
  totalDataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dataValueBold: { fontSize: 15, fontWeight: '600', color: '#111827' },
  dashedDivider: { color: '#D1D5DB', marginVertical: 8, fontSize: 12 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalLabelTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  totalAmountValue: { fontSize: 24, fontWeight: '800', color: '#2563EB' },
  actionButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#DBEAFE',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: { color: '#2563EB', fontSize: 16, fontWeight: '600' },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    elevation: 1,
  },
  addScanButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
  },
  productCardForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    position: 'relative',
  },
  removeBtn: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
  productDetailsForm: { marginBottom: 16, paddingRight: 30 },
  productNameForm: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  productPriceForm: { fontSize: 13, color: '#6B7280' },
  productInputRow: { flexDirection: 'row', gap: 12 },
  inputGroupContainer: { flex: 1 },
  inputGroupLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 6 },
  quantityInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
  },
  quantityInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 12,
    textAlign: 'center',
  },
  subtotalInput: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    textAlign: 'center',
  },
  actionButtons: { gap: 12 },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  actionBtnIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionBtnText: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1E293B' },
  noteInputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteInput: {
    fontSize: 15,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  footerForm: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    elevation: 10,
  },
  totalRowForm: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  totalLabelForm: { fontSize: 16, color: '#6B7280' },
  totalAmountForm: { fontSize: 28, fontWeight: '800', color: '#111827' },
  createOrderButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  createOrderText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});

export default CreateOrderScreen;
