import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Heart,
  Map,
  Pill,
  BrainCircuit,
  User,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Pharmacies", path: "/map" },
    { name: "Médicaments", path: "/medications" },
    { name: "IA Santé", path: "/ai-health" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-primary-600 font-medium"
      : "text-gray-700 hover:text-primary-600";
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-white/95 backdrop-blur-sm">
      <div className="container px-4 mx-auto md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" strokeWidth={1.5} />
            <span className="text-xl font-bold text-gray-900">PharmaSanté</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`${isActive(
                  link.path
                )} transition-colors duration-200`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth buttons or User menu */}
          <div className="items-center hidden space-x-4 md:flex">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
                >
                  <span>{user.nom || user.email}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 w-48 mt-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      {user.role !== "visitor" && (
                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Tableau de bord
                          </Link>
                        </div>
                      )}
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-md bg-primary-600 hover:bg-primary-700"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-gray-700 rounded-md md:hidden hover:text-primary-600 focus:outline-none"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white border-t border-gray-200 md:hidden"
          >
            <div className="container px-4 py-4 mx-auto space-y-4">
              <nav className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 ${isActive(link.path)}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  {user.role !== "visitor" && (
                    <Link
                      to="/dashboard"
                      className="flex items-center py-2 text-gray-700 hover:text-primary-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5 mr-2" />
                      Tableau de bord
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full py-2 text-gray-700 hover:text-primary-600"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="block w-full py-2 text-center text-gray-700 hover:text-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="block w-full py-2 text-center text-white rounded-md bg-primary-600 hover:bg-primary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
