import React from 'react';

export default function About() {
  return (
    <section id="sobre" className="py-20 bg-transparent text-gray-300 font-mono border-t border-gray-800 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        
        <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3">
          <span className="text-terminal-green">{">"}</span> 
          <span>./profile_analyzer.sh</span>
        </h2>

        {/* Janela de Terminal Profissional */}
        <div className="bg-surface border border-gray-700 rounded-lg overflow-hidden shadow-2xl">
          {/* Barra superior (Botões do terminal) */}
          <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-700 flex gap-2 items-center">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            <span className="ml-4 text-xs text-gray-500 font-sans">bash - root@dev-environment</span>
          </div>
          
          {/* Conteúdo Executável */}
          <div className="p-6 md:p-8 font-mono text-sm md:text-base leading-relaxed space-y-4">
            
            <div>
              <span className="text-cyan-400">root@dev:~$</span> whoami
              <br/>
              <span className="text-white font-bold">Riquelmy Miyasawa Borges</span> — Industrial Data Analyst & Full Stack Developer
            </div>

            <div>
              <span className="text-cyan-400">root@dev:~$</span> cat summary.txt
              <br/>
              <span className="text-gray-400">
                Profissional focado na construção de arquiteturas resilientes para ambientes de missão crítica. Atuando na Radix para a Kinross Gold Corporation, transformo gargalos operacionais em plataformas de alta performance, garantindo que a operação industrial não sofra interrupções, mesmo em áreas de conectividade nula (shadow zones).
              </span>
            </div>

            <div>
              <span className="text-cyan-400">root@dev:~$</span> ./run_diagnostics.sh --show-focus
              <br/>
              <span className="text-terminal-green">✔</span> <strong>Arquitetura Offline-First:</strong> Sincronização em background (Service Workers, IndexedDB).<br/>
              <span className="text-terminal-green">✔</span> <strong>Visão Computacional & IA:</strong> Redes neurais para monitoramento de segurança operacional.<br/>
              <span className="text-terminal-green">✔</span> <strong>Automação & RPA:</strong> Playwright, Selenium e integrações com sistemas corporativos (JD Edwards, AD, Vetorh).<br/>
              <span className="text-terminal-green">✔</span> <strong>Integração de Hardware:</strong> Bluetooth, coletores Zebra (DataWedge) e telemetria.
            </div>

            <div>
              <span className="text-cyan-400">root@dev:~$</span> tail -f /var/log/academic_status.log
              <br/>
              <span className="text-gray-400">[ACTIVE]</span> Cursando Análise e Desenvolvimento de Sistemas pelo Instituto Federal do Triângulo Mineiro (IFTM), unindo teoria acadêmica às melhores práticas práticas de Clean Code, CI/CD e governança de dados no mercado.
            </div>

            <div className="animate-pulse flex items-center h-6">
              <span className="inline-block w-2 h-4 bg-terminal-green"></span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}