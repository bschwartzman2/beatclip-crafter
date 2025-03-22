
// This is a simplified beat detection algorithm for demonstration purposes.
// In a real application, you would use a more sophisticated algorithm or a third-party library.

export interface Beat {
  time: number; // Time in seconds
  intensity: number; // Normalized intensity (0-1)
}

export const detectBeats = (audioBuffer: AudioBuffer): Beat[] => {
  const beats: Beat[] = [];
  
  // Get audio data for analysis
  const channelData = audioBuffer.getChannelData(0); // Use first channel
  const bufferLength = channelData.length;
  
  // For simple beat detection, we'll look at energy changes in the signal
  // Split the audio into small segments for analysis
  const segmentSize = Math.floor(audioBuffer.sampleRate / 10); // 100ms segments
  const segments = Math.floor(bufferLength / segmentSize);
  
  // Calculate energy for each segment
  const energies: number[] = [];
  let maxEnergy = 0;
  
  for (let i = 0; i < segments; i++) {
    let energy = 0;
    const startSample = i * segmentSize;
    
    // Calculate RMS (root mean square) energy
    for (let j = 0; j < segmentSize; j++) {
      if (startSample + j < bufferLength) {
        energy += channelData[startSample + j] ** 2;
      }
    }
    
    energy = Math.sqrt(energy / segmentSize);
    energies.push(energy);
    maxEnergy = Math.max(maxEnergy, energy);
  }
  
  // Normalize energies
  const normalizedEnergies = energies.map(e => e / maxEnergy);
  
  // Detect beats based on energy spikes
  // We use a simple threshold-based approach here
  const threshold = 0.3;
  const minBeatInterval = 3; // Minimum frames between beats
  let lastBeatFrame = -minBeatInterval;
  
  for (let i = 1; i < segments - 1; i++) {
    // Check if this segment has significantly more energy than previous
    // and is above our threshold
    if (normalizedEnergies[i] > threshold && 
        normalizedEnergies[i] > normalizedEnergies[i-1] * 1.2 &&
        i - lastBeatFrame >= minBeatInterval) {
      
      const time = i * segmentSize / audioBuffer.sampleRate;
      beats.push({
        time,
        intensity: normalizedEnergies[i]
      });
      
      lastBeatFrame = i;
    }
  }
  
  return beats;
};

// Utility function to convert an audio file to AudioBuffer
export const audioFileToBuffer = async (file: File): Promise<AudioBuffer> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  return await audioContext.decodeAudioData(arrayBuffer);
};

// Mock function for demonstration when we don't have actual audio files
export const generateMockBeats = (duration: number, bpm = 120): Beat[] => {
  const beats: Beat[] = [];
  const beatInterval = 60 / bpm; // Time between beats in seconds
  
  // Generate beats for the entire duration
  let time = 0;
  while (time < duration) {
    // Add some natural variation to intensity and timing
    const intensity = 0.5 + Math.random() * 0.5;
    
    beats.push({
      time,
      intensity
    });
    
    // Add slight timing variations to feel more natural
    time += beatInterval * (0.95 + Math.random() * 0.1);
  }
  
  return beats;
};
