import { useEffect } from 'react';

interface NotificationSoundProps {
  enabled: boolean;
  volume?: number;
}

export const NotificationSound: React.FC<NotificationSoundProps> = ({ 
  enabled = true, 
  volume = 0.3 
}) => {
  useEffect(() => {
    if (!enabled) return;

    // Create audio context for notification sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    const playNotificationSound = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create a simple pleasant notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configuration for a gentle notification sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };

    // Expose function globally for use by notification hooks
    (window as any).playNotificationSound = playNotificationSound;

    return () => {
      (window as any).playNotificationSound = null;
    };
  }, [enabled, volume]);

  return null;
};