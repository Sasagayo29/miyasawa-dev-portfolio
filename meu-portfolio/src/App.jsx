import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import BootScreen from './components/BootScreen';
import CommandPalette from './components/CommandPalette';
import ParticleBackground from './components/ParticleBackground'; // Importar aqui

function App() {
  const [booting, setBooting] = useState(true);

  return (
    <>
      {booting ? (
        <BootScreen onComplete={() => setBooting(false)} />
      ) : (
        <main className="min-h-screen bg-background selection:bg-terminal-green/30 selection:text-white relative">
          
          {/* Adicionar o Fundo de Partículas aqui */}
          <ParticleBackground />
          
          <CommandPalette />
          
          {/* O conteúdo tem de ter z-index para ficar acima do canvas */}
          <div className="relative z-10">
            <Navbar />
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Contact />
          </div>
        </main>
      )}
    </>
  );
}

export default App;