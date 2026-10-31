import React, { useState } from 'react';
import { CheckCircle2, Shield, Radio, Volume2, Compass, Layers, Code, Zap, Cpu, PhoneCall, Bot, SplitSquareVertical, Contact2 } from 'lucide-react';

interface LayoutInspectorProps {
  selectedViewId?: string;
  onSelectView?: (viewId: string) => void;
  isServiceActive: boolean;
  setIsServiceActive: React.Dispatch<React.SetStateAction<boolean>>;
  isOfflineMode: boolean;
  setIsOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LayoutInspector: React.FC<LayoutInspectorProps> = ({
  selectedViewId,
  onSelectView,
  isServiceActive,
  setIsServiceActive,
  isOfflineMode,
  setIsOfflineMode
}) => {
  const [activeTab, setActiveTab] = useState<'smart_pipeline' | 'requirements' | 'snippets'>('smart_pipeline');

  const smartSteps = [
    {
      step: "01",
      title: "Multiple Contact Disambiguation",
      detail: "When 'Call Rahul' finds multiple numbers (e.g. Mobile, Work) or multiple contacts, Sheri pauses, asks via TTS which one to dial, and awaits user response.",
      code: "val question = \"Multiple numbers found for $name. Which one: Mobile or Work?\""
    },
    {
      step: "02",
      title: "User Choice Resolver",
      detail: "Parses follow-up user response (e.g. 'mobile', 'work', 'first', '1') and initiates direct call for the chosen number.",
      code: "contactCallHelper.resolveDisambiguationChoice(userAnswer, pendingList)"
    },
    {
      step: "03",
      title: "'Number Batao' Info Query",
      detail: "Regex matches 'Rahul ka number batao' or 'Get Rahul's number'. Fetches number from ContactsContract and speaks it aloud via TTS without calling.",
      code: "Route.GetContactNumber(contactName) -> ttsHelper.speak(numberSpacedForTts)"
    },
    {
      step: "04",
      title: "MediaPipe Local LLM & Vosk STT",
      detail: "General queries are forwarded to on-device Gemma 2B INT4 via MediaPipe GenAI, with 16kHz on-device audio transcribed by Vosk.",
      code: "localLlmManager.generateResponse(prompt) -> ttsHelper.speak(reply)"
    },
    {
      step: "05",
      title: "Full Project Dependencies",
      detail: "Clean build.gradle.kts with MediaPipe tasks-genai, Vosk Android API, JNA, Coroutines, and aaptOptions noCompress.",
      code: "implementation(\"com.google.mediapipe:tasks-genai:0.10.14\")"
    }
  ];

  const requirements = [
    {
      title: "1. Multiple Contacts / Numbers Disambiguation",
      status: "Ready",
      detail: "Detects multiple matching phone numbers, speaks a disambiguation question via TTS, and listens for the user's choice before calling.",
      target: "ContactCallHelper.kt & MainActivity.kt"
    },
    {
      title: "2. Contact Info Query ('Number batao')",
      status: "Ready",
      detail: "Parses queries like 'Rahul ka number batao' or 'Get Rahul's number', queries ContactsContract, and speaks out the digits via TTS without dialing.",
      target: "ContactCallHelper.kt -> parseContactIntent()"
    },
    {
      title: "3. Complete Gradle Dependencies",
      status: "Ready",
      detail: "Full updated app/build.gradle.kts with MediaPipe GenAI, Vosk Android, JNA, Coroutines, and aaptOptions.",
      target: "app/build.gradle.kts"
    }
  ];

  return (
    <div className="bg-[#0D1322] border border-slate-800 rounded-2xl p-4 text-slate-200">
      {/* Sub Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Contact2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-slate-100">Smart Contact &amp; Voice Intelligence</h3>
        </div>

        <div className="flex items-center gap-1 bg-[#080C15] p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('smart_pipeline')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'smart_pipeline'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Smart Logic
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'requirements'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit (3/3)
          </button>
          <button
            onClick={() => setActiveTab('snippets')}
            className={`px-2.5 py-1 rounded-md transition-colors ${
              activeTab === 'snippets'
                ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kotlin Snippets
          </button>
        </div>
      </div>

      {/* Tab: Smart Pipeline */}
      {activeTab === 'smart_pipeline' && (
        <div className="space-y-2.5">
          {smartSteps.map((step) => (
            <div
              key={step.step}
              className="p-3 rounded-xl bg-[#080C15] border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-semibold">
                  {step.step}
                </span>
                <span className="text-xs font-semibold text-slate-200">{step.title}</span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400 leading-normal pl-9">{step.detail}</p>
              <div className="mt-1.5 pl-9">
                <code className="text-[11px] font-mono text-cyan-300 bg-[#05070C] px-2 py-1 rounded block overflow-x-auto border border-slate-850">
                  {step.code}
                </code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Requirements Audit */}
      {activeTab === 'requirements' && (
        <div className="space-y-2.5">
          {requirements.map((req, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#080C15] border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200">{req.title}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {req.status}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-400 leading-normal pl-6">{req.detail}</p>
              <div className="mt-1.5 pl-6 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400/90">
                <span className="text-slate-500">File:</span>
                <code>{req.target}</code>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Kotlin Snippets */}
      {activeTab === 'snippets' && (
        <div className="space-y-3 text-xs">
          <div className="p-3 bg-[#080C15] border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-semibold text-slate-200">1. Disambiguation Question Flow:</span>
            <pre className="font-mono text-[11.5px] text-cyan-300 bg-[#05070C] p-2.5 rounded-lg border border-slate-850 overflow-x-auto">
{`val question = "Multiple numbers found for $name. Which one: Mobile or Work?"
ttsHelper.speak(question)
pendingDisambiguationMatches = res.matches`}
            </pre>
          </div>

          <div className="p-3 bg-[#080C15] border border-slate-800 rounded-xl space-y-1.5">
            <span className="font-semibold text-slate-200">2. "Number Batao" Speak Aloud:</span>
            <pre className="font-mono text-[11.5px] text-cyan-300 bg-[#05070C] p-2.5 rounded-lg border border-slate-850 overflow-x-auto">
{`val speech = "\${match.displayName}'s \${match.typeLabel} number is \$spacedDigits."
ttsHelper.speak(speech)`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
