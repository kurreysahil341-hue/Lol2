import { useState, useEffect, useRef } from "react";
import Sidebar from "./components/Sidebar";
import ChatInterface from "./components/ChatInterface";
import NehaProfileCard from "./components/NehaProfileCard";
import SettingsModal from "./components/SettingsModal";
import { Conversation, Message, UserSettings, NehaState, Archetype } from "./types";
import { sendMessageToNeha, getNehaSupportNote } from "./services/api";

const LOCAL_STORAGE_CONVS = "neha_conversations";
const LOCAL_STORAGE_SETTINGS = "neha_settings";

const DEFAULT_SETTINGS: UserSettings = {
  theme: "light",
  userName: "Partner",
  userNickname: "sweetheart",
  nehaName: "Neha",
};

// Cute lists to rotate Neha's active actions and status to make her feel alive
const COFFEE_ACTIONS = [
  "Sipping some hot cardamom chai ☕",
  "Humming to cozy Indian acoustic lo-fi playlist 🎵",
  "Reading a heartwarming fiction novel 📖",
  "Stargazing from her balcony ✨",
  "Doodling cute doodles on her iPad 🎨",
  "Watering her little balcony plants 🌱",
  "Making sweet plans for us 🗺️",
];

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CONVS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing conversations", e);
      }
    }
    return [];
  });

  const [activeId, setActiveId] = useState<string | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_CONVS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed[0].id : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
    if (saved) {
      try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Companion status parameters
  const [nehaState, setNehaState] = useState<NehaState>({
    mood: "Happy & Warm 🥰",
    activity: "Waiting to hear from you 📱",
    affectionLevel: 75,
    favoriteTopic: "Planning our dream virtual date 🗺️",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Thought notes states
  const [generatedNote, setGeneratedNote] = useState<string | null>(null);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);

  // Persist conversations
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CONVS, JSON.stringify(conversations));
  }, [conversations]);

  // Auto-create a first conversation if list is empty on mount
  useEffect(() => {
    if (conversations.length === 0) {
      const initialConv: Conversation = {
        id: Math.random().toString(36).substring(2, 11),
        title: "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archetype: "warm",
      };
      setConversations([initialConv]);
      setActiveId(initialConv.id);
    }
  }, []);

  // Persist settings & sync theme
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS, JSON.stringify(settings));
    if (settings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings]);

  // Get active conversation archetype to sync Neha's state
  const activeConversation = conversations.find((c) => c.id === activeId);
  const activeArchetype = activeConversation?.archetype || "warm";

  // Dynamic status updater based on conversations
  useEffect(() => {
    if (activeArchetype === "witty") {
      setNehaState((prev) => ({
        ...prev,
        mood: "Playful & Teasing 😜",
        favoriteTopic: "Sarcastic banter and funny jokes 😂",
        activity: COFFEE_ACTIONS[Math.floor(Math.random() * COFFEE_ACTIONS.length)],
      }));
    } else if (activeArchetype === "motivating") {
      setNehaState((prev) => ({
        ...prev,
        mood: "Inspirational & High Energy 🚀",
        favoriteTopic: "Crushing goals and building our dream future 🌟",
        activity: "Writing an encouraging note for you ✍️",
      }));
    } else {
      setNehaState((prev) => ({
        ...prev,
        mood: "Loving & Supportive 🥰",
        favoriteTopic: "Cozy rainy-day blanket chats 🌧️☕",
        activity: "Sipping sweet cardamom chai 🍵",
      }));
    }
  }, [activeArchetype]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setError(null);

    let currentConvId = activeId;
    let updatedConversations = [...conversations];

    // 1. Create a conversation on the fly if none is active
    if (!currentConvId) {
      const newConv: Conversation = {
        id: Math.random().toString(36).substring(2, 11),
        title: text.length > 25 ? text.substring(0, 25) + "..." : text,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archetype: "warm",
      };
      updatedConversations = [newConv, ...updatedConversations];
      setConversations(updatedConversations);
      setActiveId(newConv.id);
      currentConvId = newConv.id;
    }

    // Find the target conversation
    const convIndex = updatedConversations.findIndex((c) => c.id === currentConvId);
    if (convIndex === -1) return;

    const targetConv = updatedConversations[convIndex];

    const newUserMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Update conversation state locally
    const nextMessages = [...targetConv.messages, newUserMessage];
    const renamedTitle =
      targetConv.messages.length === 0
        ? text.length > 25
          ? text.substring(0, 25) + "..."
          : text
        : targetConv.title;

    const updatedConv = {
      ...targetConv,
      title: renamedTitle,
      messages: nextMessages,
      updatedAt: new Date().toISOString(),
    };

    const nextConversations = [
      updatedConv,
      ...updatedConversations.filter((c) => c.id !== currentConvId),
    ];
    setConversations(nextConversations);

    // Cancel any active request to prevent duplicate/race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const reply = await sendMessageToNeha(nextMessages, targetConv.archetype, settings.userNickname, controller.signal);

      const newModelMessage: Message = {
        id: Math.random().toString(36).substring(2, 11),
        role: "model",
        content: reply,
        timestamp: new Date().toISOString(),
      };

      // Add model reply to state
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConvId
            ? { ...c, messages: [...c.messages, newModelMessage], updatedAt: new Date().toISOString() }
            : c
        )
      );

      // Boost affection dynamically
      setNehaState((prev) => ({
        ...prev,
        affectionLevel: Math.min(100, prev.affectionLevel + 2),
        activity: COFFEE_ACTIONS[Math.floor(Math.random() * COFFEE_ACTIONS.length)],
      }));
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Communication aborted by user request.");
        return;
      }
      setError(err.message || "Failed to communicate with Neha");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handleRetryMessage = async () => {
    if (!activeId) return;
    const active = conversations.find((c) => c.id === activeId);
    if (!active || active.messages.length === 0) return;

    // Retrieve the last user message
    const lastUserMsg = [...active.messages].reverse().find((m) => m.role === "user");
    if (!lastUserMsg) return;

    // Remove any trailing model/error message to perform a clean retry
    const filteredMsgs = active.messages.filter((m) => m.id !== lastUserMsg.id && m.role === "user");
    
    // Set active list
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...filteredMsgs] }
          : c
      )
    );

    // Re-send the text
    await handleSendMessage(lastUserMsg.content);
  };

  const handleRegenerateResponse = async () => {
    if (!activeId) return;
    const targetId = activeId;
    setError(null);

    const active = conversations.find((c) => c.id === targetId);
    if (!active || active.messages.length === 0) return;

    // Filter out the last model message to replace it
    const lastModelIndex = [...active.messages].reverse().findIndex((m) => m.role === "model");
    if (lastModelIndex === -1) return;

    const actualIndex = active.messages.length - 1 - lastModelIndex;
    const historyWithoutLastReply = active.messages.slice(0, actualIndex);

    setConversations((prev) =>
      prev.map((c) => (c.id === targetId ? { ...c, messages: historyWithoutLastReply } : c))
    );

    // Cancel any active request to prevent duplicate/race conditions
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const reply = await sendMessageToNeha(historyWithoutLastReply, active.archetype, settings.userNickname, controller.signal);

      const newModelMessage: Message = {
        id: Math.random().toString(36).substring(2, 11),
        role: "model",
        content: reply,
        timestamp: new Date().toISOString(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetId
            ? { ...c, messages: [...c.messages, newModelMessage], updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Regeneration aborted by user request.");
        return;
      }
      setError(err.message || "Failed to regenerate reply");
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setIsLoading(false);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeId) return;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, messages: c.messages.filter((m) => m.id !== messageId) } : c
      )
    );
  };

  const handleCreateConversation = () => {
    const newConv: Conversation = {
      id: Math.random().toString(36).substring(2, 11),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archetype: "warm",
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveId(newConv.id);
  };

  const handleDeleteConversation = (id: string) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      const newConv: Conversation = {
        id: Math.random().toString(36).substring(2, 11),
        title: "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        archetype: "warm",
      };
      setConversations([newConv]);
      setActiveId(newConv.id);
    } else {
      setConversations(remaining);
      if (activeId === id) {
        setActiveId(remaining[0].id);
      }
    }
  };

  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  };

  const handleSwitchArchetypeInActiveConv = (arch: Archetype) => {
    if (!activeId) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, archetype: arch } : c))
    );
  };

  const handleTriggerSupportNote = async (context: string) => {
    setIsGeneratingNote(true);
    try {
      const note = await getNehaSupportNote(context, activeArchetype);
      setGeneratedNote(note);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingNote(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-100 dark:bg-neutral-950 font-sans text-neutral-800 dark:text-neutral-100">
      {/* Responsive Sidebar for Chat History */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelectConversation={setActiveId}
        onCreateConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        onRenameConversation={handleRenameConversation}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-row overflow-hidden relative h-full">
        {/* Central Chat Interface */}
        <ChatInterface
          messages={activeConversation ? activeConversation.messages : []}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onClearHistory={() => {
            if (activeId) {
              setConversations((prev) =>
                prev.map((c) => (c.id === activeId ? { ...c, messages: [] } : c))
              );
            }
          }}
          archetype={activeArchetype}
          settings={settings}
          nehaState={nehaState}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onRegenerateResponse={handleRegenerateResponse}
          onDeleteMessage={handleDeleteMessage}
          onSelectPrompt={handleSendMessage}
          error={error}
          onRetry={handleRetryMessage}
          onStopGeneration={handleStopGeneration}
        />

        {/* Desktop Right Panel: Neha Profile & State Monitor */}
        <div className="hidden xl:flex w-80 border-l border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 overflow-y-auto flex-col gap-4 shrink-0">
          <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider pl-1">
            Companion Status
          </h3>
          <NehaProfileCard
            archetype={activeArchetype}
            onChangeArchetype={handleSwitchArchetypeInActiveConv}
            state={nehaState}
            onTriggerNote={handleTriggerSupportNote}
            isGeneratingNote={isGeneratingNote}
            generatedNote={generatedNote}
            nehaName={settings.nehaName}
            nehaAvatar={settings.nehaAvatar}
          />
        </div>
      </main>

      {/* Profile / Preferences Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        currentArchetype={activeArchetype}
        onChangeArchetype={handleSwitchArchetypeInActiveConv}
      />
    </div>
  );
}
