import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-10">
        <div>
          <p className="text-sm uppercase tracking-widest text-brand-emerald mb-3">
            NOVA & CO.
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold text-brand-charcoal">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Last updated: October 5, 2026
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">1. Overview</h2>
          <p>
            Nova & Co. is an online boutique storefront offering curated
            fashion, accessories, bags, jewellery, and lifestyle products.
            This website is currently operated as a developing e-commerce
            MVP.
          </p>
          <p>
            We respect your privacy and aim to collect and use only the
            information necessary to provide and improve our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            2. Information We Collect
          </h2>
          <p>
            When you create an account or use the website, we may collect
            information such as your name, email address, account information,
            shopping cart information, and order-related information.
          </p>
          <p>
            If you choose to sign in using Google, Google may provide us with
            basic account information such as your name, email address, and
            profile information permitted by your Google account settings.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            3. How We Use Your Information
          </h2>
          <p>Information collected through Nova & Co. may be used to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>create and manage your account;</li>
            <li>maintain your shopping cart;</li>
            <li>process and manage orders;</li>
            <li>send relevant account or order communications;</li>
            <li>provide customer support; and</li>
            <li>improve the website and shopping experience.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            4. Authentication and Third-Party Services
          </h2>
          <p>
            Nova & Co. uses Supabase to provide authentication and securely
            store application data. Google authentication may also be
            available as a sign-in option.
          </p>
          <p>
            Transactional and account-related email communications may be
            delivered using third-party email infrastructure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            5. Cookies and Local Storage
          </h2>
          <p>
            The website may use browser storage technologies to maintain
            application functionality, such as authentication state and
            shopping cart information. These technologies help the website
            remember your activity and provide a consistent experience.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            6. Data Security
          </h2>
          <p>
            We use reasonable technical and organisational measures to protect
            information stored through the service. However, no internet
            transmission or electronic storage system can be guaranteed to be
            completely secure.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            7. Your Choices
          </h2>
          <p>
            You may stop using the service at any time. If you have questions
            about your account information or would like to request changes to
            your information, you may contact Nova & Co. through the available
            contact channels on the website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy as Nova & Co. develops and new
            features or services are introduced. Updates will be reflected on
            this page with a revised update date.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">9. Contact</h2>
          <p>
            For privacy-related questions or requests, please contact Nova &
            Co. through the contact information provided on the website.
          </p>
        </section>
      </div>
    </div>
  );
};