import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');

        if (selectedCategory !== 'All') {
          query = query.eq('category', selectedCategory);
        }

        if (searchQuery) {
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        if (sortBy === 'price-low') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'price-high') {
          query = query.order('price', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (!error && data) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error loading shop products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const categories = ['All', 'Clothing', 'Bags', 'Accessories', 'Lifestyle'];

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-brand-muted-sage/30 pb-6">
        <h1 className="text-3xl font-serif font-semibold text-brand-deep-emerald">Shop Collection</h1>
        <p className="text-sm text-brand-charcoal/70 mt-1">
          Explore our range of curated everyday clothing, artisanal leather bags, and lifestyle items.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 border border-brand-muted-sage/30 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
        
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`px-3 py-1.5 text-xs uppercase font-semibold tracking-wider transition-colors rounded-none border ${
                selectedCategory === cat
                  ? 'bg-brand-deep-emerald text-white border-brand-deep-emerald'
                  : 'bg-brand-off-white text-brand-charcoal border-brand-muted-sage/40 hover:border-brand-deep-emerald'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Search Box */}
          <div className="relative flex-grow md:w-52">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="w-full bg-brand-off-white border border-brand-muted-sage/50 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-brand-deep-emerald"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-brand-charcoal/50" />
            {searchQuery && (
              <button
                onClick={() => updateFilter('search', '')}
                className="absolute right-2 top-2 text-brand-charcoal/50 hover:text-brand-charcoal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-charcoal/60" />
            <select
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="bg-brand-off-white border border-brand-muted-sage/50 px-2 py-1.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-deep-emerald cursor-pointer"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

        </div>
      </div>

      {/* Active Filters Summary */}
      {(selectedCategory !== 'All' || searchQuery) && (
        <div className="flex items-center space-x-3 text-xs text-brand-charcoal/70">
          <span>Active Filters:</span>
          {selectedCategory !== 'All' && (
            <span className="bg-brand-light-green text-brand-deep-emerald px-2 py-0.5 border border-brand-muted-sage/40 font-medium">
              Category: {selectedCategory}
            </span>
          )}
          {searchQuery && (
            <span className="bg-brand-light-green text-brand-deep-emerald px-2 py-0.5 border border-brand-muted-sage/40 font-medium">
              Search: "{searchQuery}"
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-brand-deep-emerald font-semibold underline hover:text-brand-emerald ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Product Grid / Loading / Empty States */}
      {loading ? (
        <div className="py-20 text-center text-sm text-brand-charcoal/60">
          Loading collection...
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 px-4 border border-dashed border-brand-muted-sage text-center space-y-4 bg-white">
          <h3 className="text-lg font-serif font-semibold text-brand-deep-emerald">No pieces match your search.</h3>
          <p className="text-xs text-brand-charcoal/70 max-w-md mx-auto">
            We couldn't find any products matching your current filters. Try searching for something else or clearing filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="bg-brand-deep-emerald text-white px-5 py-2 text-xs uppercase tracking-wider font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
};
