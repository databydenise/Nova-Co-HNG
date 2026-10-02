import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4);
        if (!error && data) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      
      {/* Editorial Hero Section */}
      <section className="relative bg-brand-light-green/40 border-b border-brand-muted-sage/30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold tracking-widest text-brand-emerald uppercase bg-white border border-brand-muted-sage/40 px-3 py-1 inline-block">
              NOVA & CO. / EVERYDAY COLLECTION
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-deep-emerald leading-[1.15] font-semibold">
              Thoughtfully chosen.<br />Made for everyday life.
            </h1>
            <p className="text-base sm:text-lg text-brand-charcoal/80 max-w-xl leading-relaxed">
              NOVA & CO. curates timeless clothing, structured leather craft, minimalist accessories, and living pieces for modern individuals across Nigeria.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-brand-deep-emerald text-white px-7 py-3.5 text-sm font-semibold tracking-wider uppercase hover:bg-brand-emerald transition-all rounded-none inline-flex items-center space-x-2"
              >
                <span>Shop the collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="border border-brand-deep-emerald text-brand-deep-emerald px-7 py-3.5 text-sm font-semibold tracking-wider uppercase hover:bg-brand-deep-emerald hover:text-white transition-all rounded-none"
              >
                Our story
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative border-2 border-brand-deep-emerald/20 p-2 bg-white shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000"
                alt="NOVA & CO. Editorial Collection"
                className="w-full h-[420px] object-cover object-center"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-muted-sage/40">
          <div>
            <h2 className="text-xs uppercase tracking-widest text-brand-emerald font-bold mb-1">Curated Selection</h2>
            <h3 className="text-2xl sm:text-3xl font-serif text-brand-deep-emerald font-semibold">Featured Essentials</h3>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-brand-deep-emerald hover:text-brand-emerald flex items-center mt-2 md:mt-0">
            View All Pieces <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-brand-charcoal/60">Loading collection...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Shop by Category Blocks */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xs uppercase tracking-widest text-brand-emerald font-bold mb-1">Explore Collections</h2>
          <h3 className="text-2xl sm:text-3xl font-serif text-brand-deep-emerald font-semibold">Shop by Category</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Clothing', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600' },
            { name: 'Bags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=600' },
            { name: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=600' },
            { name: 'Lifestyle', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600' },
          ].map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="group relative h-64 overflow-hidden border border-brand-muted-sage/30 bg-brand-off-white block"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep-emerald/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <h4 className="text-xl font-serif text-white font-medium">{cat.name}</h4>
                  <span className="text-xs uppercase tracking-wider text-brand-muted-sage font-semibold group-hover:text-white transition-colors">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Brand Value Pillars */}
      <section className="bg-white border-y border-brand-muted-sage/30 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-brand-light-green text-brand-deep-emerald border border-brand-muted-sage/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-deep-emerald text-base mb-1">Thoughtful Design</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                Selected for durability, comfort, and timeless simplicity in everyday routines.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-brand-light-green text-brand-deep-emerald border border-brand-muted-sage/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-deep-emerald text-base mb-1">Authentic Nigerian Craft</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                Partnering with skilled local leather artisans and boutique producers.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-brand-light-green text-brand-deep-emerald border border-brand-muted-sage/30">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-brand-deep-emerald text-base mb-1">Dependable Delivery</h4>
              <p className="text-xs text-brand-charcoal/70 leading-relaxed">
                Fast doorstep fulfillment in Lagos and reliable interstate delivery nationwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Narrative CTA Banner */}
      <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-deep-emerald text-white p-8 md:p-14 text-center space-y-4">
          <h3 className="text-2xl md:text-4xl font-serif font-semibold">
            Find something you'll keep reaching for.
          </h3>
          <p className="text-sm md:text-base text-brand-muted-sage max-w-2xl mx-auto leading-relaxed">
            Every piece in our catalog is chosen to fit effortlessly into your work, travel, and home lifestyle.
          </p>
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-block bg-white text-brand-deep-emerald font-semibold text-xs uppercase tracking-widest px-8 py-3.5 hover:bg-brand-light-green transition-colors"
            >
              Shop all products
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
