import React, { useEffect, useState } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import TaskPanel from './components/TaskPanel';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Sparkles, Layout, Zap } from 'lucide-react';

export default function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-400 font-sans selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black fill-current" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Focus OS</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-white leading-none">
              Deep <span className="italic font-serif">Work</span> Space
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center space-x-8"
          >
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Status</span>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-400 font-medium">System Active</span>
              </div>
            </div>
            <div className="h-10 w-px bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">Environment</span>
              <span className="text-xs text-zinc-400 font-medium italic">Lofi / Minimal</span>
            </div>
          </motion.div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Timer & Player */}
          <div className="lg:col-span-5 space-y-8">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <PomodoroTimer />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <MusicPlayer />
            </motion.section>
          </div>

          {/* Right Column: Tasks */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="lg:col-span-7 h-full min-h-[600px]"
          >
            <TaskPanel />
          </motion.section>
        </div>

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-bold">
          <div className="flex items-center space-x-4">
            <span>&copy; 2026 Focus Workspace</span>
            <span className="text-zinc-800">/</span>
            <span>All Systems Operational</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Support</a>
          </div>
        </footer>
      </main>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
