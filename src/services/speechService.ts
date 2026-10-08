import { Language } from '../types';

export interface SpeechRecognitionResultType {
  transcript: string;
  isFinal: boolean;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private recognition: any = null;
  public isRecognitionSupported: boolean = false;
  public isTtsSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.isTtsSupported = true;
      }

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.isRecognitionSupported = true;
      }
    }
  }

  public speak(text: string, lang: Language): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth) {
        resolve();
        return;
      }

      // Cancel ongoing speech
      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower, easy to understand for rural farmers
      utterance.pitch = 1.0;

      const targetLang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      utterance.lang = targetLang;

      // Try finding appropriate voice
      const voices = this.synth.getVoices();
      const matchedVoice = voices.find((v) =>
        lang === 'ta'
          ? v.lang.toLowerCase().startsWith('ta')
          : v.lang.toLowerCase().includes('en-in') || v.lang.toLowerCase().startsWith('en')
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public startListening(
    lang: Language,
    onResult: (transcript: string) => void,
    onError: (err: any) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser');
      return false;
    }

    try {
      this.recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      
      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        onError(event.error);
      };

      this.recognition.onend = () => {
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e) {
      onError(e);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
    }
  }
}

export const speechService = new SpeechService();
