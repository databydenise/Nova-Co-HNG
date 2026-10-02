import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-brand-light-green text-brand-deep-emerald mx-auto flex items-center justify-center border border-brand-muted-sage/40">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-serif text-brand-deep-emerald font-semibold">Your cart is waiting.</h2>
          <p className="text-xs text-brand-charcoal/70 max-w-sm mx-auto">
            No pieces here yet. Explore the collection and find something you love.
          </p>
        </div>
        <Link
          to="/shop"
          className="inline-block bg-brand-deep-emerald text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 hover:bg-brand-emerald transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-brand-muted-sage/30 pb-4">
        <h1 className="text-3xl font-serif font-semibold text-brand-deep-emerald">Shopping Bag ({totalItems})</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white border border-brand-muted-sage/30 p-4 sm:p-6 space-y-6">
          <div className="hidden sm:grid sm:grid-cols-12 text-xs font-semibold text-brand-charcoal/60 uppercase tracking-wider pb-3 border-b border-brand-off-white">
            <span className="col-span-6">Product</span>
            <span className="col-span-3 text-center">Quantity</span>
            <span className="col-span-3 text-right">Total</span>
          </div>

          <div className="divide-y divide-brand-off-white">
            {cart.map(({ product, quantity }) => (
              <div key={product.id} className="py-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                
                {/* Product Detail */}
                <div className="sm:col-span-6 flex items-center space-x-4">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-20 object-cover bg-brand-off-white border border-brand-muted-sage/30 flex-shrink-0"
                  />
                  <div>
                    <Link to={`/product/${product.id}`} className="font-medium text-sm text-brand-charcoal hover:text-brand-emerald">
                      {product.name}
                    </Link>
                    <p className="text-xs text-brand-charcoal/60">{product.category}</p>
                    <p className="text-xs font-semibold text-brand-deep-emerald mt-1">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="sm:col-span-3 flex items-center justify-between sm:justify-center">
                  <div className="flex items-center border border-brand-muted-sage">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-2 py-0.5 text-xs font-bold hover:bg-brand-off-white"
                    >
                      -
                    </button>
                    <span className="px-3 py-0.5 text-xs font-semibold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-2 py-0.5 text-xs font-bold hover:bg-brand-off-white"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="sm:hidden text-red-600 hover:text-red-800 p-1"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Total & Remove */}
                <div className="sm:col-span-3 flex items-center justify-between sm:justify-end space-x-4">
                  <span className="text-sm font-semibold text-brand-deep-emerald">
                    ₦{(product.price * quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="hidden sm:block text-brand-charcoal/40 hover:text-red-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-white border border-brand-muted-sage/30 p-6 space-y-6">
          <h2 className="text-lg font-serif font-semibold text-brand-deep-emerald border-b border-brand-off-white pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs text-brand-charcoal/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-charcoal">₦{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping (Nigeria)</span>
              <span className="text-brand-emerald font-semibold">Calculated at next step</span>
            </div>
            <div className="border-t border-brand-off-white pt-3 flex justify-between text-sm font-bold text-brand-deep-emerald">
              <span>Total</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-brand-deep-emerald text-white py-3.5 px-4 text-xs font-semibold uppercase tracking-widest hover:bg-brand-emerald transition-all flex items-center justify-center space-x-2 rounded-none"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-brand-charcoal/60 text-center leading-relaxed">
            Taxes included. Delivery dates confirmed upon checkout completion.
          </p>
        </div>

      </div>
    </div>
  );
};
