import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, RefreshCw, ArrowUpRight } from 'lucide-react';
import { projects } from '../data/projects';
import { fetchGithubRepos } from '../services/github';
import ProjectModal from './ProjectModal';

const formatUpdatedAt = (dateStr) => {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
    .format(new Date(dateStr))
    .replace('.', '');
};

const GlowCard = ({ project, onClick, index }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onClick={() => onClick(project)}
      className="relative bg-surface border border-gray-800 rounded-lg p-6 transition-all duration-300 group cursor-pointer flex flex-col overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(46, 160, 67, 0.15), transparent 40%)`,
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4 gap-2">
          <h3 className="text-xl font-bold text-white group-hover:text-terminal-green transition-colors">
            {project.title}
          </h3>
          <span className="text-xs text-terminal-yellow bg-terminal-yellow/10 px-2 py-1 rounded shrink-0">
            {project.category}
          </span>
        </div>
        <p className="text-gray-400 mb-6 text-sm font-sans leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack?.map((tech, idx) => (
            <span
              key={idx}
              className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const [githubRepos, setGithubRepos] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [repoError, setRepoError] = useState('');
  const [activeLanguage, setActiveLanguage] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchGithubRepos()
      .then((repos) => setGithubRepos(repos))
      .catch(() => setRepoError('Limite da API do GitHub atingido temporariamente.'))
      .finally(() => setLoadingRepos(false));
  }, []);

  const languages = useMemo(() => {
    const langs = Array.from(new Set(githubRepos.map((r) => r.category)));
    return ['Todos', ...langs];
  }, [githubRepos]);

  const filteredRepos = useMemo(() => {
    if (activeLanguage === 'Todos') return githubRepos;
    return githubRepos.filter((r) => r.category === activeLanguage);
  }, [githubRepos, activeLanguage]);

  return (
    <section id="projetos" className="py-20 bg-transparent text-gray-300 font-mono border-t border-gray-800 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Projetos Corporativos em Destaque */}
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3"
          >
            <span className="text-terminal-green">{'>'}</span>
            <span>ls ./projetos/destaques</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.featured.map((project, idx) => (
              <GlowCard key={project.id} project={project} index={idx} onClick={setSelectedProject} />
            ))}
          </div>
        </div>

        {/* Repositórios Dinâmicos do GitHub */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl text-white font-bold flex items-center gap-3"
            >
              <span className="text-terminal-green">{'>'}</span>
              <span>gh repo list --live</span>
            </motion.h2>

            <span className="text-xs text-gray-500 flex items-center gap-2">
              <RefreshCw
                size={12}
                className={loadingRepos ? 'animate-spin text-terminal-green' : 'text-terminal-green'}
              />
              {loadingRepos
                ? 'Sincronizando com GitHub...'
                : `${filteredRepos.length} de ${githubRepos.length} repositórios`}
            </span>
          </div>

          {/* Filtros dinâmicos por linguagem */}
          {!loadingRepos && !repoError && (
            <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-800 pb-4">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLanguage(lang)}
                  className={`px-3 py-1.5 text-xs md:text-sm rounded transition-colors ${
                    activeLanguage === lang
                      ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/30'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}

          {/* Container com rolagem 4x3 (4 colunas x 3 linhas visíveis) */}
          {loadingRepos ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="h-[152px] bg-[#0f141b] border border-gray-800 rounded-lg p-4 animate-pulse flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="h-4 bg-gray-800 rounded w-3/4" />
                    <div className="h-3 bg-gray-800 rounded w-full" />
                    <div className="h-3 bg-gray-800 rounded w-2/3" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-800 rounded w-14" />
                    <div className="h-4 bg-gray-800 rounded w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : repoError ? (
            <div className="p-6 bg-surface border border-red-900/50 rounded-lg text-sm text-red-400">
              {repoError}
            </div>
          ) : (
            <div className="bg-[#0a0d12]/50 border border-gray-800/80 rounded-lg p-3 backdrop-blur-sm">
              <motion.div
                key={activeLanguage}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[496px] overflow-y-auto pr-2"
              >
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedProject(repo)}
                    className="h-[152px] bg-[#0f141b] border border-gray-800 rounded-lg p-4 hover:border-terminal-green/50 hover:bg-[#131a24] transition-all cursor-pointer group flex flex-col"
                  >
                    {/* Título e métricas */}
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h4
                        title={repo.title}
                        className="text-sm text-white font-bold group-hover:text-terminal-green transition-colors truncate"
                      >
                        {repo.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-500 shrink-0">
                        {repo.stars > 0 && (
                          <span className="flex items-center gap-0.5">
                            <Star size={11} className="text-terminal-yellow" /> {repo.stars}
                          </span>
                        )}
                        {repo.forks > 0 && (
                          <span className="flex items-center gap-0.5">
                            <GitFork size={11} /> {repo.forks}
                          </span>
                        )}
                        <ArrowUpRight
                          size={13}
                          className="text-gray-600 group-hover:text-terminal-green transition-colors"
                        />
                      </div>
                    </div>

                    {/* Descrição ou fallback minimalista de terminal */}
                    {repo.description ? (
                      <p className="text-gray-400 text-xs font-sans leading-relaxed line-clamp-2">
                        {repo.description}
                      </p>
                    ) : (
                      <p className="text-gray-500/80 text-[11px] font-mono leading-relaxed">
                        <span className="text-terminal-green/70">//</span> inspecionar código e README
                      </p>
                    )}

                    {/* Rodapé: stack + data de atualização */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t border-gray-800/60">
                      <div className="flex flex-wrap gap-1.5 min-w-0 overflow-hidden">
                        {repo.techStack.slice(0, 2).map((t, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-cyan-400/90 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded truncate"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-600 shrink-0">
                        {formatUpdatedAt(repo.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}