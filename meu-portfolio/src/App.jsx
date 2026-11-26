import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import GithubStats from './components/GithubStats';
import Projects from './components/Projects';
import Contact from './components/Contact';
import BootScreen from './components/BootScreen';
import CommandPalette from './components/CommandPalette';
import ParticleBackground from './components/ParticleBackground';
import ContactModal from './components/ContactModal';

function App() {
  const [booting, setBooting] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      {booting ? (
        <BootScreen onComplete={() => setBooting(false)} />
      ) : (
        <main className="min-h-screen bg-background selection:bg-terminal-green/30 selection:text-white relative">
          <ParticleBackground />
          <CommandPalette onOpenContact={() => setIsContactOpen(true)} />
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />

          <div className="relative z-10">
            <Navbar onOpenContact={() => setIsContactOpen(true)} />
            <Hero onOpenContact={() => setIsContactOpen(true)} />
            <About />
            <Skills />
            <GithubStats />
            <Projects />
            <Contact />
          </div>
        </main>
      )}
    </>
  );
}

export default App;