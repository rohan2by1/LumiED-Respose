//app\layout.jsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { verifySession } from "@/app/_lib/session";
import { SessionProvider } from "@/app/_provider/sessionProvider";
import ToastProvider from "@/app/_provider/toastProvider";
import { CartProvider } from "@/app/_provider/cartProvider";
import Footer from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LumiEd",
  description: "This e-learning platform transforms online education with interactive courses tailored for engineering students and beyond.",
};

export default async function RootLayout({ children }) {
  const session = await verifySession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <SessionProvider defaultValue={session}>
            <CartProvider>
              <Navbar />
              {children}
              <Footer />
            </CartProvider>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
