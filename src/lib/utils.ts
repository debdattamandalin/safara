import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let sharedAudioCtx: AudioContext | null = null;

export function initAudio() {
  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume();
    }
    // Play a silent brief sound to unlock
    const osc = sharedAudioCtx.createOscillator();
    const gain = sharedAudioCtx.createGain();
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(sharedAudioCtx.destination);
    osc.start();
    osc.stop(sharedAudioCtx.currentTime + 0.1);
  } catch (e) {
    console.warn("Audio init failed", e);
  }
}

export function playSiren() {
  try {
    if ((window as any)._sosSirenCtx) return; // already playing
    
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    sharedAudioCtx.resume(); 

    const oscillator = sharedAudioCtx.createOscillator();
    const gainNode = sharedAudioCtx.createGain();

    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(sharedAudioCtx.destination);
    gainNode.gain.setValueAtTime(1, sharedAudioCtx.currentTime);

    const sweep = () => {
      if (sharedAudioCtx!.state === 'closed') return;
      oscillator.frequency.setValueAtTime(400, sharedAudioCtx!.currentTime);
      oscillator.frequency.linearRampToValueAtTime(800, sharedAudioCtx!.currentTime + 1);
      oscillator.frequency.linearRampToValueAtTime(400, sharedAudioCtx!.currentTime + 2);
    };
    
    sweep();
    const interval = setInterval(sweep, 2000);
    oscillator.start();
    
    (window as any)._sosSirenCtx = oscillator; // store oscillator to stop it later
    (window as any)._sosSirenInterval = interval;
  } catch(e) {
    console.error("Audio API not supported or failed to start", e);
  }
}

export function stopSiren() {
  if ((window as any)._sosSirenCtx) {
    try {
      ((window as any)._sosSirenCtx as OscillatorNode).stop();
      ((window as any)._sosSirenCtx as OscillatorNode).disconnect();
    } catch(e) {}
    (window as any)._sosSirenCtx = null;
  }
  if ((window as any)._sosSirenInterval) {
    clearInterval((window as any)._sosSirenInterval);
    (window as any)._sosSirenInterval = null;
  }
}


