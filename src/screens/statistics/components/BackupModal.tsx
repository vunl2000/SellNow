import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

interface BackupModalProps {
  visible: boolean;
  onClose: () => void;
  onBackup: () => void;
  onRestore: () => void;
}

export const BackupModal = ({
  visible,
  onClose,
  onBackup,
  onRestore,
}: BackupModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalTitle}>Quản lý dữ liệu</Text>
          <Text style={modalStyles.modalSub}>
            Chọn hành động bạn muốn thực hiện với cơ sở dữ liệu.
          </Text>

          <TouchableOpacity
            style={modalStyles.modalActionBtn}
            onPress={() => {
              onClose();
              onBackup();
            }}
          >
            <View
              style={[
                modalStyles.iconContainer,
                { backgroundColor: '#DBEAFE' },
              ]}
            >
              <Ionicons name="cloud-upload-outline" size={20} color="#2563EB" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={modalStyles.modalActionText}>Sao lưu dữ liệu</Text>
              <Text style={modalStyles.modalActionSub}>
                Xuất file .realm để cất giữ
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={modalStyles.modalActionBtn}
            onPress={() => {
              onClose();
              onRestore();
            }}
          >
            <View
              style={[
                modalStyles.iconContainer,
                { backgroundColor: '#D1FAE5' },
              ]}
            >
              <Ionicons
                name="refresh-circle-outline"
                size={22}
                color="#059669"
              />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={modalStyles.modalActionText}>Khôi phục dữ liệu</Text>
              <Text style={modalStyles.modalActionSub}>
                Nạp lại từ file sao lưu cũ
              </Text>
            </View>
          </TouchableOpacity>

          {/* Nút Hủy */}
          <TouchableOpacity
            style={modalStyles.modalCancelBtn}
            onPress={onClose}
          >
            <Text style={modalStyles.modalCancelText}>Hủy bỏ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 24,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalActionText: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  modalActionSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  modalCancelBtn: { marginTop: 8, padding: 16, alignItems: 'center' },
  modalCancelText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },
});
