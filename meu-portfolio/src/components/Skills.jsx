import React from 'react';
import { motion } from 'framer-motion';
import { Database, Layout, Server, BarChart, Settings } from 'lucide-react';

export default function Skills() {
  const skillGroups = [
    {
      file: 'backend.sh',
      icon: <Server size={18} className="text-terminal-yellow" />,
      status: 'running',
      techs: ['Python', 'Java', 'Node.js', 'FastAPI', 'Flask', 'R'],
    },
    {
      file: 'frontend.jsx',
      icon: <Layout size={18} className="text-cyan-400" />,
      status: 'compiled',
      techs: ['React', 'TypeScript', 'JavaScript', 'Electron', 'HTML5/CSS3', 'PWA'],
    },
    {
      file: 'database.sql',
      icon: <Database size={18} className="text-blue-400" />,
      status: 'connected',
      techs: ['SQL Server', 'PostgreSQL', 'MySQL'],
    },
    {
      file: 'data_science.py',
      icon: <BarChart size={18} className="text-green-400" />,
      status: 'analyzing',
      techs: ['Pandas', 'NumPy', 'Power BI', 'ETL (Airbyte)', 'IA'],
    },
    {
      file: 'devops_tools.cfg',
      icon: <Settings size={18} className="text-gray-400" />,
      status: 'active',
      techs: ['Linux', 'Git/GitHub', 'Docker', 'VS Code / IntelliJ'],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="skills"
      className="py-20 bg-[#0a0d12]/60 text-gray-300 font-mono border-t border-gray-800 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl text-white font-bold flex items-center gap-3">
            <span className="text-terminal-green">{'>'}</span>
            <span>htop --user=riquelmy</span>
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Monitorizando processos e dependências ativas no cluster principal...
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {skillGroups.map((group, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg p-5 hover:border-gray-600 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-terminal-green/5 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

              <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-3">
                <h3 className="flex items-center gap-2 text-white font-bold">
                  {group.icon}
                  {group.file}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terminal-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-terminal-green" />
                  </span>
                  <span className="text-[10px] text-gray-500 uppercase">{group.status}</span>
                </div>
              </div>

              <ul className="space-y-3">
                {group.techs.map((tech, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-sm text-gray-400 group-hover:text-gray-300 transition-colors"
                  >
                    <span className="text-gray-700 font-bold">»</span>
                    {tech}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}