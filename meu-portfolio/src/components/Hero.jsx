import React from 'react';

export default function Hero() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="inicio" className="min-h-screen flex flex-col justify-center bg-background text-gray-300 p-8 font-mono relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto w-full z-10 mt-10">
        <p className="text-terminal-green mb-4 text-sm md:text-base">
          <span className="text-gray-500">{">"}</span> const dev = "Riquelmy Miyasawa Borges";
        </p>
        
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          Software Engineer &<br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-neon to-cyan-500">
            Data Analyst Industrial.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
          <span className="text-gray-500">/*</span> Desenvolvendo soluções full-stack de missão crítica, arquiteturas offline-first e automações avançadas. Estudante de Análise e Desenvolvimento de Sistemas no IFTM. <span className="text-gray-500">*/</span>
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() => scrollTo('projetos')}
            className="px-6 py-3 bg-terminal-green/10 text-terminal-green border border-terminal-green/50 hover:bg-terminal-green/20 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all rounded transition-colors duration-300"
          >
            Explorar Projetos
          </button>
          <button 
            onClick={() => scrollTo('contato')}
            className="px-6 py-3 text-gray-300 border border-gray-700 hover:border-gray-500 hover:text-white transition-colors duration-300 rounded"
          >
            Contato
          </button>
        </div>
      </div>
    </section>
  );
}