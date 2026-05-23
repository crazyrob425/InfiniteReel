'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, Film, Cpu, Compass, Sliders, Layers } from 'lucide-react';
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
  shotType?: string;
  cameraAction?: string;
  actionNotes?: string;
  dialogueLine?: string;
}

interface VideoPlayerProps {
  activeClip: SceneClip | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  playTime: number; // current playback time in seconds
  totalDuration: number;
  onScrub: (time: number) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
}

export default function VideoPlayer({
  activeClip,
  isPlaying,
  onTogglePlay,
  onReset,
  playTime,
  totalDuration,
  onScrub,
  aspectRatio,
  setAspectRatio,
}: VideoPlayerProps) {
  const [eqHeights, setEqHeights] = useState<number[]>([15, 30, 20, 45, 10, 28, 40, 18, 35, 22]);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<any[]>([]);

  // Soundscape synthesizers for professional production vibes
  const startSynth = (styleId: string) => {
    stopSynth();
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master Gain for safe audio levels
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthNodesRef.current.push(masterGain);

      if (styleId === 'cyberpunk-neon') {
        // low rapid square bass rhythm
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65.41, ctx.currentTime); // C2

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(6, ctx.currentTime); // rapid sweep pulse
        lfoGain.gain.setValueAtTime(140, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        osc.connect(filter);
        filter.connect(masterGain);

        osc.start();
        lfo.start();
        synthNodesRef.current.push(osc, lfo, lfoGain, filter);
      } else if (styleId === 'cinematic-noir') {
        // deep dark dramatic drone and slow oscillation
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(48.99, ctx.currentTime); // G1
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(49.2, ctx.currentTime); // slightly detuned

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(90, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        synthNodesRef.current.push(osc1, osc2, filter);
      } else if (styleId === 'warm-vintage') {
        // cozy nostalgic drone & vinyl static generator
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, ctx.currentTime); // A2

        // Create high pass buffer click track dynamically for organic dust noise
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() < 0.00018 ? (Math.random() * 2 - 1) * 0.35 : 0;
        }
        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        osc.connect(masterGain);
        noiseSource.connect(masterGain);

        osc.start();
        noiseSource.start();
        synthNodesRef.current.push(osc, noiseSource);
      } else if (styleId === 'scifi-hologram') {
        // electric sweeps & futuristic telemetry bleeps
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5 hertz bleeps

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.setValueAtTime(4, ctx.currentTime);

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(1.5, ctx.currentTime); 
        lfoGain.gain.setValueAtTime(180, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        osc.connect(filter);
        filter.connect(masterGain);

        osc.start();
        lfo.start();
        synthNodesRef.current.push(osc, lfo, lfoGain, filter);
      } else {
        // editorial fade - warm ambient choral tone
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(164.81, ctx.currentTime); // E3 (major third)

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(masterGain);

        osc1.start();
        osc2.start();
        synthNodesRef.current.push(osc1, osc2, filter);
      }
    } catch (e) {
      console.warn("Web Audio engine delayed or blocked by sandbox:", e);
    }
  };

  const stopSynth = () => {
    synthNodesRef.current.forEach(node => {
      try { node.stop(); } catch(err){}
      try { node.disconnect(); } catch(err){}
    });
    synthNodesRef.current = [];
  };

  // Sync synth playback with playing states
  useEffect(() => {
    if (isPlaying && activeClip) {
      startSynth(activeClip.styleId);
    } else {
      stopSynth();
    }
    return () => stopSynth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, activeClip?.id, activeClip?.styleId, isMuted]);

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

  // Get responsive class based on aspect ratio chosen by operator
  const getAspectClass = () => {
    switch(aspectRatio) {
      case '21:9': return 'aspect-[21/9] w-full max-w-4xl';
      case '9:16': return 'aspect-[9/16] h-[360px] max-w-xs';
      case '1:1': return 'aspect-[1/1] w-full max-w-sm';
      default: return 'aspect-[16/9] w-full max-w-3xl';
    }
  };

  return (
    <div id="video-monitor-panel" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Panel Title */}
      <div className="bg-neutral-950/80 px-4 py-2.5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="font-display text-sm font-medium tracking-tight text-neutral-200">
            Active Cinema Monitor [Director Edit]
          </span>
        </div>
        
        {/* Aspect Ratio Switcher Controls */}
        <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 shrink-0">
          {['16:9', '21:9', '9:16', '1:1'].map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={cn(
                "px-2 py-0.5 text-[9px] font-mono rounded transition-colors uppercase",
                aspectRatio === ratio 
                  ? "bg-orange-600/20 text-orange-400 border border-orange-500/30" 
                  : "text-neutral-500 hover:text-neutral-300"
              )}
              title={`Switch output grid to ${ratio}`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Monitor Display Screen Frame with centered content */}
      <div className="relative flex-1 bg-neutral-950 overflow-hidden flex items-center justify-center p-4 min-h-[340px]">
        {activeClip ? (
          <div className={cn("relative transition-all duration-500 overflow-hidden rounded-lg shadow-black/80 shadow-2xl flex flex-col justify-between p-4", getAspectClass())}>
            {/* Visual Canvas matching Preset Filter */}
            <div
              className={cn(
                "absolute inset-0 w-full h-full transition-all duration-700 select-none ease-in-out opacity-85",
                activeStyle?.filterClass
              )}
              style={{
                background: activeStyle?.gradient,
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.92)',
              }}
            />

            {/* Scanning Scanlines Effect */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.5))] mix-blend-overlay" />
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0.012)_50%,rgba(0,0,0,0.09)_50%)] bg-[length:100%_4px]" />

            {/* Active HUD Overlays */}
            {/* HUD Top bar */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="font-mono text-[9px] text-emerald-400 bg-black/70 px-2 py-0.5 rounded backdrop-blur border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
                REC ● {isPlaying ? "LIVE" : "PAUSED"}
              </div>
              <div className="font-mono text-[9px] text-neutral-400 bg-black/70 px-2 py-0.5 rounded backdrop-blur border border-neutral-800">
                LENS {activeClip.styleId.toUpperCase()}
              </div>
            </div>

            {/* Screen Center Alert for Generation */}
            {activeClip.isGenerating && (
              <div className="relative z-10 self-center flex flex-col items-center gap-1.5 bg-neutral-950/90 px-4 py-3 rounded border border-orange-500/20 backdrop-blur max-w-xs text-center shadow-2xl">
                <Cpu className="w-5 h-5 text-orange-500 animate-spin" />
                <span className="font-display font-medium text-[11px] text-orange-400">Rendering Scene Elements...</span>
                <p className="font-sans text-[9px] text-neutral-400">Baking frame sequences, color gradings, and acoustic waves...</p>
              </div>
            )}

            {/* Actor Dialogue / Voiceover Subtitles */}
            {!activeClip.isGenerating && activeClip.dialogueLine && (
              <div className="relative z-10 bg-black/75 px-3 py-1.5 rounded-md border border-neutral-800/40 max-w-[85%] mx-auto text-center backdrop-blur-sm self-center my-2 transform hover:scale-105 transition-transform duration-300">
                <p className="font-sans text-[11px] font-medium text-amber-300 tracking-tight leading-snug">
                  &ldquo;{activeClip.dialogueLine}&rdquo;
                </p>
                <span className="text-[7px] text-neutral-500 font-mono tracking-widest uppercase block mt-0.5">AUDIO VOICEOVER SYNC</span>
              </div>
            )}

            {/* Prompt HUD overlay at bottom of screen */}
            <div className="relative z-10 bg-black/80 px-3 py-2 rounded-md border border-neutral-800/60 backdrop-blur-sm flex flex-col gap-1 mt-auto">
              <div className="flex justify-between items-center text-[8px] font-mono">
                <span className="text-orange-400 uppercase tracking-widest font-bold">DIRECTIVES & TIMELINE INDEX</span>
                <span className="text-neutral-500">SEED: {activeClip.imageSeed}</span>
              </div>
              <p className="font-sans text-[10px] text-neutral-200 leading-normal italic">
                &ldquo;{activeClip.prompt}&rdquo;
              </p>
              
              {/* Camera metadata tags */}
              <div className="flex gap-2 mt-1 pt-1 border-t border-neutral-800/55 flex-wrap">
                {activeClip.shotType && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 bg-neutral-900 border border-neutral-800/50 text-neutral-300 rounded uppercase">
                    🎬 {activeClip.shotType}
                  </span>
                )}
                {activeClip.cameraAction && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 bg-neutral-900 border border-neutral-800/50 text-neutral-300 rounded uppercase">
                    🎥 {activeClip.cameraAction}
                  </span>
                )}
              </div>
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
          <span className="font-mono text-xs text-orange-500 font-semibold bg-orange-950/20 px-2 py-0.5 rounded border border-orange-500/20">
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
        <div className="flex items-center justify-between mt-1 grid grid-cols-1 sm:flex sm:flex-row gap-3">
          {/* Left Buttons: Play/Pause/Rewind */}
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <button
              onClick={onTogglePlay}
              disabled={!activeClip}
              className={cn(
                "p-2 rounded-lg transition-all border",
                activeClip
                  ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white cursor-pointer"
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
                  ? "bg-neutral-900 border-neutral-800 text-neutral-200 hover:bg-neutral-800 hover:text-white cursor-pointer"
                  : "bg-neutral-950 border-neutral-900 text-neutral-700 cursor-not-allowed"
              )}
              title="Reset Timecode"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Equalizer Visual Wave Generator */}
          <div className="flex items-end gap-0.5 h-6 px-4 bg-neutral-905/40 rounded-lg border border-neutral-800/40 select-none justify-center">
            <span className="font-mono text-[8px] text-neutral-500 uppercase self-center mr-2">Acoustic nodes</span>
            {eqHeights.map((h, i) => (
              <span
                key={i}
                className="w-1 bg-orange-500/80 rounded-t-sm transition-all duration-100"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          {/* Right Toolbar Buttons */}
          <div className="flex items-center gap-2 text-neutral-400 justify-center">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 rounded hover:bg-neutral-900 hover:text-white transition duration-200"
              title={isMuted ? "Unmute Synthesizer" : "Mute Synthesizer"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-orange-400" />}
            </button>
            <button className="p-1.5 rounded hover:bg-neutral-900 hover:text-white transition cursor-pointer">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Notes Side board */}
        {activeClip && activeClip.actionNotes && (
          <div className="mt-1.5 p-2 bg-neutral-900/50 border border-neutral-800/40 rounded flex flex-col gap-0.5">
            <span className="font-mono text-[8.5px] text-neutral-500 uppercase tracking-wider block">📋 DIRECTOR&apos;S DRAMATIC ACTION LINES</span>
            <p className="font-sans text-[10px] text-neutral-400 leading-normal italic">
              {activeClip.actionNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
