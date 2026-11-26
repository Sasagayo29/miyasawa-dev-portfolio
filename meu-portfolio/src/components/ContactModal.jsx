import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, Linkedin, Mail, Copy, Check, Network, ExternalLink } from 'lucide-react';

const EMAIL = 'riquelmymiyasawaborges@gmail.com';

// Coordenadas sincronizadas com o viewBox 400x400 do SVG
const CONTACTS = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    sub: '/in/riquelmy-miyasawa-borges',
    href: 'https://www.linkedin.com/in/riquelmy-miyasawa-borges',
    icon: Linkedin,
    x: 80,
    y: 92,
    xPct: 20,
    yPct: 23,
    accent: 'text-sky-400 border-sky-400/40 group-hover:border-sky-400',
    glow: 'rgba(56, 189, 248, 0.25)',
  },
  {
    id: 'github',
    label: 'GitHub',
    sub: 'github.com/Sasagayo29',
    href: 'https://github.com/Sasagayo29',
    icon: Github,
    x: 320,
    y: 92,
    xPct: 80,
    yPct: 23,
    accent: 'text-white border-gray-500/40 group-hover:border-terminal-green',
    glow: 'rgba(46, 160, 67, 0.3)',
  },
  {
    id: 'email',
    label: 'Enviar E-mail',
    sub: EMAIL,
    href: `mailto:${EMAIL}`,
    icon: Mail,
    x: 80,
    y: 308,
    xPct: 20,
    yPct: 77,
    accent: 'text-terminal-green border-terminal-green/40 group-hover:border-terminal-green',
    glow: 'rgba(46, 160, 67, 0.3)',
  },
  {
    id: 'copy',
    label: 'Copiar E-mail',
    sub: 'Copiar endereço para área de transferência',
    action: 'copy',
    icon: Copy,
    x: 320,
    y: 308,
    xPct: 80,
    yPct: 77,
    accent: 'text-cyan-400 border-cyan-400/40 group-hover:border-cyan-400',
    glow: 'rgba(34, 211, 238, 0.25)',
  },
];

// Fios curvos externos e anel interno para formar a teia
const OUTER_WEB_THREADS = [
  'M 80 92 Q 200 128 320 92',
  'M 320 92 Q 284 200 320 308',
  'M 320 308 Q 200 272 80 308',
  'M 80 308 Q 116 200 80 92',
];

const INNER_WEB_PATH =
  'M 134 141 Q 200 160 266 141 Q 248 200 266 259 Q 200 240 134 259 Q 152 200 134 141 Z';

export default function ContactModal({ isOpen, onClose }) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [copied, setCopied] = useState(false);

  // Dispara a expansão da teia logo após o modal abrir
  useEffect(() => {
    if (!isOpen) {
      setExpanded(false);
      setHoveredId(null);
      return;
    }

    const timer = setTimeout(() => setExpanded(true), 140);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback silencioso caso o navegador restrinja clipboard
    }
  };

  const activeNode = CONTACTS.find((c) => c.id === hoveredId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 font-mono">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Container do Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            className="relative w-full max-w-lg bg-surface border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-10"
          >
            {/* Header estilo Terminal */}
            <div className="bg-[#0d1117] px-5 py-3.5 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
                <Network size={16} className="text-terminal-green" />
                <span>~/network/connections.net</span>
              </div>
              <button
                onClick={onClose}
                aria-label="Fechar modal de contatos"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Palco da Teia Interativa */}
            <div className="p-4 sm:p-6 bg-[#090d13]/90">
              <div className="relative w-full max-w-[380px] aspect-square mx-auto select-none">
                {/* Camada SVG: Teia e Conexões */}
                <svg
                  viewBox="0 0 400 400"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                >
                  {/* Anéis sutis de radar */}
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="150"
                    fill="none"
                    stroke="rgba(46, 160, 67, 0.12)"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    initial={{ scale: 0.2, opacity: 0 }}
                    animate={expanded ? { scale: 1, opacity: 1 } : { scale: 0.2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ transformOrigin: '200px 200px' }}
                  />

                  {/* Anel interno da teia */}
                  <motion.path
                    d={INNER_WEB_PATH}
                    fill="none"
                    stroke="rgba(46, 160, 67, 0.2)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={
                      expanded ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
                    }
                    transition={{ duration: 0.55, delay: 0.15 }}
                  />

                  {/* Fios externos conectando os nós entre si */}
                  {OUTER_WEB_THREADS.map((d, i) => (
                    <motion.path
                      key={i}
                      d={d}
                      fill="none"
                      stroke="rgba(56, 189, 248, 0.18)"
                      strokeWidth="1"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        expanded ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.45, delay: 0.25 + i * 0.05 }}
                    />
                  ))}

                  {/* Linhas radiais do centro até cada contato */}
                  {CONTACTS.map((node, idx) => {
                    const isHighlighted = hoveredId === node.id;
                    return (
                      <motion.line
                        key={node.id}
                        x1="200"
                        y1="200"
                        x2={node.x}
                        y2={node.y}
                        stroke={isHighlighted ? '#39d353' : 'rgba(46, 160, 67, 0.4)'}
                        strokeWidth={isHighlighted ? '2.5' : '1.5'}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={
                          expanded ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.35, delay: idx * 0.06 }}
                      />
                    );
                  })}
                </svg>

                {/* Nó Central (clicar recolhe ou reexpande a teia) */}
                <motion.button
                  type="button"
                  onClick={() => setExpanded((prev) => !prev)}
                  title={expanded ? 'Recolher conexões' : 'Expandir conexões'}
                  whileTap={{ scale: 0.94 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-20 h-20 rounded-full bg-[#0d1117] border-2 border-terminal-green flex flex-col items-center justify-center shadow-[0_0_25px_rgba(46,160,67,0.35)] hover:shadow-[0_0_35px_rgba(57,211,83,0.55)] transition-shadow"
                >
                  <span className="absolute inset-0 rounded-full border border-terminal-green/40 animate-ping opacity-30 pointer-events-none" />
                  <span className="text-terminal-green font-bold text-base tracking-wider">RM</span>
                  <span className="text-[9px] text-gray-400 uppercase mt-0.5">
                    {expanded ? 'ONLINE' : 'ABRIR'}
                  </span>
                </motion.button>

                {/* Nós de Contato expandindo a partir do centro */}
                {CONTACTS.map((node, idx) => {
                  const Icon = node.id === 'copy' && copied ? Check : node.icon;
                  const isExternal = node.href?.startsWith('http');

                  const content = (
                    <div
                      style={{
                        boxShadow:
                          hoveredId === node.id ? `0 0 22px ${node.glow}` : 'none',
                      }}
                      className={`group flex flex-col items-center justify-center w-24 sm:w-28 py-3 px-2 rounded-xl bg-[#0d1117]/95 border backdrop-blur-md transition-all duration-200 hover:scale-105 ${node.accent}`}
                    >
                      <Icon
                        size={22}
                        className={
                          node.id === 'copy' && copied ? 'text-terminal-green mb-1.5' : 'mb-1.5'
                        }
                      />
                      <span className="text-[11px] sm:text-xs font-bold text-white text-center leading-tight">
                        {node.id === 'copy' && copied ? 'Copiado!' : node.label}
                      </span>
                      {isExternal && (
                        <ExternalLink
                          size={10}
                          className="text-gray-500 group-hover:text-terminal-green mt-1"
                        />
                      )}
                    </div>
                  );

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ left: '50%', top: '50%', x: '-50%', y: '-50%', scale: 0, opacity: 0 }}
                      animate={
                        expanded
                          ? {
                              left: `${node.xPct}%`,
                              top: `${node.yPct}%`,
                              x: '-50%',
                              y: '-50%',
                              scale: 1,
                              opacity: 1,
                            }
                          : {
                              left: '50%',
                              top: '50%',
                              x: '-50%',
                              y: '-50%',
                              scale: 0,
                              opacity: 0,
                            }
                      }
                      transition={{
                        type: 'spring',
                        stiffness: 240,
                        damping: 20,
                        delay: expanded ? 0.1 + idx * 0.07 : 0,
                      }}
                      onMouseEnter={() => setHoveredId(node.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="absolute z-10"
                    >
                      {node.action === 'copy' ? (
                        <button type="button" onClick={handleCopyEmail} className="cursor-pointer">
                          {content}
                        </button>
                      ) : (
                        <a
                          href={node.href}
                          target={isExternal ? '_blank' : undefined}
                          rel={isExternal ? 'noopener noreferrer' : undefined}
                        >
                          {content}
                        </a>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Barra de status inferior (mostra o destino do nó em foco) */}
            <div className="bg-[#0d1117] px-5 py-3 border-t border-gray-800 flex items-center justify-between gap-3 text-[11px] text-gray-400">
              <span className="truncate">
                <span className="text-terminal-green mr-1.5">&gt;</span>
                {copied
                  ? `Endereço ${EMAIL} copiado com sucesso.`
                  : activeNode
                  ? `${activeNode.label}: ${activeNode.sub}`
                  : 'Clique em um nó para conectar ou no centro para alternar a teia.'}
              </span>
              <span className="text-[10px] text-gray-600 border border-gray-800 px-1.5 py-0.5 rounded shrink-0">
                ESC
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}