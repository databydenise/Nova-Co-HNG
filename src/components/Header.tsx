import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, LogOut, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

export const Header: React.FC = () => {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const { totalItems } = useCart();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true);
      setAuthError('');
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Auth Failed', err);
      setAuthError('Google sign in failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setAuthError('Please enter your email and password.');
      return;
    }

    try {
      setIsSigningIn(true);
      setAuthError('');
      setAuthMessage('');

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      setShowLogin(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Email login failed:', err);
      setAuthError('Unable to sign in. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!email.trim() || !password) {
      setAuthError('Enter an email and password first.');
      return;
    }

    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    try {
      setIsSigningIn(true);
      setAuthError('');
      setAuthMessage('');

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) {
        setAuthError(error.message);
        return;
      }

      if (data.session) {
        setShowLogin(false);
        setEmail('');
        setPassword('');
      } else {
        setAuthMessage(
          'Account created. Check your email if confirmation is required.'
        );
      }
    } catch (err) {
      console.error('Account creation failed:', err);
      setAuthError('Unable to create account. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      setShowLogin(true);
      setAuthError('');
      setAuthMessage('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-brand-off-white border-b border-brand-muted-sage/30 backdrop-blur-md bg-opacity-95">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-2xl font-serif tracking-tight text-brand-deep-emerald font-semibold"
            >
              NOVA & CO.
            </Link>

            <nav className="hidden md:flex space-x-6 text-sm tracking-wide font-medium text-brand-charcoal">
              <Link
                to="/shop"
                className="hover:text-brand-emerald transition-colors"
              >
                Shop
              </Link>

              <Link
                to="/about"
                className="hover:text-brand-emerald transition-colors"
              >
                About
              </Link>
            </nav>
          </div>

          {/* Right Nav & Utilities */}
          <div className="flex items-center space-x-5 text-sm font-medium">

            {/* Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center"
                >
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 sm:w-60 border border-brand-muted-sage bg-white px-3 py-1 text-xs focus:outline-none focus:border-brand-deep-emerald rounded-none"
                    autoFocus
                  />

                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-xs text-brand-charcoal/70 hover:text-brand-charcoal"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-1 text-brand-charcoal hover:text-brand-emerald transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-1 text-brand-charcoal hover:text-brand-emerald transition-colors flex items-center"
            >
              <ShoppingBag className="w-5 h-5" />

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-deep-emerald text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth Button/Profile */}
            <div className="pl-2 border-l border-brand-muted-sage/40 flex items-center">
              {user ? (
                <div className="flex items-center space-x-3">
                  {profile?.avatar_url || user.user_metadata?.avatar_url ? (
                    <img
                      src={
                        profile?.avatar_url ||
                        user.user_metadata?.avatar_url
                      }
                      alt={profile?.full_name || 'User Avatar'}
                      className="w-7 h-7 rounded-full object-cover border border-brand-muted-sage"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-brand-light-green text-brand-deep-emerald flex items-center justify-center text-xs font-semibold rounded-full">
                      {user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}

                  <span className="hidden lg:inline text-xs font-medium text-brand-charcoal truncate max-w-[100px]">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>

                  <button
                    onClick={handleAuth}
                    className="p-1 text-brand-charcoal/70 hover:text-brand-deep-emerald"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAuth}
                  disabled={isSigningIn}
                  className="text-xs uppercase tracking-wider font-semibold px-3 py-1.5 border border-brand-deep-emerald text-brand-deep-emerald hover:bg-brand-deep-emerald hover:text-white transition-all rounded-none disabled:opacity-50"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && !user && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="relative w-full max-w-md bg-white border border-brand-muted-sage/40 shadow-xl p-6">

            <button
              onClick={() => {
                setShowLogin(false);
                setAuthError('');
                setAuthMessage('');
              }}
              className="absolute top-4 right-4 text-brand-charcoal/50 hover:text-brand-charcoal"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-serif font-semibold text-brand-deep-emerald">
                Welcome back
              </h2>

              <p className="text-xs text-brand-charcoal/60 mt-1">
                Sign in to access your Nova & Co. account and cart.
              </p>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-brand-muted-sage px-3 py-2 text-sm focus:outline-none focus:border-brand-deep-emerald"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-charcoal mb-1">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full border border-brand-muted-sage px-3 py-2 text-sm focus:outline-none focus:border-brand-deep-emerald"
                  autoComplete="current-password"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 px-3 py-2">
                  {authError}
                </p>
              )}

              {authMessage && (
                <p className="text-xs text-brand-deep-emerald bg-brand-light-green/40 border border-brand-muted-sage px-3 py-2">
                  {authMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSigningIn}
                className="w-full bg-brand-deep-emerald text-white py-3 text-xs uppercase tracking-widest font-semibold hover:bg-brand-emerald transition-colors disabled:opacity-50"
              >
                {isSigningIn ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={handleCreateAccount}
                disabled={isSigningIn}
                className="w-full border border-brand-deep-emerald text-brand-deep-emerald py-3 text-xs uppercase tracking-widest font-semibold hover:bg-brand-off-white transition-colors disabled:opacity-50"
              >
                Create Account
              </button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-brand-muted-sage/30" />
              <span className="text-[10px] uppercase tracking-wider text-brand-charcoal/50">
                Or
              </span>
              <div className="h-px flex-1 bg-brand-muted-sage/30" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full border border-brand-muted-sage py-3 text-xs font-semibold text-brand-charcoal hover:bg-brand-off-white transition-colors disabled:opacity-50"
            >
              {isSigningIn ? 'Connecting...' : 'Continue with Google'}
            </button>

          </div>
        </div>
      )}
    </>
  );
};