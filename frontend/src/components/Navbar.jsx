
import React, { useState, useEffect } from 'react';
import { Database, Menu, X, ChevronDown, Zap, BookOpen, Code, Shield, Github, ExternalLink } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productItems = [
    { icon: <Zap className="w-4 h-4" />, title: 'Features', desc: 'Explore our capabilities', href: '#features' },
    { icon: <Code className="w-4 h-4" />, title: 'API Reference', desc: 'Complete documentation', href: '#docs' },
    { icon: <Shield className="w-4 h-4" />, title: 'Security', desc: 'Enterprise-grade protection', href: '#security' },
  ];

  const resourceItems = [
    { icon: <BookOpen className="w-4 h-4" />, title: 'Documentation', desc: 'Get started guides', href: '#docs' },
    { icon: <Github className="w-4 h-4" />, title: 'GitHub', desc: 'View source code', href: '#github' },
    { icon: <ExternalLink className="w-4 h-4" />, title: 'Community', desc: 'Join discussions', href: '#community' },
  ];

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/70 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' 
        : 'bg-black/40 backdrop-blur-md border-b border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Database className="w-5 h-5 text-black" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Dbify</span>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                <span className="text-[10px] text-green-400 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {/* Product Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('product')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <span>Product</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'product' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'product' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="p-2">
                    {productItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                      >
                        <div className="mt-0.5 text-yellow-400 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-yellow-400 transition-colors">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <span>Resources</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === 'resources' ? 'rotate-180' : ''}`} />
              </button>
              
              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="p-2">
                    {resourceItems.map((item, index) => (
                      <a
                        key={index}
                        href={item.href}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all group"
                      >
                        <div className="mt-0.5 text-blue-400 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#pricing" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Pricing
            </a>

            <a href="#about" className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              About
            </a>
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              Sign In
            </button>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <button className="relative px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-medium rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all shadow-lg hover:scale-105">
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Mobile Product Section */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Product</div>
              {productItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-all group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="text-yellow-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Mobile Resources Section */}
            <div className="space-y-1 pt-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Resources</div>
              {resourceItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-all group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="text-blue-400 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Mobile Other Links */}
            <div className="space-y-1 pt-2">
              <a href="#pricing" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                Pricing
              </a>
              <a href="#about" className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                About
              </a>
            </div>

            {/* Mobile Actions */}
            <div className="pt-4 space-y-2 border-t border-white/10">
              <button className="w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/5 border border-white/10">
                Sign In
              </button>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg blur opacity-50"></div>
                <button className="relative w-full px-4 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-sm font-medium rounded-lg shadow-lg">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;