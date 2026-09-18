import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import ProjectModal from './ProjectModal';

// Sub-componente para gerir o brilho individual de cada cartão
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
      {/* Camada do Brilho (Glow) */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-lg opacity-0 transition duration-300 group-hover:opacity-100 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(46, 160, 67, 0.15), transparent 40%)`
        }}
      />
      
      {/* Conteúdo do Cartão (z-10 para ficar acima do brilho) */}
      <div className="relative z-10 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-terminal-green transition-colors">
            {project.title}
          </h3>
          <span className="text-xs text-terminal-yellow bg-terminal-yellow/10 px-2 py-1 rounded">
            {project.category}
          </span>
        </div>
        <p className="text-gray-400 mb-6 text-sm font-sans leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-auto">
          {project.techStack?.map((tech, idx) => (
            <span key={idx} className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState(projects.categories[0].name);
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section id="projetos" className="py-20 bg-background text-gray-300 font-mono border-t border-gray-800 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3"
          >
            <span className="text-terminal-green">{">"}</span> 
            <span>ls ./projetos/destaques</span>
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.featured.map((project, idx) => (
              <GlowCard key={project.id} project={project} index={idx} onClick={setSelectedProject} />
            ))}
          </div>
        </div>

        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3"
          >
            <span className="text-terminal-green">{">"}</span> 
            <span>cat repos.json</span>
          </motion.h2>

          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-800 pb-4">
            {projects.categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  activeCategory === cat.name 
                    ? 'bg-terminal-green/10 text-terminal-green border border-terminal-green/30' 
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {projects.categories
              .find((c) => c.name === activeCategory)
              ?.items.map((item, index) => (
                <div 
                  key={index} 
                  onClick={() => setSelectedProject(item)}
                  className="bg-[#0f141b] border border-gray-800 rounded p-5 hover:border-gray-600 transition-colors cursor-pointer group"
                >
                  <h4 className="text-white font-bold mb-2 group-hover:text-terminal-green transition-colors">{item.title}</h4>
                  <p className="text-gray-500 text-xs font-sans mb-4 min-h-[40px] line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.tech.map((t, i) => (
                      <span key={i} className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
          </motion.div>
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