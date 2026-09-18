import React from 'react';

export default function About() {
  return (
    <section className="py-20 bg-background text-gray-300 font-mono border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        
        <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3">
          <span className="text-terminal-green">{">"}</span> 
          <span>whoami</span>
        </h2>

        {/* Janela de Terminal */}
        <div className="bg-surface border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
          {/* Barra superior (Botões do terminal) */}
          <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-700 flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          
          {/* Conteúdo */}
          <div className="p-6 md:p-8 font-sans text-gray-300 text-base md:text-lg leading-relaxed space-y-6">
            <p>
              Sou um <strong className="text-white">Engenheiro de Software e Analista de Dados Industriais</strong> focado em construir arquiteturas resilientes para ambientes de missão crítica. Atualmente, atuo na Radix desenvolvendo soluções de transformação digital para a Kinross Gold Corporation, transformando gargalos operacionais em plataformas de alta performance.
            </p>
            <p>
              Minha trajetória profissional começou no suporte técnico N1/N2 na Softcom, evoluindo para a automação de minas e monitoramento de barragens. Hoje, lidero o desenvolvimento técnico de sistemas full-stack, aplicações offline-first e rotinas de RPA avançadas. Em paralelo, reforço minha base acadêmica cursando Análise e Desenvolvimento de Sistemas no Instituto Federal do Triângulo Mineiro (IFTM).
            </p>
            <p>
              Tenho forte foco em resolver problemas difíceis em locais de baixa conectividade, garantindo que a operação nunca pare. Fora do ambiente corporativo, gosto de explorar projetos envolvendo visão computacional, desenvolvimento de jogos multiplayer e IA.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}