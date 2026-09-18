import React from 'react';

export default function Contact() {
  return (
    <footer className="py-12 bg-[#05080f] text-gray-400 font-mono border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <h2 className="text-xl md:text-2xl text-white font-bold mb-6">
          <span className="text-terminal-green">~/contacto</span> $ ping riquelmy
        </h2>

        <p className="mb-8 font-sans text-sm md:text-base max-w-xl mx-auto">
          Sempre disponível para discutir novas arquiteturas, automações industriais e desafios complexos de engenharia de software.
        </p>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a href="mailto:riquelmemiyasawaborges@gmail.com" className="px-5 py-2 border border-gray-700 rounded hover:text-terminal-green hover:border-terminal-green transition-colors">
            Email
          </a>
          <a href="https://linkedin.com/in/riquelmymiyasawaborges" target="_blank" rel="noreferrer" className="px-5 py-2 border border-gray-700 rounded hover:text-terminal-green hover:border-terminal-green transition-colors">
            LinkedIn
          </a>
          <a href="https://github.com/riquelmymiyasawa" target="_blank" rel="noreferrer" className="px-5 py-2 border border-gray-700 rounded hover:text-terminal-green hover:border-terminal-green transition-colors">
            GitHub
          </a>
        </div>

        <div className="text-xs text-gray-600 border-t border-gray-800 pt-6 mt-6">
          <p>/* {new Date().getFullYear()} Riquelmy Miyasawa Borges. A partir de Paracatu, MG. */</p>
          <p className="mt-2 animate-pulse">EOF</p>
        </div>
      </div>
    </footer>
  );
}