
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-slate-200">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-2xl font-bold text-brand">Oops! Lost in the mountains?</p>
        </div>
      </div>
      <p className="text-slate-500 max-w-md mb-12">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/" className="bg-brand text-white px-8 py-3 rounded-full font-bold flex items-center space-x-2 hover:bg-brand-dark transition-all">
          <Home size={18} />
          <span>Go to Homepage</span>
        </Link>
        <Link to="/tour-packages" className="bg-slate-100 text-slate-700 px-8 py-3 rounded-full font-bold flex items-center space-x-2 hover:bg-slate-200 transition-all">
          <Search size={18} />
          <span>Search Packages</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
