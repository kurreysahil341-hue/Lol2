import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GeminiService } from './services/gemini';
import { SystemAppLauncher } from './services/appLauncher';
import { SpeechService } from './services/speech';
import { StorageService } from './services/storage';
import { CommandParser } from './services/commandParser';
import ApiKeyModal from './components/ApiKeyModal';

type MsgKind = 'user' | 'jarvis' | 'error';
interface Msg { kind: MsgKind; text: string; time: string; }

const WAKE_WORDS = ['jarvis', 'जार्विस', 'hey jarvis', 'ok jarvis'];

export default function App() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<string>('OFFLINE');
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [ready, setReady] = useState(false);

  const speechRef = useRef<SpeechService | null>(null);
  const geminiRef = useRef<GeminiService | null>(null);
  const convRef = useRef<HTMLDivElement>(null);

  // --- init ---
  useEffect(() => {
    (async () => {
      const savedKey = await StorageService.get('gemini_api_key');
      if (savedKey) {
        setApiKey(savedKey);
        geminiRef.current = new GeminiService(savedKey);
        setStatus('READY — Tap arc reactor to speak');
        setReady(true);
      } else {
        setShowKeyModal(true);
        setStatus('API KEY REQUIRED');
      }
      speechRef.current = new SpeechService();
    })();
  }, []);

  useEffect(() => {
    if (convRef.current) convRef.current.scrollTop = convRef.current.scrollHeight;
  }, [messages]);

  const addMsg = useCallback((kind: MsgKind, text: string) => {
    const time = new Date().toLocaleTimeString();
    setMessages(prev => [...prev, { kind, text, time }]);
  }, []);

  // --- save API key ---
  const handleSaveKey = async (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) return;
    await StorageService.set('gemini_api_key', trimmed);
    setApiKey(trimmed);
    geminiRef.current = new GeminiService(trimmed);
    setShowKeyModal(false);
    setStatus('READY — Tap arc reactor to speak');
    setReady(true);
    addMsg('jarvis', 'Systems online, Sir. Gemini API connected. How may I assist you?');
    await speak('Systems online. How may I assist you?');
  };

  // --- speak ---
  const speak = async (text: string) => {
    setSpeaking(true);
    setStatus('SPEAKING...');
    try {
      await speechRef.current?.speak(text);
    } finally {
      setSpeaking(false);
      setStatus('READY — Tap arc reactor to speak');
    }
  };

  // --- listen and process ---
  const startListening = async () => {
    if (!ready || !geminiRef.current) {
      setShowKeyModal(true);
      return;
    }
    if (listening || speaking) return;

    setListening(true);
    setStatus('LISTENING...');
    try {
      const transcript = await speechRef.current!.listen();
      setListening(false);
      if (!transcript || !transcript.trim()) {
        setStatus('READY — Tap arc reactor to speak');
        return;
      }
      addMsg('user', transcript);
      await handleCommand(transcript);
    } catch (err: any) {
      setListening(false);
      const m = err?.message || 'Voice recognition failed';
      addMsg('error', m);
      setStatus('READY — Tap arc reactor to speak');
      if (m.includes('permission')) {
        await speak('Microphone permission is required, Sir.');
      }
    }
  };

  const handleCommand = async (raw: string) => {
    setStatus('PROCESSING...');
    // 1) Try to handle as a system command locally (offline, fast)
    const parsed = CommandParser.parse(raw);
    if (parsed) {
      try {
        const result = await SystemAppLauncher.execute(parsed);
        addMsg('jarvis', result.message);
        await speak(result.message);
        return;
      } catch (e: any) {
        addMsg('error', `Command failed: ${e?.message || e}`);
      }
    }

    // 2) Otherwise ask Gemini for a conversational reply
    try {
      const reply = await geminiRef.current!.chat(raw);
      addMsg('jarvis', reply);
      await speak(reply);
    } catch (err: any) {
      const msg = err?.message || 'AI service failed';
      addMsg('error', `Gemini error: ${msg}`);
      await speak('I am unable to reach the AI service, Sir. Please check the API key or network.');
      if (/api key|API_KEY|invalid|401|403/i.test(msg)) {
        setShowKeyModal(true);
      }
    }
  };

  const clearChat = () => setMessages([]);
  const resetKey = () => setShowKeyModal(true);

  return (
    <div className="app">
      <div className="header">
        <h1>J.A.R.V.I.S.</h1>
        <div className="subtitle">Just A Rather Very Intelligent System</div>
      </div>

      <div className="arc-reactor" onClick={startListening}>
        <div className={`arc-ring ${listening ? 'listening' : ''} ${speaking ? 'speaking' : ''}`}>
          <div className="arc-core" />
        </div>
      </div>

      <div className="status">{status}</div>

      <div className="conversation" ref={convRef}>
        {messages.length === 0 && (
          <div className="msg jarvis">
            <div className="label">JARVIS</div>
            Welcome, Sir. Tap the arc reactor and speak.<br/>
            Try: <em>"WhatsApp kholo"</em>, <em>"YouTube par lofi music chalao"</em>,
            <em>"Rahul ko call karo"</em>, <em>"Delhi ka mausam batao"</em>.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.kind}`}>
            <div className="label">{m.kind === 'user' ? 'YOU' : m.kind === 'jarvis' ? 'JARVIS' : 'SYSTEM'} · {m.time}</div>
            {m.text}
          </div>
        ))}
      </div>

      <div className="controls">
        <button className="btn" onClick={clearChat}>CLEAR</button>
        <button className="btn" onClick={resetKey}>API KEY</button>
        <button className="btn danger" onClick={() => speechRef.current?.stop()}>STOP</button>
      </div>

      {showKeyModal && <ApiKeyModal initial={apiKey} onSave={handleSaveKey} onClose={() => ready && setShowKeyModal(false)} />}
    </div>
  );
}
