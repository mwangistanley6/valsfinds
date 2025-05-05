import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      // No need to close the cart manually - the navigation will handle this
      router.push('/auth');
      return;
    }
    
    const itemsList = items.map(item => 
      `${item.name} - KES ${item.price} (${item.quantity}x)`
    ).join('\n');
    
    const message = `Hello! I'm interested in purchasing the following items from Val's Finds and Thrifts:\n\n${itemsList}\n\nTotal: KES ${calculateTotal()}`;
    
    const whatsappUrl = `https://wa.me/+254717514698?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    onClose();
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg">
        <div className="p-4 flex flex-col h-full bg-pink-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-pink-600">Your Shopping Bag</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-pink-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-pink-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Your shopping bag is empty</p>
                <button
                  onClick={onClose}
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        KES {item.price} × {item.quantity}
                      </p>
                      <p className="text-pink-600 font-semibold">
                        Total: KES {item.price * item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-pink-200 pt-4 mt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total:</span>
                <span className="text-xl font-bold text-pink-600">
                  KES {calculateTotal()}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full btn-primary bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                {user ? 'Checkout via WhatsApp' : 'Sign in to Checkout'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}