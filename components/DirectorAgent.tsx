'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, X, MessageSquare, Wand2, Film, Check, Settings2 } from 'lucide-react';

interface DirectorAgentProps {
  isOpen: boolean;
  onClose: () => void;
  sceneA: any;
  sceneB: any;
  onTransitionUpdate: (transitionMetadata: any) => void;
}

export function DirectorAgent({ isOpen, onClose, sceneA, sceneB, onTransitionUpdate }: DirectorAgentProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen && messages.length === 0) {
      timeout = setTimeout(() => {
        setMessages([
          {
            role: 'assistant',
            content: `Director Agent here. I see we have two scenes to bridge:\n\n**Scene 1:** ${sceneA.prompt}\n**Scene 2:** ${sceneB.prompt}\n\nShould I craft a seamless cinematic flow or a Hollywood-style high-end transition between these? Just describe the "feel" you want.`
          }
        ]);
      }, 0);
    }
    return () => clearTimeout(timeout);
  }, [isOpen, sceneA, sceneB, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const callFreeLLM = async (prompt: string) => {
    try {
      // Using Pollinations Text API (reverse-engineered/proxy style as requested)
      const res = await fetch(`https://text.pollinations.ai/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a Hollywood Master Video Editor Agent. Your job is to describe professional transitions in technical detail. Provide a JSON block at the end with "type", "duration", and "description".' },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: prompt }
          ],
          model: 'openai', // Pollinations maps this to an open model
          jsonMode: true
        })
      });

      if (!res.ok) {
        // Fallback to simpler GET if POST is restricted
        const getRes = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}?system=${encodeURIComponent("You are a video editor agent. Be concise.")}`);
        return await getRes.text();
      }

      const data = await res.json();
      return data.choices[0].message.content;
    } catch (err) {
      console.error('Free LLM failed:', err);
      return "I'm having trouble connecting to the editing suite. Let's try a standard cinematic cross-dissolve.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const response = await callFreeLLM(input);
    
    // Parse transition metadata if present (simplified parsing for demo)
    let metadata = { type: 'fade', duration: 1, description: 'Cinematic Crossfade' } as any;
    if (response.includes('{')) {
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          metadata = { ...metadata, ...parsed };
        }
      } catch (e) {}
    }

    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
    
    // Update the transition in the parent
    onTransitionUpdate({
        ...metadata,
        agentPrompt: input
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">Director Agent</h3>
                <p className="text-[10px] text-indigo-300 uppercase tracking-widest">Master Video Editor</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Banner */}
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 flex items-center gap-2 overflow-hidden">
            <Film className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <div className="text-[10px] text-indigo-700 truncate font-medium">
              Editing: Scene {sceneA.id.slice(0,4)} ➔ Scene {sceneB.id.slice(0,4)}
            </div>
          </div>

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-lg' 
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm border border-gray-100'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                </div>
              </div>
            ))}
            {isTyping && (
                <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 flex gap-1">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Suggest a transition style..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-indigo-500 text-sm resize-none h-20"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="absolute bottom-3 right-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
                <QuickChip label="Quick Glitch" onClick={() => setInput('Add a digital glitch data-moshing transition')} />
                <QuickChip label="Pan & Zoom" onClick={() => setInput('A seamless match-cut with a zoom out')} />
                <QuickChip label="Lip Sync" onClick={() => setInput('Sync the character mouth movements to the current audio track with facial mapping precision')} />
                <QuickChip label="Beat Sync" onClick={() => setInput('Map the clip movement speed and cuts to the audio peaks and BPM')} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickChip({ label, onClick }: { label: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="text-[9px] font-semibold uppercase tracking-wider px-2 py-1 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-full transition-colors text-gray-500"
        >
            {label}
        </button>
    )
}
