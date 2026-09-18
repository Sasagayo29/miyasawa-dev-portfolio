import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [output, setOutput] = useState([]);

  const handleCommand = (cmd) => {
    if (cmd === 'hobbies') {
      setOutput([...output, { 
        command: '> cat hobbies.txt', 
        result: 'Carregando dependências pessoais...\n- Motociclismo: Yamaha MT-03 2024 preta a postos.\n- Gaming: Sessões na PlayStation (Elden Ring, Sekiro, Resident Evil 4, Minecraft).'
      }]);
    } else if (cmd === 'ping') {
      setOutput([...output, { 
        command: '> ping hiancka', 
        result: 'Enviando pacotes ICMP...\nResposta: bytes=32 tempo<1ms TTL=128\nConexão estável e sem latência desde 29/07/2021 às 10:00.'
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
      role: "Estágio em Automação e Monitoramento",
      company: "Kinross Gold Corporation Brasil",
      date: "Jul 2024 - Out 2025",
      desc: "Integração operacional, telemetria de frotas e monitoramento de barragens."
    },
    {
      role: "Suporte Técnico N1/N2",
      company: "Softcom",
      date: "Mar 2025 - Ago 2025",
      desc: "Atendimento de infraestrutura, resolução de incidentes e estabilização de redes locais."
    },
    {
      role: "Graduação: Análise e Desenv. de Sistemas",
      company: "Instituto Federal do Triângulo Mineiro (IFTM)",
      date: "Em andamento",
      desc: "Base acadêmica focada em Engenharia de Software, Kotlin, Java e estruturas de dados."
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-transparent text-gray-300 font-mono border-t border-gray-800">
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
                <button onClick={() => handleCommand('hobbies')} className="whitespace-nowrap text-[10px] md:text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">cat hobbies.txt</button>
                <button onClick={() => handleCommand('ping')} className="whitespace-nowrap text-[10px] md:text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">ping hiancka</button>
                <button onClick={() => handleCommand('clear')} className="whitespace-nowrap text-[10px] md:text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">clear</button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 font-mono text-sm leading-relaxed min-h-[250px] max-h-[400px] overflow-y-auto">
              <p className="text-gray-400 mb-4">
                Ambiente de desenvolvimento ativo. Execute os scripts acima para extrair dados pessoais protegidos.
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