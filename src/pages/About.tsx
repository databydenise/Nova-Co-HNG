import React from 'react';

export const About: React.FC = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold tracking-widest uppercase text-brand-emerald">Our Story</span>
        <h1 className="text-4xl font-serif font-semibold text-brand-deep-emerald leading-tight">
          Crafting thoughtful everyday living for modern Nigeria.
        </h1>
        <p className="text-base text-brand-charcoal/80 leading-relaxed">
          NOVA & CO. was founded on a quiet belief: that the products we interact with daily—our linen shirts, structured tote bags, candles, and accessories—should be crafted with restraint, purpose, and quality.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="bg-brand-off-white border border-brand-muted-sage/30 p-2">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000"
            alt="NOVA & CO. Store Atmosphere"
            className="w-full h-80 object-cover"
          />
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-brand-charcoal/80 leading-relaxed">
          <h3 className="text-xl font-serif text-brand-deep-emerald font-semibold">The Internship Storefront Concept</h3>
          <p>
            NOVA & CO. serves as an internship MVP project designed to demonstrate how modern, lightweight cloud architecture—leveraging React, Vite, Supabase, and Serverless Edge Functions—can empower small boutique businesses to deliver seamless, enterprise-grade digital experiences.
          </p>
          <p>
            By combining Google OAuth identity verification, direct database row-level security, and automated cloud notification workflows, NOVA & CO. provides a complete digital storefront experience tailored for the modern Nigerian consumer.
          </p>
        </div>
      </div>

    </div>
  );
};
