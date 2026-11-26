import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  ExternalLink,
  BookOpen,
  FolderTree,
  Folder,
  FileCode,
  ArrowLeft,
  Star,
  GitFork,
} from 'lucide-react';
import { fetchRepoReadme, fetchRepoContents } from '../services/github';

const markdownComponents = {
  h1: ({ children }) => <h1 className="text-2xl font-bold text-white border-b border-gray-800 pb-2 mt-4 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-white border-b border-gray-800/70 pb-1.5 mt-6 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-100 mt-5 mb-2">{children}</h3>,
  p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3 text-sm">{children}</p>,
  ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 text-gray-300 text-sm mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 text-gray-300 text-sm mb-4">{children}</ol>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-terminal-green hover:underline">
      {children}
    </a>
  ),
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
    ) : (
      <pre className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 overflow-x-auto my-4 text-xs font-mono text-gray-200">
        <code>{children}</code>
      </pre>
    ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-terminal-green pl-4 italic text-gray-400 my-4">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-left border-collapse border border-gray-800 text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => <th className="bg-[#0d1117] border border-gray-800 px-3 py-2 text-white font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-gray-800 px-3 py-2 text-gray-300">{children}</td>,
  img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full rounded my-3 inline-block" loading="lazy" />,
};

export default function ProjectModal({ project, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('readme');
  const [readme, setReadme] = useState('');
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen || !project?.isGithubRepo) return;

    let cancelled = false;
    setActiveTab('readme');
    setCurrentPath('');
    setError('');
    setLoadingReadme(true);

    fetchRepoReadme(project.repoName)
      .then((content) => {
        if (!cancelled) setReadme(content);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingReadme(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen || !project?.isGithubRepo || activeTab !== 'files') return;

    let cancelled = false;
    setLoadingFiles(true);
    setError('');

    fetchRepoContents(project.repoName, currentPath)
      .then((data) => {
        if (!cancelled) setFiles(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoadingFiles(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, project, activeTab, currentPath]);

  const handleGoBack = () => {
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-surface border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-10 max-h-[88vh] flex flex-col"
          >
            {/* Header estilo IDE */}
            <div className="bg-[#0d1117] px-6 py-4 border-b border-gray-800 flex justify-between items-center gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-white font-mono truncate flex items-center gap-2">
                  <span className="text-terminal-green">~/</span>
                  {project.title.toLowerCase().replace(/\s+/g, '-')}
                </h3>

                {project.isGithubRepo && (
                  <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Star size={13} className="text-terminal-yellow" /> {project.stars}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork size={13} /> {project.forks}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {project.htmlUrl && (
                  <a
                    href={project.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Abas exclusivas para repositórios do GitHub */}
            {project.isGithubRepo && (
              <div className="bg-[#0a0d12] px-6 border-b border-gray-800 flex gap-2 font-mono text-xs">
                <button
                  onClick={() => setActiveTab('readme')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'readme'
                      ? 'border-terminal-green text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <BookOpen size={14} /> README.md
                </button>
                <button
                  onClick={() => setActiveTab('files')}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                    activeTab === 'files'
                      ? 'border-terminal-green text-white'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <FolderTree size={14} /> Arquivos
                </button>
              </div>
            )}

            {/* Corpo do Modal */}
            <div className="p-6 md:p-8 overflow-y-auto font-sans text-gray-300 flex-1">
              {!project.isGithubRepo ? (
                <>
                  <span className="inline-block text-xs text-terminal-yellow bg-terminal-yellow/10 px-2 py-1 rounded mb-4 font-mono">
                    {project.category || 'Sistema'}
                  </span>
                  <h4 className="text-lg text-white font-semibold mb-3">Visão Geral</h4>
                  <p className="leading-relaxed mb-6 text-gray-400">{project.description || project.desc}</p>

                  <h4 className="text-lg text-white font-semibold mb-3">Stack Tecnológica</h4>
                  <div className="flex flex-wrap gap-2">
                    {(project.techStack || project.tech || []).map((tech, index) => (
                      <span
                        key={index}
                        className="text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded border border-cyan-400/20 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </>
              ) : activeTab === 'readme' ? (
                loadingReadme ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-6 bg-gray-800 rounded w-1/3" />
                    <div className="h-4 bg-gray-800 rounded w-full" />
                    <div className="h-4 bg-gray-800 rounded w-5/6" />
                    <div className="h-32 bg-gray-800/70 rounded w-full mt-4" />
                  </div>
                ) : error ? (
                  <p className="text-red-400 font-mono text-sm">{error}</p>
                ) : readme ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                    {readme}
                  </ReactMarkdown>
                ) : (
                  <div className="font-mono text-sm text-gray-400 space-y-3">
                    <p className="text-terminal-yellow">// Nenhum README.md encontrado neste repositório.</p>
                    <p className="font-sans text-gray-300">{project.description}</p>
                  </div>
                )
              ) : (
                <div className="font-mono text-sm">
                  {/* Breadcrumb de navegação */}
                  <div className="flex items-center justify-between bg-[#0d1117] px-4 py-2.5 rounded-t border border-gray-800 text-xs text-gray-400">
                    <span>
                      /{project.repoName}
                      {currentPath ? `/${currentPath}` : ''}
                    </span>
                    {currentPath && (
                      <button
                        onClick={handleGoBack}
                        className="flex items-center gap-1 text-terminal-green hover:underline"
                      >
                        <ArrowLeft size={13} /> voltar
                      </button>
                    )}
                  </div>

                  <div className="border-x border-b border-gray-800 rounded-b divide-y divide-gray-800/70">
                    {loadingFiles ? (
                      <div className="p-4 space-y-2.5 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-5 bg-gray-800 rounded w-full" />
                        ))}
                      </div>
                    ) : error ? (
                      <div className="p-4 text-red-400 text-xs">{error}</div>
                    ) : (
                      files.map((item) =>
                        item.type === 'dir' ? (
                          <button
                            key={item.sha}
                            onClick={() => setCurrentPath(item.path)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left"
                          >
                            <span className="flex items-center gap-2.5 text-cyan-400">
                              <Folder size={16} />
                              {item.name}/
                            </span>
                            <span className="text-[11px] text-gray-500">dir</span>
                          </button>
                        ) : (
                          <a
                            key={item.sha}
                            href={item.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors"
                          >
                            <span className="flex items-center gap-2.5 text-gray-300">
                              <FileCode size={16} className="text-gray-500" />
                              {item.name}
                            </span>
                            <span className="text-[11px] text-gray-500">
                              {(item.size / 1024).toFixed(1)} KB
                            </span>
                          </a>
                        )
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}