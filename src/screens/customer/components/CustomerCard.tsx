import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { CustomerModel } from '../../../model/customer';

const COLOR_PALETTE = [
  { bg: '#DBEAFE', icon: '#2563EB' }, // Blue
  { bg: '#D1FAE5', icon: '#059669' }, // Green
  { bg: '#FEE2E2', icon: '#EF4444' }, // Red
  { bg: '#FEF3C7', icon: '#D97706' }, // Amber
  { bg: '#EDE9FE', icon: '#7C3AED' }, // Purple
  { bg: '#FCE7F3', icon: '#DB2777' }, // Pink
  { bg: '#F3F4F6', icon: '#4B5563' }, // Slate
];

interface CustomerCardProps {
  item: CustomerModel;
  onPress?: (customer: CustomerModel) => void;
  onDelete?: (customer: CustomerModel) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  item,
  onPress,
  onDelete,
}) => {
  const isQuen = item.type === 'quen';
  const hasNote = !!item.note && item.note.trim() !== '';

  const colorStyle = useMemo(() => {
    const str = `${item.id}-${item.name}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += str.charCodeAt(i);
      hash += hash << 10;
      hash ^= hash >> 6;
    }
    const index = Math.abs(hash) % COLOR_PALETTE.length;
    return COLOR_PALETTE[index];
  }, [item.id, item.name]);

  return (
    <Pressable
      onPress={() => onPress && onPress(item)}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      android_ripple={{ color: colorStyle.bg }}
    >
      <View style={[styles.cardContent, { paddingBottom: hasNote ? 0 : 16 }]}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colorStyle.bg }]}
        >
          <Ionicons
            name={isQuen ? 'ribbon' : 'person'}
            size={22}
            color={colorStyle.icon}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <View
              style={[
                styles.tag,
                { backgroundColor: isQuen ? '#DBEAFE' : '#F3F4F6' },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: isQuen ? '#2563EB' : '#6B7280' },
                ]}
              >
                {isQuen ? 'Quen' : 'Vãng lai'}
              </Text>
            </View>
          </View>

          <View style={styles.rowInfo}>
            <Ionicons name="call-outline" size={13} color="#64748B" />
            <Text style={styles.textSecondary}>{item.phone || 'N/A'}</Text>
          </View>

          <View
            style={[styles.rowInfo, { marginTop: 2, alignItems: 'flex-start' }]}
          >
            <Ionicons
              name="location-outline"
              size={13}
              color="#64748B"
              style={{ marginTop: 2 }}
            />
            <Text style={styles.textSecondary} numberOfLines={2}>
              {item.address || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.actionColumn}>
          <View style={styles.topActionsRow}>
            {!!item.map && (
              <TouchableOpacity
                style={[styles.miniBtn, { backgroundColor: '#EFF6FF' }]}
                onPress={() => Linking.openURL(item.map!)}
              >
                <Ionicons name="map" size={16} color="#2563EB" />
              </TouchableOpacity>
            )}
            {!!item.phone && (
              <TouchableOpacity
                style={[
                  styles.miniBtn,
                  { backgroundColor: '#D1FAE5', marginLeft: 6 },
                ]}
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
              >
                <Ionicons name="call" size={16} color="#10B981" />
              </TouchableOpacity>
            )}
          </View>

          {!hasNote && (
            <TouchableOpacity
              style={[styles.miniBtn, styles.deleteBtn, { marginTop: 10 }]}
              onPress={() => onDelete && onDelete(item)}
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {hasNote && (
        <View style={styles.noteFullSection}>
          <View style={styles.noteContent}>
            <Text style={styles.noteText} numberOfLines={2}>
              📝 {item.note}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.miniBtn, styles.deleteBtn]}
            onPress={() => onDelete && onDelete(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardPressed: { backgroundColor: '#F8FAFC' },
  cardContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  name: { fontSize: 16, fontWeight: '700', color: '#1E293B', flexShrink: 1 },
  tag: {
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 5,
  },
  tagText: { fontSize: 8, fontWeight: '800', textTransform: 'uppercase' },
  rowInfo: { flexDirection: 'row', alignItems: 'center' },
  textSecondary: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },

  actionColumn: {
    marginLeft: 10,
    alignItems: 'flex-end',
  },
  topActionsRow: {
    flexDirection: 'row',
  },
  miniBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: { backgroundColor: '#FEF2F2' },
  noteFullSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 10,
  },
  noteContent: { flex: 1, marginRight: 10 },
  noteText: {
    fontSize: 12,
    color: '#1E293B',
    fontStyle: 'italic',
    lineHeight: 17,
  },
});

export default CustomerCard;
