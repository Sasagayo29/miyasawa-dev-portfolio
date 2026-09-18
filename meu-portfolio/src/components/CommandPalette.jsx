import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Terminal, User, Briefcase, Mail, Code } from 'lucide-react';

// Tem de ter o "export default" aqui nesta linha
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Abre com Ctrl+K (Windows/Linux) ou Cmd+K (Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // Fecha com Esc
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Foca no input automaticamente quando o modal abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setSearch(''); // Limpa a pesquisa ao fechar
    }
  }, [isOpen]);

  const scrollTo = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const commands = [
    { id: 'inicio', icon: <Terminal size={18} />, label: 'Ir para o Início', action: () => scrollTo('inicio') },
    { id: 'sobre', icon: <User size={18} />, label: 'Ir para Sobre Mim', action: () => scrollTo('sobre') },
    { id: 'skills', icon: <Code size={18} />, label: 'Ver Stack Tecnológica', action: () => scrollTo('skills') },
    { id: 'projetos', icon: <Briefcase size={18} />, label: 'Explorar Projetos', action: () => scrollTo('projetos') },
    { id: 'contato', icon: <Mail size={18} />, label: 'Contactos', action: () => scrollTo('contato') },
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 font-mono">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-surface border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 py-4 border-b border-gray-800">
              <Search size={20} className="text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Escreva um comando ou navegue..."
                className="w-full bg-transparent text-white focus:outline-none placeholder-gray-500 text-base md:text-lg"
              />
              <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded ml-2">ESC</span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 py-2 text-xs text-gray-500 mb-1">Navegação</div>
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-terminal-green/10 hover:border-l-2 hover:border-terminal-green transition-all rounded text-left group"
                  >
                    <span className="text-gray-500 group-hover:text-terminal-green transition-colors">{cmd.icon}</span>
                    <span>{cmd.label}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  Nenhum comando encontrado para "<span className="text-gray-300">{search}</span>"
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
