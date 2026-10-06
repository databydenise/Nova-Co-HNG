import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '../lib/supabase';

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: CartProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  async function loadCart(currentUserId: string) {
    console.log('🛒 LOAD CART:', currentUserId);

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        product:products (
          id,
          name,
          price,
          image_url,
          stock
        )
      `)
      .eq('user_id', currentUserId);

    if (error) {
      console.error('❌ FAILED TO LOAD CART:', error);
      return;
    }

    const loadedCart: CartItem[] = (data ?? [])
      .filter((item) => item.product)
      .map((item) => {
        const product = item.product as unknown as CartProduct;

        return {
          ...product,
          quantity: Math.min(item.quantity, product.stock),
        };
      });

    setCart(loadedCart);
  }

  useEffect(() => {
    let mounted = true;

    async function initializeCart() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const currentUserId = session?.user?.id ?? null;

      console.log('👤 INITIAL USER:', currentUserId);

      setUserId(currentUserId);

      if (currentUserId) {
        await loadCart(currentUserId);
      } else {
        setCart([]);
      }
    }

    initializeCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUserId = session?.user?.id ?? null;

      console.log('🔐 AUTH STATE:', currentUserId);

      setUserId(currentUserId);

      if (currentUserId) {
        await loadCart(currentUserId);
      } else {
        setCart([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function addToCart(product: CartProduct, quantity = 1) {
    console.log('🛒 ADD TO CART CALLED:', {
      productId: product.id,
      productName: product.name,
      quantity,
      userId,
    });

    if (!userId) {
      console.log('⚠️ NO USER ID — USING LOCAL CART');

      setCart((currentCart) => {
        const existingItem = currentCart.find(
          (item) => item.id === product.id
        );

        if (existingItem) {
          return currentCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + quantity,
                    item.stock
                  ),
                }
              : item
          );
        }

        return [
          ...currentCart,
          {
            ...product,
            quantity: Math.min(quantity, product.stock),
          },
        ];
      });

      return;
    }

    console.log('👤 USER ID FOUND — SAVING TO SUPABASE:', userId);

    const existingItem = cart.find(
      (item) => item.id === product.id
    );

    const newQuantity = existingItem
      ? Math.min(
          existingItem.quantity + quantity,
          product.stock
        )
      : Math.min(quantity, product.stock);

    console.log('📦 UPSERTING:', {
      userId,
      productId: product.id,
      newQuantity,
    });

    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: userId,
          product_id: product.id,
          quantity: newQuantity,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,product_id',
        }
      )
      .select();

    console.log('🛒 CART UPSERT RESULT:', {
      data,
      error,
    });

    if (error) {
      console.error('❌ CART UPSERT FAILED:', error);
      alert(`Cart save failed: ${error.message}`);
      return;
    }

    console.log('✅ CART SAVED:', data);

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: newQuantity,
        },
      ];
    });
  }

  async function removeFromCart(productId: string) {
    if (!userId) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId)
      );
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('❌ FAILED TO REMOVE CART ITEM:', error);
      return;
    }

    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

  async function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const item = cart.find(
      (cartItem) => cartItem.id === productId
    );

    if (!item) return;

    const safeQuantity = Math.min(quantity, item.stock);

    if (!userId) {
      setCart((currentCart) =>
        currentCart.map((cartItem) =>
          cartItem.id === productId
            ? {
                ...cartItem,
                quantity: safeQuantity,
              }
            : cartItem
        )
      );
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({
        quantity: safeQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      console.error('❌ FAILED TO UPDATE CART:', error);
      return;
    }

    setCart((currentCart) =>
      currentCart.map((cartItem) =>
        cartItem.id === productId
          ? {
              ...cartItem,
              quantity: safeQuantity,
            }
          : cartItem
      )
    );
  }

  async function clearCart() {
    if (!userId) {
      setCart([]);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('❌ FAILED TO CLEAR CART:', error);
      return;
    }

    setCart([]);
  }

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + Number(item.price) * item.quantity,
        0
      ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}

