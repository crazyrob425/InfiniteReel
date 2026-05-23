'use client';

import React, { useState } from 'react';
import { Sparkles, Activity, Link as LinkIcon, RefreshCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnalysisResult {
  overallPacing: string;
  narrativeFlow: string;
  transitions: Array<{
    sceneIndex: number;
    suggestion: string;
    reasoning: string;
    recommendedType: string;
  }>;
  improvements: string[];
}

interface TimelineAnalyzerProps {
  scenes: any[];
  onAnalyze: () => Promise<AnalysisResult>;
  onApplyTransition: (index: number, type: string) => void;
}

export function TimelineAnalyzer({ scenes, onAnalyze, onApplyTransition }: TimelineAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setIsOpen(true);
    try {
      const res = await onAnalyze();
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (scenes.length < 2) return null;

  return (
    <div className="bg-white rounded-xl border border-indigo-100 shadow-sm overflow-hidden mb-6">
      <div className="p-4 bg-indigo-50/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-indigo-900">AI Director&apos;s Sequence Analysis</h3>
        </div>
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {result ? 'Re-Analyze Sequence' : 'Analyze Flow'}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 border-t border-indigo-100 space-y-6">
              {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center py-8 text-indigo-500">
                  <RefreshCw className="w-8 h-8 animate-spin mb-4" />
                  <p className="font-medium animate-pulse">AI is reviewing timeline logic and blending options...</p>
                </div>
              ) : result ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Narrative Flow</h4>
                      <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50/30 p-3 rounded-lg border border-indigo-50">
                        {result.narrativeFlow}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Overall Pacing</h4>
                      <p className="text-sm text-gray-700 leading-relaxed bg-indigo-50/30 p-3 rounded-lg border border-indigo-50">
                        {result.overallPacing}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-green-500 mb-2">Suggested Improvements</h4>
                      <ul className="text-sm text-gray-700 space-y-2">
                        {result.improvements.map((imp, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-green-500 font-bold">•</span>
                            {imp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Transition Logic & Recommendations</h4>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {result.transitions.map((t, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:border-indigo-300 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                              Scene {t.sceneIndex + 1} <LinkIcon className="w-3 h-3 text-gray-400" /> Scene {t.sceneIndex + 2}
                            </div>
                            <button
                              onClick={() => onApplyTransition(t.sceneIndex, t.recommendedType)}
                              className="text-[10px] bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-2 py-1 rounded font-bold transition-colors"
                            >
                              Apply {t.recommendedType}
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mb-1"><strong>Logic:</strong> {t.reasoning}</p>
                          <p className="text-xs text-indigo-600 font-medium"><strong>Blending:</strong> {t.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
