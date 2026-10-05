import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useCart } from '@/context/CartContext';

export default function CartScreen() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    subtotal,
  } = useCart();

  if (cart.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add something from the shop to get started.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image_url ? (
              <Image
                source={{ uri: item.image_url }}
                style={styles.image}
              />
            ) : (
              <View style={styles.imagePlaceholder} />
            )}

            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>

              <Text style={styles.price}>
                ₦{Number(item.price).toLocaleString()}
              </Text>

              <View style={styles.quantityRow}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() =>
                    updateQuantity(item.id, item.quantity - 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </Pressable>

                <Text style={styles.quantity}>
                  {item.quantity}
                </Text>

                <Pressable
                  style={styles.quantityButton}
                  disabled={item.quantity >= item.stock}
                  onPress={() =>
                    updateQuantity(item.id, item.quantity + 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={() => removeFromCart(item.id)}
              >
                <Text style={styles.remove}>Remove</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </Text>

        <Text style={styles.total}>
          ₦{subtotal.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 30,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
  },
  details: {
    flex: 1,
    marginLeft: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 15,
    marginTop: 6,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 20,
  },
  quantity: {
    width: 36,
    textAlign: 'center',
    fontSize: 15,
  },
  remove: {
    marginTop: 10,
    color: '#777',
    textDecorationLine: 'underline',
  },
  summary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryText: {
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  emptyText: {
    marginTop: 10,
    color: '#666',
    textAlign: 'center',
  },
});