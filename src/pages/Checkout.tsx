import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export const Checkout: React.FC = () => {
  const { user, profile, signInWithGoogle } = useAuth();
  const { cart, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!user) return;
    setPlacingOrder(true);
    setErrorMessage(null);

    try {
      // 1. Fetch fresh product details to ensure prices are valid
      const productIds = cart.map((i) => i.product.id);
      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('id, price, name')
        .in('id', productIds);

      if (prodErr || !dbProducts) {
        throw new Error('Could not verify product catalog pricing. Please try again.');
      }

      // 2. Calculate verified total
      let calculatedTotal = 0;
      const verifiedItems = cart.map((cartItem) => {
        const fresh = dbProducts.find((p) => p.id === cartItem.product.id);
        const unitPrice = fresh ? fresh.price : cartItem.product.price;
        calculatedTotal += unitPrice * cartItem.quantity;
        return {
          product_id: cartItem.product.id,
          quantity: cartItem.quantity,
          unit_price: unitPrice,
          name: cartItem.product.name,
        };
      });

      // 3. Generate Order Number
      const orderNumber = `NC-${Math.floor(100000 + Math.random() * 900000)}`;

      // 4. Create Order record
      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_number: orderNumber,
            total_amount: calculatedTotal,
            status: 'Confirmed',
          },
        ])
        .select()
        .single();

      if (orderErr || !orderData) {
        throw new Error('Failed to record order. Please try again.');
      }

      // 5. Create Order Items
      const orderItemsToInsert = verifiedItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsErr) {
        console.error('Error recording order items:', itemsErr);
      }

      // 6. Trigger Order Confirmation Email via Edge Function
      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'order_confirmation',
            email: user.email,
            name: profile?.full_name || user.email?.split('@')[0] || 'Customer',
            orderNumber: orderNumber,
            totalAmount: calculatedTotal,
            items: verifiedItems.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              unitPrice: i.unit_price,
            })),
          },
        });
      } catch (emailErr) {
        console.error('Non-blocking: Confirmation email dispatch failed', emailErr);
      }

      // 7. Clear cart & redirect to confirmation
      clearCart();
      navigate(`/order-success?order=${orderNumber}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-brand-muted-sage/30 pb-4">
        <h1 className="text-3xl font-serif font-semibold text-brand-deep-emerald">Checkout</h1>
      </div>

      {!user ? (
        /* Auth Gate for Unauthenticated Users */
        <div className="max-w-md mx-auto bg-white border border-brand-muted-sage/40 p-8 text-center space-y-6">
          <div className="w-12 h-12 bg-brand-light-green text-brand-deep-emerald mx-auto flex items-center justify-center border border-brand-muted-sage/30">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-semibold text-brand-deep-emerald">Sign in to complete order</h2>
            <p className="text-xs text-brand-charcoal/70">
              Please sign in with your Google account to associate your order and receive delivery tracking notifications.
            </p>
          </div>
          <button
            onClick={() => signInWithGoogle()}
            className="w-full bg-brand-deep-emerald text-white py-3 px-4 text-xs font-semibold uppercase tracking-wider hover:bg-brand-emerald transition-colors"
          >
            Continue with Google
          </button>
        </div>
      ) : (
        /* Authenticated Checkout Review */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Customer & Shipping Summary */}
          <div className="lg:col-span-7 bg-white border border-brand-muted-sage/30 p-6 space-y-6">
            <div className="border-b border-brand-off-white pb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-emerald mb-1">Customer Details</h2>
              <p className="text-sm font-semibold text-brand-charcoal">
                {profile?.full_name || 'Valued Customer'}
              </p>
              <p className="text-xs text-brand-charcoal/70">{user.email}</p>
            </div>

            <div className="border-b border-brand-off-white pb-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-emerald mb-1">Fulfillment</h2>
              <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                Standard Doorstep Delivery across Lagos & Major Nigerian Cities.
              </p>
              <div className="bg-brand-light-green p-3 border border-brand-muted-sage/30 text-[11px] text-brand-deep-emerald font-medium">
                Note: This is a demonstration internship storefront. No real money will be charged.
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-brand-deep-emerald text-white py-4 px-6 text-xs font-semibold uppercase tracking-widest hover:bg-brand-emerald transition-all flex items-center justify-center space-x-2 rounded-none disabled:opacity-50"
            >
              <span>{placingOrder ? 'Placing Order...' : 'Place Order'}</span>
              {!placingOrder && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Items Summary Side panel */}
          <div className="lg:col-span-5 bg-white border border-brand-muted-sage/30 p-6 space-y-4">
            <h2 className="text-lg font-serif font-semibold text-brand-deep-emerald border-b border-brand-off-white pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-brand-off-white max-h-80 overflow-y-auto">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-14 object-cover border border-brand-muted-sage/30"
                    />
                    <div>
                      <p className="font-semibold text-brand-charcoal">{product.name}</p>
                      <p className="text-brand-charcoal/60">Qty: {quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-brand-deep-emerald">
                    ₦{(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-off-white pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Subtotal</span>
                <span className="font-semibold">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Shipping</span>
                <span className="text-brand-emerald font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-deep-emerald border-t border-brand-off-white pt-2">
                <span>Total Amount</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-brand-charcoal/60">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />
              <span>Encrypted Order Processing</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
