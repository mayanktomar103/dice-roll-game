import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-md border border-purple-500/20 space-y-6 shadow-2xl">
        <div className="text-6xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          404
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-xs text-slate-400">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-block glow-btn-purple text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg"
        >
          Return to Safety Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
