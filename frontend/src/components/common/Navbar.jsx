import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  SparklesIcon,
  ShoppingBagIcon,
  ClockIcon,
  CreditCardIcon,
  Squares2X2Icon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { CurrencyDollarIcon, BanknotesIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <span className="text-xl font-black text-white tracking-tighter">🎲</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-purple-400 bg-clip-text text-transparent">
              Dice<span className="text-purple-400">Roll</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Squares2X2Icon className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/game"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/game')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>🎲</span>
                <span>Dice Game</span>
              </Link>

              <Link
                to="/history"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/history')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ClockIcon className="w-4 h-4" />
                <span>History</span>
              </Link>

              <Link
                to="/store"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/store')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <ShoppingBagIcon className="w-4 h-4" />
                <span>Store</span>
              </Link>

              <Link
                to="/payment-history"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/payment-history')
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <CreditCardIcon className="w-4 h-4" />
                <span>Payments</span>
              </Link>

              <Link
                to="/vip"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/vip')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <SparklesIcon className="w-4 h-4 text-amber-400" />
                <span>VIP</span>
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="glow-btn-purple text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25"
              >
                Register Free
              </Link>
            </div>
          )}

          {/* Right Actions / User Status */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-3">
              {/* Coin Counter Pill */}
              <div className="flex items-center space-x-1.5 bg-slate-900/80 border border-amber-500/30 px-3 py-1.5 rounded-full shadow-inner">
                <CurrencyDollarIcon className="w-5 h-5 text-amber-400 animate-pulse" />
                <span className="font-bold text-amber-300 text-sm">
                  {user?.coins?.toLocaleString() || 0}
                </span>
                <span className="text-xs text-amber-500 font-semibold uppercase">coins</span>
              </div>

              {/* Wallet Balance Pill */}
              <div className="flex items-center space-x-1 bg-slate-900/80 border border-emerald-500/30 px-2.5 py-1.5 rounded-full text-xs font-bold text-emerald-300">
                <BanknotesIcon className="w-4 h-4 text-emerald-400" />
                <span>₹{user?.walletBalance || 0}</span>
              </div>

              {/* VIP badge */}
              {user?.vip && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 uppercase shadow-md shadow-amber-500/30">
                  VIP
                </span>
              )}

              {/* Profile Link */}
              <Link
                to="/profile"
                className="flex items-center space-x-2 p-1.5 rounded-full border border-slate-700 hover:border-purple-500 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs uppercase">
                  {user?.username ? user.username.substring(0, 2) : 'U'}
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <div className="flex items-center space-x-1 bg-slate-900 border border-amber-500/30 px-2.5 py-1 rounded-full text-xs">
                <CurrencyDollarIcon className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-amber-300">{user?.coins}</span>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/game"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Dice Game
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                History
              </Link>
              <Link
                to="/store"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Store
              </Link>
              <Link
                to="/payment-history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Payment History
              </Link>
              <Link
                to="/vip"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-amber-400 hover:bg-slate-800"
              >
                VIP Pass
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Profile ({user?.username})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-purple-400 hover:bg-purple-500/10"
              >
                Register Free
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
