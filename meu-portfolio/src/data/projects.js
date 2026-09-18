export const projects = {
  featured: [
    {
      id: "maprix",
      title: "MAPRIX Enterprise",
      description: "Hub de monitoramento de frota com geofencing, checklists digitais com evidência fotográfica, dashboards de BI e aplicativo mobile com operação offline.",
      techStack: ["Python", "Flask", "PostgreSQL", "PWA"],
      category: "Destaque"
    },
    {
      id: "mineflow",
      title: "MineFlow",
      description: "Sistema enterprise para chão de mina com funcionamento offline-first, IA integrada e gestão de ativos via QR Code em áreas sem conectividade.",
      techStack: ["React", "Offline-first", "IA", "Mobile"],
      category: "Destaque"
    },
    {
      id: "kad",
      title: "KAD (Kinross AD Asset & Identity Console)",
      description: "Console unificado (Desktop e Mobile) para gestão de identidades e ativos de TI, com integração direta ao ERP Senior/Vetorh e Active Directory.",
      techStack: ["PySide6", "React", "FastAPI", "WinRM"],
      category: "Destaque"
    },
    {
      id: "movimex",
      title: "MoviMeX",
      description: "PWA offline-first baseado em IndexedDB para rastreamento de ativos, com leitura nativa de código de barras e impressão em campo via Bluetooth.",
      techStack: ["React", "IndexedDB", "Bluetooth", "PWA"],
      category: "Destaque"
    }
  ],
  categories: [
    {
      name: "Automação & RPA",
      items: [
        { title: "kbot", tech: ["Python", "Playwright", "CustomTkinter"], desc: "RPA para entradas de medição no JD Edwards." },
        { title: "DataFiscal", tech: ["Python", "XML", "PDF"], desc: "Processamento em lote de NF-e e DANFES, reduzindo rotinas de 3h para 30s." },
        { title: "Integração Checklist Fácil", tech: ["Python", "APIs"], desc: "Integração corporativa de formulários e checklists operacionais." },
        { title: "WhatsApp Sender", tech: ["Python", "Selenium", "Tkinter"], desc: "Automação de disparo de mensagens via planilhas." }
      ]
    },
    {
      name: "Governança & Dados",
      items: [
        { title: "WMS Industrial", tech: ["Angular", "FastAPI", "QR Code"], desc: "Gestão de armazém com visão financeira e rastreabilidade total." },
        { title: "Maprix FuelOps", tech: ["Engenharia de Dados", "SQL"], desc: "Auditoria milimétrica de consumo de diesel cruzando medições com sistemas de alarme." },
        { title: "DataOps", tech: ["Python", "BI", "SQLite"], desc: "Hub central de auditoria de ativos industriais e disparo de gargalos." },
        { title: "K-Radio Tracker 2.0", tech: ["Python", "Flask", "SQL"], desc: "Rastreabilidade completa de rádios comunicadores industriais." }
      ]
    },
    {
      name: "Ferramentas & IA",
      items: [
        { title: "DocMind", tech: ["Python", "Fuzzy Matching", "IA"], desc: "Triagem cognitiva e roteamento automático de PDFs complexos." },
        { title: "API do Chatbot (Blip)", tech: ["Docker", "Python", "SQL Server"], desc: "API containerizada de alta disponibilidade para autoatendimento via WhatsApp." },
        { title: "GitWizard", tech: ["PySide6", "Python"], desc: "Interface gráfica avançada para gerenciamento de repositórios Git." }
      ]
    },
    {
      name: "Visão Computacional & Outros",
      items: [
        { title: "SafeShift Monitor", tech: ["Python", "OpenCV", "dlib"], desc: "Monitoramento de fadiga e distração de motoristas por visão computacional." },
        { title: "RPG Multiplayer", tech: ["Flask", "SocketIO", "JS"], desc: "Plataforma web educacional em tempo real." }
      ]
    }
  ]
};