//app\_components\Navbar.jsx
"use client";

import {
    ArrowRightStartOnRectangleIcon,
    Bars3Icon,
    ShoppingCartIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../_provider/cartProvider";
import { useSession } from "../_provider/sessionProvider";
import CustomLink from "./CustomLink";

export default function Navbar() {
  const { isAuth, isAdmin } = useSession();
  const { cartData, loading } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNav, setShowNav] = useState(true);

  const lastScrollY = useRef(0);
  const timeoutRef = useRef(null);
  const router = useRouter();

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y <= 150 || y < lastScrollY.current) setShowNav(true);
      else setShowNav(false);
      lastScrollY.current = y;

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (window.scrollY > 10) setShowNav(false);
      }, 3000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navLinks = (
    <>
      <CustomLink 
        href="/" 
        className="hover:text-blue-300 transition-colors py-2 md:py-0" 
        onClick={() => setMobileMenuOpen(false)}
      >
        Home
      </CustomLink>
      <CustomLink 
        href="/#about-us" 
        className="hover:text-blue-300 transition-colors py-2 md:py-0" 
        onClick={() => setMobileMenuOpen(false)}
      >
        About
      </CustomLink>
      <CustomLink 
        href="/course" 
        className="hover:text-blue-300 transition-colors py-2 md:py-0" 
        onClick={() => setMobileMenuOpen(false)}
      >
        Courses
      </CustomLink>
      <CustomLink 
        href="/#contact-us" 
        className="hover:text-blue-300 transition-colors py-2 md:py-0" 
        onClick={() => setMobileMenuOpen(false)}
      >
        Contact
      </CustomLink>
      {isAdmin && (
        <CustomLink 
          href="/admin" 
          className="hover:text-blue-300 transition-colors py-2 md:py-0" 
          onClick={() => setMobileMenuOpen(false)}
        >
          Admin
        </CustomLink>
      )}
    </>
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        } bg-gradient-to-r from-blue-700 via-purple-600 to-blue-800 bg-opacity-90 backdrop-blur-lg text-white shadow-md`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <CustomLink href="/" className="flex items-center gap-2 mr-4">
                <img 
                  src="/images/logo3.png" 
                  alt="LumiED Logo" 
                  className="h-8 w-auto sm:h-10" 
                />
                <span className="sm:block text-xl md:text-2xl font-bold tracking-wide text-white">
                  LumiED
                </span>
              </CustomLink>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 font-medium">
              {navLinks}
            </nav>

            {/* Right Section: Cart/Login + Mobile Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Auth Section */}
              <div className="flex items-center gap-3 sm:gap-4">
                {isAuth ? (
                  <>
                    <CustomLink 
                      href="/cart" 
                      className="relative p-2" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <ShoppingCartIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="absolute -top-1 -right-1 bg-white text-blue-600 text-xs font-bold min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center shadow">
                        {loading ? "" : cartData.length}
                      </span>
                    </CustomLink>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        router.push("/auth/logout");
                      }}
                      className="p-2"
                      aria-label="Logout"
                    >
                      <ArrowRightStartOnRectangleIcon className="w-5 h-5 sm:w-6 sm:h-6 hover:text-blue-300 transition" />
                    </button>
                  </>
                ) : (
                  <CustomLink
                    href="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-blue-700 font-semibold rounded-md hover:bg-blue-100 shadow transition duration-200 active:scale-95 text-sm sm:text-base"
                  >
                    Login
                  </CustomLink>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? 
                  <XMarkIcon className="w-6 h-6" /> : 
                  <Bars3Icon className="w-6 h-6" />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-4 py-4 space-y-1 bg-black/20 backdrop-blur-md">
            <div className="flex flex-col font-medium">
              {navLinks}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
}