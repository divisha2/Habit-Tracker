import React from 'react';
import { Flame, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  // Get emoji based on user name
  const getProfileEmoji = (name) => {
    const emojis = ['🧘', '🌟', '💪', '🚀', '🎯', '✨', '🔥', '💎', '🌈', '⭐'];
    const hash = name.charCodeAt(0) + name.charCodeAt(name.length - 1);
    return emojis[hash % emojis.length];
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="p-2 bg-primary rounded-lg">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-secondary font-display">
                Zen Habits
              </h1>
              <p className="text-xs sm:text-sm text-muted hidden sm:block">
                Track your daily progress
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {isAuthenticated && (
              <>
                <a href="#habits" className="text-secondary hover:text-primary font-medium transition-colors">
                  Habits
                </a>
                <a href="#analytics" className="text-secondary hover:text-primary font-medium transition-colors">
                  Analytics
                </a>
                <a href="#progress" className="text-secondary hover:text-primary font-medium transition-colors">
                  Progress
                </a>
              </>
            )}
            
            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleSignIn}
                  className="px-5 py-2.5 text-secondary font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={handleSignUp}
                  className="px-5 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{getProfileEmoji(user?.name || 'User')}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-secondary">{user?.name}</p>
                    <p className="text-xs text-muted">{user?.email}</p>
                  </div>
                </div>
                <button 
                  onClick={handleSignOut}
                  className="px-4 py-2.5 bg-gray-100 text-secondary rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-secondary" />
            ) : (
              <Menu className="w-6 h-6 text-secondary" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4">
            {isAuthenticated && (
              <>
                <a
                  href="#habits"
                  className="block px-4 py-2 text-secondary hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Habits
                </a>
                <a
                  href="#analytics"
                  className="block px-4 py-2 text-secondary hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </a>
                <a
                  href="#progress"
                  className="block px-4 py-2 text-secondary hover:bg-gray-50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Progress
                </a>
              </>
            )}
            
            {/* Mobile Auth Buttons */}
            <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
              {!isAuthenticated ? (
                <>
                  <button 
                    onClick={handleSignIn}
                    className="w-full px-4 py-2.5 text-secondary font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={handleSignUp}
                    className="w-full px-4 py-2.5 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">{getProfileEmoji(user?.name || 'User')}</span>
                    <div>
                      <p className="text-sm font-semibold text-secondary">{user?.name}</p>
                      <p className="text-xs text-muted">{user?.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="w-full px-4 py-2.5 bg-gray-100 text-secondary rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
