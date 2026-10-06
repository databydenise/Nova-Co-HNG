import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  UserRound,
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export const Checkout: React.FC = () => {
  const {
    user,
    profile,
    signInWithGoogle,
    continueAsGuest,
  } = useAuth();

  const { cart, subtotal, clearCart } = useCart();

  const navigate = useNavigate();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Guest customer information
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  // Anonymous users should still see the guest checkout form.
  const isAnonymous = user?.is_anonymous === true;
  const needsGuestDetails = !user || isAnonymous;

  const handlePlaceOrder = async () => {
    setPlacingOrder(true);
    setErrorMessage(null);

    try {
      /*
       * ------------------------------------------------------------
       * 1. Determine the customer
       * ------------------------------------------------------------
       */

      let checkoutUser = user;
      let orderEmail = user?.email || '';
      let orderName =
        profile?.full_name || user?.user_metadata?.full_name || '';

      // Guest checkout
      if (needsGuestDetails) {
        const trimmedName = customerName.trim();
        const trimmedEmail = customerEmail.trim();

        if (!trimmedName) {
          throw new Error('Please enter your full name.');
        }

        if (!trimmedEmail) {
          throw new Error('Please enter your email address.');
        }

        // Basic email validation
        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          trimmedEmail
        );

        if (!emailIsValid) {
          throw new Error('Please enter a valid email address.');
        }

        // If there is already an anonymous user, use it.
        // Otherwise create a new anonymous session.
        if (!checkoutUser || !checkoutUser.is_anonymous) {
          checkoutUser = await continueAsGuest();
        }

        orderEmail = trimmedEmail;
        orderName = trimmedName;

        /*
         * The orders table requires user_id to reference profiles.id.
         * Therefore, create the guest's profile before creating the order.
         */

        const {
          data: existingGuestProfile,
          error: guestProfileFetchError,
        } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', checkoutUser.id)
          .maybeSingle();

        if (guestProfileFetchError) {
          throw new Error(
            'Could not prepare guest checkout. Please try again.'
          );
        }

        if (!existingGuestProfile) {
          const { error: guestProfileInsertError } = await supabase
            .from('profiles')
            .insert([
              {
                id: checkoutUser.id,
                email: trimmedEmail,
                full_name: trimmedName,
                avatar_url: null,
                // Guests do not receive a welcome email.
                welcome_email_sent: true,
              },
            ]);

          if (guestProfileInsertError) {
            console.error(
              'Guest profile creation error:',
              guestProfileInsertError
            );

            throw new Error(
              'Could not create your checkout profile. Please try again.'
            );
          }
        }
      }

      /*
       * ------------------------------------------------------------
       * 2. Make sure we have a user
       * ------------------------------------------------------------
       */

      if (!checkoutUser) {
        throw new Error(
          'Could not start checkout. Please try again.'
        );
      }

      /*
       * ------------------------------------------------------------
       * 3. Fetch fresh product details
       * ------------------------------------------------------------
       */

      // CartItem is already the product itself plus quantity.
      const productIds = cart.map((item) => item.id);

      const { data: dbProducts, error: prodErr } = await supabase
        .from('products')
        .select('id, price, name')
        .in('id', productIds);

      if (prodErr || !dbProducts) {
        throw new Error(
          'Could not verify product catalog pricing. Please try again.'
        );
      }

      /*
       * ------------------------------------------------------------
       * 4. Calculate verified total
       * ------------------------------------------------------------
       */

      let calculatedTotal = 0;

      const verifiedItems = cart.map((cartItem) => {
        const fresh = dbProducts.find(
          (p) => p.id === cartItem.id
        );

        const unitPrice = fresh
          ? fresh.price
          : cartItem.price;

        calculatedTotal += unitPrice * cartItem.quantity;

        return {
          product_id: cartItem.id,
          quantity: cartItem.quantity,
          unit_price: unitPrice,
          name: fresh?.name || cartItem.name,
        };
      });

      /*
       * ------------------------------------------------------------
       * 5. Generate order number
       * ------------------------------------------------------------
       */

      const orderNumber = `NC-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      /*
       * ------------------------------------------------------------
       * 6. Create order
       * ------------------------------------------------------------
       */

      const { data: orderData, error: orderErr } =
        await supabase
          .from('orders')
          .insert([
            {
              user_id: checkoutUser.id,
              order_number: orderNumber,
              total_amount: calculatedTotal,
              status: 'Confirmed',
            },
          ])
          .select()
          .single();

      if (orderErr || !orderData) {
        console.error('Order creation error:', orderErr);

        throw new Error(
          'Failed to record order. Please try again.'
        );
      }

      /*
       * ------------------------------------------------------------
       * 7. Create order items
       * ------------------------------------------------------------
       */

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
        console.error(
          'Error recording order items:',
          itemsErr
        );

        throw new Error(
          'Your order could not be completed. Please try again.'
        );
      }

      /*
       * ------------------------------------------------------------
       * 8. Send order confirmation email
       * ------------------------------------------------------------
       */

      try {
        await supabase.functions.invoke('send-email', {
          body: {
            type: 'order_confirmation',
            email: orderEmail,
            name: orderName || 'Customer',
            orderNumber: orderNumber,
            totalAmount: calculatedTotal,
            items: verifiedItems.map((item) => ({
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unit_price,
            })),
          },
        });
      } catch (emailErr) {
        // Email failure should not undo a successfully created order.
        console.error(
          'Non-blocking: Confirmation email dispatch failed',
          emailErr
        );
      }

      /*
       * ------------------------------------------------------------
       * 9. Clear cart and show success page
       * ------------------------------------------------------------
       */

      await clearCart();

      navigate(`/order-success?order=${orderNumber}`);
    } catch (err: any) {
      console.error('Checkout error:', err);

      setErrorMessage(
        err.message ||
          'An unexpected error occurred during checkout.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="border-b border-brand-muted-sage/30 pb-4">
        <h1 className="text-3xl font-serif font-semibold text-brand-deep-emerald">
          Checkout
        </h1>
      </div>

      {/* ============================================================
          GUEST / UNAUTHENTICATED CHECKOUT
          ============================================================ */}

      {needsGuestDetails ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Guest Details */}
          <div className="lg:col-span-7 bg-white border border-brand-muted-sage/30 p-6 space-y-6">
            <div className="flex items-center space-x-3 border-b border-brand-off-white pb-4">
              <div className="w-10 h-10 bg-brand-light-green text-brand-deep-emerald flex items-center justify-center border border-brand-muted-sage/30">
                <UserRound className="w-5 h-5" />
              </div>

              <div>
                <h2 className="text-lg font-serif font-semibold text-brand-deep-emerald">
                  Customer Details
                </h2>

                <p className="text-xs text-brand-charcoal/60">
                  Enter your details to complete your order.
                </p>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label
                htmlFor="customer-name"
                className="text-xs font-bold uppercase tracking-widest text-brand-emerald"
              >
                Full Name
              </label>

              <input
                id="customer-name"
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(e.target.value)
                }
                placeholder="Enter your full name"
                className="w-full border border-brand-muted-sage/40 px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-emerald"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="customer-email"
                className="text-xs font-bold uppercase tracking-widest text-brand-emerald"
              >
                Email Address
              </label>

              <input
                id="customer-email"
                type="email"
                value={customerEmail}
                onChange={(e) =>
                  setCustomerEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="w-full border border-brand-muted-sage/40 px-4 py-3 text-sm text-brand-charcoal outline-none focus:border-brand-emerald"
              />

              <p className="text-[11px] text-brand-charcoal/60">
                Your order confirmation will be sent to this email.
              </p>
            </div>

            {/* Demo notice */}
            <div className="bg-brand-light-green p-3 border border-brand-muted-sage/30 text-[11px] text-brand-deep-emerald font-medium">
              Note: This is a demonstration internship storefront.
              No real money will be charged.
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMessage}
              </div>
            )}

            {/* Guest Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-brand-deep-emerald text-white py-4 px-6 text-xs font-semibold uppercase tracking-widest hover:bg-brand-emerald transition-all flex items-center justify-center space-x-2 rounded-none disabled:opacity-50"
            >
              <span>
                {placingOrder
                  ? 'Placing Order...'
                  : 'Continue as Guest'}
              </span>

              {!placingOrder && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>

            {/* Google Option */}
            <div className="flex items-center gap-3">
              <div className="h-px bg-brand-muted-sage/30 flex-1" />

              <span className="text-[10px] uppercase tracking-widest text-brand-charcoal/50">
                Or
              </span>

              <div className="h-px bg-brand-muted-sage/30 flex-1" />
            </div>

            <button
              onClick={() => signInWithGoogle()}
              className="w-full border border-brand-deep-emerald text-brand-deep-emerald py-3 px-4 text-xs font-semibold uppercase tracking-wider hover:bg-brand-light-green transition-colors flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Guest Order Summary */}
          <div className="lg:col-span-5 bg-white border border-brand-muted-sage/30 p-6 space-y-4">
            <h2 className="text-lg font-serif font-semibold text-brand-deep-emerald border-b border-brand-off-white pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-brand-off-white max-h-80 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image_url || ''}
                      alt={item.name}
                      className="w-12 h-14 object-cover border border-brand-muted-sage/30"
                    />

                    <div>
                      <p className="font-semibold text-brand-charcoal">
                        {item.name}
                      </p>

                      <p className="text-brand-charcoal/60">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-brand-deep-emerald">
                    ₦
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-off-white pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Subtotal</span>

                <span className="font-semibold">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-brand-charcoal/80">
                <span>Shipping</span>

                <span className="text-brand-emerald font-semibold">
                  FREE
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-brand-deep-emerald border-t border-brand-off-white pt-2">
                <span>Total Amount</span>

                <span>
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-2 text-[11px] text-brand-charcoal/60">
              <ShieldCheck className="w-4 h-4 text-brand-emerald" />

              <span>Encrypted Order Processing</span>
            </div>
          </div>
        </div>
      ) : (
        /*
         * ============================================================
         * GOOGLE AUTHENTICATED CHECKOUT
         * ============================================================
         */

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Customer Details */}
          <div className="lg:col-span-7 bg-white border border-brand-muted-sage/30 p-6 space-y-6">
            <div className="border-b border-brand-off-white pb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-emerald mb-1">
                Customer Details
              </h2>

              <p className="text-sm font-semibold text-brand-charcoal">
                {profile?.full_name || 'Valued Customer'}
              </p>

              <p className="text-xs text-brand-charcoal/70">
                {user?.email}
              </p>
            </div>

            <div className="border-b border-brand-off-white pb-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-emerald mb-1">
                Fulfillment
              </h2>

              <p className="text-xs text-brand-charcoal/80 leading-relaxed">
                Standard Doorstep Delivery across Lagos & Major
                Nigerian Cities.
              </p>

              <div className="bg-brand-light-green p-3 border border-brand-muted-sage/30 text-[11px] text-brand-deep-emerald font-medium">
                Note: This is a demonstration internship storefront.
                No real money will be charged.
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
              <span>
                {placingOrder
                  ? 'Placing Order...'
                  : 'Place Order'}
              </span>

              {!placingOrder && (
                <ArrowRight className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 bg-white border border-brand-muted-sage/30 p-6 space-y-4">
            <h2 className="text-lg font-serif font-semibold text-brand-deep-emerald border-b border-brand-off-white pb-3">
              Order Items ({cart.length})
            </h2>

            <div className="divide-y divide-brand-off-white max-h-80 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="py-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.image_url || ''}
                      alt={item.name}
                      className="w-12 h-14 object-cover border border-brand-muted-sage/30"
                    />

                    <div>
                      <p className="font-semibold text-brand-charcoal">
                        {item.name}
                      </p>

                      <p className="text-brand-charcoal/60">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <span className="font-semibold text-brand-deep-emerald">
                    ₦
                    {(
                      item.price * item.quantity
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-off-white pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-brand-charcoal/80">
                <span>Subtotal</span>

                <span className="font-semibold">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-brand-charcoal/80">
                <span>Shipping</span>

                <span className="text-brand-emerald font-semibold">
                  FREE
                </span>
              </div>

              <div className="flex justify-between text-sm font-bold text-brand-deep-emerald border-t border-brand-off-white pt-2">
                <span>Total Amount</span>

                <span>
                  ₦{subtotal.toLocaleString()}
                </span>
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