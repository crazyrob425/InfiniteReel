'use client';

import React, { useState } from 'react';
import { Film, Trash2, GripVertical, Clock, PlayCircle, Loader2, Sparkles } from 'lucide-react';
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
  progress?: number;
  shotType?: string;
  cameraAction?: string;
  actionNotes?: string;
  dialogueLine?: string;
}

interface StoryboardProps {
  clips: SceneClip[];
  activeClipId: string | null;
  onSelectClip: (id: string) => void;
  onReorderClips: (clips: SceneClip[]) => void;
  onDeleteClip: (id: string) => void;
  onAddClipPlaceholder: () => void;
}

export default function Storyboard({
  clips,
  activeClipId,
  onSelectClip,
  onReorderClips,
  onDeleteClip,
  onAddClipPlaceholder,
}: StoryboardProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [hoveredTargetIndex, setHoveredTargetIndex] = useState<number | null>(null);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Standard visual feedback setting
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setHoveredTargetIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setHoveredTargetIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    // Do reordering
    const items = [...clips];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    onReorderClips(items);
    setDraggedIndex(null);
    setHoveredTargetIndex(null);
  };

  // Convert seconds to readable format
  const formatSecs = (secs: number) => `${secs}s`;

  return (
    <div id="storyboard-timeline-pane" className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl flex flex-col w-full">
      {/* Title Header */}
      <div className="bg-neutral-950/80 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-orange-500" />
          <span className="font-display text-sm font-semibold tracking-tight text-neutral-200">
            InfiniteReel Storyboard Studio Timeline
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-[11px] font-mono text-neutral-500 uppercase flex items-center gap-1.5">
            <span>DRAG & DROP TO ARRANGE STORY</span>
          </div>
          <button
            onClick={onAddClipPlaceholder}
            className="text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1 rounded-md border border-neutral-700 transition flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-orange-400" />
            Add Mock Scene
          </button>
        </div>
      </div>

      {/* Main Track Runway */}
      <div className="p-4 bg-neutral-950/40 min-h-[170px] overflow-x-auto overflow-y-hidden flex items-center gap-3 select-none scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {clips.length > 0 ? (
          clips.map((clip, index) => {
            const isActive = clip.id === activeClipId;
            const itemStyle = VIDEO_STYLES.find((s) => s.id === clip.styleId);
            const isDraggingThis = index === draggedIndex;
            const isHoveredTarget = index === hoveredTargetIndex;

            return (
              <React.Fragment key={clip.id}>
                {/* Visual spacer indicator insert before elements during drag over */}
                {isHoveredTarget && draggedIndex !== null && index < draggedIndex && (
                  <div className="w-1.5 bg-orange-500 rounded h-28 shrink-0 transition-all duration-300 animate-pulse shadow-[0_0_10px_#f97316]" />
                )}

                {/* Card structure */}
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => onSelectClip(clip.id)}
                  className={cn(
                    "w-48 bg-neutral-900 border rounded-lg shrink-0 flex flex-col justify-between overflow-hidden cursor-grab transition-all duration-300",
                    isActive
                      ? "border-orange-500 ring-1 ring-orange-500/20 bg-neutral-900 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                      : "border-neutral-800 hover:border-neutral-700",
                    isDraggingThis ? "opacity-30 border-dashed border-orange-500 scale-95" : "opacity-100 scale-100"
                  )}
                >
                  {/* Aspect Preview Thumbnail block */}
                  <div className="h-16 relative bg-neutral-950 flex items-center justify-center p-3">
                    {/* Style-colored backdrop */}
                    <div
                      className={cn("absolute inset-0 opacity-40 transition-all", itemStyle?.filterClass)}
                      style={{ background: itemStyle?.gradient }}
                    />
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_90%,rgba(0,0,0,0.4)_90%)] bg-[length:100%_8px]" />

                    {/* Left details */}
                    <div className="relative z-10 w-full h-full flex flex-col justify-between">
                      <div className="flex justify-between items-start font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                        <span>{clip.title}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-neutral-500" />
                          <span>{formatSecs(clip.duration)}</span>
                        </div>
                      </div>

                      {/* Playback Indicators */}
                      <div className="flex items-center justify-between">
                        {isActive ? (
                          <span className="flex items-center gap-1 font-mono text-[9px] text-orange-400">
                            <PlayCircle className="w-3.5 h-3.5 animate-pulse shrink-0 fill-orange-500/20" />
                            Active Monitor
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-neutral-600 group-hover:text-neutral-400">Select clip</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Body textual directions */}
                  <div className="p-2.5 border-t border-neutral-800 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-sans text-[10px] text-neutral-400 line-clamp-2 italic h-[2.5rem] mb-1.5">
                        &ldquo;{clip.prompt}&rdquo;
                      </p>
                      {/* Interactive meta indicators */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {clip.shotType && (
                          <span className="text-[8px] font-mono px-1 py-0.5 bg-neutral-950 border border-neutral-850 rounded text-neutral-400">
                            {clip.shotType.split(' ').slice(0, 2).join(' ')}
                          </span>
                        )}
                        {clip.dialogueLine && (
                          <span className="text-[8px] font-mono px-1 py-0.5 bg-amber-950/20 border border-amber-900/20 rounded text-amber-500" title={clip.dialogueLine}>
                            💬 VOICE
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status node */}
                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-neutral-800/60 w-full">
                      <div className="flex items-center gap-1">
                        {clip.isGenerating ? (
                          <>
                            <Loader2 className="w-3 h-3 text-orange-500 animate-spin shrink-0" />
                            <span className="font-mono text-[8px] text-orange-400 animate-pulse">Rendering ({clip.progress || 0}%)</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
                            <span className="font-mono text-[8px] text-emerald-500 uppercase">Completed</span>
                          </>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClip(clip.id);
                        }}
                        className="text-neutral-500 hover:text-red-400 p-1 rounded hover:bg-neutral-800 transition cursor-pointer"
                        title="Delete Scene Clip"
                      >
                        <Trash2 className="w-3 h-3 animate-none" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Visual spacer indicator insert after elements during drag over */}
                {isHoveredTarget && draggedIndex !== null && index > draggedIndex && (
                  <div className="w-1.5 bg-orange-500 rounded h-28 shrink-0 transition-all duration-300 animate-pulse shadow-[0_0_10px_#f97316]" />
                )}
              </React.Fragment>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center justify-center p-8 text-center text-neutral-500">
            <Film className="w-8 h-8 text-neutral-700 mb-2 animate-pulse" />
            <span className="font-display text-xs text-neutral-400">Timeline Runway Empty</span>
            <p className="font-sans text-[10px] text-neutral-600 mt-0.5">Queue a scene draft on the prompt engine above to compose your storyboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
