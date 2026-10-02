import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Mail } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('order') || 'NC-CONFIRMED';

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-16 text-center space-y-8">
      <div className="max-w-md mx-auto bg-white border border-brand-muted-sage/40 p-8 space-y-6">
        <div className="w-16 h-16 bg-brand-light-green text-brand-emerald mx-auto flex items-center justify-center border border-brand-muted-sage/40">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold tracking-widest text-brand-emerald uppercase">
            Order Confirmed
          </span>
          <h1 className="text-2xl font-serif font-semibold text-brand-deep-emerald">
            Thank you for your order!
          </h1>
          <p className="text-xs font-semibold text-brand-charcoal/80">
            Order Reference: <span className="text-brand-deep-emerald font-mono">{orderNumber}</span>
          </p>
        </div>

        <div className="p-4 bg-brand-off-white border border-brand-muted-sage/30 text-xs text-brand-charcoal/70 space-y-2 text-left">
          <div className="flex items-center space-x-2 font-semibold text-brand-deep-emerald">
            <Mail className="w-4 h-4" />
            <span>Confirmation email dispatched</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            We have sent an order summary receipt to your registered email address with fulfillment details.
          </p>
        </div>

        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-brand-deep-emerald text-white px-6 py-3 text-xs uppercase tracking-wider font-semibold hover:bg-brand-emerald transition-colors"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>
    </div>
  );
};
