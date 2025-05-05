import { db, storage } from '@/config/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const addProduct = async (
  name: string,
  price: number,
  imageFile: File
): Promise<Product> => {
  // Upload image first
  const imageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
  await uploadBytes(imageRef, imageFile);
  const imageUrl = await getDownloadURL(imageRef);

  // Add product to Firestore
  const productRef = await addDoc(collection(db, 'products'), {
    name,
    price,
    image: imageUrl,
    createdAt: new Date(),
  });

  return {
    id: productRef.id,
    name,
    price,
    image: imageUrl,
  };
};

export const deleteProduct = async (productId: string, imageUrl: string) => {
  // Delete image from storage
  const imageRef = ref(storage, imageUrl);
  try {
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
  }

  // Delete product from Firestore
  await deleteDoc(doc(db, 'products', productId));
};

export const getProducts = async (): Promise<Product[]> => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Product));
};