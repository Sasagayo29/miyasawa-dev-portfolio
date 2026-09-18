import React, { useState } from 'react';
import { projects } from '../data/projects';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState(projects.categories[0].name);

  return (
    <section className="py-20 bg-background text-gray-300 font-mono border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Seção Destaques Corporativos */}
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3">
            <span className="text-terminal-green">{">"}</span> 
            <span>ls ./projetos/destaques</span>
            <span className="animate-pulse w-3 h-6 bg-terminal-green inline-block"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.featured.map((project) => (
              <div 
                key={project.id} 
                className="bg-surface border border-gray-800 rounded-lg p-6 hover:border-terminal-green/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all duration-300 group"
              >
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
                  {project.techStack.map((tech, index) => (
                    <span key={index} className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seção Categorias / Outros Projetos */}
        <div>
          <h2 className="text-2xl md:text-3xl text-white font-bold mb-8 flex items-center gap-3">
            <span className="text-terminal-green">{">"}</span> 
            <span>cat repos.json</span>
          </h2>

          {/* Abas de Navegação */}
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

          {/* Grid da Categoria Ativa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.categories
              .find((c) => c.name === activeCategory)
              ?.items.map((item, index) => (
                <div key={index} className="bg-[#0f141b] border border-gray-800 rounded p-5 hover:border-gray-600 transition-colors">
                  <h4 className="text-white font-bold mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-xs font-sans mb-4 min-h-[40px]">
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
          </div>
        </div>

      </div>
    </section>
  );
}