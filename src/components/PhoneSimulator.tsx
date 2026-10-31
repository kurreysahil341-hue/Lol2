import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Home, 
  Settings, 
  Zap, 
  Check, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Bot, 
  HelpCircle,
  Contact2,
  Download
} from 'lucide-react';

interface PhoneSimulatorProps {
  isServiceActive: boolean;
  setIsServiceActive: React.Dispatch<React.SetStateAction<boolean>>;
  isOfflineMode: boolean;
  setIsOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectView?: (viewId: string) => void;
  selectedViewId?: string;
}

interface ActiveCallState {
  displayName: string;
  phoneNumber: string;
  durationSeconds: number;
}

interface DisambiguationItem {
  displayName: string;
  phoneNumber: string;
  label: string;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  isServiceActive,
  setIsServiceActive,
  isOfflineMode,
  setIsOfflineMode,
  onSelectView,
  selectedViewId
}) => {
  const [isListening, setIsListening] = useState(true);
  const [hasAudioPermission, setHasAudioPermission] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'settings'>('home');
  const [transcript, setTranscript] = useState("Listening for 'Hey Sheri'...");
  const [partialHypothesis, setPartialHypothesis] = useState("Say 'call Rahul' or 'Rahul ka number batao'");
  const [wakeWordTriggered, setWakeWordTriggered] = useState(false);
  const [isSpeakingTts, setIsSpeakingTts] = useState(false);
  const [ttsAudioEnabled, setTtsAudioEnabled] = useState(true);
  const [simulatedBars, setSimulatedBars] = useState<number[]>([40, 65, 90, 75, 45, 60, 85, 50, 30]);
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [activeCall, setActiveCall] = useState<ActiveCallState | null>(null);

  // Disambiguation State (for multiple numbers/contacts)
  const [pendingDisambiguation, setPendingDisambiguation] = useState<DisambiguationItem[] | null>(null);

  // Info card for "Number batao" queries
  const [displayedContactInfo, setDisplayedContactInfo] = useState<{ name: string; number: string; type: string } | null>(null);

  // LLM Model Manager & Importer State
  const [activeModelName, setActiveModelName] = useState<string>("gemma-2b-it-cpu-int4.bin");
  const [activeModelSize, setActiveModelSize] = useState<string>("1.34 GB");
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(true);
  const [isImportingModel, setIsImportingModel] = useState<boolean>(false);
  const [importProgress, setImportProgress] = useState<number>(0);
  const [importCopiedMb, setImportCopiedMb] = useState<number>(0);

  // Mock contact book with Rahul having multiple numbers
  const mockContacts = [
    { name: "Rahul", number: "+1 (555) 234-8901", type: "Mobile" },
    { name: "Rahul", number: "+1 (555) 345-6789", type: "Work" },
    { name: "Mom", number: "+1 (555) 492-0199", type: "Home" },
    { name: "David", number: "+1 (555) 781-4422", type: "Mobile" }
  ];

  const handleSimulateModelImport = (fileName: string = "gemma-2b-it-cpu-int4.bin", sizeMb: number = 1340) => {
    setIsImportingModel(true);
    setImportProgress(0);
    setImportCopiedMb(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      if (current > 100) {
        clearInterval(interval);
        setIsImportingModel(false);
        setActiveModelName(fileName);
        setActiveModelSize(`${(sizeMb / 1024).toFixed(2)} GB`);
        setIsModelLoaded(true);
        setTranscript(`Offline Brain: ${fileName} Ready!`);
        setPartialHypothesis(`Model verified (${(sizeMb / 1024).toFixed(2)} GB) · MediaPipe Active`);
        speakTextOffline("Sheri offline brain loaded successfully. You can now ask me anything!");
      } else {
        setImportProgress(current);
        setImportCopiedMb(Math.floor((current * sizeMb) / 100));
      }
    }, 180);
  };

  const handleTestLlmQuery = (question: string) => {
    setShowSettingsSheet(false);
    setActiveTab('home');
    setTranscript(`"${question}"`);
    setPartialHypothesis("Gemma 2B generating offline reply…");

    setTimeout(() => {
      const reply = "I am Sheri, your fully offline on-device voice assistant. Powered by Google Gemma 2B, I process all your voice commands, contacts, and questions entirely on your phone without internet.";
      setTranscript(reply);
      setPartialHypothesis("Sheri speaking…");
      speakTextOffline(reply);
    }, 1000);
  };

  // Visualizer bar animation
  useEffect(() => {
    if (!isListening || !hasAudioPermission || activeCall) return;
    const interval = setInterval(() => {
      setSimulatedBars(prev =>
        prev.map(() => Math.floor(Math.random() * (isSpeakingTts ? 85 : wakeWordTriggered ? 70 : 40)) + 25)
      );
    }, 120);
    return () => clearInterval(interval);
  }, [isListening, hasAudioPermission, wakeWordTriggered, activeCall, isSpeakingTts]);

  // Call timer
  useEffect(() => {
    if (!activeCall) return;
    const timer = setInterval(() => {
      setActiveCall(prev => prev ? { ...prev, durationSeconds: prev.durationSeconds + 1 } : null);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeCall]);

  const speakTextOffline = (textToSpeak: string, onEnd?: () => void) => {
    setIsSpeakingTts(true);
    if (ttsAudioEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.pitch = 1.05;
      utterance.rate = 1.05;
      utterance.onend = () => {
        setIsSpeakingTts(false);
        onEnd?.();
      };
      utterance.onerror = () => {
        setIsSpeakingTts(false);
        onEnd?.();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setIsSpeakingTts(false);
        onEnd?.();
      }, 3000);
    }
  };

  const handleMicClick = () => {
    if (onSelectView) onSelectView('btnMic');

    if (isSpeakingTts) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeakingTts(false);
    }

    const next = !isListening;
    setIsListening(next);
    if (next) {
      setTranscript("Listening for 'Hey Sheri'...");
      setPartialHypothesis("Say 'call Rahul' or 'Rahul ka number batao'");
      setPendingDisambiguation(null);
      setDisplayedContactInfo(null);
      setWakeWordTriggered(false);
    } else {
      setTranscript("Tap mic or say 'Hey Sheri'");
      setPartialHypothesis("Tap mic to activate listener");
    }
  };

  /**
   * Requirement 1: Handle Multiple Contacts / Numbers Disambiguation
   */
  const handleTestDisambiguation = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setDisplayedContactInfo(null);
    setWakeWordTriggered(true);
    setTranscript("Hey Sheri call Rahul");
    setPartialHypothesis("Searching ContactsContract for 'Rahul'…");

    setTimeout(() => {
      // Find all numbers for Rahul in mock address book
      const matches: DisambiguationItem[] = [
        { displayName: "Rahul", phoneNumber: "+1 (555) 234-8901", label: "Mobile" },
        { displayName: "Rahul", phoneNumber: "+1 (555) 345-6789", label: "Work" }
      ];

      setPendingDisambiguation(matches);
      const question = "Multiple numbers found for Rahul. Which one should I call: Mobile or Work?";
      setTranscript(question);
      setPartialHypothesis("Awaiting your choice (Mobile or Work)…");
      speakTextOffline(question);
    }, 700);
  };

  const selectDisambiguatedNumber = (item: DisambiguationItem) => {
    setPendingDisambiguation(null);
    const confirm = `Calling ${item.displayName} on ${item.label}`;
    setTranscript(confirm);
    setPartialHypothesis(`Dialing ${item.phoneNumber}`);
    speakTextOffline(confirm, () => {
      setActiveCall({
        displayName: `${item.displayName} (${item.label})`,
        phoneNumber: item.phoneNumber,
        durationSeconds: 0
      });
    });
  };

  /**
   * Requirement 2: Handle Contact Info Query ("Number batao")
   */
  const handleTestNumberBatao = (spokenQuery: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPendingDisambiguation(null);
    setWakeWordTriggered(true);
    setTranscript(spokenQuery);
    setPartialHypothesis("IntentRouter: GET_CONTACT_NUMBER (No Call)");

    setTimeout(() => {
      const match = mockContacts[0]; // Rahul Mobile
      const rawDigits = match.number.replace(/[^0-9]/g, '');
      const spacedDigits = rawDigits.slice(-10).split('').join(' ');
      const speechText = `Rahul's mobile number is ${spacedDigits}.`;

      setDisplayedContactInfo({
        name: "Rahul",
        number: match.number,
        type: "Mobile"
      });
      setTranscript(`Rahul: ${match.number} (Mobile)`);
      setPartialHypothesis("Speaking number aloud via Android TTS…");
      speakTextOffline(speechText);
    }, 700);
  };

  const endCall = () => {
    setActiveCall(null);
    setTranscript("Call ended");
    setPartialHypothesis("Listening for 'Hey Sheri'...");
    setWakeWordTriggered(false);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Phone Shell */}
      <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-[#05070C] rounded-[48px] p-3 shadow-2xl ring-1 ring-slate-800/80 shadow-cyan-950/20 flex flex-col justify-between">
        
        {/* Top Speaker / Camera Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-30">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-10 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Screen Area */}
        <div 
          className="relative w-full h-full bg-[#080C15] rounded-[38px] overflow-hidden flex flex-col text-white select-none border border-slate-850"
          style={{ backgroundColor: '#080C15' }}
        >
          {/* Android System Status Bar */}
          <div className="w-full pt-3 px-6 pb-1 flex items-center justify-between text-[11px] text-slate-400 font-medium tracking-tight z-20">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="font-semibold text-[10px] text-cyan-400">5G</span>
              <span>📶</span>
              <span>🔋 98%</span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. STATUS HEADER: Horizontal Top Layout */}
          {/* ========================================================= */}
          <div 
            id="layoutStatusHeader"
            onClick={() => onSelectView?.('layoutStatusHeader')}
            className={`mx-5 mt-4 flex items-center gap-2.5 z-20 transition-all ${
              selectedViewId === 'layoutStatusHeader' ? 'ring-2 ring-cyan-400 rounded-2xl p-0.5' : ''
            }`}
          >
            {/* Foreground Service Status Indicator */}
            <div
              id="layoutServiceStatus"
              onClick={(e) => {
                e.stopPropagation();
                setIsServiceActive(!isServiceActive);
                onSelectView?.('layoutServiceStatus');
              }}
              title="Click to toggle foreground service active state"
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all duration-200 border ${
                isServiceActive
                  ? 'bg-[#11192C] border-emerald-500/30 hover:border-emerald-500/50'
                  : 'bg-[#11192C]/60 border-slate-800'
              } ${selectedViewId === 'layoutServiceStatus' ? 'ring-2 ring-emerald-400' : ''}`}
            >
              <div 
                id="dotServiceStatus" 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isServiceActive ? 'bg-[#00E676] shadow-[0_0_8px_#00E676]' : 'bg-slate-600'
                }`} 
              />
              <span id="tvServiceStatus" className="text-xs font-medium text-slate-100 truncate">
                {isServiceActive ? "Hey Sheri Active" : "Hey Sheri Paused"}
              </span>
            </div>

            {/* Offline Status Indicator */}
            <div
              id="layoutOfflineStatus"
              onClick={(e) => {
                e.stopPropagation();
                setIsOfflineMode(!isOfflineMode);
                onSelectView?.('layoutOfflineStatus');
              }}
              title="Click to toggle offline mode state"
              className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer transition-all duration-200 border ${
                isOfflineMode
                  ? 'bg-[#11192C] border-cyan-500/30 hover:border-cyan-500/50'
                  : 'bg-[#11192C]/60 border-slate-800'
              } ${selectedViewId === 'layoutOfflineStatus' ? 'ring-2 ring-cyan-400' : ''}`}
            >
              <Zap
                id="ivOfflineStatus"
                className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                  isOfflineMode ? 'text-[#00E5FF]' : 'text-slate-500'
                }`}
              />
              <span id="tvOfflineStatus" className="text-xs font-medium text-slate-300 truncate">
                {isOfflineMode ? "Offline Mode Enabled" : "Cloud Hybrid Active"}
              </span>
            </div>
          </div>

          {/* Persistent Background Service Notification Preview Bar */}
          <div className="mx-5 mt-2.5 px-3 py-2 rounded-xl bg-[#0F172A] border border-cyan-500/25 shadow-lg flex items-center justify-between text-xs z-20 transition-all">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isServiceActive ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-500'}`}>
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-slate-200">Hey Sheri Service</span>
                  <span className={`text-[8px] font-mono px-1 py-0.5 rounded uppercase font-bold ${isServiceActive ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                    FOREGROUND
                  </span>
                </div>
                <p className="text-[10px] text-cyan-300/90 truncate font-sans">
                  {isServiceActive ? "Sheri is listening in background..." : "Service stopped (Mic released)"}
                </p>
              </div>
            </div>
            {isServiceActive ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServiceActive(false);
                  setIsListening(false);
                  setTranscript("Hey Sheri stopped from notification");
                  setPartialHypothesis("Tap status indicator or mic to restart");
                }}
                title="Completely stops the foreground service and releases microphone"
                className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-md bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/35 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>Stop Sheri</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServiceActive(true);
                  setIsListening(true);
                  setTranscript("Listening for 'Hey Sheri' in background...");
                  setPartialHypothesis("Continuous microphone active");
                }}
                title="Restart foreground listening service"
                className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/35 transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <span>Start</span>
              </button>
            )}
          </div>

          {/* Smart Features Pill */}
          <div className="mx-6 mt-2 flex items-center justify-between px-2.5 py-1 rounded-md bg-[#0D1322] border border-slate-800 text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <Contact2 className="w-3 h-3 text-cyan-400" />
              <span>Smart Contacts:</span>
              <span className="text-slate-200">Disambiguate + TTS Info</span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold uppercase text-[9px]">Offline</span>
          </div>

          {/* ========================================================= */}
          {/* 2. MAIN CENTER VIEW: Large Mic & Visualizer Wave Area */}
          {/* ========================================================= */}
          <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
            
            {/* Visualizer & Mic Container FrameLayout */}
            <div 
              id="layoutMicContainer"
              onClick={() => onSelectView?.('layoutMicContainer')}
              className={`relative w-64 h-64 flex items-center justify-center cursor-pointer ${
                selectedViewId === 'layoutMicContainer' ? 'ring-2 ring-cyan-400 rounded-full' : ''
              }`}
            >
              {/* Outer Ambient Pulsing Ring */}
              <div
                id="viewWaveOuter"
                className={`absolute inset-0 rounded-full border border-cyan-400/30 transition-all duration-1000 ${
                  isListening && hasAudioPermission && !activeCall
                    ? isSpeakingTts
                      ? 'animate-pulse opacity-70 bg-emerald-400/15 border-emerald-400 scale-110'
                      : wakeWordTriggered 
                        ? 'animate-ping opacity-60 bg-cyan-400/20 scale-110' 
                        : 'animate-ping opacity-25 bg-cyan-500/5'
                    : 'opacity-0 scale-90'
                }`}
              />

              {/* Middle Wave Ring with Cyan/Emerald Glow */}
              <div
                id="viewWaveInner"
                className={`absolute w-52 h-52 rounded-full border transition-all duration-500 ${
                  isSpeakingTts
                    ? 'border-emerald-400 bg-emerald-400/20 scale-115 shadow-[0_0_35px_rgba(0,230,118,0.3)]'
                    : isListening && hasAudioPermission && !activeCall
                      ? wakeWordTriggered
                        ? 'scale-115 bg-cyan-400/25 shadow-[0_0_40px_rgba(0,229,255,0.4)] border-cyan-300'
                        : 'scale-105 bg-cyan-400/10 shadow-[0_0_30px_rgba(0,229,255,0.15)] border-cyan-400/40'
                      : 'scale-95 opacity-20 border-slate-700'
                }`}
              />

              {/* Waveform Bar Visualizer Placeholder in Center */}
              <div 
                id="visualizerWavePlaceholder"
                className="absolute w-40 h-40 rounded-full bg-[#18233C]/70 border border-cyan-500/20 backdrop-blur-sm flex items-center justify-center gap-1.5 px-6"
              >
                {isListening && hasAudioPermission && !activeCall ? (
                  simulatedBars.map((height, idx) => (
                    <div
                      key={idx}
                      style={{ height: `${height}%` }}
                      className={`w-1.5 rounded-full transition-all duration-150 ${
                        isSpeakingTts
                          ? 'bg-gradient-to-t from-emerald-500 via-teal-300 to-white'
                          : wakeWordTriggered 
                            ? 'bg-gradient-to-t from-cyan-400 via-teal-200 to-white' 
                            : 'bg-gradient-to-t from-cyan-500 to-teal-300'
                      }`}
                    />
                  ))
                ) : (
                  <div className="w-12 h-1 bg-slate-700 rounded-full" />
                )}
              </div>

              {/* Prominent Large Circular Mic Button (FloatingActionButton) */}
              <button
                id="btnMic"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMicClick();
                }}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl ${
                  isSpeakingTts
                    ? 'bg-emerald-400 text-[#080C15] shadow-emerald-500/40'
                    : isListening && hasAudioPermission && !activeCall
                      ? wakeWordTriggered
                        ? 'bg-white text-[#080C15] shadow-[0_0_35px_#00E5FF] scale-105'
                        : 'bg-[#00E5FF] text-[#080C15] shadow-cyan-500/40 hover:bg-[#33ebff]'
                      : 'bg-[#18233C] text-slate-400 hover:text-white border border-slate-700 shadow-black/50'
                } ${selectedViewId === 'btnMic' ? 'ring-4 ring-white' : ''}`}
              >
                {isSpeakingTts ? (
                  <Volume2 className="w-10 h-10 stroke-[2.2] animate-bounce" />
                ) : isListening && hasAudioPermission && !activeCall ? (
                  <Mic className="w-10 h-10 stroke-[2.2]" />
                ) : (
                  <MicOff className="w-10 h-10 stroke-[2]" />
                )}
              </button>
            </div>

            {/* Listening Prompt Text */}
            <p
              id="tvListeningPrompt"
              onClick={() => onSelectView?.('tvListeningPrompt')}
              className={`mt-4 text-center text-[15px] leading-snug font-medium tracking-wide text-slate-100 max-w-[280px] transition-colors ${
                isSpeakingTts 
                  ? 'text-emerald-300 font-semibold' 
                  : wakeWordTriggered 
                    ? 'text-cyan-300 font-semibold' 
                    : ''
              } ${selectedViewId === 'tvListeningPrompt' ? 'ring-1 ring-cyan-400 rounded px-2' : ''}`}
            >
              {transcript}
            </p>

            {/* Voice Hint & Feedback */}
            <p
              id="tvVoiceHint"
              onClick={() => onSelectView?.('tvVoiceHint')}
              className="mt-1 text-center text-xs font-mono text-cyan-400/90 max-w-[280px] truncate"
            >
              {partialHypothesis}
            </p>

            {/* Requirement 1: Disambiguation Options Panel */}
            {pendingDisambiguation && (
              <div className="mt-3 p-2.5 rounded-2xl bg-[#11192C] border border-cyan-500/40 w-full max-w-[280px] space-y-2 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Choose number to call:</span>
                </div>
                <div className="flex gap-2">
                  {pendingDisambiguation.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectDisambiguatedNumber(item)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 text-left transition-colors"
                    >
                      <div className="text-[11px] font-semibold text-white">{item.label}</div>
                      <div className="text-[9px] font-mono text-cyan-400 truncate">{item.phoneNumber}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Requirement 2: Contact Info Card for "Number Batao" */}
            {displayedContactInfo && (
              <div className="mt-3 p-2.5 rounded-2xl bg-[#11192C] border border-emerald-500/40 w-full max-w-[280px] flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {displayedContactInfo.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{displayedContactInfo.name}</div>
                    <div className="text-[10px] font-mono text-emerald-400">{displayedContactInfo.number}</div>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {displayedContactInfo.type}
                </span>
              </div>
            )}

            {/* Quick Test Chips */}
            <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-[320px]">
              <button
                onClick={() => handleTestNumberBatao("Rahul ka number batao")}
                className="text-[11px] bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-white px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1 transition-colors"
              >
                <Contact2 className="w-3 h-3" />
                "Rahul ka number batao"
              </button>
              <button
                onClick={handleTestDisambiguation}
                className="text-[11px] bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 hover:text-white px-2.5 py-1 rounded-full border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                "Call Rahul" (Disambiguate)
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. NAVIGATION / ACTION BUTTONS: Home & Settings */}
          {/* ========================================================= */}
          <div 
            id="layoutBottomNav"
            onClick={() => onSelectView?.('layoutBottomNav')}
            className={`mx-6 mb-7 h-16 rounded-[28px] bg-[#11192C] border border-[#1E2C4A] flex items-center justify-around px-8 shadow-lg shadow-black/40 z-20 ${
              selectedViewId === 'layoutBottomNav' ? 'ring-2 ring-cyan-400' : ''
            }`}
          >
            <button
              id="btnNavHome"
              onClick={() => {
                setActiveTab('home');
                setShowSettingsSheet(false);
                setPendingDisambiguation(null);
                setDisplayedContactInfo(null);
                onSelectView?.('btnNavHome');
              }}
              className={`p-2.5 rounded-full transition-all active:scale-95 ${
                activeTab === 'home' && !showSettingsSheet
                  ? 'text-[#00E5FF] bg-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              } ${selectedViewId === 'btnNavHome' ? 'ring-2 ring-cyan-400' : ''}`}
              title="Home"
            >
              <Home className="w-6 h-6 stroke-[2.2]" />
            </button>

            <button
              id="btnNavSettings"
              onClick={() => {
                setActiveTab('settings');
                setShowSettingsSheet(true);
                onSelectView?.('btnNavSettings');
              }}
              className={`p-2.5 rounded-full transition-all active:scale-95 ${
                activeTab === 'settings' || showSettingsSheet
                  ? 'text-[#00E5FF] bg-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              } ${selectedViewId === 'btnNavSettings' ? 'ring-2 ring-cyan-400' : ''}`}
              title="Settings"
            >
              <Settings className="w-6 h-6 stroke-[2.2]" />
            </button>
          </div>

          {/* IN-CALL OVERLAY */}
          {activeCall && (
            <div className="absolute inset-0 bg-[#060A14]/95 backdrop-blur-md z-40 flex flex-col items-center justify-between p-8 text-white animate-fadeIn">
              <div className="pt-8 text-center space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Android Call Active
                </span>
                <p className="text-xs text-slate-400 mt-2">Intent.ACTION_CALL</p>
                <h3 className="text-2xl font-bold text-white tracking-tight">{activeCall.displayName}</h3>
                <p className="text-xs font-mono text-cyan-400">{activeCall.phoneNumber}</p>
                <p className="text-sm font-mono text-slate-300 pt-2">{Math.floor(activeCall.durationSeconds / 60).toString().padStart(2, '0')}:{(activeCall.durationSeconds % 60).toString().padStart(2, '0')}</p>
              </div>

              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="text-3xl font-bold text-white">{activeCall.displayName.charAt(0)}</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-center pb-4">
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 active:scale-95 flex items-center justify-center shadow-lg shadow-red-600/40 text-white transition-all"
                  title="End Call"
                >
                  <PhoneOff className="w-7 h-7" />
                </button>
              </div>
            </div>
          )}

          {/* Settings Drawer */}
          {showSettingsSheet && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-30 flex flex-col justify-end">
              <div className="bg-[#11192C] border-t border-slate-700/60 rounded-t-3xl p-5 space-y-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <h4 className="text-sm font-semibold">Smart Voice Settings</h4>
                  </div>
                  <button
                    onClick={() => {
                      setShowSettingsSheet(false);
                      setActiveTab('home');
                    }}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Done
                  </button>
                </div>

                {/* LLM Model Importer & Manager Section */}
                <div className="p-3 rounded-xl bg-[#080C15] border border-cyan-500/30 text-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4 text-cyan-400" />
                      <span className="font-semibold text-white">Offline LLM Brain</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {isModelLoaded ? "Model Ready" : "No Model"}
                    </span>
                  </div>

                  <div className="bg-[#0F172A] p-2 rounded-lg border border-slate-800 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Active Model:</span>
                      <span className="text-cyan-300 font-mono font-medium truncate max-w-[170px]">{activeModelName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">File Size:</span>
                      <span className="text-slate-200 font-mono">{activeModelSize} (INT4 CPU)</span>
                    </div>
                  </div>

                  {/* Import Progress Bar */}
                  {isImportingModel ? (
                    <div className="space-y-1.5 py-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-cyan-400 font-medium">Copying model into sandbox…</span>
                        <span className="font-mono text-cyan-300">{importProgress}% ({importCopiedMb} MB)</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
                          style={{ width: `${importProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        onClick={() => handleSimulateModelImport("gemma-2b-it-cpu-int4.bin", 1340)}
                        className="px-2 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <Download className="w-3 h-3" />
                        <span>Import Gemma 2B</span>
                      </button>
                      <button
                        onClick={() => handleSimulateModelImport("llama-3.2-1b-instruct.task", 1150)}
                        className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-95"
                      >
                        <Download className="w-3 h-3" />
                        <span>Import Llama 3.2</span>
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleTestLlmQuery("Who are you and what can you do offline?")}
                    className="w-full py-1.5 rounded-lg bg-[#18233C] hover:bg-[#1E2C4A] border border-cyan-500/20 text-cyan-300 text-[10px] font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Test Gemma Offline Query</span>
                  </button>
                </div>

                <div className="p-2 rounded-xl bg-[#080C15] border border-slate-800 text-xs">
                  <span className="text-slate-400">Contacts with multiple numbers:</span>
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white">Rahul (Mobile)</span>
                      <span className="text-cyan-400 font-mono">+1 555-234-8901</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white">Rahul (Work)</span>
                      <span className="text-cyan-400 font-mono">+1 555-345-6789</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-[#080C15] border border-slate-800 text-xs">
                  <div>
                    <p className="font-medium text-slate-200">Voice Synthesis (TTS)</p>
                    <p className="text-[10px] text-slate-400">Speak disambiguation &amp; numbers</p>
                  </div>
                  <button
                    onClick={() => setTtsAudioEnabled(!ttsAudioEnabled)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      ttsAudioEnabled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {ttsAudioEnabled ? "Audio On" : "Muted"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Simulator Device Controls */}
      <div className="mt-4 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          Smart Contacts &amp; Disambiguation
        </span>
        <span>·</span>
        <button
          onClick={() => setTtsAudioEnabled(!ttsAudioEnabled)}
          className="text-cyan-400 hover:underline flex items-center gap-1"
        >
          {ttsAudioEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
          TTS Audio: {ttsAudioEnabled ? "Enabled" : "Muted"}
        </button>
      </div>
    </div>
  );
};
