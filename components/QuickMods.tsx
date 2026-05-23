'use client';

import React, { useState } from 'react';
import { SUGGESTIONS, SuggestionItem } from '@/lib/suggestions';
import { ChevronDown, ChevronUp, Sparkles, Video, Settings2, Lightbulb, Music, Zap, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuickModsProps {
  onSelect: (label: string) => void;
}

const CATEGORY_MAP: Record<string, { label: string, icon: React.ReactNode, color: string }> = {
  camera: { label: 'Camera & Angles', icon: <Video className="w-3 h-3" />, color: 'bg-amber-100 text-amber-700' },
  lighting: { label: 'Lighting & Mood', icon: <Sparkles className="w-3 h-3" />, color: 'bg-yellow-100 text-yellow-700' },
  mod: { label: 'Visual Style Mods', icon: <Settings2 className="w-3 h-3" />, color: 'bg-blue-100 text-blue-700' },
  lipsync: { label: 'Lip Sync & Vocal', icon: <Music className="w-3 h-3" />, color: 'bg-pink-100 text-pink-700' },
  transition: { label: 'Transitions', icon: <LayoutTemplate className="w-3 h-3" />, color: 'bg-emerald-100 text-emerald-700' },
  motion: { label: 'Motion & Tempo', icon: <Zap className="w-3 h-3" />, color: 'bg-cyan-100 text-cyan-700' },
  vfx: { label: 'VFX & Particles', icon: <Sparkles className="w-3 h-3" />, color: 'bg-purple-100 text-purple-700' },
  idea: { label: 'Concepts & Ideas', icon: <Lightbulb className="w-3 h-3" />, color: 'bg-violet-100 text-violet-700' },
};

export function QuickMods({ onSelect }: QuickModsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('camera');

  const categories = Array.from(new Set(SUGGESTIONS.map(s => s.type))).filter(type => type !== 'keyword');

  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors"
      >
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          Quick Mods Library ({SUGGESTIONS.length}+)
        </span>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200"
          >
             <div className="flex overflow-x-auto p-2 gap-2 border-b border-gray-100 scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[10px] font-semibold flex items-center gap-1.5 transition-all ${
                      activeCategory === cat 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {CATEGORY_MAP[cat]?.icon}
                    {CATEGORY_MAP[cat]?.label || cat}
                  </button>
                ))}
            </div>
            
            <div className="p-3 max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.filter(s => s.type === activeCategory).map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSelect(s.label)}
                    title={s.description}
                    className="group flex flex-col items-start px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                  >
                    <span className="text-xs font-semibold text-gray-800 group-hover:text-indigo-700">
                      + {s.label}
                    </span>
                    {s.description && (
                      <span className="text-[9px] text-gray-400 group-hover:text-indigo-500 mt-0.5 max-w-[200px] truncate">
                        {s.description}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
