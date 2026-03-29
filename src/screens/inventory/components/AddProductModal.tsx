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
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductModel } from '../../../model/product';

interface AddProductModalProps {
  onSave: (data: ProductModel) => void;
  checkSKUExists: (sku: string) => boolean;
  generateUniqueSKU: () => string;
}

export interface AddProductModalRef {
  open: (productData?: ProductModel, mode?: 'add' | 'view' | 'edit') => void;
  close: () => void;
}

const AddProductModal = forwardRef<AddProductModalRef, AddProductModalProps>(
  ({ onSave, checkSKUExists, generateUniqueSKU }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const [mode, setMode] = useState<'add' | 'view' | 'edit'>('add');
    const [currentId, setCurrentId] = useState<string | undefined>();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [type, setType] = useState('');
    const [note, setNote] = useState('');

    const isAddMode = mode === 'add';
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    const skuRef = useRef<TextInput>(null);
    const nameRef = useRef<TextInput>(null);
    const priceRef = useRef<TextInput>(null);
    const stockRef = useRef<TextInput>(null);
    const typeRef = useRef<TextInput>(null);
    const noteRef = useRef<TextInput>(null);

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

    useImperativeHandle(ref, () => ({
      open: (productData, initialMode = 'add') => {
        if (productData) {
          setCurrentId(productData.id);
          setName(productData.name);
          setPrice(productData.price.toString());
          setStock(productData.stock.toString());
          setType(productData.type || '');
          setNote(productData.note || '');
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

    const handleAutoGenerateSKU = () => {
      const newSKU = generateUniqueSKU();
      setCurrentId(newSKU);
    };

    const handleRightAction = () => {
      const inputId = currentId?.trim();
      if (isViewMode) {
        setMode('edit');
        return;
      }

      if (!inputId || !name.trim() || !price.trim() || !stock.trim()) {
        Alert.alert(
          'Thiếu thông tin',
          'Vui lòng nhập đầy đủ các trường bắt buộc (*)',
          [
            {
              text: 'OK',
              onPress: () => {
                if (!currentId?.trim() && isAddMode) skuRef.current?.focus();
                else if (!name.trim()) nameRef.current?.focus();
                else if (!price.trim()) priceRef.current?.focus();
                else if (!stock.trim()) stockRef.current?.focus();
              },
            },
          ],
        );
        return;
      }

      if (isAddMode) {
        if (checkSKUExists(inputId)) {
          Alert.alert(
            'Mã SKU đã tồn tại',
            `Mã sản phẩm "${inputId}" đã có trong kho. Vui lòng nhập mã khác hoặc bấm nút Tạo nhanh.`,
            [{ text: 'OK', onPress: () => skuRef.current?.focus() }],
          );
          return;
        }
      }

      onSave({
        id: currentId,
        name: name.trim(),
        price: Number(price.replace(',', '.')) || 0,
        stock: Number(stock.replace(',', '.')) || 0,
        type: type.trim() || '',
        note: note.trim() || '',
      } as ProductModel);

      handleClose();
      resetForm();
    };

    const resetForm = () => {
      setCurrentId('');
      setName('');
      setPrice('');
      setStock('');
      setType('');
      setNote('');
    };

    return (
      <Modal
        visible={isVisible}
        animationType="fade"
        transparent={false}
        onRequestClose={handleClose}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoid}
          >
            <View style={[styles.header, { backgroundColor: headerStyle.bg }]}>
              <TouchableOpacity onPress={handleClose} style={styles.headerIcon}>
                <Ionicons
                  name="close-outline"
                  size={28}
                  color={headerStyle.icon}
                />
              </TouchableOpacity>

              <View style={styles.titleWrapper}>
                <Text
                  style={[styles.headerTitle, { color: headerStyle.content }]}
                >
                  {headerStyle.text}
                </Text>
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

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Mã sản phẩm<Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.skuRow}>
                    <TextInput
                      ref={skuRef}
                      style={[
                        styles.input,
                        styles.skuInput,
                        !isAddMode && styles.inputLocked,
                      ]}
                      placeholder="Gõ hoặc tạo nhanh..."
                      placeholderTextColor="#9CA3AF"
                      value={currentId}
                      onChangeText={setCurrentId}
                      editable={isAddMode} // CHỈ CHO NHẬP KHI THÊM MỚI
                      autoCapitalize="characters"
                      returnKeyType="next"
                      onSubmitEditing={() => nameRef.current?.focus()}
                      submitBehavior="submit"
                    />

                    {isAddMode && (
                      <TouchableOpacity
                        style={styles.quickGenerateBtn}
                        onPress={handleAutoGenerateSKU}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="flash" size={20} color="#2563EB" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Tên sản phẩm <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={nameRef}
                    style={[styles.input, isViewMode && styles.inputLocked]}
                    value={name}
                    onChangeText={setName}
                    editable={!isViewMode}
                    placeholder="Nhập tên sản phẩm..."
                    returnKeyType="next"
                    onSubmitEditing={() => priceRef.current?.focus()}
                    submitBehavior="submit"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Giá bán (VND) <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={priceRef}
                    style={[styles.input, isViewMode && styles.inputLocked]}
                    value={price}
                    onChangeText={setPrice}
                    editable={!isViewMode}
                    keyboardType="numeric"
                    placeholder="0"
                    returnKeyType="next"
                    onSubmitEditing={() => stockRef.current?.focus()}
                    submitBehavior="submit"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Tồn kho (Kg) <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    ref={stockRef}
                    style={[styles.input, isViewMode && styles.inputLocked]}
                    value={stock}
                    onChangeText={setStock}
                    editable={!isViewMode}
                    keyboardType="numeric"
                    placeholder="0 Kg"
                    returnKeyType="next"
                    onSubmitEditing={() => typeRef.current?.focus()}
                    submitBehavior="submit"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Phân loại</Text>
                  <TextInput
                    ref={typeRef}
                    style={[styles.input, isViewMode && styles.inputLocked]}
                    value={type}
                    onChangeText={setType}
                    editable={!isViewMode}
                    placeholder="Mặt hàng"
                    returnKeyType="next"
                    onSubmitEditing={() => noteRef.current?.focus()}
                    submitBehavior="submit"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Ghi chú</Text>
                  <TextInput
                    ref={noteRef}
                    style={[styles.textArea, isViewMode && styles.inputLocked]}
                    value={note}
                    onChangeText={setNote}
                    editable={!isViewMode}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    placeholder="Thêm mô tả..."
                  />
                </View>

                <View style={{ height: 100 }} />
              </ScrollView>
            </TouchableWithoutFeedback>

            {!isViewMode && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleRightAction}
                >
                  <Text style={styles.saveBtnText}>
                    {isAddMode ? 'Lưu sản phẩm' : 'Cập nhật thay đổi'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardAvoid: { flex: 1 },
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
  headerIcon: { width: 40, alignItems: 'center' },
  actionButtonText: { fontSize: 16, color: '#2563EB', fontWeight: '600' },
  actionText: { fontSize: 16, fontWeight: '600', color: '#2563EB' },
  content: { flex: 1, padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  required: { color: '#EF4444' },
  skuRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  skuInput: { flex: 1 },
  quickGenerateBtn: {
    backgroundColor: '#EFF6FF',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  inputLocked: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    color: '#6B7280',
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    minHeight: 100,
  },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  saveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});

export default AddProductModal;
