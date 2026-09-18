import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function BootScreen({ onComplete }) {
  const [logs, setLogs] = useState([]);
  
  const bootSequence = [
    "BIOS Date 09/18/26 10:35:43 Ver 1.00",
    "CPU: Miyasawa Logic Engine 8-Core",
    "[OK] Montando volumes virtuais...",
    "[OK] Inicializando módulos de Engenharia de Software...",
    "[OK] Carregando protocolos Offline-First e PWA...",
    "[WARN] Nível de cafeína abaixo do ideal. Bypass ativado.",
    "[OK] Estabelecendo conexão segura com cluster Radix/Kinross...",
    "[OK] Descriptografando portfólio industrial...",
    "Acesso concedido. Inicializando interface..."
  ];

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < bootSequence.length) {
        setLogs(prev => [...prev, bootSequence[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        // Aguarda um momento antes de fechar a tela de boot
        setTimeout(onComplete, 1000);
      }
    }, 250); // Velocidade da digitação das linhas

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#05080f] text-terminal-green font-mono p-8 z-[100] flex flex-col justify-end pb-20 overflow-hidden">
      <div className="max-w-4xl w-full mx-auto">
        {logs.map((log, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-sm md:text-base mb-1"
          >
            {log}
          </motion.div>
        ))}
        <div className="animate-pulse w-3 h-5 bg-terminal-green mt-2 inline-block"></div>
      </div>
    </div>
  );
}