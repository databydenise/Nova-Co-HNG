import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-white border border-brand-muted-sage/30 hover:border-brand-emerald/50 transition-all rounded-none overflow-hidden h-full">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-brand-off-white overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-brand-off-white/90 backdrop-blur-sm text-brand-charcoal text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 border border-brand-muted-sage/30">
          {product.category}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow justify-between bg-white">
        <div>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-brand-charcoal text-base hover:text-brand-emerald transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm font-semibold text-brand-deep-emerald mt-1">
            ₦{product.price.toLocaleString()}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-brand-off-white">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 px-3 text-xs tracking-wider uppercase font-semibold transition-all rounded-none border ${
              added
                ? 'bg-brand-emerald text-white border-brand-emerald'
                : 'bg-brand-off-white text-brand-deep-emerald border-brand-deep-emerald/30 hover:bg-brand-deep-emerald hover:text-white hover:border-brand-deep-emerald'
            }`}
          >
            {added ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
