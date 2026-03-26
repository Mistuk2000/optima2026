import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(25);
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          handleTimerComplete();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Audible alert
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audio.play().catch(e => console.log('Audio play blocked', e));

    if (mode === 'work') {
      setSessions(s => s + 1);
      setMode('break');
      setMinutes(0);
      setSeconds(5);
    } else {
      setMode('work');
      setMinutes(0);
      setSeconds(25);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setMinutes(0);
    setSeconds(25);
  };

  const progress = mode === 'work' 
    ? ((25 - (minutes * 60 + seconds)) / 25) * 100
    : ((5 - (minutes * 60 + seconds)) / 5) * 100;

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center space-y-6 shadow-2xl">
      <div className="flex items-center space-x-2 mb-2">
        {mode === 'work' ? (
          <Brain className="w-5 h-5 text-orange-500" />
        ) : (
          <Coffee className="w-5 h-5 text-blue-400" />
        )}
        <span className={cn(
          "text-xs font-bold uppercase tracking-widest",
          mode === 'work' ? "text-orange-500" : "text-blue-400"
        )}>
          {mode === 'work' ? 'Focus Session' : 'Short Break'}
        </span>
      </div>

      <div className="relative flex items-center justify-center w-48 h-48">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-zinc-800"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="552.92"
            initial={{ strokeDashoffset: 552.92 }}
            animate={{ strokeDashoffset: 552.92 - (552.92 * progress) / 100 }}
            transition={{ duration: 0.5, ease: "linear" }}
            className={cn(
              mode === 'work' ? "text-orange-500" : "text-blue-400"
            )}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-5xl font-light tracking-tighter text-white font-mono">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTimer}
          className={cn(
            "p-4 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95",
            isActive 
              ? "bg-zinc-800 text-white hover:bg-zinc-700" 
              : "bg-white text-black hover:bg-zinc-200"
          )}
        >
          {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
        </button>
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all duration-300"
        >
          <RotateCcw className="w-6 h-6" />
        </button>
      </div>

      <div className="pt-4 border-t border-zinc-800 w-full flex justify-between items-center px-4">
        <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Sessions</span>
        <span className="text-white font-mono text-sm">{sessions}</span>
      </div>
    </div>
  );
}
