import React from 'react';

export default function Skills() {
  const skillGroups = [
    {
      file: "frontend.jsx",
      techs: ["React", "Vite", "Angular", "TypeScript", "Tailwind CSS", "PWA (Offline-first)"]
    },
    {
      file: "backend.py",
      techs: ["Python", "FastAPI", "Flask", "Node.js", "Integrações Corporativas"]
    },
    {
      file: "desktop_mobile.exe",
      techs: ["PySide6", "CustomTkinter", "Electron", "React Native"]
    },
    {
      file: "dados_infra.sql",
      techs: ["SQL Server", "PostgreSQL", "Power BI", "Pandas", "Docker", "Git"]
    }
  ];

  return (
    <section className="py-20 bg-[#0a0d12] text-gray-300 font-mono border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        
        <h2 className="text-2xl md:text-3xl text-white font-bold mb-10 flex items-center gap-3">
          <span className="text-terminal-green">{">"}</span> 
          <span>tree ./skills</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillGroups.map((group, index) => (
            <div key={index} className="bg-surface border border-gray-800 rounded p-5">
              <h3 className="text-terminal-yellow mb-4 border-b border-gray-800 pb-2">
                <span className="text-gray-500">📄</span> {group.file}
              </h3>
              <ul className="space-y-3">
                {group.techs.map((tech, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-gray-600">├──</span> {tech}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}