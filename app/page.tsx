'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Film, Info, HelpCircle, Sparkles, RefreshCw, Layers, Compass, Zap, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';
import VideoPlayer from '../components/VideoPlayer';
import Generator from '../components/Generator';
import Storyboard from '../components/Storyboard';
import { LOADING_TIPS, LoadingTip } from '../lib/loadingTips';

export interface SceneClip {
  id: string;
  title: string;
  duration: number;
  prompt: string;
  styleId: string;
  imageSeed: string;
  isGenerating?: boolean;
  progress?: number;
}

const DEFAULT_CLIPS: SceneClip[] = [
  {
    id: 'clip-1',
    title: 'Scene 1: Neon Haze',
    duration: 8,
    prompt: 'Drone sweep zooming gracefully across neon cyberpunk towers in fuchsia rain',
    styleId: 'cyberpunk-neon',
    imageSeed: 'cyber',
    isGenerating: false,
    progress: 100,
  },
  {
    id: 'clip-2',
    title: 'Scene 2: Mirror Gaze',
    duration: 10,
    prompt: 'Intense tight close-up of a pilot wearing mercury visor goggles reflecting solar flare grids',
    styleId: 'cinematic-noir',
    imageSeed: 'noir',
    isGenerating: false,
    progress: 100,
  },
  {
    id: 'clip-3',
    title: 'Scene 3: Golden Scraps',
    duration: 12,
    prompt: 'Breathtaking low crane shot panning rusty starship hulls at sunrise with dust motes floating',
    styleId: 'warm-vintage',
    imageSeed: 'vintage',
    isGenerating: false,
    progress: 100,
  },
];

export default function Home() {
  // App states
  const [clips, setClips] = useState<SceneClip[]>(DEFAULT_CLIPS);
  const [activeClipId, setActiveClipId] = useState<string | null>('clip-1');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playTime, setPlayTime] = useState<number>(0);
  
  // Loading screen states
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(true); // SHOW INITIAL LOADER FOR 2 SECONDS FOR AI CALIBRATION
  const [loadingTime, setLoadingTime] = useState<number>(3); // customized simulated loading length in secs
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);

  // Periodic rotation of tips inside the loading screen
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showLoadingScreen) {
      interval = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [showLoadingScreen]);

  // Turn off initial loading screen after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingScreen(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Playback timer ticker
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const updatePlayTime = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTime) / 1000;
        setPlayTime((prev) => {
          const totalDuration = clips.reduce((acc, c) => acc + c.duration, 0);
          const nextVal = prev + delta;
          if (nextVal >= totalDuration) {
            setIsPlaying(false);
            return 0; // reset
          }
          return nextVal;
        });
      }
      lastTime = now;
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(updatePlayTime);
      }
    };

    if (isPlaying) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(updatePlayTime);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, clips]);

  // Map absolute playTime to find which Scene is currently active on Screen
  useEffect(() => {
    if (clips.length === 0) {
      setActiveClipId(null);
      return;
    }
    let accumulated = 0;
    let found = false;
    for (const clip of clips) {
      if (playTime >= accumulated && playTime < accumulated + clip.duration) {
        setActiveClipId(clip.id);
        found = true;
        break;
      }
      accumulated += clip.duration;
    }
    // Fallback margin safety
    if (!found && clips.length > 0) {
      setActiveClipId(clips[0].id);
    }
  }, [playTime, clips]);

  const activeClip = clips.find((c) => c.id === activeClipId) || clips[0] || null;
  const totalDuration = clips.reduce((sum, c) => sum + c.duration, 0);

  // Select a specific scene from the timeline. Seek playhead to its start offset.
  const handleSelectClip = (id: string) => {
    setActiveClipId(id);
    let offset = 0;
    for (const clip of clips) {
      if (clip.id === id) {
        break;
      }
      offset += clip.duration;
    }
    setPlayTime(offset);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setPlayTime(0);
    if (clips.length > 0) {
      setActiveClipId(clips[0].id);
    }
  };

  const handleScrubTime = (targetSecs: number) => {
    setPlayTime(targetSecs);
  };

  // Reorder clips & update playhead accordingly
  const handleReorderClips = (reordered: SceneClip[]) => {
    setClips(reordered);
    // Seek to start of rebuilt track
    setPlayTime(0);
    if (reordered.length > 0) {
      setActiveClipId(reordered[0].id);
    }
  };

  // Delete clip from track
  const handleDeleteClip = (id: string) => {
    const updated = clips.filter((c) => c.id !== id);
    setClips(updated);
    if (activeClipId === id) {
      setActiveClipId(updated[0]?.id || null);
    }
    setPlayTime(0);
  };

  // Generate Scene simulated trigger
  const handleGenerateScene = (prompt: string, selectedMods: string[], styleId: string, duration: number) => {
    const newId = `clip-${Date.now()}`;
    const newSceneIndex = clips.length + 1;
    const newClip: SceneClip = {
      id: newId,
      title: `Scene ${newSceneIndex}: Gen Draft`,
      duration: duration,
      prompt: prompt || 'Abstract visual flow gradient motion',
      styleId: styleId,
      imageSeed: Math.random().toString(36).substring(7),
      isGenerating: true,
      progress: 0,
    };

    setClips((prev) => [...prev, newClip]);
    setActiveClipId(newId);

    // Simulated progress interval for the clip's generation sequence
    let currentPrg = 0;
    const interval = setInterval(() => {
      currentPrg += 20;
      setClips((prev) =>
        prev.map((c) => {
          if (c.id === newId) {
            return {
              ...c,
              progress: currentPrg,
              isGenerating: currentPrg < 100,
            };
          }
          return c;
        })
      );

      if (currentPrg >= 100) {
        clearInterval(interval);
      }
    }, 800);
  };

  // Add dummy placeholder
  const handleAddClipPlaceholder = () => {
    const descriptors = [
      'Glitchy tracking camera across wireframe terminals',
      'Wide angle dolly back on futuristic capsule door',
      'Warm optical focus of retro synthesizer knobs turning',
      'Atmospheric shadow silhouette walking down dark corridor'
    ];
    const randDesc = descriptors[Math.floor(Math.random() * descriptors.length)];
    const styles = ['cinematic-noir', 'cyberpunk-neon', 'warm-vintage', 'editorial-fade', 'scifi-hologram'];
    const randStyle = styles[Math.floor(Math.random() * styles.length)];
    
    handleGenerateScene(randDesc, [], randStyle, 6);
  };

  // Progress calculations for project assembling bar
  const totalClips = clips.length;
  const completedClips = clips.filter((c) => !c.isGenerating).length;
  const clipsAssembledPercent = totalClips > 0 ? Math.round((completedClips / totalClips) * 100) : 0;
  const generatingClip = clips.find((c) => c.isGenerating);

  // Trigger loading screen manually for export simulation
  const triggerManualExportLoading = () => {
    setIsPlaying(false);
    setShowLoadingScreen(true);
    setTimeout(() => {
      setShowLoadingScreen(false);
    }, loadingTime * 1000);
  };

  return (
    <div className="relative min-h-screen bg-neutral-950 flex flex-col justify-between overflow-x-hidden font-sans select-none">
      
      {/* 1. Segmented Project Progress bar at very top */}
      <div id="project-assembly-status-bar" className="bg-neutral-900/90 border-b border-neutral-800/80 sticky top-0 z-40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-col md:flex-row md:items-center justify-between gap-2">
          
          {/* Metadata progress labels */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-mono text-[10px] text-orange-400 bg-orange-950/25 px-2 py-0.5 rounded border border-orange-500/15">
              <Cpu className="w-3.5 h-3.5 animate-spin" />
              DIRECTOR DISPATCH PIPELINE
            </span>
            <span className="font-display font-semibold text-xs text-neutral-300">
              Project Overall assembly: <strong className="text-orange-500 font-mono">{clipsAssembledPercent}%</strong>
            </span>
            <span className="text-[10px] text-neutral-500 hidden md:inline">
              ({completedClips} / {totalClips} Storyboards Complete)
            </span>
          </div>

          {/* Real-time individual queue status clips segments */}
          <div className="flex flex-1 max-w-lg items-center gap-1 h-3.5 bg-neutral-950 rounded-md p-0.5 border border-neutral-800 shrink-0">
            {clips.map((clip, i) => (
              <div
                key={clip.id}
                className={cn(
                  "h-full rounded-sm transition-all duration-300 relative group flex-1",
                  clip.isGenerating
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse"
                    : "bg-emerald-500/80"
                )}
                title={`${clip.title}: ${clip.isGenerating ? `Baking (${clip.progress}%)` : 'Ready'}`}
              >
                {/* Embedded progress bar block on the segment */}
                {clip.isGenerating && (
                  <div
                    className="absolute inset-y-0 left-0 bg-white opacity-40 transition-all duration-300"
                    style={{ width: `${clip.progress}%` }}
                  />
                )}
                {/* Floating tool tips */}
                <span className="opacity-0 group-hover:opacity-100 transition absolute bottom-5 left-1/2 -translate-x-1/2 bg-black text-[9px] font-mono text-neutral-200 px-1.5 py-0.5 rounded border border-neutral-700 pointer-events-none whitespace-nowrap z-50">
                  {clip.title} - {clip.isGenerating ? `Generating (${clip.progress}%)` : 'Ready'}
                </span>
              </div>
            ))}
          </div>

          {/* Micro triggers */}
          <div className="flex items-center gap-3">
            {generatingClip && (
              <span className="font-mono text-[9px] text-orange-400 animate-pulse flex items-center gap-1 shrink-0">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                Rendering {generatingClip.title} ({generatingClip.progress}%)
              </span>
            )}
            <button
              onClick={triggerManualExportLoading}
              className="text-[10px] font-mono font-medium hover:text-white bg-neutral-800 hover:bg-neutral-700 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700 transition"
              title="Simulate video export loading sequence"
            >
              Export Assembly
            </button>
          </div>

        </div>
      </div>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 flex flex-col gap-5 justify-between">
        
        {/* Core Title Info bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-neutral-900 pb-3 gap-3">
          <div className="flex items-center gap-3">
            <div id="company-logo" className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-600 to-amber-500 flex items-center justify-center font-bold text-lg text-white shadow-lg">
              ∞
            </div>
            <div>
              <h1 className="font-display font-medium text-lg leading-tight tracking-tight text-white flex items-center gap-2">
                InfiniteReel Storyboard Studio
              </h1>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest">
                Professional Audio-Visual Orchestrator console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
              <span className="w-2 h-2 bg-green-500 rounded-full shrink-0" />
              PORT 3000 DEV ACTIVE
            </div>
          </div>
        </div>

        {/* Video Player & Generator Column Dual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Main Visual Monitor (Left span-7) */}
          <div className="lg:col-span-7 flex flex-col h-full">
            <VideoPlayer
              activeClip={activeClip}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onReset={handleResetPlayback}
              playTime={playTime}
              totalDuration={totalDuration}
              onScrub={handleScrubTime}
            />
          </div>

          {/* AI Prompt Engine Input (Right span-5) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <Generator
              onGenerateScene={handleGenerateScene}
              isGeneratingAny={!!generatingClip}
            />
          </div>
        </div>

        {/* Storyboard track timeline area */}
        <div id="timeline-layout-tray" className="w-full">
          <Storyboard
            clips={clips}
            activeClipId={activeClipId}
            onSelectClip={handleSelectClip}
            onReorderClips={handleReorderClips}
            onDeleteClip={handleDeleteClip}
            onAddClipPlaceholder={handleAddClipPlaceholder}
          />
        </div>

      </main>

      {/* Aesthetic Footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-3.5 mt-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-neutral-500 font-mono gap-2">
          <span>© 2026 INFINITEREEL CORPORATION. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-300 transition">TERMS</a>
            <a href="#" className="hover:text-neutral-300 transition">API DOCS</a>
            <a href="#" className="hover:text-neutral-300 transition">SUPPORT PIPELINE</a>
          </div>
        </div>
      </footer>

      {/* 2. Interactive Transition Loader overlay */}
      {showLoadingScreen && (
        <div
          id="transitional-loader-overlay"
          className="fixed inset-0 bg-neutral-950/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 ease-in-out"
        >
          {/* Aesthetic Scanner Ring frame */}
          <div className="relative h-24 w-24 mb-6 flex items-center justify-center">
            {/* outer running pulse circle */}
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
            {/* middle reversing ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-amber-500/30 animate-[spin_4s_linear_infinite_reverse]" />
            {/* core emblem logo */}
            <Film className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>

          {/* Status headings */}
          <span className="font-mono text-[10px] text-orange-500 uppercase tracking-widest font-semibold mb-1">
            Rebuilding active composition matrices
          </span>
          <h3 className="font-display font-medium text-lg text-white mb-6">
            Compiling Video Assembly Project...
          </h3>

          {/* Rotating tip board */}
          <div className="max-w-md w-full bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 shadow-xl relative overflow-hidden backdrop-blur">
            {/* Top Badge */}
            <div className="absolute top-3 right-3">
              <span className="text-[9px] font-mono text-orange-400 bg-orange-950/50 border border-orange-500/20 px-2 py-0.5 rounded">
                ⚡ {LOADING_TIPS[currentTipIndex].badge}
              </span>
            </div>

            {/* Content text */}
            <div className="text-left">
              <span className="font-mono text-[9px] text-neutral-500 block uppercase mb-1">
                INFINITEREEL TIPS & ABILITIES
              </span>
              <h4 className="font-display font-medium text-sm text-neutral-200 mb-1.5">
                {LOADING_TIPS[currentTipIndex].title}
              </h4>
              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                {LOADING_TIPS[currentTipIndex].description}
              </p>
            </div>

            {/* Bottom dots switcher indicators */}
            <div className="flex gap-1.5 mt-4 justify-center">
              {LOADING_TIPS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    i === currentTipIndex ? "bg-orange-500 w-3" : "bg-neutral-800"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Loading controls indicator */}
          <div className="mt-8 flex items-center gap-2 font-mono text-[10px] text-neutral-500">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>CALIBRATING AUDIOKEY GRAPE LUT NODES...</span>
          </div>

        </div>
      )}

    </div>
  );
}
