'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 container mx-auto px-4 py-8 max-w-[1440px]">
                {children}
              </main>
              <Toaster 
                position="bottom-right"
                containerStyle={{
                  bottom: 40,
                  right: 20,
                  maxWidth: '100%'
                }} 
              />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
