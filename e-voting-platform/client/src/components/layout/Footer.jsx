import React from "react";
import { Link } from "react-router-dom";

const Footer = (props) => {
  // Accept props for data-scroll-section
  return (
    <footer className="bg-gray-800 text-gray-300 py-12" {...props}>
      <div className="container mx-auto px-6">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-semibold text-white mb-2">
              E-Voting System
            </h2>
            <p className="text-sm">
              Secure, transparent, and accessible voting for everyone.
            </p>
            <p className="text-xs mt-4">
              © {new Date().getFullYear()} E-Voting System. All rights reserved.
              (Project by Hirmani)
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white">
                    Voter Login
                  </Link>
                </li>
                <li>
                  <Link to="/admin/login" className="hover:text-white">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-white">
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-3">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  Email:{" "}
                  <a
                    href="mailto:info@example.com"
                    className="hover:text-white"
                  >
                    your_email@example.com
                  </a>
                </li>
                <li>
                  Phone:{" "}
                  <a href="tel:+1234567890" className="hover:text-white">
                    (+91) XXXXXXXXXX
                  </a>
                </li>
                {/* Add contact details from image */}
              </ul>
            </div>
            {/* Add more footer sections if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
