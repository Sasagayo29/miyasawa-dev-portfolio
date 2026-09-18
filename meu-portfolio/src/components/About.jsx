import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function About() {
  const [output, setOutput] = useState([]);

  const handleCommand = (cmd) => {
    if (cmd === 'hobbies') {
      setOutput([...output, { 
        command: '> cat hobbies.txt', 
        result: 'Carregando dependências pessoais...\n- Motociclismo: Yamaha MT-03 2024 preta a postos.\n- Gaming: Sessões na PlayStation (Elden Ring, Sekiro, Resident Evil 4 Gold, It Takes Two).'
      }]);
    } else if (cmd === 'ping') {
      setOutput([...output, { 
        command: '> ping hiancka', 
        result: 'A enviar pacotes ICMP...\nResposta recebida: bytes=32 tempo<1ms TTL=128\nConexão estável e sem latência desde 29/07/2021 às 10:00.\n0% de perda de pacotes. Uptime perfeito.'
      }]);
    } else if (cmd === 'clear') {
      setOutput([]);
    }
  };

  return (
    // Altere a tag <section> para ter o id="sobre"
    <section id="sobre" className="py-20 bg-background text-gray-300 font-mono border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3"
        >
          <span className="text-terminal-green">{">"}</span> 
          <span>whoami</span>
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface border border-gray-700 rounded-lg overflow-hidden shadow-2xl"
        >
          <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-700 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleCommand('hobbies')} className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">cat hobbies.txt</button>
              <button onClick={() => handleCommand('ping')} className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">ping hiancka</button>
              <button onClick={() => handleCommand('clear')} className="text-xs px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 transition-colors">clear</button>
            </div>
          </div>
          
          <div className="p-6 md:p-8 font-sans text-gray-300 text-base md:text-lg leading-relaxed space-y-6 h-auto min-h-[300px]">
            <p>
              Sou um <strong className="text-white">Engenheiro de Software e Analista de Dados Industriais</strong> focado em construir arquiteturas resilientes para ambientes de missão crítica. Na Radix, atuo no desenvolvimento de soluções de transformação digital para a Kinross, convertendo gargalos operacionais em plataformas de alta performance.
            </p>
            <p>
              Com raízes no suporte técnico N1/N2, evoluí para a automação de minas e monitorização de barragens. Lidero o desenvolvimento técnico de sistemas full-stack, aplicações offline-first e RPA. Continuo a reforçar a minha base académica no Instituto Federal do Triângulo Mineiro (IFTM).
            </p>

            {/* Renderização do Console Interativo */}
            {output.map((out, idx) => (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={idx} className="mt-6 border-t border-gray-800 pt-4 font-mono text-sm">
                <div className="text-terminal-green mb-2">{out.command}</div>
                <div className="text-gray-400 whitespace-pre-line">{out.result}</div>
              </motion.div>
            ))}
            <div className="animate-pulse w-3 h-5 bg-terminal-green inline-block mt-4"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}