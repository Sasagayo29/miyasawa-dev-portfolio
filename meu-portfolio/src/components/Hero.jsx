import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, FolderGit2, Flame, ArrowRight } from 'lucide-react';
import { fetchGithubStats } from '../services/github';

const TypewriterText = ({ text, delay = 0, speed = 40, showCursor = false }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let i = 0;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span>
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-2.5 h-6 md:h-9 bg-terminal-green ml-1.5 align-middle"
        />
      )}
    </span>
  );
};

export default function Hero({ onOpenContact }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchGithubStats()
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="inicio"
      className="min-h-screen flex items-center bg-transparent text-gray-300 pt-24 pb-16 font-mono relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Coluna Esquerda: Apresentação Principal */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terminal-green/10 border border-terminal-green/30 text-terminal-green text-xs mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green" />
              </span>
              <span>AddValue &amp; Kinross • Industrial Data &amp; Full Stack</span>
            </div>

            <p className="text-terminal-green mb-4 text-xs sm:text-sm md:text-base min-h-[24px]">
              <span className="text-gray-500">&gt;</span>{' '}
              <TypewriterText text='const dev = "Riquelmy Miyasawa Borges";' speed={35} />
            </p>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold text-white mb-6 tracking-tight leading-[1.1] min-h-[110px] sm:min-h-[140px]">
              <TypewriterText text="Software Engineer &" delay={1000} speed={35} />
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-terminal-green via-emerald-400 to-cyan-400">
                <TypewriterText
                  text="PL Developer Analyst."
                  delay={1800}
                  speed={40}
                  showCursor={true}
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.8 }}
              className="text-sm sm:text-base md:text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed"
            >
              <span className="text-gray-500">/*</span> Desenvolvendo soluções full-stack de missão
              crítica, arquiteturas offline-first, visão computacional e automações RPA para
              ambientes industriais. Graduando em ADS no IFTM.{' '}
              <span className="text-gray-500">*/</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.1, duration: 0.5 }}
              className="flex flex-wrap gap-3 sm:gap-4"
            >
              <button
                onClick={() => scrollTo('projetos')}
                className="px-6 py-3 bg-terminal-green/15 text-terminal-green border border-terminal-green/60 hover:bg-terminal-green/25 hover:shadow-[0_0_20px_rgba(46,160,67,0.3)] transition-all rounded text-sm flex items-center gap-2"
              >
                <span>Explorar Projetos</span>
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => scrollTo('stats')}
                className="px-6 py-3 text-gray-300 border border-gray-700 hover:border-cyan-400/60 hover:text-white transition-colors rounded text-sm"
              >
                Métricas GitHub
              </button>
              <button
                onClick={onOpenContact}
                className="px-6 py-3 text-gray-300 border border-gray-700 hover:border-terminal-green/60 hover:text-terminal-green transition-colors rounded text-sm"
              >
                Contato
              </button>
            </motion.div>
          </div>

          {/* Coluna Direita: Painel de Telemetria em Tempo Real */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="lg:col-span-5"
          >
            <div className="bg-surface/85 backdrop-blur-md border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Barra Superior estilo Terminal */}
              <div className="bg-[#0d1117] px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Terminal size={12} className="text-terminal-green" />
                  github-telemetry@Sasagayo29
                </span>
              </div>

              <div className="p-5 sm:p-6 space-y-5">
                {/* Mini KPIs Ao Vivo */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-[#0d1117]/80 border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                      <Activity size={12} className="text-terminal-green" />
                      <span>CONTRIB/ANO</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {stats ? stats.totalContributions.toLocaleString('pt-BR') : '...'}
                    </div>
                  </div>

                  <div className="bg-[#0d1117]/80 border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                      <FolderGit2 size={12} className="text-cyan-400" />
                      <span>REPOS</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {stats ? stats.publicRepos : '...'}
                    </div>
                  </div>

                  <div className="bg-[#0d1117]/80 border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mb-1">
                      <Flame size={12} className="text-terminal-yellow" />
                      <span>STREAK</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-white">
                      {stats ? `${stats.longestStreak}d` : '...'}
                    </div>
                  </div>
                </div>

                {/* Top 4 Linguagens */}
                <div className="space-y-2.5">
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>&gt; top_languages --by-repo</span>
                    <span className="text-terminal-green">LIVE</span>
                  </div>
                  <div className="space-y-2">
                    {(stats?.topLanguages || []).slice(0, 4).map((lang) => (
                      <div key={lang.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-300">{lang.name}</span>
                          <span className="text-gray-500">{lang.percent}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-terminal-green to-cyan-400 rounded-full"
                            style={{ width: `${lang.percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                    {!stats && (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-gray-800 rounded w-full" />
                        <div className="h-4 bg-gray-800 rounded w-5/6" />
                        <div className="h-4 bg-gray-800 rounded w-2/3" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Rodapé de Core Focus */}
                <div className="pt-3 border-t border-gray-800 flex flex-wrap gap-2 text-[11px]">
                  {['Python', 'React', 'FastAPI', 'RPA', 'OpenCV', 'SQL'].map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-gray-800/80 text-gray-300 border border-gray-700/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}