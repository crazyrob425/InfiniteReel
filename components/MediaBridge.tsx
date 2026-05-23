'use client';

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileVideo, ImageIcon, Plus, Music } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MediaBridgeProps {
  onMediaUpload: (scenes: any[]) => void;
  onAudioUpload?: (url: string, name: string) => void;
}

export function MediaBridge({ onMediaUpload, onAudioUpload }: MediaBridgeProps) {
  const onDrop = (acceptedFiles: File[]) => {
    const audioFile = acceptedFiles.find(f => f.type.startsWith('audio/'));
    if (audioFile && onAudioUpload) {
        onAudioUpload(URL.createObjectURL(audioFile), audioFile.name);
    }

    const mediaFiles = acceptedFiles.filter(f => !f.type.startsWith('audio/'));
    const newScenes = mediaFiles.map(file => {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);
      
      return {
        id: uuidv4(),
        prompt: `Uploaded ${isVideo ? 'video' : 'image'}: ${file.name}`,
        duration: isVideo ? 5 : 3, // Default durations
        status: 'completed',
        videoUrl: isVideo ? url : undefined,
        previewUrl: isVideo ? undefined : url,
        isUpload: true,
        fileName: file.name,
        // For uploaded images, we'll eventually want to "animate" them
        // For uploaded videos, they are ready
      };
    });
    
    onMediaUpload(newScenes);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi'],
      'image/*': ['.png', '.jpg', '.jpeg', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a']
    },
    multiple: true
  });

  return (
    <div 
      {...getRootProps()} 
      className={`relative group h-32 border-2 border-dashed rounded-2xl transition-all flex flex-col items-center justify-center p-4 cursor-pointer
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'}`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 pointer-events-none">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full">
          <Upload className="w-5 h-5" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700">
            {isDragActive ? 'Drop files here...' : 'Bulk Media & Audio Importer'}
          </p>
          <p className="text-xs text-gray-400">Drag & drop multiple videos, images, and a background track</p>
        </div>
      </div>
      
      {/* Subtle indicator for what's supported */}
      <div className="absolute bottom-2 right-2 flex gap-2 overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity">
        <FileVideo className="w-4 h-4" />
        <ImageIcon className="w-4 h-4" />
        <Music className="w-4 h-4" />
      </div>
    </div>
  );
}
