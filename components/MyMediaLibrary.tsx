import React, { useState } from 'react';
import { Play, Plus, Search, Video, Image as ImageIcon, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export interface LibraryItem {
  id: string;
  url: string;
  type: 'video' | 'image';
  fileName: string;
  duration: number;
  quality: 'HD' | 'SD';
  summary: string;
  tags: string[];
  favoriteTransition?: string;
}

interface MyMediaLibraryProps {
  items: LibraryItem[];
  onAddToStoryboard: (item: LibraryItem) => void;
}

export function MyMediaLibrary({ items, onAddToStoryboard }: MyMediaLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filtered = items.filter(item => 
    item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-600" />
          My Media Library
        </h3>
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, summary or #tags..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto pr-2 pb-2">
        {filtered.map(item => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={item.id}
          >
            <div
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify(item));
              }}
              className="group relative bg-gray-50 border border-gray-200 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors h-full"
            >
              {/* Thumbnail Area */}
              <div className="aspect-video bg-black relative">
                {item.type === 'video' ? (
                  <video src={item.url} className="w-full h-full object-cover opacity-80" />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.url} alt={`Preview of ${item.fileName}`} className="w-full h-full object-cover opacity-80" />
                )}
                
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className="px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium backdrop-blur-sm shadow-sm backdrop-saturate-150">
                    {item.quality}
                  </span>
                  {item.type === 'video' && (
                    <span className="px-1.5 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium backdrop-blur-sm shadow-sm">
                      {item.duration}s
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  {item.type === 'video' ? <Video className="w-3 h-3 text-white shadow-sm" /> : <ImageIcon className="w-3 h-3 text-white shadow-sm" />}
                </div>

                {/* Hover actions */}
                <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => onAddToStoryboard(item)}
                    className="bg-white text-indigo-600 rounded-full p-2 shadow-lg transform hover:scale-110 transition-transform"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info Area */}
              <div className="p-3 space-y-2">
                <p className="text-xs font-semibold text-gray-900 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                <p className="text-[10px] text-gray-500 line-clamp-2 leading-snug">
                  {item.summary}
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[9px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-md font-medium whitespace-nowrap">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-500 text-sm">
            No media found matching &quot;{searchTerm}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
