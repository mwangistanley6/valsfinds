'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();
  const { items } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/" 
              className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors"
            >
              Val&apos;s
            </Link>

            <div className="flex items-center gap-6">
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <ShoppingBagIcon className="h-6 w-6 text-pink-600" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {isAdmin ? 'Admin' : 'Welcome'}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative p-2 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    <ShoppingBagIcon className="h-6 w-6 text-pink-600" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {totalItems}
                      </span>
                    )}
                  </button>
                  
                  <Link
                    href="/auth"
                    className="text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </>
  );
}