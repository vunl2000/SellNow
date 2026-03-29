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
import { ProductModel } from '../../../model/product';
import { useProducts } from '../../../utils/realm/hooks/useProducts';

export interface SelectProductModalRef {
  open: (alreadySelectedIds: string[]) => void;
  close: () => void;
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

interface Props {
  onConfirm: (selectedProducts: ProductModel[]) => void;
}

const SelectProductModal = forwardRef<SelectProductModalRef, Props>(
  ({ onConfirm }, ref) => {
    const [isVisible, setIsVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const { products } = useProducts(searchText);

    useImperativeHandle(ref, () => ({
      open: alreadySelectedIds => {
        setSelectedIds(alreadySelectedIds || []);
        setSearchText('');
        setIsVisible(true);
      },
      close: () => setIsVisible(false),
    }));

    const toggleProduct = (productId: string) => {
      setSelectedIds(prev => {
        if (prev.includes(productId)) {
          return prev.filter(id => id !== productId);
        }
        return [...prev, productId];
      });
    };

    const handleConfirm = () => {
      const selectedProductObjects = products.filter(p =>
        selectedIds.includes(p.id),
      );

      onConfirm(selectedProductObjects as unknown as ProductModel[]);
      setIsVisible(false);
    };

    const formatPrice = (num: number) => num.toLocaleString('vi-VN') + 'đ';

    const renderItem = ({
      item,
      index,
    }: {
      item: ProductModel;
      index: number;
    }) => {
      const isSelected = selectedIds.includes(item.id);

      const theme = COLOR_PALETTE[index % COLOR_PALETTE.length];

      return (
        <TouchableOpacity
          style={[styles.productItem, isSelected && styles.productItemSelected]}
          activeOpacity={0.7}
          onPress={() => toggleProduct(item.id)}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
            <Ionicons name="cube-outline" size={24} color={theme.icon} />
          </View>

          <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
          </View>

          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          >
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
              <Text style={styles.headerTitle}>Chọn Sản Phẩm</Text>
              <View style={{ width: 44 }} />
            </View>
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm tên sản phẩm..."
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
              data={products}
              keyExtractor={item => item.id}
              renderItem={renderItem}
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
                  Không tìm thấy sản phẩm nào.
                </Text>
              }
            />

            <View style={styles.footer}>
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  selectedIds.length === 0 && styles.confirmBtnDisabled,
                ]}
                disabled={selectedIds.length === 0}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>
                  Xác nhận ({selectedIds.length})
                </Text>
              </TouchableOpacity>
            </View>
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
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  productItem: {
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
  productItemSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: { fontSize: 14, color: '#6B7280' },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  confirmBtn: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmBtnDisabled: { backgroundColor: '#9CA3AF' },
  confirmText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default SelectProductModal;
