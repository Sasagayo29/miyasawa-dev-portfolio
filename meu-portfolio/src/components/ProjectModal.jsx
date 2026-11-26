import React, { useState, useEffect, useMemo } from 'react';
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
  Image as ImageIcon,
  ArrowLeft,
  Star,
  GitFork,
  Copy,
  Check,
  Globe,
} from 'lucide-react';
import {
  fetchRepoReadme,
  fetchRepoContents,
  fetchFileContent,
  getFileExtension,
  resolveGithubImageUrl,
} from '../services/github';

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'bmp']);

export default function ProjectModal({ project, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('readme');
  const [readme, setReadme] = useState('');
  const [files, setFiles] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [copied, setCopied] = useState(false);

  const [loadingReadme, setLoadingReadme] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [loadingFileContent, setLoadingFileContent] = useState(false);
  const [error, setError] = useState('');

  // Reset de estados e carregamento do README ao abrir um repositório
  useEffect(() => {
    if (!isOpen || !project?.isGithubRepo) return;

    let cancelled = false;
    setActiveTab('readme');
    setCurrentPath('');
    setSelectedFile(null);
    setFileData(null);
    setCopied(false);
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

  // Carrega o diretório atual quando a aba "Arquivos" está ativa
  useEffect(() => {
    if (!isOpen || !project?.isGithubRepo || activeTab !== 'files' || selectedFile) return;

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
  }, [isOpen, project, activeTab, currentPath, selectedFile]);

  const handleOpenFile = async (item) => {
    setSelectedFile(item);
    setFileData(null);
    setCopied(false);
    setError('');
    setLoadingFileContent(true);

    try {
      const result = await fetchFileContent(project.repoName, item);
      setFileData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingFileContent(false);
    }
  };

  const handleGoBack = () => {
    setError('');
    if (selectedFile) {
      setSelectedFile(null);
      setFileData(null);
      return;
    }
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  const handleCopyCode = async () => {
    if (!fileData?.content) return;
    try {
      await navigator.clipboard.writeText(fileData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback silencioso se o navegador bloquear clipboard
    }
  };

  const markdownComponents = useMemo(
    () => ({
      h1: ({ children }) => (
        <h1 className="text-2xl font-bold text-white border-b border-gray-800 pb-2 mt-4 mb-4">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-xl font-bold text-white border-b border-gray-800/70 pb-1.5 mt-6 mb-3">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-lg font-semibold text-gray-100 mt-5 mb-2">{children}</h3>
      ),
      p: ({ children }) => <p className="text-gray-300 leading-relaxed mb-3 text-sm">{children}</p>,
      ul: ({ children }) => (
        <ul className="list-disc list-inside space-y-1.5 text-gray-300 text-sm mb-4">{children}</ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-inside space-y-1.5 text-gray-300 text-sm mb-4">{children}</ol>
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-terminal-green hover:underline"
        >
          {children}
        </a>
      ),
      pre: ({ children }) => (
        <pre className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 overflow-x-auto my-4 text-xs font-mono text-gray-200">
          {children}
        </pre>
      ),
      code: ({ className, children, ...props }) => {
        const isBlock = Boolean(className) || String(children).includes('\n');
        if (isBlock) {
          return (
            <code className="font-mono text-xs text-gray-200" {...props}>
              {children}
            </code>
          );
        }
        return (
          <code className="bg-gray-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
            {children}
          </code>
        );
      },
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-terminal-green pl-4 italic text-gray-400 my-4">
          {children}
        </blockquote>
      ),
      table: ({ children }) => (
        <div className="overflow-x-auto my-4">
          <table className="w-full text-left border-collapse border border-gray-800 text-xs">
            {children}
          </table>
        </div>
      ),
      th: ({ children }) => (
        <th className="bg-[#0d1117] border border-gray-800 px-3 py-2 text-white font-semibold">
          {children}
        </th>
      ),
      td: ({ children }) => <td className="border border-gray-800 px-3 py-2 text-gray-300">{children}</td>,
      img: ({ src, alt }) => (
        <img
          src={
            project?.isGithubRepo
              ? resolveGithubImageUrl(src, project.repoName, project.defaultBranch)
              : src
          }
          alt={alt}
          className="max-w-full rounded my-3 inline-block"
          loading="lazy"
        />
      ),
    }),
    [project]
  );

  if (!project) return null;

  const codeLines = fileData?.type === 'text' ? fileData.content.split('\n') : [];

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

              <div className="flex items-center gap-2.5 shrink-0">
                {project.homepage && (
                  <a
                    href={project.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
                  >
                    <Globe size={13} />
                    <span>Demo</span>
                  </a>
                )}

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

                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-1">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Abas para repositórios do GitHub */}
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
                  {/* Breadcrumb e controle de retorno */}
                  <div className="flex items-center justify-between gap-4 bg-[#0d1117] px-4 py-2.5 rounded-t border border-gray-800 text-xs text-gray-400">
                    <span className="truncate">
                      /{project.repoName}
                      {selectedFile
                        ? `/${selectedFile.path}`
                        : currentPath
                        ? `/${currentPath}`
                        : ''}
                    </span>

                    <div className="flex items-center gap-3 shrink-0">
                      {selectedFile && fileData?.type === 'text' && (
                        <button
                          onClick={handleCopyCode}
                          className="flex items-center gap-1 text-gray-300 hover:text-terminal-green transition-colors"
                        >
                          {copied ? <Check size={13} className="text-terminal-green" /> : <Copy size={13} />}
                          <span>{copied ? 'Copiado' : 'Copiar'}</span>
                        </button>
                      )}

                      {selectedFile && (
                        <a
                          href={selectedFile.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:underline"
                        >
                          <span>Raw/GitHub</span>
                          <ExternalLink size={12} />
                        </a>
                      )}

                      {(currentPath || selectedFile) && (
                        <button
                          onClick={handleGoBack}
                          className="flex items-center gap-1 text-terminal-green hover:underline"
                        >
                          <ArrowLeft size={13} /> voltar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Conteúdo: Visualizador de arquivo OU Lista do diretório */}
                  <div className="border-x border-b border-gray-800 rounded-b overflow-hidden">
                    {selectedFile ? (
                      loadingFileContent ? (
                        <div className="p-5 space-y-2.5 animate-pulse bg-[#0a0d12]">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className="h-4 bg-gray-800 rounded"
                              style={{ width: `${55 + ((i * 17) % 40)}%` }}
                            />
                          ))}
                        </div>
                      ) : error ? (
                        <div className="p-5 text-red-400 text-xs">{error}</div>
                      ) : fileData?.type === 'image' ? (
                        <div className="p-6 bg-[#0a0d12] flex flex-col items-center justify-center gap-4">
                          <img
                            src={fileData.url}
                            alt={selectedFile.name}
                            className="max-h-[50vh] rounded border border-gray-800"
                          />
                          <span className="text-xs text-gray-500">
                            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ) : fileData?.type === 'unsupported' ? (
                        <div className="p-6 bg-[#0a0d12] text-center space-y-4">
                          <p className="text-terminal-yellow text-xs">// {fileData.reason}</p>
                          <a
                            href={selectedFile.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 text-xs transition-colors"
                          >
                            <span>Abrir arquivo no GitHub</span>
                            <ExternalLink size={13} />
                          </a>
                        </div>
                      ) : (
                        <div className="bg-[#0a0d12] overflow-x-auto max-h-[55vh] overflow-y-auto text-xs leading-6">
                          <table className="w-full border-collapse">
                            <tbody>
                              {codeLines.map((line, idx) => (
                                <tr key={idx} className="hover:bg-gray-800/30">
                                  <td className="select-none text-right text-gray-600 pr-4 pl-3 w-12 align-top border-r border-gray-800/60">
                                    {idx + 1}
                                  </td>
                                  <td className="pl-4 pr-4 whitespace-pre text-gray-200">
                                    {line || ' '}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    ) : loadingFiles ? (
                      <div className="p-4 space-y-2.5 animate-pulse">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-5 bg-gray-800 rounded w-full" />
                        ))}
                      </div>
                    ) : error ? (
                      <div className="p-4 text-red-400 text-xs">{error}</div>
                    ) : (
                      <div className="divide-y divide-gray-800/70">
                        {files.map((item) => {
                          const isImg = IMAGE_EXTS.has(getFileExtension(item.name));
                          return item.type === 'dir' ? (
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
                            <button
                              key={item.sha}
                              onClick={() => handleOpenFile(item)}
                              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-800/50 transition-colors text-left"
                            >
                              <span className="flex items-center gap-2.5 text-gray-300">
                                {isImg ? (
                                  <ImageIcon size={16} className="text-terminal-yellow" />
                                ) : (
                                  <FileCode size={16} className="text-gray-500" />
                                )}
                                {item.name}
                              </span>
                              <span className="text-[11px] text-gray-500">
                                {(item.size / 1024).toFixed(1)} KB
                              </span>
                            </button>
                          );
                        })}
                      </div>
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