import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface ExcelModalProps {
  visible: boolean;
  onClose: () => void;
  onExportOrders: () => void;
  onExportProducts: () => void;
  onExportCustomers: () => void;
  onImportProducts: () => void;
  onImportCustomers: () => void;
}

export const ExcelModal = ({
  visible,
  onClose,
  onExportOrders,
  onExportProducts,
  onExportCustomers,
  onImportProducts,
  onImportCustomers,
}: ExcelModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Xuất / Nhập Excel</Text>
          <Text style={styles.modalSub}>
            Chọn dữ liệu bạn muốn xử lý. File sẽ xuất ra định dạng .xlsx chuẩn.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <ActionBtn
              icon="receipt-outline"
              color="#2563EB"
              bg="#DBEAFE"
              title="Xuất Đơn hàng"
              sub="Theo tháng đang chọn trên màn hình"
              onPress={() => {
                onClose();
                onExportOrders();
              }}
            />

            <ActionBtn
              icon="cube-outline"
              color="#059669"
              bg="#D1FAE5"
              title="Xuất Sản phẩm"
              sub="Tất cả sản phẩm trong kho"
              onPress={() => {
                onClose();
                onExportProducts();
              }}
            />

            <ActionBtn
              icon="people-outline"
              color="#D97706"
              bg="#FEF3C7"
              title="Xuất Khách hàng"
              sub="Danh sách khách hàng đã lưu"
              onPress={() => {
                onClose();
                onExportCustomers();
              }}
            />

            <View style={styles.divider} />
            <ActionBtn
              icon="push-outline"
              color="#7C3AED"
              bg="#EDE9FE"
              title="Nhập Sản phẩm từ Excel"
              sub="Thêm nhanh nhiều SP vào kho"
              onPress={() => {
                onClose();
                onImportProducts();
              }}
            />

            <ActionBtn
              icon="person-add-outline"
              color="#EA580C"
              bg="#FFEDD5"
              title="Nhập Khách hàng từ Excel"
              sub="Thêm nhanh danh bạ vào app"
              onPress={() => {
                onClose();
                onImportCustomers();
              }}
            />
          </ScrollView>

          <TouchableOpacity style={styles.modalCancelBtn} onPress={onClose}>
            <Text style={styles.modalCancelText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const ActionBtn = ({ icon, color, bg, title, sub, onPress }: any) => (
  <TouchableOpacity style={styles.modalActionBtn} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={styles.modalActionText}>{title}</Text>
      <Text style={styles.modalActionSub}>{sub}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalSub: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  modalActionSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  modalCancelBtn: {
    marginTop: 16,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
  },
  modalCancelText: { fontSize: 16, fontWeight: '700', color: '#475569' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 12 },
});
