import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-deep-emerald text-white border-t border-brand-emerald/20 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4 md:col-span-1">
            <span className="text-2xl font-serif font-semibold tracking-tight block">NOVA & CO.</span>
            <p className="text-sm text-brand-muted-sage leading-relaxed">
              Thoughtfully chosen. Made for everyday life. Curating modern wardrobe essentials and living goods in Lagos, Nigeria.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-muted-sage mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:underline">All Collection</Link></li>
              <li><Link to="/shop?category=Clothing" className="hover:underline">Clothing</Link></li>
              <li><Link to="/shop?category=Bags" className="hover:underline">Bags & Leather</Link></li>
              <li><Link to="/shop?category=Accessories" className="hover:underline">Accessories</Link></li>
              <li><Link to="/shop?category=Lifestyle" className="hover:underline">Lifestyle & Gift</Link></li>
            </ul>
          </div>

          {/* Column 3: About & Info */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-muted-sage mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:underline">Our Story</Link></li>
              <li><span className="text-white/60">Shipping & Delivery (Lagos & Nationwide)</span></li>
              <li><span className="text-white/60">Care Guide</span></li>
              <li><span className="text-white/60">Internship Project MVP</span></li>
            </ul>
          </div>

          {/* Column 4: Newsletter/Brand Statement */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-brand-muted-sage mb-4">Storefront</h4>
            <p className="text-xs text-brand-muted-sage leading-relaxed mb-4">
              All prices shown in Nigerian Naira (₦). Handcrafted quality standards applied to every curated piece.
            </p>
            <div className="text-xs text-white/50 border-t border-brand-emerald/40 pt-4">
              © {new Date().getFullYear()} NOVA & CO. All rights reserved.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
