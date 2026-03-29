import Ionicons from '@react-native-vector-icons/ionicons';
import { memo, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ProductModel } from '../../../model/product';

const COLOR_PALETTE = [
  { bg: '#DBEAFE', icon: '#2563EB' }, // Blue
  { bg: '#D1FAE5', icon: '#059669' }, // Green
  { bg: '#FEE2E2', icon: '#EF4444' }, // Red
  { bg: '#FEF3C7', icon: '#D97706' }, // Amber
  { bg: '#EDE9FE', icon: '#7C3AED' }, // Purple
  { bg: '#FCE7F3', icon: '#DB2777' }, // Pink
  { bg: '#F3F4F6', icon: '#4B5563' }, // Slate
];

interface ProductCardProps {
  item: ProductModel;
  onPress: (product: ProductModel) => void;
  onOptionsPress: (product: ProductModel) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ item, onPress, onOptionsPress }) => {
    const formatPrice = (num: number) => num.toLocaleString('vi-VN') + ' đ';

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

    const formatStock = (kg: number) => {
      if (kg === 0) return '0 kg';
      if (kg >= 1000) {
        const tan = kg / 1000;
        const isQuaLe = kg % 100 !== 0;
        const value = isQuaLe ? Math.ceil(tan * 100) / 100 : tan;
        const formatted = value.toLocaleString('vi-VN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: isQuaLe ? 2 : 1,
        });
        return `${isQuaLe ? '≈ ' : ''}${formatted} tấn`;
      }
      if (kg >= 100) {
        const ta = kg / 100;
        const isQuaLe = kg % 10 !== 0;
        const value = isQuaLe ? Math.ceil(ta * 100) / 100 : ta;
        const formatted = value.toLocaleString('vi-VN', {
          maximumFractionDigits: 2,
          minimumFractionDigits: isQuaLe ? 2 : 1,
        });
        return `${isQuaLe ? '≈ ' : ''}${formatted} tạ`;
      }
      return `${kg.toLocaleString('vi-VN', { maximumFractionDigits: 2 })} kg`;
    };

    return (
      <Pressable
        onPress={() => onPress(item)}
        style={({ pressed }) => [
          cardStyles.card,
          pressed && cardStyles.cardPressed,
        ]}
        android_ripple={{ color: '#F1F5F9' }}
      >
        <View
          style={[cardStyles.iconContainer, { backgroundColor: colorStyle.bg }]}
        >
          <Ionicons name="flame" size={28} color={colorStyle.icon} />
        </View>

        <View style={cardStyles.infoContainer}>
          <View style={cardStyles.nameRow}>
            <Text style={cardStyles.name} numberOfLines={1}>
              {item.name}
            </Text>
            {item.type && (
              <View style={cardStyles.typeTag}>
                <Text style={cardStyles.typeText}>{item.type}</Text>
              </View>
            )}
          </View>

          <Text style={cardStyles.sku}>Mã: {item.id}</Text>

          <View style={cardStyles.priceStockRow}>
            <Text style={cardStyles.price}>{formatPrice(item.price)}</Text>
            <View style={cardStyles.dot} />
            <Text style={cardStyles.stock}>Kho: {formatStock(item.stock)}</Text>
          </View>
        </View>

        <Pressable
          hitSlop={12}
          style={({ pressed }) => [
            cardStyles.optionButton,
            pressed && { opacity: 0.5 },
          ]}
          onPress={() => onOptionsPress(item)}
        >
          <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
        </Pressable>
      </Pressable>
    );
  },
);

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    overflow: 'hidden',
  },
  cardPressed: {
    backgroundColor: '#F8FAFC',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flexShrink: 1,
  },
  typeTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  typeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  sku: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  priceStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 8,
  },
  stock: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  optionButton: {
    padding: 10,
    marginRight: -4,
  },
});

export default ProductCard;
