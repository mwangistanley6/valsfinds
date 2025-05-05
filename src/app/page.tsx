'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { addProduct, deleteProduct, getProducts, type Product } from '@/services/productService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: Product) => {
    try {
      addToCart(product);
      toast.success('Added to cart!');
    } catch {
      // This means the user isn&apos;t logged in
      router.push('/auth');
    }
  };

  const handleAddProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const name = formData.get('name') as string;
      const price = Number(formData.get('price'));
      const imageFile = formData.get('image') as File;

      if (!imageFile || !name || !price) {
        toast.error('Please fill all fields');
        return;
      }

      const newProduct = await addProduct(name, price, imageFile);
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added successfully!');
      form.reset();
    } catch (error) {
      toast.error('Failed to add product');
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId: string, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId, imageUrl);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast.success('Product deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">
          Val&apos;s Finds and Thrifts
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-2">
          Discover Unique Fashion Treasures
        </p>
        <p className="text-gray-600 text-md md:text-lg max-w-2xl mx-auto">
          Find your perfect style with us! We offer quality clothing for work and weekend wear, all carefully chosen to help you look and feel your best.
        </p>
      </div>

      {isAdmin && (
        <form onSubmit={handleAddProduct} className="max-w-md mx-auto space-y-4 p-6 card bg-white shadow-lg rounded-lg mb-12">
          <h2 className="text-2xl font-semibold text-pink-600">Add New Product</h2>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price in KES"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            required
          />
          <button type="submit" className="w-full btn-primary bg-pink-600 hover:bg-pink-700">
            Add Product
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <div key={product.id} className="card bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform hover:scale-105">
            {isAdmin && (
              <button
                onClick={() => handleDeleteProduct(product.id, product.image)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 z-10 w-8 h-8 flex items-center justify-center"
                aria-label="Delete product"
              >
                ×
              </button>
            )}
            <div className="aspect-square relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2 truncate">{product.name}</h3>
              <p className="text-lg sm:text-xl font-bold text-pink-600 mb-2 sm:mb-3">KES {product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full btn-secondary bg-pink-100 text-pink-700 hover:bg-pink-200 font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <footer className="mt-16 border-t pt-8 pb-4">
        <div className="text-center text-gray-600">
          <p>© 2025 Val&apos;s Finds and Thrifts. Quality fashion at great prices.</p>
        </div>
      </footer>
    </div>
  );
}
