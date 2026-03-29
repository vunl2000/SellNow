import Ionicons from '@react-native-vector-icons/ionicons';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProductCard from './components/ProductCard';
import AddProductModal, {
  AddProductModalRef,
} from './components/AddProductModal';
import ProductActionModal, {
  ProductActionModalRef,
} from './components/ProductActionModal';
import { useProducts } from '../../utils/realm/hooks/useProducts';
import { ProductModel } from '../../model/product';

const InventoryScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  const modalRef = useRef<AddProductModalRef>(null);
  const actionModalRef = useRef<ProductActionModalRef>(null);

  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    checkSKUExists,
    generateUniqueSKU,
  } = useProducts(searchQuery);

  const handleEditProduct = useCallback((product: ProductModel) => {
    modalRef.current?.open(product, 'edit');
  }, []);

  const handleDeleteProduct = useCallback(
    (product: ProductModel) => {
      Alert.alert(
        'Xác nhận xóa',
        `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`,
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: () => deleteProduct(product.id),
          },
        ],
      );
    },
    [deleteProduct],
  );

  const handleOpenOptions = useCallback((product: ProductModel) => {
    actionModalRef.current?.open(product);
  }, []);

  const handlePressCard = (product: ProductModel) => {
    modalRef.current?.open(product, 'view');
  };

  const handleSaveProduct = (data: ProductModel) => {
    const isExisting = products.some(p => p.id === data.id);

    if (isExisting) {
      updateProduct(data.id, data);
    } else {
      addProduct(data);
    }
  };

  const renderEmptyComponent = () => {
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
        <Text style={styles.emptyTitle}>Danh sách trống</Text>
        <Text style={styles.emptySubtitle}>
          Chưa có dữ liệu nào ở đây cả. Bấm nút dưới để thêm mới nhé!
        </Text>
      </View>
    );
  };
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ProductModel>) => {
      return (
        <ProductCard
          item={item}
          onPress={handlePressCard}
          onOptionsPress={handleOpenOptions}
        />
      );
    },
    [],
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

          <Text style={styles.headerTitle}>Kho Hàng</Text>

          <View style={styles.headerRight} />
        </View>

        {(products.length > 0 || searchQuery !== '') && (
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#9CA3AF"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
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
          data={products}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
        />

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => modalRef.current?.open()}
          >
            <Ionicons
              name="add"
              size={24}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
          </TouchableOpacity>
        </View>

        <AddProductModal
          ref={modalRef}
          onSave={handleSaveProduct}
          checkSKUExists={checkSKUExists}
          generateUniqueSKU={generateUniqueSKU}
        />
        <ProductActionModal
          ref={actionModalRef}
          onView={handlePressCard}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
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
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 100,
    flexGrow: 1,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingTop: 16,
    backgroundColor: 'rgba(248, 250, 252, 0.9)',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderRadius: 100,
    paddingVertical: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
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

export default InventoryScreen;
