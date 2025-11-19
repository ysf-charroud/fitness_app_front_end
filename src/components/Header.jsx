import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';   
import { useSelector } from 'react-redux';
import { Profile } from '@/pages/Profile';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';

const Header = () => {
  const user = useSelector((s) => s.auth.user);
  const token = useSelector((s) => s.auth.token);
  const location = useLocation();
  const [showContactDialog, setShowContactDialog] = useState(false);
  const isAuthenticated = Boolean(user && token);

  useEffect(() => {
    setShowContactDialog(false);
  }, [location.pathname]);

  const handleContactClick = (event) => {
    event.preventDefault();
    if (location.pathname === "/") {
      const section = document.getElementById("contact");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.hash = "contact";
      }
      return;
    }
    setShowContactDialog(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and title */}
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <span className="text-xl font-semibold text-gray-900">
                  Fitness Journey
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
                Home
              </Link>
              
              <Link to="/coaches" className="text-gray-700 hover:text-primary transition-colors">
                Coaches
              </Link>
              <Link to="/gyms" className="text-gray-700 hover:text-primary transition-colors">
                Gyms
              </Link>
              <Link to="/programs" className="text-gray-700 hover:text-primary transition-colors">
                Programs
              </Link>
              <button
                type="button"
                onClick={handleContactClick}
                className="text-gray-700 hover:text-primary transition-colors cursor-pointer"
              >
                Contact
              </button>
            </nav>

            {/* User / Auth buttons */}
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Profile />
              ) : (
                <>
                  <button className="hidden sm:block text-gray-700 hover:text-primary transition-colors">
                    <Link to="/login">Login</Link>
                  </button>
                  <Button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-purple-800 transition-colors">
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
          </DialogHeader>
          <ContactForm minimalist />
        </DialogContent>
      </Dialog> 
    </>
  );
};

export default Header;
