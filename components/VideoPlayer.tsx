'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Maximize, Film, Cpu, Compass } from 'lucide-react';
import { cn } from '../lib/utils';
import { VIDEO_STYLES } from '../lib/styles';

interface SceneClip {
  id: string;
  title: string;
  duration: number;
  prompt: string;
  styleId: string;
  imageSeed: string;
  isGenerating?: boolean;
}

interface VideoPlayerProps {
  activeClip: SceneClip | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playTime: number; // current playback time in seconds
  totalDuration: number;
  onScrub: (time: number) => void;
}

export default function VideoPlayer({
  activeClip,
  isPlaying,
  onTogglePlay,
  onReset,
  playTime,
  totalDuration,
  onScrub,
}: VideoPlayerProps) {
  const [eqHeights, setEqHeights] = useState<number[]>([15, 30, 20, 45, 10, 28, 40, 18, 35, 22]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate Equalizer bars when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setEqHeights(Array.from({ length: 14 }, () => Math.floor(Math.random() * 45) + 5));
      }, 100);
    } else {
      setEqHeights(Array.from({ length: 14 }, () => 6));
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeStyle = VIDEO_STYLES.find((s) => s.id === (activeClip?.styleId || 'cinematic-noir'));

  // Format time (MM:SS.CC)
  const formatTimecode = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const currentPercent = totalDuration > 0 ? (playTime / totalDuration) * 100 : 0;

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.min(Math.max(clickX / rect.width, 0), 1);
    onScrub(percent * totalDuration);
  };

  return (
    <div id="video-monitor-panel" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Panel Title */}
      <div className="bg-neutral-950/80 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="font-display text-sm font-medium tracking-tight text-neutral-200">
            Cinematic Preview Monitor
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span className="font-mono text-[10px] text-neutral-400">1080P PRO RES</span>
        </div>
      </div>

      {/* Monitor Display Screen */}
      <div className="relative flex-1 bg-black overflow-hidden flex items-center justify-center min-h-[300px]">
        {activeClip ? (
          <div className="w-full h-full relative flex flex-col justify-between p-4">
            {/* Visual Canvas matching Preset Filter */}
            <div
              className={cn(
                "absolute inset-0 w-full h-full transition-all duration-700 select-none ease-in-out opacity-85",
                activeStyle?.filterClass
              )}
              style={{
                background: activeStyle?.gradient,
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.9)',
              }}
            />

            {/* Scanning Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.4))] mix-blend-overlay" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.015)_50%,rgba(0,0,0,0.08)_50%)] bg-[length:100%_4px]" />

            {/* Active HUD Overlays */}
            {/* HUD Top bar */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="font-mono text-[11px] text-emerald-400 bg-black/50 px-2 py-1 rounded backdrop-blur border border-emerald-500/20">
                REC ● PLAYING
              </div>
              <div className="font-mono text-[11px] text-neutral-400 bg-black/50 px-2 py-1 rounded backdrop-blur border border-neutral-800">
                SCENE {activeClip.title.replace('Scene', '').trim()}
              </div>
            </div>

            {/* Screen Center Alert for Generation */}
            {activeClip.isGenerating && (
              <div className="relative z-10 self-center flex flex-col items-center gap-2 bg-neutral-950/85 px-6 py-4 rounded-lg border border-orange-500/30 backdrop-blur max-w-sm text-center">
                <Cpu className="w-7 h-7 text-orange-500 animate-spin" />
                <span className="font-display font-medium text-xs text-orange-400">Reconfiguring Scene Elements...</span>
                <p className="font-sans text-[10px] text-neutral-400">The director AI is baking high-fidelity color grading, audio nodes, and transition matrices for this layout.</p>
              </div>
            )}

            {/* Prompt HUD overlay at bottom of screen */}
            <div className="relative z-10 bg-black/60 px-4 py-2 rounded border border-neutral-800/40 backdrop-blur">
              <p className="font-mono text-[10px] text-orange-400 uppercase tracking-widest mb-0.5">CURRENT PROMPT DIRECTION</p>
              <p className="font-sans text-xs text-neutral-200 line-clamp-2 italic">
                &ldquo;{activeClip.prompt}&rdquo;
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center max-w-md select-none">
            <Compass className="w-10 h-10 text-neutral-600 mb-3 animate-pulse" />
            <span className="font-display font-medium text-sm text-neutral-300">Workspace Pipeline Idle</span>
            <p className="font-sans text-xs text-neutral-500 mt-1">
              Select or generate a scene clip to hook onto the preview monitor. Click the Quick Mods preset combos to initialize.
            </p>
          </div>
        )}
      </div>

      {/* Scrub Rulers & Time Slider */}
      <div className="bg-neutral-950 p-3 border-t border-neutral-800 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-orange-500 font-semibold">
            {formatTimecode(playTime)}
          </span>
          {/* Visual playhead markers */}
          <div className="flex gap-4 font-mono text-[9px] text-neutral-500 select-none">
            <span>00:00.00</span>
            <span>00:15.00</span>
            <span>00:30.00</span>
            <span>00:45.00</span>
            <span>01:00.00</span>
          </div>
          <span className="font-mono text-xs text-neutral-400">
            {formatTimecode(totalDuration)}
          </span>
        </div>

        {/* Playback Progress Scrubber Track */}
        <div
          ref={containerRef}
          onClick={handleProgressBarClick}
          className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden cursor-pointer relative group"
        >
          {/* Progress bar fill */}
          <div
            className="h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-75 relative"
            style={{ width: `${currentPercent}%` }}
          >
            {/* Glowing active glow tip */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_#fff]" />
          </div>
        </div>

        {/* Transport Toolbar Buttons */}
        <div className="flex items-center justify-between mt-1">
          {/* Left Buttons: Play/Pause/Rewind */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={onTogglePlay}
              disabled={!activeClip}
              className={cn(
                "p-2 rounded-lg transition-all border",
                activeClip
                  ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  : "bg-neutral-950 border-neutral-900 text-neutral-700 cursor-not-allowed"
              )}
              title={isPlaying ? "Pause" : "Play Clip Sequence"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={onReset}
              disabled={!activeClip}
              className={cn(
                "p-2 rounded-lg transition-all border",
                activeClip
                  ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white"
                  : "bg-neutral-950 border-neutral-900 text-neutral-700 cursor-not-allowed"
              )}
              title="Reset Timecode"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Equalizer Visual Wave Generator */}
          <div className="flex items-end gap-0.5 h-6 px-4 bg-neutral-900/50 rounded-lg border border-neutral-800/40 select-none">
            <span className="font-mono text-[8px] text-neutral-500 uppercase self-center mr-2">Audio Nodes</span>
            {eqHeights.map((h, i) => (
              <span
                key={i}
                className="w-1 bg-orange-500/80 rounded-t-sm transition-all duration-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* Right Toolbar Buttons */}
          <div className="flex items-center gap-1.5 text-neutral-400">
            <button className="p-1.5 rounded hover:bg-neutral-900 hover:text-white transition">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded hover:bg-neutral-900 hover:text-white transition">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
