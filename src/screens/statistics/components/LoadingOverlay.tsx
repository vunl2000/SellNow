import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet, Text } from 'react-native';

export const LoadingOverlay = ({
  visible,
  message = 'Đang xử lý dữ liệu...',
}: any) => {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.text}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 5,
  },
  text: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
});
