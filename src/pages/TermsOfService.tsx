import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-10">
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-emerald mb-3">
            NOVA & CO.
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-brand-charcoal">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: October 5, 2026
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">1. About Nova & Co.</h2>
          <p>
            Nova & Co. is an online boutique storefront featuring curated
            fashion, bags, jewellery, accessories, and lifestyle products.
            The current website is an evolving e-commerce MVP.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">2. Accounts</h2>
          <p>
            Some features may require you to create an account. You are
            responsible for keeping your account credentials secure and for
            activity carried out through your account.
          </p>
          <p>
            You agree to provide accurate information when creating an account
            and to notify us if you believe your account has been accessed
            without permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            3. Products and Availability
          </h2>
          <p>
            We aim to provide accurate product names, descriptions, images, and
            prices. Product availability, specifications, and pricing may
            change without prior notice.
          </p>
          <p>
            Product images are provided to help customers understand the
            appearance of an item. Actual products may have minor differences
            in colour, texture, or appearance depending on photography,
            lighting, and display settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            4. Shopping Cart and Orders
          </h2>
          <p>
            Adding an item to your shopping cart does not necessarily reserve
            that item. Items remain subject to availability.
          </p>
          <p>
            The current Nova & Co. storefront is an evolving MVP and does not
            currently provide a fully integrated online payment gateway.
            Checkout functionality may therefore be limited while the
            platform is being developed.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            5. Prices
          </h2>
          <p>
            Prices displayed on the website are shown in Nigerian Naira (₦).
            Nova & Co. reserves the right to correct pricing or product
            information errors and update prices when necessary.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            6. Acceptable Use
          </h2>
          <p>
            You agree not to misuse the website, attempt to gain unauthorised
            access to accounts or systems, interfere with the operation of the
            website, or use the service for unlawful purposes.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            7. Intellectual Property
          </h2>
          <p>
            The Nova & Co. name, branding, website design, original content,
            and other materials provided through the website belong to Nova &
            Co. or their respective owners and may not be reproduced or used
            without appropriate permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            8. Changes to the Service
          </h2>
          <p>
            Nova & Co. may add, remove, or modify features as the storefront
            develops. These Terms may also be updated from time to time to
            reflect changes to the service.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">9. Contact</h2>
          <p>
            If you have questions about these Terms, please contact Nova & Co.
            through the contact information provided on the website.
          </p>
        </section>
      </div>
    </div>
  );
};