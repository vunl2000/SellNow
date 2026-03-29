import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CustomerModel, TypeCustomer } from '../../../model/customer';

interface AddCustomerModalProps {
  onSave: (data: CustomerModel) => void;
}

export interface AddCustomerModalRef {
  open: (data?: CustomerModel, mode?: 'add' | 'view' | 'edit') => void;
  close: () => void;
}

const AddCustomerModal = forwardRef<AddCustomerModalRef, AddCustomerModalProps>(
  ({ onSave }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const [mode, setMode] = useState<'add' | 'view' | 'edit'>('add');
    const [currentId, setCurrentId] = useState<string | undefined>();

    const [customerType, setCustomerType] = useState<TypeCustomer>('quen');
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [map, setMap] = useState<string>('');
    const [note, setNote] = useState<string>('');

    const nameRef = useRef<TextInput>(null);
    const phoneRef = useRef<TextInput>(null);
    const addressRef = useRef<TextInput>(null);
    const mapRef = useRef<TextInput>(null);
    const noteRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      open: (data, initialMode = 'add') => {
        if (data) {
          setCurrentId(data.id);
          setCustomerType(data.type);
          setName(data.name);
          setPhone(data.phone);
          setAddress(data.address);
          setMap(data.map || '');
          setNote(data.note || '');
        } else {
          resetForm();
        }
        setMode(initialMode);
        setIsVisible(true);
      },
      close: () => handleClose(),
    }));

    const handleClose = () => {
      setIsVisible(false);
      Keyboard.dismiss();
    };

    const handleRightAction = () => {
      if (mode === 'view') {
        setMode('edit');
      } else {
        if (!name.trim() || !phone.trim() || !address.trim()) {
          Alert.alert(
            'Lỗi',
            'Vui lòng điền đầy đủ các thông tin bắt buộc (*).',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (!name.trim()) nameRef.current?.focus();
                  else if (!phone.trim()) phoneRef.current?.focus();
                  else if (!address.trim()) addressRef.current?.focus();
                },
              },
            ],
          );
          return;
        }

        const formData = {
          ...(currentId && { id: currentId }),
          type: customerType,
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          map: map.trim() || '',
          note: note.trim() || '',
        } as CustomerModel;
        onSave(formData);
        handleClose();
        resetForm();
      }
    };

    const resetForm = () => {
      setCurrentId(undefined);
      setCustomerType('quen');
      setName('');
      setPhone('');
      setAddress('');
      setMap('');
      setNote('');
    };

    const getHeaderStyle = () => {
      switch (mode) {
        case 'add':
          return {
            text: 'THÊM MỚI',
            bg: '#DCFCE7',
            content: '#166534',
            icon: '#166534',
          };
        case 'edit':
          return {
            text: 'CHỈNH SỬA',
            bg: '#DBEAFE',
            content: '#1E40AF',
            icon: '#1E40AF',
          };
        case 'view':
        default:
          return {
            text: 'CHI TIẾT',
            bg: '#FFFFFF',
            content: '#111827',
            icon: '#374151',
          };
      }
    };

    const headerStyle = getHeaderStyle();

    const isReadOnly = mode === 'view';

    return (
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.keyboardAvoid}
            >
              <View style={styles.bottomSheet}>
                <View
                  style={[styles.header, { backgroundColor: headerStyle.bg }]}
                >
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.headerIcon}
                  >
                    <Ionicons
                      name="close-outline"
                      size={28}
                      color={headerStyle.icon}
                    />
                  </TouchableOpacity>

                  <View style={styles.titleWrapper}>
                    <Text
                      style={[
                        styles.headerTitle,
                        { color: headerStyle.content },
                      ]}
                    >
                      {headerStyle.text}
                    </Text>
                    {/* Thêm một cái chấm nhỏ cho "nghệ" */}
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: headerStyle.content },
                      ]}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleRightAction}
                    style={styles.headerIcon}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        { color: headerStyle.content },
                      ]}
                    >
                      {mode === 'view' ? 'Sửa' : 'Lưu'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={styles.content}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                >
                  <Text style={styles.sectionTitle}>Phân loại khách hàng</Text>

                  <View style={styles.typeContainer}>
                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        customerType === 'quen' && styles.typeButtonActive,
                        isReadOnly && styles.typeButtonDisabled,
                      ]}
                      onPress={() => setCustomerType('quen')}
                      disabled={isReadOnly}
                    >
                      <Ionicons
                        name={customerType === 'quen' ? 'star' : 'star-outline'}
                        size={18}
                        color={customerType === 'quen' ? '#2563EB' : '#6B7280'}
                      />
                      <Text
                        style={[
                          styles.typeText,
                          customerType === 'quen' && styles.typeTextActive,
                        ]}
                      >
                        Quen
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.typeButton,
                        customerType === 'vang_lai' && styles.typeButtonActive,
                        isReadOnly && styles.typeButtonDisabled,
                      ]}
                      onPress={() => setCustomerType('vang_lai')}
                      disabled={isReadOnly}
                    >
                      <Ionicons
                        name="walk-outline"
                        size={18}
                        color={
                          customerType === 'vang_lai' ? '#2563EB' : '#6B7280'
                        }
                      />
                      <Text
                        style={[
                          styles.typeText,
                          customerType === 'vang_lai' && styles.typeTextActive,
                        ]}
                      >
                        Vãng lai
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.formGroup}>
                    <View style={styles.inputWrapper}>
                      {!name && (
                        <Text style={styles.placeholderAbsolute}>
                          Tên khách hàng <Text style={styles.required}>*</Text>
                        </Text>
                      )}
                      <TextInput
                        ref={nameRef}
                        style={[
                          styles.input,
                          isReadOnly && styles.inputDisabled,
                        ]}
                        value={name}
                        onChangeText={setName}
                        editable={!isReadOnly}
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => phoneRef.current?.focus()}
                      />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.inputWrapper}>
                      {!phone && (
                        <Text style={styles.placeholderAbsolute}>
                          Số điện thoại <Text style={styles.required}>*</Text>
                        </Text>
                      )}
                      <TextInput
                        ref={phoneRef}
                        style={[
                          styles.input,
                          isReadOnly && styles.inputDisabled,
                        ]}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                        editable={!isReadOnly}
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => addressRef.current?.focus()}
                      />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.inputWrapper}>
                      {!address && (
                        <Text style={styles.placeholderAbsolute}>
                          Địa chỉ <Text style={styles.required}>*</Text>
                        </Text>
                      )}
                      <TextInput
                        ref={addressRef}
                        style={[
                          styles.input,
                          isReadOnly && styles.inputDisabled,
                        ]}
                        value={address}
                        onChangeText={setAddress}
                        editable={!isReadOnly}
                        returnKeyType="next"
                        submitBehavior="submit"
                        onSubmitEditing={() => mapRef.current?.focus()}
                      />
                    </View>
                  </View>

                  <View style={[styles.formGroup, styles.mapGroup]}>
                    <TextInput
                      ref={mapRef}
                      style={[
                        styles.mapInput,
                        isReadOnly && styles.inputDisabled,
                      ]}
                      placeholder="Link Google Map (Tùy chọn)"
                      placeholderTextColor="#9CA3AF"
                      value={map}
                      onChangeText={setMap}
                      editable={!isReadOnly}
                      keyboardType="url"
                      autoCapitalize="none"
                      multiline
                      textAlignVertical="top"
                      returnKeyType="next"
                      submitBehavior="submit"
                      onSubmitEditing={() => noteRef.current?.focus()}
                    />
                  </View>

                  <View style={[styles.formGroup, styles.noteGroup]}>
                    <TextInput
                      ref={noteRef}
                      style={[
                        styles.noteInput,
                        isReadOnly && styles.inputDisabled,
                      ]}
                      placeholder="Ghi chú..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      textAlignVertical="top"
                      value={note}
                      onChangeText={setNote}
                      editable={!isReadOnly}
                    />
                  </View>

                  <View style={{ height: 40 }} />
                </ScrollView>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  keyboardAvoid: { flex: 1, justifyContent: 'flex-end' },
  bottomSheet: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginLeft: 6,
    opacity: 0.5,
  },
  headerIcon: { padding: 4, minWidth: 40, alignItems: 'center' },
  actionButtonText: { fontSize: 16, color: '#2563EB', fontWeight: '600' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 14, color: '#4B5563', marginBottom: 10 },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: { backgroundColor: '#EFF6FF', borderColor: '#3B82F6' },
  typeButtonDisabled: { opacity: 0.7 },
  typeText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  typeTextActive: { color: '#2563EB' },
  formGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  inputWrapper: { position: 'relative', justifyContent: 'center' },
  placeholderAbsolute: {
    position: 'absolute',
    left: 16,
    color: '#9CA3AF',
    fontSize: 16,
    zIndex: -1,
  },
  required: { color: '#EF4444' },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    minHeight: 50,
  },
  inputDisabled: { color: '#6B7280' },
  divider: { height: 1, backgroundColor: '#E5E7EB', marginLeft: 16 },
  mapGroup: { minHeight: 80 },
  mapInput: { padding: 16, fontSize: 16, color: '#111827', minHeight: 80 },
  noteGroup: { minHeight: 120 },
  noteInput: { padding: 16, fontSize: 16, color: '#111827', minHeight: 120 },
});

export default AddCustomerModal;
