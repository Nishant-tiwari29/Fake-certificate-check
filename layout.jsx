
import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Shield, Menu, X } from "lucide-react";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "./src/contexts/AuthContext";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const getMenuItems = () => {
    if (!user) {
      return [
        { name: "Verify", path: createPageUrl("Verify") },
        { name: "Login", path: createPageUrl("Login") },
        { name: "Register", path: createPageUrl("Register") }
      ];
    }
    
    if (user.role === 'institute') {
      return [
        { name: "Dashboard", path: createPageUrl("Dashboard") },
        { name: "My Certificates", path: createPageUrl("MyCertificates") },
        { name: "Issue", path: createPageUrl("IssueCertificate") },
        { name: "Verify", path: createPageUrl("Verify") }
      ];
    }
    
    return [
      { name: "Verify", path: createPageUrl("Verify") }
    ];
  };

  const menuItems = getMenuItems();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="fixed inset-0 bg-gradient-to-br from-teal-500/5 via-cyan-500/5 to-purple-500/5 pointer-events-none" />
      
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to={createPageUrl("Home")} 
              className="flex items-center gap-3 group"
            >
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Shield className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                EduVerify
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {menuItems.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50"
                >
                  <span>Account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden group-hover:block border border-slate-200">
                  {!user ? (
                    <>
                      <Link to="/login" className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                        Login
                      </Link>
                      <Link to="/register" className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                        Register
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="block px-4 py-2 text-sm font-medium text-slate-900 border-b border-slate-200">
                        {user.email}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          logout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-slate-600" />
              ) : (
                <Menu className="w-6 h-6 text-slate-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4"
              >
                <div className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-slate-200 mt-2 pt-2">
                    {!user ? (
                      <>
                        <Link to="/login" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                          Login
                        </Link>
                        <Link to="/register" className="block px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                          Register
                        </Link>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 text-sm font-medium text-slate-900">
                          {user.email}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setIsMenuOpen(false);
                            logout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                        >
                          Logout
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children ?? <Outlet />}
      </motion.main>

      <footer className="mt-auto bg-white/80 backdrop-blur-md border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-600">
              © 2025 EduVerify. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-600 hover:text-slate-900"
              >
                About
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-600 hover:text-slate-900"
              >
                Privacy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-slate-600 hover:text-slate-900"
              >
                Contact
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
