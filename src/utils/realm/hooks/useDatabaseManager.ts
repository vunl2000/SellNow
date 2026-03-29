import { Alert } from 'react-native';
import { useRealm } from '@realm/react';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import RNRestart from 'react-native-restart';
import moment from 'moment';

import {
  pick,
  isErrorWithCode,
  errorCodes,
  types,
} from '@react-native-documents/picker';

export const useDatabaseManager = () => {
  const realm = useRealm();

  const backupDatabase = async () => {
    try {
      const dateStr = moment().format('DD_MM_YYYY_HHmm');
      const backupFileName = `SellNow_Backup_${dateStr}.realm`;
      const backupPath = `${RNFS.CachesDirectoryPath}/${backupFileName}`;

      if (await RNFS.exists(backupPath)) {
        await RNFS.unlink(backupPath);
      }

      realm.writeCopyTo({ path: backupPath });

      await Share.open({
        title: 'Lưu file sao lưu dữ liệu',
        url: `file://${backupPath}`,
        filename: backupFileName,
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Lỗi sao lưu', error.message);
      }
    }
  };

  const restoreDatabase = async () => {
    try {
      const result = await pick({
        type: [types.allFiles],
      });

      const pickedFile = result[0];

      if (!pickedFile.name?.endsWith('.realm')) {
        Alert.alert(
          'Lỗi định dạng',
          'Vui lòng chọn đúng file sao lưu có đuôi .realm',
        );
        return;
      }

      Alert.alert(
        'Cảnh báo nguy hiểm',
        'Khôi phục dữ liệu sẽ XÓA TOÀN BỘ dữ liệu hiện tại và thay bằng dữ liệu từ file vừa chọn. Ứng dụng sẽ tự động khởi động lại. Bạn có chắc chắn?',
        [
          { text: 'Hủy', style: 'cancel' },
          {
            text: 'Khôi phục ngay',
            style: 'destructive',
            onPress: async () => {
              try {
                const currentRealmPath = realm.path;
                realm.close();
                await RNFS.copyFile(pickedFile.uri, currentRealmPath);
                RNRestart.restart();
              } catch (copyError: any) {
                Alert.alert('Lỗi ghi file', copyError.message);
              }
            },
          },
        ],
      );
    } catch (err) {
      if (isErrorWithCode(err)) {
        if (err.code === errorCodes.OPERATION_CANCELED) {
        } else {
          Alert.alert(
            'Lỗi đọc file',
            err.message || 'Có lỗi xảy ra khi gọi file.',
          );
        }
      } else {
        Alert.alert('Lỗi', 'Không thể đọc được file đã chọn.');
      }
    }
  };

  return { backupDatabase, restoreDatabase };
};
