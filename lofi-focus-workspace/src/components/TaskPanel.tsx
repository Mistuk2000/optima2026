import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export default function TaskPanel() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focus-tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('focus-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask.trim(),
      completed: false
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = () => {
    if (!editText.trim()) return;
    setTasks(tasks.map(t => t.id === editingId ? { ...t, text: editText.trim() } : t));
    setEditingId(null);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 flex flex-col h-full shadow-2xl">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-light tracking-tight text-white mb-1">Focus Tasks</h2>
          <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">
            {completedCount} of {tasks.length} Completed
          </p>
        </div>
      </div>

      <form onSubmit={addTask} className="relative mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What are you focusing on?"
          className="w-full bg-zinc-800/50 border border-zinc-700 rounded-2xl py-4 pl-6 pr-14 text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 bottom-2 px-4 bg-white text-black rounded-xl hover:bg-zinc-200 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "group flex items-center p-4 rounded-2xl border transition-all duration-300",
                task.completed 
                  ? "bg-zinc-900/30 border-zinc-800/50 opacity-60" 
                  : "bg-zinc-800/30 border-zinc-700/50 hover:border-zinc-600"
              )}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  "mr-4 transition-colors",
                  task.completed ? "text-orange-500" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                {task.completed ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>

              {editingId === task.id ? (
                <div className="flex-1 flex items-center space-x-2">
                  <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="flex-1 bg-transparent border-b border-orange-500 text-white focus:outline-none py-1"
                  />
                  <button onClick={saveEdit} className="text-green-500 hover:text-green-400">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className={cn(
                  "flex-1 text-sm font-medium transition-all",
                  task.completed ? "text-zinc-500 line-through" : "text-zinc-200"
                )}>
                  {task.text}
                </span>
              )}

              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(task)}
                  className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
            <p className="text-sm italic">Your focus list is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}
