export interface BeatData {
  bpm: number;
  peaks: number[];
}

export async function analyzeBeats(audioUrl: string): Promise<BeatData> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  const channelData = audioBuffer.getChannelData(0);
  const sampleRate = audioBuffer.sampleRate;
  
  // Very simple peak detection
  const threshold = 0.8;
  const peaks: number[] = [];
  
  for (let i = 0; i < channelData.length; i += sampleRate / 10) { // Check every 0.1s
    if (Math.abs(channelData[Math.round(i)]) > threshold) {
      peaks.push(i / sampleRate);
    }
  }

  // Estimate BPM (simplified)
  const bpm = peaks.length > 0 ? (peaks.length / (audioBuffer.duration / 60)) : 120;

  return {
    bpm: Math.round(bpm),
    peaks
  };
}

export function syncClipsToBeats(scenes: any[], beatData: BeatData) {
  // Distribute scene durations to match peaks if possible
  // Or just set to average beat interval
  const beatInterval = 60 / beatData.bpm;
  
  return scenes.map(s => ({
    ...s,
    duration: Math.max(1, Math.round(beatInterval * 4)) // 1 bar (4 beats) per clip
  }));
}
