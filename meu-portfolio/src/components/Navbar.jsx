import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const triggerCommandPalette = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b font-mono ${scrolled ? 'bg-[#0d1117]/90 backdrop-blur-md border-gray-800' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex gap-2 items-center text-gray-500 text-sm">
          <span className="text-terminal-green">RM</span>
          <span>~/portfolio</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-row">
            {['inicio', 'sobre', 'skills', 'projetos', 'contato'].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                className="px-4 py-4 text-xs text-gray-400 hover:text-white hover:bg-gray-800/50 border-t-2 border-transparent hover:border-terminal-green transition-all"
              >
                {item}.jsx
              </button>
            ))}
          </div>

          {/* Botão da Command Palette */}
          <button 
            onClick={triggerCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 bg-gray-800/50 border border-gray-700 hover:border-gray-500 rounded transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Pesquisar...</span>
            <span className="bg-gray-700 px-1.5 rounded text-[10px]">Ctrl K</span>
          </button>
        </div>
      </div>
    </nav>
  );
}