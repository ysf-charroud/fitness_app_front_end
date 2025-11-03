import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';   
import { useSelector } from 'react-redux';
import { Profile } from '@/pages/Profile';

const Header = () => {
  const user = useSelector((s) => s.auth.user);
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-gray-900">Fitness Journey</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-primary transition-colors">Home</a>
            <a href="#coaches" className="text-gray-700 hover:text-primary transition-colors">Coaches</a>
            <a href="#gyms" className="text-gray-700 hover:text-primary transition-colors">Gyms</a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
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
  );
};

export default Header;
