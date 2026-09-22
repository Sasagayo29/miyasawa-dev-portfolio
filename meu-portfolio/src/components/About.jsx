import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [output, setOutput] = useState([]);

  const handleCommand = (cmd) => {
    if (cmd === 'focus') {
      setOutput([...output, { 
        command: '> cat tech_radar.md', 
        result: 'Carregando stack de inovação atual...\n- Arquitetura: PWA e modelos Offline-First para zonas de sombra.\n- Automação: RPA avançado (Playwright/Selenium) integrado a ERPs.\n- Dados & IA: Pipelines ETL e redes neurais para visão computacional.'
      }]);
    } else if (cmd === 'status') {
      setOutput([...output, { 
        command: '> systemctl status core-services', 
        result: 'Verificando integridade dos serviços de missão crítica...\n[OK] MAPRIX Enterprise: Ativo e responsivo.\n[OK] MoviMeX: Sincronização em background operacional.\n[OK] KAD Console: Conexão WinRM e AD estabelecida.\nUptime: 99.99% - Operação industrial sem interrupções.'
      }]);
    } else if (cmd === 'clear') {
      setOutput([]);
    }
  };

  const timeline = [
    {
      role: "Industrial Data Analyst / Consultor",
      company: "Radix & Kinross Gold Corporation",
      date: "Out 2025 - Presente",
      desc: "Desenvolvimento de soluções enterprise, automação RPA, PWA offline-first e arquitetura de dados industriais."
    },
    {
      role: "Suporte Técnico N1/N2",
      company: "Softcom",
      date: "Mar 2025 - Ago 2025",
      desc: "Atendimento de infraestrutura, resolução de incidentes e estabilização de redes locais."
    },
    {
      role: "Estágio em Automação e Monitoramento",
      company: "Kinross Gold Corporation Brasil",
      date: "Jul 2024 - Out 2025",
      desc: "Integração operacional, telemetria de frotas e monitoramento de barragens."
    },
    {
      role: "Graduação: Análise e Desenv. de Sistemas",
      company: "Instituto Federal do Triângulo Mineiro (IFTM)",
      date: "Em andamento",
      desc: "Base acadêmica focada em Engenharia de Software, Kotlin, Java e estruturas de dados."
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-transparent text-gray-300 font-mono border-t border-gray-800 relative z-10">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3"
        >
          <span className="text-terminal-green">{">"}</span> 
          <span>git log --graph --oneline</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Coluna 1: Git Timeline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative border-l-2 border-gray-800 ml-3 space-y-8 py-4"
          >
            {timeline.map((item, idx) => (
              <div key={idx} className="relative pl-6 group">
                {/* O ponto do "Commit" */}
                <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-gray-800 border-2 border-background group-hover:bg-terminal-green group-hover:shadow-[0_0_10px_rgba(46,160,67,0.8)] transition-all duration-300"></span>
                
                <h4 className="text-white font-bold text-sm md:text-base group-hover:text-terminal-green transition-colors">
                  commit: {item.role}
                </h4>
                <p className="text-terminal-yellow text-xs mt-1 mb-2 font-sans">
                  {item.company} | <span className="text-gray-500">{item.date}</span>
                </p>
                <p className="text-gray-400 text-xs md:text-sm font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Coluna 2: Terminal Interativo */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface border border-gray-700 rounded-lg overflow-hidden shadow-2xl h-fit"
          >
            <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-700 flex justify-between items-center overflow-x-auto">
              <div className="flex gap-2 min-w-[50px]">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => handleCommand('focus')} className="whitespace-nowrap text-[10px] md:text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">cat tech_radar.md</button>
                <button onClick={() => handleCommand('status')} className="whitespace-nowrap text-[10px] md:text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">systemctl status</button>
                <button onClick={() => handleCommand('clear')} className="whitespace-nowrap text-[10px] md:text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">clear</button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 font-mono text-sm leading-relaxed min-h-[250px] max-h-[400px] overflow-y-auto">
              <p className="text-gray-400 mb-4">
                Ambiente de desenvolvimento ativo. Execute os diagnósticos acima para verificar o status dos nós operacionais.
              </p>

              {output.map((out, idx) => (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={idx} className="mt-4 border-t border-gray-800 pt-4">
                  <div className="text-terminal-green mb-1">{out.command}</div>
                  <div className="text-gray-300 whitespace-pre-line">{out.result}</div>
                </motion.div>
              ))}
              <div className="animate-pulse w-2 h-4 bg-terminal-green inline-block mt-4"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}