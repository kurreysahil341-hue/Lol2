import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Terminal, 
  Layers, 
  Smartphone, 
  Download, 
  Cpu, 
  Zap, 
  SlidersHorizontal,
  FileCode,
  Volume2
} from 'lucide-react';
import { PhoneSimulator } from './components/PhoneSimulator';
import { CodeViewer } from './components/CodeViewer';
import { LayoutInspector } from './components/LayoutInspector';
import { ACTIVITY_MAIN_XML } from './data/androidFiles';
import { downloadAndroidProjectZip } from './utils/zipExporter';

export default function App() {
  const [isServiceActive, setIsServiceActive] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(true);
  const [selectedViewId, setSelectedViewId] = useState<string | undefined>('btnMic');
  const [headerCopied, setHeaderCopied] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);
  const [rightPanelTab, setRightPanelTab] = useState<'code' | 'inspector'>('code');

  const handleDownloadZip = async () => {
    try {
      setIsDownloadingZip(true);
      setZipProgress(10);
      await downloadAndroidProjectZip((percent) => {
        setZipProgress(percent);
      });
      setTimeout(() => {
        setIsDownloadingZip(false);
        setZipProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Failed to export zip', err);
      setIsDownloadingZip(false);
    }
  };

  const handleCopyXml = () => {
    navigator.clipboard.writeText(ACTIVITY_MAIN_XML);
    setHeaderCopied(true);
    setTimeout(() => setHeaderCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* ========================================================= */}
      {/* TOP BAR CONTRACT: Brand — Nav — Primary Action           */}
      {/* ========================================================= */}
      <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#090D18]/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center text-[#060911] font-bold shadow-md shadow-cyan-500/20">
            <Cpu className="w-5 h-5 stroke-[2.4]" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
              Hey Sheri
            </span>
            <span className="hidden sm:inline-block text-xs text-cyan-400 font-mono ml-2 px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60">
              Gemma LLM &amp; Voice Studio
            </span>
          </div>
        </div>

        {/* Zone 2: Single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => setRightPanelTab('code')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              rightPanelTab === 'code' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Vosk &amp; Kotlin Code
          </button>
          <button
            onClick={() => setRightPanelTab('inspector')}
            className={`transition-colors whitespace-nowrap hover:text-white ${
              rightPanelTab === 'inspector' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Voice Pipeline &amp; Audit
          </button>
          <span className="text-slate-600">·</span>
          <span className="text-xs text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Vosk 16kHz Offline
          </span>
        </nav>

        {/* Zone 3: CTA Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95 whitespace-nowrap cursor-pointer disabled:opacity-75"
          >
            <Download className={`w-4 h-4 stroke-[2.2] ${isDownloadingZip ? 'animate-bounce' : ''}`} />
            <span>
              {isDownloadingZip 
                ? `Packing ZIP ${zipProgress}%...` 
                : 'Download All Files (.ZIP)'}
            </span>
          </button>

          <button
            onClick={handleCopyXml}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-[#00E5FF] hover:bg-[#33ebff] text-slate-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            {headerCopied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>XML Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 stroke-[2.2]" />
                <span>Copy XML</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN WORKSPACE: 2-Column Split View                       */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Phone Simulator (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          
          {/* Quick Info Header Card */}
          <div className="w-full max-w-[360px] mb-3 flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-1.5 font-medium">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>Interactive Android Emulator</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsServiceActive(!isServiceActive)}
                className="text-[11px] hover:text-white transition-colors"
                title="Toggle service"
              >
                Service: <span className={isServiceActive ? 'text-emerald-400 font-medium' : 'text-slate-500'}>{isServiceActive ? 'On' : 'Off'}</span>
              </button>
              <span>·</span>
              <button
                onClick={() => setIsOfflineMode(!isOfflineMode)}
                className="text-[11px] hover:text-white transition-colors"
                title="Toggle offline mode"
              >
                Offline: <span className={isOfflineMode ? 'text-cyan-400 font-medium' : 'text-slate-500'}>{isOfflineMode ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>

          {/* The Live Interactive Phone Frame */}
          <PhoneSimulator
            isServiceActive={isServiceActive}
            setIsServiceActive={setIsServiceActive}
            isOfflineMode={isOfflineMode}
            setIsOfflineMode={setIsOfflineMode}
            selectedViewId={selectedViewId}
            onSelectView={setSelectedViewId}
          />
        </div>

        {/* Right Column: Code Viewer & Specifications (7 cols on large screens) */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-[780px]">
          
          {/* Studio Tab Switcher */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1 bg-[#090D18] p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRightPanelTab('code')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rightPanelTab === 'code'
                    ? 'bg-[#18233C] text-cyan-300 shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Android Layout &amp; Code Studio</span>
              </button>
              
              <button
                onClick={() => setRightPanelTab('inspector')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  rightPanelTab === 'inspector'
                    ? 'bg-[#18233C] text-cyan-300 shadow-sm border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Layout Inspector &amp; Specs</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              Target: <span className="text-slate-300">ConstraintLayout 2.1+</span>
            </div>
          </div>

          {/* Right Panel Main View */}
          <div className="flex-1 min-h-0">
            {rightPanelTab === 'code' ? (
              <CodeViewer 
                selectedViewId={selectedViewId} 
                onSelectView={setSelectedViewId} 
              />
            ) : (
              <LayoutInspector
                selectedViewId={selectedViewId}
                onSelectView={setSelectedViewId}
                isServiceActive={isServiceActive}
                setIsServiceActive={setIsServiceActive}
                isOfflineMode={isOfflineMode}
                setIsOfflineMode={setIsOfflineMode}
              />
            )}
          </div>
        </div>

      </main>

      {/* Footer / Status bar */}
      <footer className="border-t border-slate-800/80 bg-[#080C15] px-6 py-3 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4 mt-auto">
        <div className="flex items-center gap-3">
          <span>Hey Sheri Voice Assistant</span>
          <span>·</span>
          <span>Kotlin ViewBinding Ready</span>
          <span>·</span>
          <span className="text-cyan-400">Strictly Voice Navigation (No Maps button)</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Target SDK 35 · Material Components · On-Device Voice Pipeline
        </div>
      </footer>
    </div>
  );
}
