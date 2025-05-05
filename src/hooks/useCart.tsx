import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { getProducts } from '@/services/productService';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  // Load cart data when user changes
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.uid}`);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } else {
      // Clear cart when user logs out
      setItems([]);
    }
  }, [user]);

  // Save cart data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.uid}`, JSON.stringify(items));
    }
  }, [items, user]);

  // Periodically verify that cart items still exist in the database
  useEffect(() => {
    const verifyCartItems = async () => {
      if (items.length === 0) return;
      
      try {
        const availableProducts = await getProducts();
        const availableProductIds = new Set(availableProducts.map(p => p.id));
        
        const updatedItems = items.filter(item => availableProductIds.has(item.id));
        
        if (updatedItems.length !== items.length) {
          setItems(updatedItems);
        }
      } catch (error) {
        console.error('Error verifying cart items:', error);
      }
    };

    // Verify cart items every time the component mounts and every 5 minutes
    verifyCartItems();
    const interval = setInterval(verifyCartItems, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(i => i.id === item.id);
      if (existingItem) {
        return currentItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}