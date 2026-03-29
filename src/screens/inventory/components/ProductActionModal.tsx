import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons'; // Nhớ export interface Product từ file kia ra nhé
import { ProductModel } from '../../../model/product';

export interface ProductActionModalRef {
  open: (product: ProductModel) => void;
  close: () => void;
}

interface ProductActionModalProps {
  onView: (product: ProductModel) => void;
  onEdit: (product: ProductModel) => void;
  onDelete: (product: ProductModel) => void;
}

const ProductActionModal = forwardRef<
  ProductActionModalRef,
  ProductActionModalProps
>(({ onView, onEdit, onDelete }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useImperativeHandle(ref, () => ({
    open: product => {
      setSelectedProduct(product);
      setIsVisible(true);
    },
    close: () => handleClose(),
  }));

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!selectedProduct) return null;

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.backgroundDimmer} />
        </TouchableWithoutFeedback>

        <View style={styles.bottomSheet}>
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <View style={styles.header}>
            <Text style={styles.productName}>{selectedProduct.name}</Text>
            <Text style={styles.subtitle}>Chọn hành động cho sản phẩm này</Text>
          </View>

          <View style={styles.actionList}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {
                handleClose();
                requestAnimationFrame(() => onView(selectedProduct));
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons
                  name="information-circle-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.actionText}>Xem chi tiết</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() => {
                handleClose();
                requestAnimationFrame(() => onEdit(selectedProduct));
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: '#F3F4F6' }]}>
                <Ionicons name="settings-outline" size={20} color="#4B5563" />
              </View>
              <Text style={styles.actionText}>Chỉnh sửa sản phẩm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              activeOpacity={0.7}
              onPress={() => {
                handleClose();
                requestAnimationFrame(() => onDelete(selectedProduct));
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </View>
              <Text style={[styles.actionText, { color: '#DC2626' }]}>
                Xóa sản phẩm
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backgroundDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dragHandleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  header: {
    marginBottom: 20,
  },
  productName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionList: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});

export default ProductActionModal;
