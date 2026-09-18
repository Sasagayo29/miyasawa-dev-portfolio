import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import BootScreen from './components/BootScreen';

function App() {
  const [booting, setBooting] = useState(true);

  return (
    <>
      {booting ? (
        <BootScreen onComplete={() => setBooting(false)} />
      ) : (
        <main className="min-h-screen bg-background selection:bg-terminal-green/30 selection:text-white animate-fade-in">
          <Navbar />
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </main>
      )}
    </>
  );
}

export default App;