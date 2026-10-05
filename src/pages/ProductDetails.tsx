import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, ShoppingBag, Truck, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

export const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          setProduct(data);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-brand-charcoal/60">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-serif text-brand-deep-emerald">
          Product Not Found
        </h2>

        <Link
          to="/shop"
          className="text-xs uppercase font-semibold text-brand-emerald underline"
        >
          Return to shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    document.title = 'TEST-CLICK-WORKED';

   alert('TEST CLICK WORKED');

   setAdded(true);
  };
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Navigation */}
      <Link
        to="/shop"
        className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-brand-charcoal/70 hover:text-brand-deep-emerald"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Collection
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Product Image Gallery */}
        <div className="bg-white border border-brand-muted-sage/30 p-2">
          <div className="aspect-[4/5] bg-brand-off-white overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Product Info & Action */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-emerald">
              {product.category}
            </span>

            <h1 className="text-3xl font-serif text-brand-deep-emerald font-semibold mt-1">
              {product.name}
            </h1>

            <p className="text-2xl font-semibold text-brand-deep-emerald mt-3">
              ₦{product.price.toLocaleString()}
            </p>
          </div>

          <p className="text-sm text-brand-charcoal/80 leading-relaxed border-t border-b border-brand-muted-sage/30 py-4">
            {product.description}
          </p>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-xs text-brand-charcoal/70">
              <span className="font-semibold text-brand-charcoal">
                Availability:
              </span>

              {product.stock > 0 ? (
                <span className="text-brand-emerald font-semibold">
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-600 font-semibold">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-xs uppercase font-semibold text-brand-charcoal">
                Quantity:
              </label>

              <div className="flex items-center border border-brand-muted-sage">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 bg-brand-off-white text-brand-charcoal hover:bg-brand-muted-sage/20 text-sm font-bold"
                >
                  -
                </button>

                <span className="px-4 py-1 text-xs font-semibold text-brand-charcoal min-w-[2rem] text-center">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  className="px-3 py-1 bg-brand-off-white text-brand-charcoal hover:bg-brand-muted-sage/20 text-sm font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add To Cart CTA */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={false}
              className={`w-full py-3.5 px-6 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center space-x-2 rounded-none border ${
                added
                  ? 'bg-brand-emerald text-white border-brand-emerald'
                  : 'bg-brand-deep-emerald text-white border-brand-deep-emerald hover:bg-brand-emerald'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Bag</span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="pt-4 space-y-2 border-t border-brand-muted-sage/30 text-xs text-brand-charcoal/70">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-brand-emerald" />
              <span>
                Standard Lagos delivery in 1–2 business days. Nationwide in
                3–5 days.
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-brand-emerald" />
              <span>
                Quality guaranteed. Authentic craftsmanship and premium
                fabrics.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};