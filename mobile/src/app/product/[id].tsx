import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useCart } from '@/context/CartContext';

import { supabase } from '@/lib/supabase';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
};

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('PRODUCT DETAILS SCREEN LOADED');
  console.log('PRODUCT ID:', id);

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        setError('No product ID was provided.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.log('PRODUCT LOAD ERROR:', error.message);
        setError(error.message);
      } else {
        console.log('PRODUCT LOADED:', data?.name);
        setProduct(data);
      }

      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.message}>Loading product...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Couldn't load product</Text>
        <Text style={styles.errorText}>{error}</Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Shop</Text>
        </Pressable>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {product.image_url ? (
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text>No image</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.category}>
          {product.category ?? 'Nova & Co'}
        </Text>

        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.price}>
          ₦{Number(product.price).toLocaleString()}
        </Text>

        <Text style={styles.description}>
          {product.description ?? 'No description available.'}
        </Text>

        <Text style={styles.stock}>
          {product.stock > 0
            ? `${product.stock} available`
            : 'Out of stock'}
        </Text>

        <Pressable
          style={[
            styles.button,
            product.stock <= 0 && styles.disabledButton,
          ]}
          disabled={product.stock <= 0}
          onPress={() => {
            addToCart({
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              stock: product.stock,
            });
          }}
        >
        
          <Text style={styles.buttonText}>
            {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backLink}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back to Shop</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f2f2f2',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  category: {
    fontSize: 13,
    color: '#777',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
  },
  stock: {
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#111',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 1,
  },
  backLink: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  backText: {
    fontSize: 15,
  },
  center: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  errorText: {
    color: '#c00',
    textAlign: 'center',
  },
  backButton: {
    marginTop: 24,
    backgroundColor: '#111',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});