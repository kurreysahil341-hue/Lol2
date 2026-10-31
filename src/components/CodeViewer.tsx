import React, { useState } from 'react';
import { Check, Copy, Download, FileCode, Layers, ShieldCheck, Terminal, BookOpen, Smartphone, Cpu, PhoneCall, Volume2, SplitSquareVertical, HelpCircle } from 'lucide-react';
import { 
  ACTIVITY_MAIN_XML, 
  MAIN_ACTIVITY_KT, 
  SHERI_VOICE_SERVICE_KT,
  LOCAL_LLM_MANAGER_KT,
  TTS_SPEECH_HELPER_KT,
  INTENT_ROUTER_KT,
  CONTACT_CALL_HELPER_KT,
  VOSK_SPEECH_MANAGER_KT,
  ANDROID_MANIFEST_XML,
  COLORS_XML, 
  STRINGS_XML, 
  DRAWABLES, 
  BUILD_GRADLE_KTS,
  SETUP_GUIDE_MD,
  BUILD_APK_YML,
  GIT_PUSH_GUIDE_MD
} from '../data/androidFiles';

interface CodeViewerProps {
  selectedViewId?: string;
  onSelectView?: (viewId: string) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ selectedViewId, onSelectView }) => {
  const [activeTab, setActiveTab] = useState<
    'gitpush' | 'kotlin' | 'service' | 'gradle' | 'yaml' | 'manifest' | 'guide' | 'llm' | 'tts' | 'router' | 'calling' | 'vosk' | 'layout' | 'colors' | 'strings' | 'drawables'
  >('gitpush');
  const [activeDrawableIndex, setActiveDrawableIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const getCurrentFileContent = () => {
    switch (activeTab) {
      case 'gitpush':
        return {
          filename: 'GIT_PUSH_SOLUTION.md',
          code: GIT_PUSH_GUIDE_MD,
          lang: 'markdown',
          description: 'Step-by-step fix for "Coding push nahi ho raha" — web drag & drop and token instructions.'
        };
      case 'kotlin':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/MainActivity.kt',
          code: MAIN_ACTIVITY_KT,
          lang: 'kotlin',
          description: 'Unified MainActivity: Starts Foreground Service, receives speech events, handles intent routing & UI.'
        };
      case 'service':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/speech/SheriVoiceService.kt',
          code: SHERI_VOICE_SERVICE_KT,
          lang: 'kotlin',
          description: 'Foreground Service: Continuous background Vosk STT, ongoing notification with "Stop Sheri" action button.'
        };
      case 'gradle':
        return {
          filename: 'app/build.gradle.kts',
          code: BUILD_GRADLE_KTS,
          lang: 'kotlin',
          description: 'Full compatibility build.gradle.kts: minSdk 21, targetSdk 34, MultiDex, Vosk, MediaPipe LLM.'
        };
      case 'yaml':
        return {
          filename: '.github/workflows/build-apk.yml',
          code: BUILD_APK_YML,
          lang: 'yaml',
          description: 'GitHub Actions Workflow: Compiles and builds HeySheri-Debug-APK automatically on GitHub.'
        };
      case 'manifest':
        return {
          filename: 'app/src/main/AndroidManifest.xml',
          code: ANDROID_MANIFEST_XML,
          lang: 'xml',
          description: 'Complete AndroidManifest.xml: INTERNET, RECORD_AUDIO, CALL_PHONE, READ_CONTACTS, and SheriVoiceService.'
        };
      case 'guide':
        return {
          filename: 'SETUP_GUIDE.md',
          code: SETUP_GUIDE_MD,
          lang: 'markdown',
          description: 'Setup Guide: exact asset folder structure, Vosk model directory, and Gemma 2B model placement.'
        };
      case 'llm':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/llm/LocalLlmManager.kt',
          code: LOCAL_LLM_MANAGER_KT,
          lang: 'kotlin',
          description: 'Google MediaPipe LLM Inference API: loads Gemma 2B INT4 model offline & generates text.'
        };
      case 'tts':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/tts/TtsSpeechHelper.kt',
          code: TTS_SPEECH_HELPER_KT,
          lang: 'kotlin',
          description: 'Android TextToSpeech engine: speaks Sheri responses aloud offline with pitch and speed tuning.'
        };
      case 'router':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/router/IntentRouter.kt',
          code: INTENT_ROUTER_KT,
          lang: 'kotlin',
          description: 'Intent Router: categorizes voice commands to Phone Calling, Contact Info, or Local Gemma LLM.'
        };
      case 'calling':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/calling/ContactCallHelper.kt',
          code: CONTACT_CALL_HELPER_KT,
          lang: 'kotlin',
          description: 'ContactsContract resolver, multiple match disambiguation, and Intent.ACTION_CALL dispatcher.'
        };
      case 'vosk':
        return {
          filename: 'app/src/main/java/com/heysheri/assistant/speech/VoskSpeechManager.kt',
          code: VOSK_SPEECH_MANAGER_KT,
          lang: 'kotlin',
          description: 'Vosk offline speech recognition & wake word detection engine.'
        };
      case 'layout':
        return {
          filename: 'res/layout/activity_main.xml',
          code: ACTIVITY_MAIN_XML,
          lang: 'xml',
          description: 'Production ConstraintLayout XML with standardized View IDs for ViewBinding.'
        };
      case 'colors':
        return {
          filename: 'res/values/colors.xml',
          code: COLORS_XML,
          lang: 'xml',
          description: 'High-tech dark palette (#080C15 base, cyan & emerald accents).'
        };
      case 'strings':
        return {
          filename: 'res/values/strings.xml',
          code: STRINGS_XML,
          lang: 'xml',
          description: 'Localized string resources for "Hey Sheri", statuses, and voice prompts.'
        };
      case 'drawables':
        return {
          filename: DRAWABLES[activeDrawableIndex].path,
          code: DRAWABLES[activeDrawableIndex].content,
          lang: 'xml',
          description: `Vector / Shape drawable resource: ${DRAWABLES[activeDrawableIndex].name}`
        };
      default:
        return { filename: 'MainActivity.kt', code: MAIN_ACTIVITY_KT, lang: 'kotlin', description: '' };
    }
  };

  const currentFile = getCurrentFileContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename.split('/').pop() || 'code.kt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const viewBindingMap = [
    { id: 'layoutStatusHeader', type: 'LinearLayout', role: 'Top horizontal status indicator bar' },
    { id: 'layoutServiceStatus', type: 'LinearLayout', role: 'Foreground Service status ("Hey Sheri Active")' },
    { id: 'dotServiceStatus', type: 'View', role: 'Small green status dot' },
    { id: 'tvServiceStatus', type: 'TextView', role: 'Foreground service status text' },
    { id: 'layoutOfflineStatus', type: 'LinearLayout', role: 'Offline status badge ("Offline Mode Enabled")' },
    { id: 'ivOfflineStatus', type: 'ImageView', role: 'Offline bolt indicator' },
    { id: 'tvOfflineStatus', type: 'TextView', role: 'Offline status text' },
    { id: 'layoutMicContainer', type: 'FrameLayout', role: 'Center container for mic and wave animations' },
    { id: 'viewWaveOuter', type: 'View', role: 'Outer pulsing wave visualizer ring' },
    { id: 'viewWaveInner', type: 'View', role: 'Inner glow wave visualizer ring' },
    { id: 'visualizerWavePlaceholder', type: 'View', role: 'Wave animation placeholder / audio wave canvas' },
    { id: 'btnMic', type: 'FloatingActionButton', role: 'Prominent circular mic button (92dp)' },
    { id: 'tvListeningPrompt', type: 'TextView', role: 'Prompt text / LLM generated text response' },
    { id: 'tvVoiceHint', type: 'TextView', role: 'Recognition state & TTS status indicator' },
    { id: 'layoutBottomNav', type: 'ConstraintLayout', role: 'Bottom navigation bar' },
    { id: 'btnNavHome', type: 'ImageButton', role: 'Home navigation action button' },
    { id: 'btnNavSettings', type: 'ImageButton', role: 'Settings navigation action button (No Maps)' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0D1322] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-[#090D18] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-950/60 border border-cyan-500/30 rounded-lg text-cyan-400">
            {activeTab === 'kotlin' ? <FileCode className="w-4 h-4 text-cyan-300" /> : activeTab === 'gradle' ? <Layers className="w-4 h-4 text-emerald-300" /> : activeTab === 'guide' ? <BookOpen className="w-4 h-4 text-teal-300" /> : <Cpu className="w-4 h-4 text-cyan-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-100 font-mono">{currentFile.filename}</span>
              {(activeTab === 'kotlin' || activeTab === 'gradle' || activeTab === 'manifest' || activeTab === 'guide') && (
                <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-md">
                  CORE DELIVERABLE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{currentFile.description}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-sans shadow-md shadow-cyan-500/20 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied Code!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy File</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleDownload}
            title="Download file"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* File Navigation Tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2 bg-[#090D18]/70 border-b border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('gitpush')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'gitpush'
              ? 'bg-rose-950/70 text-rose-300 border border-rose-500/40 shadow-sm'
              : 'text-rose-400/90 hover:text-rose-200 hover:bg-rose-950/30 border border-rose-800/40'
          }`}
        >
          <span className="font-semibold">🚀 Push Solution</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
        </button>

        <button
          onClick={() => setActiveTab('kotlin')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'kotlin'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>MainActivity.kt</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          onClick={() => setActiveTab('service')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'service'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>SheriVoiceService.kt</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </button>

        <button
          onClick={() => setActiveTab('gradle')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'gradle'
              ? 'bg-[#18233C] text-emerald-300 border border-emerald-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>build.gradle.kts</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </button>

        <button
          onClick={() => setActiveTab('yaml')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'yaml'
              ? 'bg-[#18233C] text-amber-300 border border-amber-500/30 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>build-apk.yml</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>

        <button
          onClick={() => setActiveTab('manifest')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'manifest'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          AndroidManifest.xml
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'guide'
              ? 'bg-[#18233C] text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>Setup Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('calling')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'calling'
              ? 'bg-[#18233C] text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>ContactCallHelper.kt</span>
        </button>

        <button
          onClick={() => setActiveTab('llm')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'llm'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>LocalLlmManager.kt</span>
        </button>

        <button
          onClick={() => setActiveTab('tts')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'tts'
              ? 'bg-[#18233C] text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>TtsSpeechHelper.kt</span>
        </button>

        <button
          onClick={() => setActiveTab('router')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'router'
              ? 'bg-[#18233C] text-teal-300 border border-teal-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span>IntentRouter.kt</span>
        </button>

        <button
          onClick={() => setActiveTab('vosk')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'vosk'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          VoskSpeechManager.kt
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'layout'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          activity_main.xml
        </button>

        <button
          onClick={() => setActiveTab('colors')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'colors'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          colors.xml
        </button>

        <button
          onClick={() => setActiveTab('strings')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'strings'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          strings.xml
        </button>

        <button
          onClick={() => setActiveTab('drawables')}
          className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
            activeTab === 'drawables'
              ? 'bg-[#18233C] text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          drawables/ ({DRAWABLES.length})
        </button>
      </div>

      {/* Sub-selector for drawables if on drawables tab */}
      {activeTab === 'drawables' && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#080C15] border-b border-slate-800 overflow-x-auto text-[11px]">
          <span className="text-slate-400 font-medium">Select Drawable:</span>
          {DRAWABLES.map((drw, idx) => (
            <button
              key={drw.name}
              onClick={() => setActiveDrawableIndex(idx)}
              className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                activeDrawableIndex === idx
                  ? 'bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {drw.name}
            </button>
          ))}
        </div>
      )}

      {/* Code Editor Body */}
      <div className="flex-1 relative overflow-auto font-mono text-[12.5px] leading-relaxed p-4 bg-[#080C15]">
        <pre className="text-slate-300 whitespace-pre">
          {currentFile.code}
        </pre>
      </div>

      {/* Bottom Kotlin ViewBinding Quick-Access Cheatsheet */}
      <div className="border-t border-slate-800 bg-[#0A0F1D] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Complete Unified Architecture Components</span>
          </div>
          <span className="text-[11px] text-slate-400">Click any component to inspect</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          {viewBindingMap.slice(0, 8).map(item => (
            <button
              key={item.id}
              onClick={() => onSelectView?.(item.id)}
              className={`p-1.5 rounded-lg border text-left transition-all ${
                selectedViewId === item.id
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="font-mono text-cyan-400 truncate">.{item.id}</div>
              <div className="text-[10px] text-slate-400 truncate">{item.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
