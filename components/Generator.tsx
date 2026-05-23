'use client';

import React, { useState } from 'react';
import { Sparkles, Library, Check, ChevronDown, ChevronUp, RefreshCw, Layers } from 'lucide-react';
import { cn } from '../lib/utils';
import { QUICK_MODS, QuickMod } from '../lib/quickMods';
import { VIDEO_STYLES } from '../lib/styles';

interface GeneratorProps {
  onGenerateScene: (prompt: string, selectedMods: string[], styleId: string, duration: number) => void;
  isGeneratingAny: boolean;
}

export default function Generator({ onGenerateScene, isGeneratingAny }: GeneratorProps) {
  const [naturalSpeak, setNaturalSpeak] = useState<string>('');
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('cinematic-noir');
  const [sceneDuration, setSceneDuration] = useState<number>(8); // default to 8 seconds
  const [isLibraryExpanded, setIsLibraryExpanded] = useState<boolean>(true); // DEFAULT EXPANDED ON SHUTDOWN LOAD

  const toggleModifier = (id: string) => {
    setSelectedMods((prev) => {
      if (prev.includes(id)) {
        return prev.filter((m) => m !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleCreate = () => {
    // Generate prompt from natural speak + selected modifiers descriptions
    const modDetails = selectedMods
      .map((mid) => QUICK_MODS.find((m) => m.id === mid))
      .filter((m) => !!m)
      .map((m) => m!.label)
      .join(', ');

    const combinedPrompt = [
      naturalSpeak.trim(),
      modDetails ? `[Modifiers: ${modDetails}]` : ''
    ]
      .filter(Boolean)
      .join(' ');

    onGenerateScene(
      combinedPrompt || 'Dynamic ambient footage of sequence outline',
      selectedMods,
      selectedStyleId,
      sceneDuration
    );

    // Clear input after generation
    setNaturalSpeak('');
  };

  // Preset modifiers combinations to click easily
  const selectQuickPreset = (count: number) => {
    // Pick first 'count' modifiers
    const selection = QUICK_MODS.slice(0, count).map((m) => m.id);
    setSelectedMods(selection);
  };

  return (
    <div id="ai-generator-panel" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="bg-neutral-950/80 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="font-display text-sm font-medium tracking-tight text-neutral-200">
            Director AI Prompt Engine
          </span>
        </div>
        <div className="text-[10px] text-neutral-500 font-mono">MODEL: GEMINI-2.5-FLASH</div>
      </div>

      <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[600px] sm:max-h-none">
        {/* Core Directives Prompt Text Box */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>NATURAL LANGUAGE DIRECTIONS (SPEECH BOX)</span>
            <span className="text-[10px] text-neutral-500">OPTIONAL DESCRIPTION</span>
          </label>
          <textarea
            value={naturalSpeak}
            onChange={(e) => setNaturalSpeak(e.target.value)}
            placeholder="Describe your scene in natural language (e.g. 'Drone shots sailing over misty sci-fi city skylines during dusk...')"
            className="w-full h-20 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none font-sans"
          />
        </div>

        {/* Quick Mods Library -- DEFAULT EXPANDED ON SHUTDOWN LOAD */}
        <div className="border border-neutral-800/80 rounded-lg overflow-hidden bg-neutral-950/50">
          <button
            onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
            className="w-full px-3 py-2 bg-neutral-950 hover:bg-neutral-900 transition flex items-center justify-between border-b border-neutral-800/50"
          >
            <div className="flex items-center gap-2 text-neutral-300">
              <Library className="w-4 h-4 text-orange-500" />
              <span className="font-display text-xs font-semibold tracking-wide">
                QUICK MODS LIBRARY (ACTIVE COMPOSITION)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-orange-600/10 text-orange-400 font-mono px-1.5 py-0.5 rounded border border-orange-500/20">
                REQUIRED SELECTION: 5-10 ITEMS
              </span>
              {isLibraryExpanded ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </div>
          </button>

          {isLibraryExpanded && (
            <div className="p-3 flex flex-col gap-3">
              {/* Instructions Banner */}
              <div className="p-2.5 bg-orange-950/20 border border-orange-500/15 rounded text-[11px] text-orange-400 font-sans leading-relaxed">
                🚀 <strong>Cinematic Concept Design Plan:</strong> Please select <strong>5 to 10 options</strong> below to map out your overall video flow and conceptual plans, or write them out in natural speech in the textbox above!
              </div>

              {/* Quick helper picker buttons */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 font-mono">SELECTED: ({selectedMods.length}/10 MODS)</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => selectQuickPreset(6)}
                    className="text-[9px] bg-neutral-900 text-neutral-400 hover:text-white px-2 py-0.5 rounded border border-neutral-800 transition"
                  >
                    Select 6 Combo
                  </button>
                  <button
                    onClick={() => selectQuickPreset(9)}
                    className="text-[9px] bg-neutral-900 text-neutral-400 hover:text-white px-2 py-0.5 rounded border border-neutral-800 transition"
                  >
                    Select 9 Combo
                  </button>
                  <button
                    onClick={() => setSelectedMods([])}
                    className="text-[9px] bg-neutral-900 hover:bg-red-950/20 text-neutral-400 hover:text-red-400 px-2 py-0.5 rounded border border-neutral-800 hover:border-red-500/20 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Grid of Mods */}
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {QUICK_MODS.map((mod) => {
                  const isSelected = selectedMods.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => toggleModifier(mod.id)}
                      className={cn(
                        "p-2 rounded border text-left flex flex-col justify-between transition-all group relative overflow-hidden",
                        isSelected
                          ? "bg-orange-950/30 border-orange-500/50 text-white shadow-[0_0_8px_rgba(249,115,22,0.1)]"
                          : "bg-neutral-900/50 border-neutral-800/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                      )}
                      title={mod.description}
                    >
                      <div className="flex items-start justify-between w-full">
                        <span className="font-display font-medium text-[11px] leading-tight pr-1 group-hover:text-neutral-100 transition-colors">
                          {mod.label}
                        </span>
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        ) : (
                          <span className="text-[8px] uppercase font-mono text-neutral-600 group-hover:text-neutral-400">
                            +{mod.category.split(' ')[0]}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[9px] opacity-70 line-clamp-1 mt-1 leading-tight">
                        {mod.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Cinematic Presets & Styling Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-neutral-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              CINEMATIC LUT COLORGRADE
            </label>
            <select
              value={selectedStyleId}
              onChange={(e) => setSelectedStyleId(e.target.value)}
              className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 font-sans"
            >
              {VIDEO_STYLES.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-neutral-400 flex items-center gap-1">
              <RefreshCw className={cn("w-3.5 h-3.5 text-neutral-500", isGeneratingAny && "animate-spin")} />
              CLIP EXPIRY / DURATION
            </label>
            <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5">
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={sceneDuration}
                onChange={(e) => setSceneDuration(parseInt(e.target.value))}
                className="w-full accent-orange-500 h-1"
              />
              <span className="font-mono text-xs text-neutral-300 shrink-0">
                {sceneDuration}s
              </span>
            </div>
          </div>
        </div>

        {/* Generate scene trigger block */}
        <button
          onClick={handleCreate}
          disabled={isGeneratingAny}
          className={cn(
            "w-full py-3 rounded-lg font-display text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2",
            isGeneratingAny
              ? "bg-neutral-950 border border-neutral-800 text-neutral-600 cursor-not-allowed"
              : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          )}
        >
          <Sparkles className="w-4 h-4 fill-current animate-pulse" />
          <span>Queue Generative Scene Draft</span>
        </button>
      </div>
    </div>
  );
}
