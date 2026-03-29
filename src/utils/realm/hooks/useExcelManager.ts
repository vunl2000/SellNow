import XLSX from 'xlsx';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Alert } from 'react-native';
import moment from 'moment';
import { useRealm } from '@realm/react';
import {
  pick,
  isErrorWithCode,
  errorCodes,
  types,
} from '@react-native-documents/picker';
import { BSON } from 'realm';
import { useState } from 'react';
import { useProducts } from './useProducts';
import { PRODUCT_SCHEMA_NAME } from '../schemas/schemaNames';
import { TypeCustomer } from '../../../model/customer';

export const useExcelManager = () => {
  const realm = useRealm();
  const [isLoading, setIsLoading] = useState(false);
  const {} = useProducts;
  const generateAndShareExcel = async (
    data: any[],
    fileNamePrefix: string,
    sheetName: string,
  ) => {
    try {
      if (data.length === 0) {
        Alert.alert('Thông báo', 'Không có dữ liệu để xuất!');
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      const wbout = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
      const fileName = `${fileNamePrefix}_${moment().format(
        'DDMMYYYY_HHmm',
      )}.xlsx`;
      const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await RNFS.writeFile(filePath, wbout, 'base64');

      await Share.open({
        title: `Chia sẻ ${fileName}`,
        url: `file://${filePath}`,
        filename: fileName,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Lỗi xuất Excel', error.message);
      }
    }
  };

  const exportOrdersThisMonth = async (selectedDate: Date) => {
    try {
      const startOfMonth = moment(selectedDate).startOf('month').toDate();
      const endOfMonth = moment(selectedDate).endOf('month').toDate();

      const orders = realm
        .objects('Order')
        .filtered(
          'createdAt >= $0 AND createdAt <= $1',
          startOfMonth,
          endOfMonth,
        );

      if (orders.length === 0) {
        Alert.alert(
          'Thông báo',
          'Không có đơn hàng nào trong tháng này để báo cáo!',
        );
        return;
      }

      setIsLoading(true);
      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const dataToExport = orders.map((order: any, index: number) => {
        const uniqueItemNames = [
          ...new Set(
            order.items
              .map((item: any) => item.product?.name)
              .filter((name: any) => name),
          ),
        ];

        const itemNamesDisplay = uniqueItemNames.join(', ');

        const totalWeightOfOrder = order.items.reduce(
          (sum: number, item: any) => {
            return sum + (Number(item.qty) || 0);
          },
          0,
        );

        return {
          STT: index + 1,
          'Mã Đơn': order.orderCode || order.id?.toString().slice(-6),
          'Ngày Bán': moment(order.createdAt).format('DD/MM/YYYY HH:mm'),
          'Khách Hàng': order.customer?.name || 'Khách vãng lai',
          'Mặt Hàng': itemNamesDisplay,
          'Khối lượng (kg)': totalWeightOfOrder,
          'Thành Tiền (VNĐ)': order.total || 0,
          'Ghi chú': order.note || '',
        };
      });

      const monthYear = moment(selectedDate).format('MM_YYYY');
      await generateAndShareExcel(
        dataToExport,
        `QuyetToan_Thang_${monthYear}`,
        'Báo Cáo Chi Tiết',
      );
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      if (err.message !== 'User did not share') {
        Alert.alert(
          'Lỗi xuất báo cáo',
          `Không thể tạo file Excel: ${err.message}`,
        );
      }
    }
  };

  const exportProducts = async () => {
    try {
      const products = realm.objects('Product');

      if (products.length === 0) {
        Alert.alert('Thông báo', 'Chưa có sản phẩm nào để xuất!');
        return;
      }

      setIsLoading(true);
      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const dataToExport = products.map((prod: any, index: number) => ({
        STT: index + 1,
        'Mã SP': prod.id,
        'Tên Sản Phẩm': prod.name,
        'Giá Bán (VNĐ)': prod.price,
        'Tồn Kho': prod.stock,
        'Phân Loại': prod?.type || '',
        'Ghi Chú': prod?.note || '',
      }));

      await generateAndShareExcel(
        dataToExport,
        'Danh_Sach_San_Pham',
        'Sản Phẩm',
      );
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);

      if (err.message !== 'User did not share') {
        Alert.alert(
          'Lỗi xuất file',
          `Không thể tạo file Excel: ${err.message}`,
        );
      }
    }
  };

  const exportCustomers = async () => {
    try {
      const customers = realm.objects('Customer');

      if (customers.length === 0) {
        Alert.alert('Thông báo', 'Chưa có khách hàng nào để xuất!');
        return;
      }

      setIsLoading(true);
      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const dataToExport = customers.map((cus: any, index: number) => {
        let customerType = 'Chưa phân loại';
        if (cus.type === 'quen') customerType = 'Khách quen';
        if (cus.type === 'vang_lai') customerType = 'Khách vãng lai';

        return {
          STT: index + 1,
          'Tên Khách Hàng': cus.name,
          'Số Điện Thoại': cus.phone,
          'Loại Khách': customerType,
          'Địa Chỉ': cus.address || '',
          'Bản Đồ': cus.map || '',
          'Ghi Chú': cus.note || '',
        };
      });

      await generateAndShareExcel(
        dataToExport,
        'KhachHang',
        'Danh Sách Khách Hàng',
      );

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (error.message !== 'User did not share') {
        Alert.alert(
          'Lỗi xuất file',
          `Không thể xuất danh sách: ${error.message}`,
        );
      }
    }
  };

  const importProducts = async (generateUniqueSKU: () => string) => {
    try {
      const result = await pick();
      const pickedFile = result[0];

      if (
        !pickedFile.name?.endsWith('.xlsx') &&
        !pickedFile.name?.endsWith('.xls')
      ) {
        Alert.alert(
          'Lỗi định dạng',
          'Vui lòng chọn file Excel đuôi .xlsx hoặc .xls',
        );
        return;
      }

      setIsLoading(true);

      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const fileBase64 = await RNFS.readFile(pickedFile.uri, 'base64');
      const workbook = XLSX.read(fileBase64, { type: 'base64' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        setIsLoading(false);
        Alert.alert('Thông báo', 'File Excel trống!');
        return;
      }

      let importedCount = 0;
      let updatedCount = 0;

      realm.write(() => {
        data.forEach(row => {
          const cleanRow: any = {};
          Object.keys(row).forEach(key => {
            cleanRow[key.trim()] = row[key];
          });

          const name = String(cleanRow['Tên Sản Phẩm'] || '').trim();
          const price =
            Number(
              String(cleanRow['Giá Bán (VNĐ)'] || 0).replace(/[^0-9]/g, ''),
            ) || 0;
          const stockInFile =
            Number(String(cleanRow['Tồn Kho'] || 0).replace(/[^0-9]/g, '')) ||
            0;

          if (name === '') return;

          let sku = String(cleanRow['Mã SP'] || '').trim();
          if (!sku) {
            sku = generateUniqueSKU();
          }

          const existingBySKU = realm.objectForPrimaryKey('Product', sku);
          const existingByName = realm
            .objects('Product')
            .filtered('name == $0 AND price == $1', name, price)[0] as any;

          const finalProduct = existingBySKU || existingByName;

          if (finalProduct) {
            finalProduct.stock += stockInFile;
            updatedCount++;
          } else {
            realm.create('Product', {
              id: sku,
              name: name,
              price: price,
              stock: stockInFile,
              type: String(cleanRow['Phân Loại'] || 'Chưa phân loại'),
              note: String(cleanRow['Ghi Chú'] || ''),
              createdAt: new Date(),
            });
            importedCount++;
          }
        });
      });

      setIsLoading(false);

      Alert.alert(
        'Hoàn tất nhập dữ liệu',
        `- Thêm mới thành công: ${importedCount} sản phẩm\n- Đã cộng dồn tồn kho: ${updatedCount} sản phẩm`,
      );
    } catch (err: any) {
      setIsLoading(false);

      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
      } else {
        Alert.alert(
          'Lỗi nhập Excel',
          `Không thể đọc file hoặc sai cấu trúc: ${err.message}`,
        );
      }
    }
  };

  const importCustomers = async () => {
    try {
      const result = await pick();
      const pickedFile = result[0];

      if (
        !pickedFile.name?.endsWith('.xlsx') &&
        !pickedFile.name?.endsWith('.xls')
      ) {
        Alert.alert(
          'Lỗi định dạng',
          'Vui lòng chọn file Excel đuôi .xlsx hoặc .xls',
        );
        return;
      }

      setIsLoading(true);
      await new Promise<void>(resolve => setTimeout(resolve, 100));

      const fileBase64 = await RNFS.readFile(pickedFile.uri, 'base64');
      const workbook = XLSX.read(fileBase64, { type: 'base64' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

      if (data.length === 0) {
        setIsLoading(false);
        Alert.alert('Thông báo', 'File Excel trống!');
        return;
      }

      let importedCount = 0;
      let skippedCount = 0;

      realm.write(() => {
        data.forEach(row => {
          const cleanRow: any = {};
          Object.keys(row).forEach(key => {
            cleanRow[key.trim()] = row[key];
          });

          const name = String(cleanRow['Tên Khách Hàng'] || '').trim();

          const rawPhone = String(cleanRow['Số Điện Thoại'] || '').trim();
          const phone = rawPhone.replace(/[^0-9+]/g, '');

          if (name === '') return;

          let isDuplicate = false;
          if (phone !== '') {
            const existingCustomer = realm
              .objects('Customer')
              .filtered('phone == $0', phone)[0];

            if (existingCustomer) {
              isDuplicate = true;
            }
          }

          if (isDuplicate) {
            skippedCount++;
          } else {
            const excelType = String(cleanRow['Loại Khách'] || '').trim();
            let customerType: TypeCustomer = 'vang_lai';
            if (excelType === 'Khách quen') customerType = 'quen';
            else if (excelType === 'Khách vãng lai') customerType = 'vang_lai';
            else if (excelType.toLowerCase().includes('quen'))
              customerType = 'quen';

            const newId = new BSON.ObjectId().toHexString();
            const finalId = String(cleanRow['Mã KH'] || newId).trim();

            realm.create('Customer', {
              id: finalId,
              name: name,
              phone: phone,
              type: customerType,
              address: String(cleanRow['Địa Chỉ'] || '').trim(),
              map: String(cleanRow['Bản Đồ'] || '').trim(),
              note: String(cleanRow['Ghi Chú'] || '').trim(),
              createdAt: new Date(),
            });
            importedCount++;
          }
        });
      });

      setIsLoading(false);
      Alert.alert(
        'Hoàn tất nhập dữ liệu',
        `- Thêm mới thành công: ${importedCount} khách\n- Bỏ qua (trùng SĐT): ${skippedCount} khách`,
      );
    } catch (err: any) {
      setIsLoading(false);
      if (isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED) {
      } else {
        Alert.alert(
          'Lỗi nhập Excel',
          `Không thể đọc file hoặc sai cấu trúc: ${err.message}`,
        );
      }
    }
  };
  return {
    exportOrdersThisMonth,
    exportProducts,
    exportCustomers,
    importProducts,
    importCustomers,
    isLoading,
  };
};
