'use client';

import React, { useState } from 'react';
import { Sparkles, Library, Check, ChevronDown, ChevronUp, RefreshCw, Layers, Cpu, Film, Zap, Music } from 'lucide-react';
import { cn } from '../lib/utils';
import { QUICK_MODS, QuickMod } from '../lib/quickMods';
import { VIDEO_STYLES } from '../lib/styles';

interface GeneratorProps {
  onGenerateScene: (prompt: string, selectedMods: string[], styleId: string, duration: number) => void;
  onGenerateStoryboardSeries: (concept: string) => Promise<void>;
  isGeneratingAny: boolean;
}

export default function Generator({ onGenerateScene, isGeneratingAny, onGenerateStoryboardSeries }: GeneratorProps) {
  // Tabs: "single" or "multi"
  const [activeTab, setActiveTab] = useState<'single' | 'multi'>('single');
  
  // Prompt states
  const [naturalSpeak, setNaturalSpeak] = useState<string>('');
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('cinematic-noir');
  const [sceneDuration, setSceneDuration] = useState<number>(8); // default to 8 seconds
  const [isLibraryExpanded, setIsLibraryExpanded] = useState<boolean>(true); // DEFAULT EXPANDED ON SHUTDOWN LOAD

  // AI Storyboard Series States
  const [conceptInput, setConceptInput] = useState<string>('');
  const [isGeneratingSeries, setIsGeneratingSeries] = useState<boolean>(false);

  // Single scene prompt enhancer states
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  // Enhance prompt with AI camera paths, textures and compositions
  const handleEnhancePrompt = async () => {
    if (!naturalSpeak.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/gemini/storyboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'enhance_prompt',
          prompt: naturalSpeak,
        }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setNaturalSpeak(data.enhancedText);
      }
    } catch (e) {
      console.error("Failed to enhance prompt:", e);
    } finally {
      setIsEnhancing(false);
    }
  };

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

  // Generate a multi-scene professional series story sequence using Gemini
  const handleCreateSeries = async () => {
    if (!conceptInput.trim()) return;
    setIsGeneratingSeries(true);
    try {
      await onGenerateStoryboardSeries(conceptInput);
      setConceptInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSeries(false);
    }
  };

  return (
    <div id="ai-generator-panel" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header Tabs */}
      <div className="bg-neutral-950/90 border-b border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between">
        <div className="flex border-b sm:border-b-0 border-neutral-800">
          <button
            onClick={() => setActiveTab('single')}
            className={cn(
              "px-4 py-3 font-display text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer",
              activeTab === 'single'
                ? "text-orange-400 border-b-2 border-orange-500 bg-neutral-900/50"
                : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
            Single Scene
          </button>
          <button
            onClick={() => setActiveTab('multi')}
            className={cn(
              "px-4 py-3 font-display text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 focus:outline-none cursor-pointer",
              activeTab === 'multi'
                ? "text-orange-400 border-b-2 border-orange-500 bg-neutral-900/50"
                : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            <Film className="w-3.5 h-3.5 text-amber-500" />
            AI Core Director (Full Story)
          </button>
        </div>
        <div className="px-4 py-2 text-[10px] text-neutral-500 font-mono self-center">
          MODEL: GEMINI-3.5-FLASH
        </div>
      </div>

      {activeTab === 'single' ? (
        <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[600px] sm:max-h-none flex-1">
          {/* Core Directives Prompt Text Box */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
              <span>NATURAL LANGUAGE SCENE DIRECTION</span>
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !naturalSpeak.trim()}
                className={cn(
                  "text-[10px] uppercase font-mono px-2 py-0.5 rounded border flex items-center gap-1.5 transition-all",
                  naturalSpeak.trim()
                    ? "bg-orange-950/30 border-orange-500/30 text-orange-400 hover:bg-orange-500/20 cursor-pointer"
                    : "bg-neutral-950 border-neutral-800 text-neutral-600 cursor-not-allowed"
                )}
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    Baking...
                  </>
                ) : (
                  <>
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    AI Prompt Prep / Enhance
                  </>
                )}
              </button>
            </div>
            <textarea
              value={naturalSpeak}
              onChange={(e) => setNaturalSpeak(e.target.value)}
              placeholder="Describe your scene context (e.g., 'Medium tracking shot following a dusty robot walking down a rusty hangar bay under golden solar light...')"
              className="w-full h-20 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none font-sans"
            />
          </div>

          {/* Quick Mods Library -- DEFAULT EXPANDED ON SHUTDOWN LOAD */}
          <div className="border border-neutral-800/80 rounded-lg overflow-hidden bg-neutral-950/50">
            <button
              onClick={() => setIsLibraryExpanded(!isLibraryExpanded)}
              className="w-full px-3 py-2 bg-neutral-950 hover:bg-neutral-900 transition flex items-center justify-between border-b border-neutral-800/50 cursor-pointer"
            >
              <div className="flex items-center gap-2 text-neutral-300">
                <Library className="w-4 h-4 text-orange-500" />
                <span className="font-display text-xs font-semibold tracking-wide">
                  QUICK MODS LIBRARY (ACTIVE COMPOSITION)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-orange-600/10 text-orange-400 font-mono px-1.5 py-0.5 rounded border border-orange-500/20">
                  REFINED MODIFIERS
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
                      className="text-[9px] bg-neutral-900 text-neutral-400 hover:text-white px-2 py-0.5 rounded border border-neutral-800 transition cursor-pointer"
                    >
                      Select 6 Combo
                    </button>
                    <button
                      onClick={() => selectQuickPreset(9)}
                      className="text-[9px] bg-neutral-900 text-neutral-400 hover:text-white px-2 py-0.5 rounded border border-neutral-800 transition cursor-pointer"
                    >
                      Select 9 Combo
                    </button>
                    <button
                      onClick={() => setSelectedMods([])}
                      className="text-[9px] bg-neutral-900 hover:bg-red-950/20 text-neutral-400 hover:text-red-400 px-2 py-0.5 rounded border border-neutral-800 hover:border-red-500/20 transition cursor-pointer"
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
                          "p-2 rounded border text-left flex flex-col justify-between transition-all group relative overflow-hidden cursor-pointer",
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
                  className="w-full accent-orange-500 h-1 cursor-pointer"
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
              "w-full py-3 rounded-lg font-display text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 mt-auto",
              isGeneratingAny
                ? "bg-neutral-950 border border-neutral-800 text-neutral-600 cursor-not-allowed"
                : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            )}
          >
            <Sparkles className="w-4 h-4 fill-current animate-pulse" />
            <span>Queue Generative Scene Draft</span>
          </button>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
          {/* AI Storyboard Sequencer mode instructions */}
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-850 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Cpu className="w-4 h-4 text-orange-500" />
              <span className="font-display text-xs font-semibold uppercase">AI Cinematic Scriptboard Sequencing</span>
            </div>
            <p className="font-sans text-[11px] text-neutral-400 leading-relaxed">
              Input a single concept or narrative line below. Our AI Director will split it into a <strong>highly cohesive 4-scene Hollywood storyboard project</strong>—automatically configuring lighting grades, dramatic action lines, camera movement parameters, and dialogue lines!
            </p>
          </div>

          {/* Concept Input Textarea */}
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-xs font-mono text-neutral-400 uppercase tracking-wider block">
              Global story concept or script logline
            </label>
            <textarea
              value={conceptInput}
              onChange={(e) => setConceptInput(e.target.value)}
              placeholder="e.g., 'A cyberpunk detective tracking a ghost hacker in deep rainy alleys under hologram sights'"
              className="w-full h-28 px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300 placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-orange-500/50 focus:border-orange-500/50 resize-none font-sans flex-1 min-h-[100px]"
            />
          </div>

          {/* Generate 4-Scene Project Button */}
          <button
            onClick={handleCreateSeries}
            disabled={isGeneratingSeries || !conceptInput.trim()}
            className={cn(
              "w-full py-3.5 rounded-lg font-display text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2",
              isGeneratingSeries || !conceptInput.trim()
                ? "bg-neutral-950 border border-neutral-800 text-neutral-600 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-amber-500 hover:from-violet-500 hover:to-amber-400 text-white hover:shadow-[0_0_20px_rgba(109,40,217,0.3)] transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            )}
          >
            {isGeneratingSeries ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
                <span>Baking 4-Scene Project (Gemini)</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4 text-amber-400 fill-current animate-pulse" />
                <span>Sequence Full AI Storyboard</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
