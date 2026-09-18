import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ProjectModal({ project, isOpen, onClose }) {
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
            className="relative w-full max-w-3xl bg-surface border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
          >
            <div className="bg-[#0d1117] px-6 py-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <span className="text-terminal-green">~/</span>{project.title.toLowerCase().replace(/\s+/g, '-')}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto font-sans text-gray-300">
              <span className="inline-block text-xs text-terminal-yellow bg-terminal-yellow/10 px-2 py-1 rounded mb-4 font-mono">
                {project.category || 'Sistema'}
              </span>
              
              <h4 className="text-lg text-white font-semibold mb-3">Visão Geral</h4>
              <p className="leading-relaxed mb-6 text-gray-400">{project.description}</p>
              
              <h4 className="text-lg text-white font-semibold mb-3">Stack Tecnológica</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {project.techStack?.map((tech, index) => (
                  <span key={index} className="text-sm text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded border border-cyan-400/20 font-mono">
                    {tech}
                  </span>
                )) || project.tech?.map((tech, index) => (
                  <span key={index} className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}