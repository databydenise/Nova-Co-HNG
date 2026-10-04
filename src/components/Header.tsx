import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const { user, profile, signInWithGoogle, signOut } = useAuth();
  const { totalItems } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleAuth = async () => {
    if (user) {
      await signOut();
    } else {
      try {
        setIsSigningIn(true);
        await signInWithGoogle();
      } catch (err) {
        console.error('Google Auth Failed', err);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-brand-off-white border-b border-brand-muted-sage/30 backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-serif tracking-tight text-brand-deep-emerald font-semibold">
            NOVA & CO.
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm tracking-wide font-medium text-brand-charcoal">
            <Link to="/shop" className="hover:text-brand-emerald transition-colors">
              Shop
            </Link>
            <Link to="/about" className="hover:text-brand-emerald transition-colors">
              About
            </Link>
          </nav>
        </div>

        {/* Right Nav & Utilities */}
        <div className="flex items-center space-x-5 text-sm font-medium">
          
          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
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
          <Link to="/cart" className="relative p-1 text-brand-charcoal hover:text-brand-emerald transition-colors flex items-center">
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
                    src={profile?.avatar_url || user.user_metadata?.avatar_url}
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
                {isSigningIn ? 'Connecting...' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
