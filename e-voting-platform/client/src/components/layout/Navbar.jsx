import React, { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

// You can replace this with your actual logo import or SVG
const YourLogo = () => (
  <span className="text-2xl font-bold text-primary">E-Vote</span>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null); // Ref for the dropdown

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () =>
    setIsProfileDropdownOpen(!isProfileDropdownOpen);

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    toast.info("Logged out successfully.");
    navigate("/");
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef]);

  const navLinks = [
    { name: "Home", href: "/" },
    // { name: 'About Us', href: '/about' },
    // { name: 'How It Works', href: '/how-it-works' },
  ];

  const authenticatedVoterLinks = [
    { name: "Dashboard", href: "/dashboard" },
    // { name: 'My Past Votes', href: '/my-votes' }, // Example
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <YourLogo />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-1 lg:space-x-4">
            {" "}
            {/* Adjusted spacing for more links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors
                   ${
                     isActive
                       ? "bg-primary text-white"
                       : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                   }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            {isAuthenticated &&
              user?.role === "voter" &&
              authenticatedVoterLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors
                   ${
                     isActive
                       ? "bg-primary text-white"
                       : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                   }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
          </div>

          {/* Auth Buttons / Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.name && (
                    <span className="mr-2 text-gray-700 hidden lg:block">
                      {user.name}
                    </span>
                  )}
                  <UserCircleIcon className="h-8 w-8 text-gray-600 hover:text-primary" />
                </button>
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                    >
                      <Link
                        to={
                          user?.role === "admin" ? "/admin/profile" : "/profile"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          role="menuitem"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="inline h-4 w-4 mr-2 text-gray-500" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                >
                  Voter Login
                </Link>
                <Link
                  to="/admin/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-primary transition-colors"
                >
                  Admin
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-primary text-white hover:bg-indigo-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {isAuthenticated && ( // Show profile icon on mobile if logged in, then menu button
              <button
                onClick={toggleProfileDropdown}
                className="p-2 mr-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
                aria-expanded={isProfileDropdownOpen}
                aria-haspopup="true"
              >
                <UserCircleIcon className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-gray-200"
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  onClick={toggleMobileMenu}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium
                     ${
                       isActive
                         ? "bg-primary text-white"
                         : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                     }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {isAuthenticated &&
                user?.role === "voter" &&
                authenticatedVoterLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.href}
                    onClick={toggleMobileMenu}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium
                     ${
                       isActive
                         ? "bg-primary text-white"
                         : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                     }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
            </div>
            {/* Mobile Auth Section */}
            <div className="pt-4 pb-3 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-5 mb-3">
                    {/* Profile icon already handled above if we want one separate from menu button */}
                    <div>
                      <div className="text-base font-medium text-gray-800">
                        {user?.name}
                      </div>
                      <div className="text-sm font-medium text-gray-500">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 px-2 space-y-1">
                    <Link
                      to={
                        user?.role === "admin" ? "/admin/profile" : "/profile"
                      }
                      onClick={toggleMobileMenu}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                    >
                      My Profile
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={toggleMobileMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout} // No need for toggleMobileMenu here, logout navigates
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="inline h-5 w-5 mr-2 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-2 space-y-1">
                  <Link
                    to="/login"
                    onClick={toggleMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                  >
                    Voter Login
                  </Link>
                  <Link
                    to="/admin/login"
                    onClick={toggleMobileMenu}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-100"
                  >
                    Admin Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={toggleMobileMenu}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-indigo-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Profile dropdown for mobile - if triggered by profile icon */}
      <AnimatePresence>
        {isProfileDropdownOpen &&
          isAuthenticated && ( // Only show if authenticated
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden origin-top-right absolute right-4 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              // Position it carefully if mobile menu is also open
              style={{ top: "4rem" }} // Adjust as needed
              ref={profileDropdownRef} // Use ref here too
            >
              <div className="px-5 py-3">
                {" "}
                {/* Added padding for name/email */}
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <hr />
              <Link
                to={user?.role === "admin" ? "/admin/profile" : "/profile"}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                My Profile
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileDropdownOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <ArrowRightOnRectangleIcon className="inline h-4 w-4 mr-2 text-gray-500" />
                Sign out
              </button>
            </motion.div>
          )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
