// Wrapper around Web Speech API (works inside Capacitor WebView on Android 6+)
// getUserMedia is called first so Chromium requests the RECORD_AUDIO runtime permission.

export class SpeechService {
  private recognition: any = null;
  private synth: SpeechSynthesis = window.speechSynthesis;
  private permissionGranted = false;

  private async ensureMicPermission(): Promise<void> {
    if (this.permissionGranted) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      this.permissionGranted = true;
    } catch (e) {
      throw new Error('Microphone permission denied. Please allow it from app settings.');
    }
  }

  listen(lang: string = 'en-IN'): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.ensureMicPermission();
      } catch (e: any) {
        return reject(e);
      }

      const SR: any =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SR) {
        return reject(new Error('Speech recognition not supported on this device.'));
      }
      const rec = new SR();
      this.recognition = rec;
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.continuous = false;

      let finished = false;
      const done = (fn: () => void) => { if (!finished) { finished = true; fn(); } };

      rec.onresult = (evt: any) => {
        const text = evt.results[0][0].transcript;
        done(() => resolve(text));
      };
      rec.onerror = (evt: any) => {
        const err = evt.error || 'unknown';
        done(() => reject(new Error(
          err === 'not-allowed' || err === 'service-not-allowed'
            ? 'Microphone permission denied. Please allow it from app settings.'
            : `Speech recognition error: ${err}`
        )));
      };
      rec.onend = () => done(() => resolve(''));

      try { rec.start(); }
      catch (e: any) { done(() => reject(new Error(e?.message || 'Failed to start recognition'))); }
    });
  }

  speak(text: string, lang: string = 'en-IN'): Promise<void> {
    return new Promise(resolve => {
      try { this.synth.cancel(); } catch {}
      const u = new SpeechSynthesisUtterance(text);
      u.lang = /[\u0900-\u097F]/.test(text) ? 'hi-IN' : lang;
      u.rate = 1.0;
      u.pitch = 0.9;
      u.volume = 1.0;
      // Prefer a male voice similar to JARVIS if available
      const voices = this.synth.getVoices();
      const preferred = voices.find(v => /male|david|daniel|google uk english male/i.test(v.name))
        || voices.find(v => v.lang.startsWith(u.lang.slice(0, 2)));
      if (preferred) u.voice = preferred;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      this.synth.speak(u);
    });
  }

  stop() {
    try { this.recognition?.stop(); } catch {}
    try { this.synth.cancel(); } catch {}
  }
}
