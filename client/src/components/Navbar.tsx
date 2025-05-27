import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-900 to-orange-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                SK
              </div>
              <span className="font-bold text-xl text-blue-900">SEIKO CUSTOMIZER</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-400 font-medium transition-colors">
                🏠 Home
              </Link>
              
              {/* Customize Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-400 font-medium transition-colors flex items-center space-x-1">
                  <span>⌚ Customize</span>
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link to="/" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <div className="font-semibold">3D Watch Builder</div>
                      <div className="text-xs text-gray-500">Interactive watch customization</div>
                    </Link>
                    <Link to="/jewelry-designer" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <div className="font-semibold">Jewelry Designer</div>
                      <div className="text-xs text-gray-500">Custom chains, bracelets & rings</div>
                    </Link>
                    <a href="/chain-and-box-designer.html" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <div className="font-semibold">Chain & Box Designer</div>
                      <div className="text-xs text-gray-500">Custom chains & ASWAT MODS boxes</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Styling Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-400 font-medium transition-colors flex items-center space-x-1">
                  <span>👔 Styling</span>
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <a href="/outfit-creator.html" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={(e) => { window.location.href = '/outfit-creator.html'; }}>
                      <div className="font-semibold">Outfit Creator</div>
                      <div className="text-xs text-gray-500">Virtual styling with 50+ combinations</div>
                    </a>
                    <a href="/upload-outfit.html" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={(e) => { window.location.href = '/upload-outfit.html'; }}>
                      <div className="font-semibold">Upload Your Outfit</div>
                      <div className="text-xs text-gray-500">AI-powered color extraction & styling</div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Catalog Dropdown */}
              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-400 font-medium transition-colors flex items-center space-x-1">
                  <span>🏪 Catalog</span>
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link to="/parts-catalog" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <div className="font-semibold">Parts Catalog</div>
                      <div className="text-xs text-gray-500">Browse 125+ premium components</div>
                    </Link>
                    <a href="/suppliers.html" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg" onClick={(e) => { window.location.href = '/suppliers.html'; }}>
                      <div className="font-semibold">Suppliers Network</div>
                      <div className="text-xs text-gray-500">90+ global supplier partners</div>
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <button className="text-gray-700 hover:text-orange-400 font-medium transition-colors flex items-center space-x-1">
                  <span>👥 Community</span>
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    <Link to="/community-forum" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <div className="font-semibold">Community Forum</div>
                      <div className="text-xs text-gray-500">Discussions & feedback</div>
                    </Link>
                    <Link to="/watch-showcase" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                      <div className="font-semibold">Watch Showcase</div>
                      <div className="text-xs text-gray-500">View community builds & costs</div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link 
                to="/" 
                className="bg-gradient-to-r from-blue-900 to-orange-400 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                🚀 Start Customizing
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-700 hover:text-orange-400 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-2">
              <Link to="/" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                🏠 Home
              </Link>
              <Link to="/" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                ⌚ 3D Watch Builder
              </Link>
              <Link to="/jewelry-designer" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                💍 Jewelry Designer
              </Link>
              <a href="/chain-and-box-designer.html" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                📦 Chain & Box Designer
              </a>
              <a href="/outfit-creator.html" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                👔 Outfit Creator
              </a>
              <a href="/upload-outfit.html" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                📷 Upload Outfit
              </a>
              <Link to="/parts-catalog" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                🏪 Parts Catalog
              </Link>
              <a href="/suppliers.html" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                🌐 Suppliers
              </a>
              <Link to="/community-forum" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                👥 Community Forum
              </Link>
              <Link to="/watch-showcase" className="block py-2 text-gray-700 hover:text-orange-400 font-medium">
                ⌚ Watch Showcase
              </Link>
              <Link 
                to="/" 
                className="block mt-4 bg-gradient-to-r from-blue-900 to-orange-400 text-white px-4 py-2 rounded-lg font-semibold text-center"
              >
                🚀 Start Customizing
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}