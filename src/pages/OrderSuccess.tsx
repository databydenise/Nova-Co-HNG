import React from 'react';
import { Link } from 'react-router-dom';

export const OrderSuccess: React.FC = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white border border-brand-muted-sage/40 p-8 text-center">

        <div className="w-16 h-16 bg-brand-light-green text-brand-deep-emerald mx-auto flex items-center justify-center mb-6">
          ✓
        </div>

        <p className="text-xs font-bold tracking-widest text-brand-emerald uppercase mb-3">
          Order Confirmed
        </p>

        <h1 className="text-2xl font-serif font-semibold text-brand-deep-emerald mb-4">
          Thank you for your order!
        </h1>

        <p className="text-sm text-brand-charcoal/70 mb-8">
          Your order has been successfully placed. A confirmation email has been sent to the email address you provided.
        </p>

        <Link
          to="/shop"
          className="inline-block bg-brand-deep-emerald text-white px-6 py-3 text-xs uppercase tracking-wider font-semibold"
        >
          Continue Shopping
        </Link>

      </div>
    </div>
  );
};

export default OrderSuccess;
