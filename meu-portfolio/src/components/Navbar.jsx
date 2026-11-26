import React, { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';

const navItems = [
  { id: 'inicio', label: 'inicio.jsx' },
  { id: 'sobre', label: 'sobre.jsx' },
  { id: 'skills', label: 'skills.jsx' },
  { id: 'stats', label: 'stats.jsx' },
  { id: 'projetos', label: 'projetos.jsx' },
  { id: 'contato', label: 'contato.jsx' },
];

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    if (id === 'contato' && onOpenContact) {
      onOpenContact();
      return;
    }
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const triggerCommandPalette = () => {
    setMobileOpen(false);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 border-b font-mono ${
        scrolled || mobileOpen
          ? 'bg-[#0d1117]/95 backdrop-blur-md border-gray-800'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          onClick={() => scrollTo('inicio')}
          className="flex gap-2 items-center text-gray-400 hover:text-white text-sm transition-colors"
        >
          <span className="text-terminal-green font-bold">RM</span>
          <span>~/portfolio</span>
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Links Desktop */}
          <div className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3.5 py-5 text-xs text-gray-400 hover:text-white hover:bg-gray-800/40 border-t-2 border-transparent hover:border-terminal-green transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Botão Command Palette */}
          <button
            onClick={triggerCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 bg-gray-800/60 border border-gray-700 hover:border-terminal-green/60 hover:text-white rounded transition-colors"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Pesquisar...</span>
            <span className="bg-gray-700/80 px-1.5 py-0.5 rounded text-[10px]">Ctrl K</span>
          </button>

          {/* Botão Menu Mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Abrir menu"
            className="lg:hidden p-2 text-gray-400 hover:text-white border border-gray-800 rounded bg-gray-900/60"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Drawer Mobile */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0d1117]/98 border-t border-gray-800 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-terminal-green hover:bg-gray-800/50 rounded transition-colors"
            >
              <span className="text-terminal-green mr-2">&gt;</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}