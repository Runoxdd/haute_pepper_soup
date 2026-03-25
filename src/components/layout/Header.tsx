"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useSession, signOut } from "next-auth/react";
import CartDrawer from "@/components/cart/CartDrawer";
import OrderForm from "@/components/cart/OrderForm";
import { AnimatePresence, motion } from "motion/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

/**
 * Navigation header with brand name, cart icon with badge,
 * and mobile hamburger menu.
 *
 * Sticky top with glass background and backdrop-blur.
 * Manages cart drawer and checkout states.
 */
export { Header };
export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0),
  );

  const { data: session, status } = useSession();
  const user = session?.user;
  const isAuth = status === "authenticated";

  // Simple heuristic for admin link — check if email is in ADMIN_EMAILS (via a separate check or shared list)
  // For now, let's just show "Sign Out" or "Profile" if logged in.
  // Actually, let's just show "Sign Out" and if they are at /admin, they'll know they are logged in.

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  // Close checkout modal on Escape key and prevent body scroll
  useEffect(() => {
    if (!checkoutOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCheckoutOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [checkoutOpen]);

  return (
    <>
      <header
        className="
          sticky top-0 z-30 w-full
          border-b border-gray-200 dark:border-glass-border
          safe-top bg-white dark:bg-[#0A0A0A]/90
        "
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >

        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
          aria-label="Main navigation"
        >
          {/* Brand */}
          <Link
            href="/"
            className="
              font-serif text-xl font-bold text-text-primary
              transition-colors duration-200 hover:text-brand-lemon-dark dark:hover:text-brand-lemon
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2
              focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
              rounded
            "
          >
            Haute Pepper Soup
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/menu"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-brand-lemon-dark dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded px-2 py-1"
            >
              Menu
            </Link>
            <Link
              href="/catering"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-brand-lemon-dark dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded px-2 py-1"
            >
              Catering
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-brand-lemon-dark dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded px-2 py-1"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-brand-lemon-dark dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded px-2 py-1"
            >
              Contact
            </Link>
            
            {isAuth ? (
              <div className="flex items-center gap-4">
                {user?.image && (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full border border-gray-200 dark:border-white/10"
                  />
                )}
                <Link
                  href="/admin"
                  className="text-sm font-medium text-brand-lemon-dark dark:text-brand-lemon transition-colors duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded px-2 py-1"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-200 hover:text-text-primary rounded px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-200 hover:text-brand-lemon-dark dark:hover:text-brand-lemon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon rounded px-2 py-1"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Right side: Theme + Cart + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <ThemeToggle />
            {/* Cart button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${totalItems} items`}
              className="
                relative flex h-10 w-10 items-center justify-center rounded-xl
                text-text-secondary transition-colors duration-200
                hover:text-text-primary hover:bg-glass-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2
                focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                touch-action-manipulation
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M2.25 2.25a.75.75 0 0 0 0 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 0 0-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 0 0 0-1.5H5.378A2.25 2.25 0 0 1 7.5 14.25h11.218a.75.75 0 0 0 .674-.421 60.358 60.358 0 0 0 2.96-7.228.75.75 0 0 0-.525-.965A60.864 60.864 0 0 0 5.68 4.509l-.232-.867A1.875 1.875 0 0 0 3.636 2.25H2.25ZM3.75 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM16.5 20.25a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" />
              </svg>
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-lemon-dark dark:bg-brand-lemon text-[10px] font-bold text-white dark:text-brand-dark"
                  aria-live="polite"
                  aria-label={`${totalItems} ${totalItems === 1 ? "item" : "items"} in cart`}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="
                flex h-10 w-10 items-center justify-center rounded-xl
                text-text-secondary transition-colors duration-200
                hover:text-text-primary hover:bg-glass-hover
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2
                focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                md:hidden
                touch-action-manipulation
              "
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path fillRule="evenodd" d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 10a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 10Zm0 5.25a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative overflow-hidden border-t border-glass-border md:hidden"
            >
              <div className="px-4 py-4 space-y-3">
                <Link
                  href="/menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary py-2"
                >
                  Menu
                </Link>
                <Link
                  href="/catering"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary py-2"
                >
                  Catering
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary py-2"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary py-2"
                >
                  Contact
                </Link>
                {isAuth ? (
                  <>
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-medium text-brand-lemon-dark dark:text-brand-lemon py-2"
                    >
                      Admin Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left text-sm text-text-secondary py-2"
                    >
                      Sign Out ({user?.name || user?.email})
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary py-2"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
      />

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60"
              onClick={() => setCheckoutOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              role="dialog"
              aria-label="Checkout"
              aria-modal="true"
              className="
                fixed inset-0 z-50
                flex items-center justify-center
                p-4 sm:p-8
              "
              onClick={() => setCheckoutOpen(false)}
            >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="
                w-full max-w-2xl
                max-h-[90vh] overflow-y-auto overscroll-contain
                rounded-2xl border border-gray-200 dark:border-white/10
                bg-[#FAFAF9] dark:bg-[#111111] p-6 sm:p-8
                scrollbar-thin shadow-2xl
              "
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl font-semibold text-text-primary">
                  Checkout
                </h2>
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  aria-label="Close checkout"
                  className="
                    flex h-8 w-8 items-center justify-center rounded-lg
                    text-text-secondary transition-colors duration-200
                    hover:text-text-primary hover:bg-glass-hover
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-1
                    focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                    touch-action-manipulation
                  "
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                  </svg>
                </button>
              </div>
              <OrderForm />
            </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
