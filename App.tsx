
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AppConfig, 
  ChatWindowData, 
  OpenRouterModel, 
  Message, 
  DEFAULT_MODELS,
  TRANSLATIONS,
  TokenUsage,
  Attachment
} from './types';
import { fetchModels, streamChatCompletion } from './services/api';
import WelcomeScreen from './components/WelcomeScreen';
import ChatWindow from './components/ChatWindow';
import { Download, LogOut, Globe, Sparkles, Paperclip, FileText, ArrowUp, X } from 'lucide-react';

// --- Components ---

const WindowSelector = ({ count, onChange }: { count: number, onChange: (n: 1|2|3|4|6) => void }) => {
  const options = [
    { val: 1, label: '1', icon: (
      <div className="w-5 h-4 bg-current rounded-[3px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
    )},
    { val: 2, label: '2', icon: (
      <div className="flex gap-[3px] w-5 h-4">
        <div className="w-1/2 h-full bg-current rounded-[3px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-1/2 h-full bg-current rounded-[3px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
      </div>
    )},
    { val: 3, label: '3', icon: (
      <div className="flex gap-[2px] w-5 h-4">
        <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
      </div>
    )},
    { val: 4, label: '4', icon: (
      <div className="flex flex-col gap-[2px] w-4 h-4">
        <div className="flex gap-[2px] h-1/2">
             <div className="w-1/2 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-1/2 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex gap-[2px] h-1/2">
             <div className="w-1/2 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-1/2 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    )},
    { val: 6, label: '6', icon: (
       <div className="flex flex-col gap-[2px] w-5 h-4">
        <div className="flex gap-[2px] h-1/2">
             <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="flex gap-[2px] h-1/2">
             <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
             <div className="w-1/3 h-full bg-current rounded-[2px] opacity-40 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>
    )}
  ];

  return (
    <div className="flex items-center bg-gray-100/80 p-1 rounded-[12px] gap-1 backdrop-blur-md">
      {options.map((opt) => (
        <button
          key={opt.val}
          onClick={() => onChange(opt.val as any)}
          className={`group p-2 rounded-[10px] transition-all duration-300 ease-out ${
            count === opt.val 
              ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-gray-900 scale-100' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-white/40 scale-95 hover:scale-100'
          }`}
          title={`${opt.label} Windows`}
        >
          {opt.icon}
        </button>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [chats, setChats] = useState<ChatWindowData[]>([]);
  const [globalInput, setGlobalInput] = useState('');
  const [globalAttachments, setGlobalAttachments] = useState<Attachment[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const globalFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('zhuo_api_key');
    const savedBaseUrl = localStorage.getItem('zhuo_base_url');
    const savedLang = localStorage.getItem('zhuo_lang') as 'zh' | 'en' || 'zh';
    
    // Load favorites
    const savedFavs = localStorage.getItem('zhuo_favorites');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }

    if (savedApiKey && savedBaseUrl) {
      setConfig({
        apiKey: savedApiKey,
        baseUrl: savedBaseUrl,
        windowCount: 2,
        language: savedLang
      });
    }
  }, []);

  const handleToggleFavorite = useCallback((modelId: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(modelId)
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId];
      localStorage.setItem('zhuo_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  }, []);

  useEffect(() => {
    if (!config) return;

    setChats(prevChats => {
      const newChats: ChatWindowData[] = [];
      const count = config.windowCount;
      
      for (let i = 0; i < count; i++) {
        const id = `window-${i}`;
        const existing = prevChats[i];
        
        newChats.push({
          id,
          modelId: existing?.modelId || DEFAULT_MODELS[i % DEFAULT_MODELS.length].id,
          messages: existing?.messages || [],
          isLoading: existing?.isLoading || false,
          error: existing?.error,
          systemPrompt: existing?.systemPrompt || ''
        });
      }
      return newChats;
    });
  }, [config?.windowCount]);

  useEffect(() => {
    if (config) {
      setLoadingModels(true);
      fetchModels(config.apiKey, config.baseUrl)
        .then(fetchedModels => {
          if (fetchedModels.length > 0) {
            setModels(fetchedModels);
          }
        })
        .finally(() => setLoadingModels(false));
    }
  }, [config?.apiKey, config?.baseUrl]);

  const handleConfigSave = (apiKey: string, baseUrl: string, language: 'zh' | 'en') => {
    localStorage.setItem('zhuo_api_key', apiKey);
    localStorage.setItem('zhuo_base_url', baseUrl);
    localStorage.setItem('zhuo_lang', language);
    setConfig({ apiKey, baseUrl, windowCount: 2, language });
  };

  const handleLogout = () => {
    localStorage.removeItem('zhuo_api_key');
    localStorage.removeItem('zhuo_base_url');
    setConfig(null);
    setChats([]);
  };

  const toggleLanguage = () => {
    if (!config) return;
    const newLang = config.language === 'zh' ? 'en' : 'zh';
    setConfig({ ...config, language: newLang });
    localStorage.setItem('zhuo_lang', newLang);
  }

  const updateChat = useCallback((id: string, updates: Partial<ChatWindowData>) => {
    setChats(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const executeStream = async (chatId: string, modelId: string, messages: Message[], systemPrompt?: string) => {
    if (!config) return;
    
    const assistantMsgId = (Date.now() + 1).toString();
    let assistantContent = "";
    
    updateChat(chatId, { 
        messages: [...messages, { 
            id: assistantMsgId, 
            role: 'assistant', 
            content: '', 
            timestamp: Date.now() 
        }],
        isLoading: true,
        error: undefined
    });

    try {
      await streamChatCompletion(
        config.apiKey,
        config.baseUrl,
        modelId,
        messages,
        (chunk) => {
            assistantContent += chunk;
            setChats(currentChats => currentChats.map(c => {
                if (c.id !== chatId) return c;
                const msgs = [...c.messages];
                const lastIdx = msgs.length - 1;
                if (msgs[lastIdx].id === assistantMsgId) {
                    msgs[lastIdx] = { ...msgs[lastIdx], content: assistantContent };
                }
                return { ...c, messages: msgs };
            }));
        },
        (usage) => {
             setChats(currentChats => currentChats.map(c => {
                if (c.id !== chatId) return c;
                const msgs = [...c.messages];
                const lastIdx = msgs.length - 1;
                if (msgs[lastIdx].id === assistantMsgId) {
                    msgs[lastIdx] = { ...msgs[lastIdx], usage: usage };
                }
                return { ...c, messages: msgs };
            }));
        },
        systemPrompt
      );
      updateChat(chatId, { isLoading: false });
    } catch (err: any) {
      updateChat(chatId, { isLoading: false, error: err.message });
    }
  };

  const handleSendMessage = async (id: string, content: string, attachments: Attachment[] = []) => {
    const chat = chats.find(c => c.id === id);
    if (!chat) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      attachments: attachments,
      timestamp: Date.now()
    };
    
    const updatedMessages = [...chat.messages, newMessage];
    await executeStream(id, chat.modelId, updatedMessages, chat.systemPrompt);
  };

  const handleEditMessage = async (chatId: string, messageId: string, newContent: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    const msgIndex = chat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;
    const previousMessages = chat.messages.slice(0, msgIndex);
    const updatedMessage: Message = {
      ...chat.messages[msgIndex],
      content: newContent,
      timestamp: Date.now()
    };
    const newContext = [...previousMessages, updatedMessage];
    updateChat(chatId, { messages: newContext });
    await executeStream(chatId, chat.modelId, newContext, chat.systemPrompt);
  };

  const handleRegenerate = async (chatId: string, messageId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;
    const msgIndex = chat.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;
    const context = chat.messages.slice(0, msgIndex);
    if (context.length === 0 || context[context.length - 1].role !== 'user') return;
    updateChat(chatId, { messages: context });
    await executeStream(chatId, chat.modelId, context, chat.systemPrompt);
  };

  const handleSendAll = async () => {
    if (!globalInput.trim() && globalAttachments.length === 0) return;
    const currentInput = globalInput;
    const currentAttachments = [...globalAttachments];
    
    setGlobalInput(''); 
    setGlobalAttachments([]);

    for (let i = 0; i < chats.length; i++) {
        handleSendMessage(chats[i].id, currentInput, currentAttachments);
        if (i < chats.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }
  };

  const handleGlobalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
     if (e.target.files) {
       Array.from(e.target.files).forEach((file: File) => {
        const isImage = file.type.startsWith('image/');
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            setGlobalAttachments(prev => [...prev, {
                type: isImage ? 'image' : 'file',
                content: event.target!.result as string,
                name: file.name,
                mimeType: file.type
            }]);
          }
        };

        if (isImage) {
            reader.readAsDataURL(file);
        } else {
            // Read text based files
            reader.readAsText(file);
        }
      });
    }
    if (globalFileInputRef.current) globalFileInputRef.current.value = '';
  };

  const handleClearChat = (id: string) => {
    updateChat(id, { messages: [], error: undefined });
  };

  const handleModelChange = (id: string, modelId: string) => {
    updateChat(id, { modelId });
  };

  const handleSystemPromptChange = (id: string, prompt: string) => {
    updateChat(id, { systemPrompt: prompt });
  };

  const handleExport = (chatId: string | null) => {
    const chatsToExport = chatId 
      ? chats.filter(c => c.id === chatId)
      : chats;

    const headers = ['Window ID', 'Model', 'System Prompt', 'Role', 'Time', 'Content', 'Tokens (In/Out)'];
    let csvContent = headers.join(',') + '\n';

    chatsToExport.forEach(chat => {
      const modelName = models.find(m => m.id === chat.modelId)?.name || chat.modelId;
      const systemPrompt = chat.systemPrompt ? `"${chat.systemPrompt.replace(/"/g, '""')}"` : "";
      
      chat.messages.forEach(msg => {
        const time = new Date(msg.timestamp).toLocaleString();
        const safeContent = `"${msg.content.replace(/"/g, '""')}"`;
        const tokens = msg.usage ? `${msg.usage.prompt_tokens}/${msg.usage.completion_tokens}` : "";
        const row = [chat.id, modelName, systemPrompt, msg.role, time, safeContent, tokens];
        csvContent += row.join(',') + '\n';
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `zhuochat_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!config) {
    return <WelcomeScreen onSave={handleConfigSave} />;
  }

  const t = TRANSLATIONS[config.language];

  const getGridClass = () => {
    switch (config.windowCount) {
      case 1: return "grid-cols-1 grid-rows-1";
      case 2: return "grid-cols-1 md:grid-cols-2 grid-rows-1";
      case 3: return "grid-cols-1 md:grid-cols-3 grid-rows-1";
      case 4: return "grid-cols-1 md:grid-cols-2 grid-rows-2";
      case 6: return "grid-cols-1 md:grid-cols-3 grid-rows-2";
      default: return "grid-cols-2";
    }
  };

  const isDense = config.windowCount >= 4;

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f7] overflow-hidden text-gray-900 font-sans selection:bg-[#0071e3] selection:text-white">
      
      {/* Background Ambient (Subtle) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#f5f5f7]">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
      </div>

      {/* Top Navigation - Adaptive Height */}
      <header className={`flex-none ${isDense ? 'h-9 px-4' : 'h-14 px-6'} bg-white/70 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between z-10 sticky top-0 transition-all duration-300`}>
        <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-b from-gray-800 to-black ${isDense ? 'w-5 h-5 rounded-[0.35rem]' : 'w-7 h-7 rounded-[0.5rem]'} shadow-sm flex items-center justify-center text-white transition-all`}>
                <Sparkles size={isDense ? 10 : 14} fill="currentColor" className="opacity-90" />
            </div>
            <h1 className={`${isDense ? 'text-[14px]' : 'text-[17px]'} font-semibold tracking-tight text-gray-900 font-display hidden sm:block transition-all`}>
            ZhuoChat
            </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {loadingModels && (
            <div className={`hidden sm:flex items-center gap-2 ${isDense ? 'px-2 py-0.5' : 'px-3 py-1'} bg-gray-100/50 backdrop-blur-sm rounded-full animate-in fade-in`}>
               <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse" />
               <span className="text-[10px] text-gray-500 font-medium">{t.modelLoading}</span>
            </div>
          )}
          
          <div className="h-4 w-px bg-gray-300/50 mx-2 hidden sm:block"></div>

          <button 
             onClick={toggleLanguage}
             className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-black/5 rounded-md transition-all active:scale-95"
             title="Switch Language"
          >
             <Globe size={isDense ? 14 : 18} strokeWidth={1.5} />
          </button>

          <button
            onClick={() => handleExport(null)}
            className={`flex items-center gap-2 ${isDense ? 'px-2 py-1 text-[11px]' : 'px-3 py-1.5 text-[13px]'} bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg transition-all shadow-sm active:scale-95`}
          >
            <Download size={isDense ? 12 : 14} />
            <span className="hidden sm:inline">{t.exportAll}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all active:scale-95"
            title={t.logout}
          >
            <LogOut size={isDense ? 14 : 18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      {/* Main Grid Area */}
      <main className={`flex-1 overflow-hidden p-2 sm:p-4 z-0 relative ${isDense ? 'pt-2' : ''}`}>
        <div className={`grid gap-3 sm:gap-4 h-full w-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${getGridClass()}`}>
          {chats.map((chat) => (
            <div key={chat.id} className="min-h-0 min-w-0 animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
                <ChatWindow
                  data={chat}
                  availableModels={models}
                  onSendMessage={handleSendMessage}
                  onClear={handleClearChat}
                  onExport={handleExport}
                  onModelChange={handleModelChange}
                  onSystemPromptChange={handleSystemPromptChange}
                  onEditMessage={handleEditMessage}
                  onRegenerate={handleRegenerate}
                  lang={config.language}
                  isDense={isDense}
                  favoriteModels={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Control Bar - Adaptive Padding */}
      <footer className={`flex-none bg-white/80 backdrop-blur-2xl border-t border-gray-200/50 px-4 z-20 transition-all duration-300 ${isDense ? 'py-1.5 pb-2' : 'py-3 sm:py-4 pb-6 sm:pb-6'}`}>
        
        {/* Global Attachment Previews */}
        {globalAttachments.length > 0 && (
            <div className="max-w-[800px] mx-auto mb-1 flex gap-2 overflow-x-auto px-1 justify-center">
                {globalAttachments.map((att, idx) => (
                    <div key={idx} className="relative group flex-shrink-0 animate-in slide-in-from-bottom-2 fade-in">
                        {att.type === 'image' ? (
                            <img src={att.content} className="h-8 w-8 rounded-[8px] object-cover border border-gray-200 shadow-sm" alt="preview" />
                        ) : (
                            <div className="h-8 w-8 bg-white rounded-[8px] border border-gray-200 flex flex-col items-center justify-center p-0.5 shadow-sm">
                                <FileText size={12} className="text-gray-500" />
                            </div>
                        )}
                        <button 
                        onClick={() => setGlobalAttachments(prev => prev.filter((_, i) => i !== idx))}
                        className="absolute -top-1.5 -right-1.5 bg-gray-500 hover:bg-gray-700 text-white rounded-full p-0.5 shadow-sm transition-colors"
                        >
                            <X size={10} />
                        </button>
                    </div>
                ))}
            </div>
        )}

        <div className="max-w-[900px] mx-auto flex flex-col md:flex-row items-center gap-2 sm:gap-4">
          
          {/* Window Selector */}
          <div className={`hidden md:flex items-center gap-3 pr-4 border-r border-gray-200/50 ${isDense ? 'scale-90 origin-left' : ''}`}>
             <WindowSelector 
               count={config.windowCount} 
               onChange={(n) => setConfig({ ...config, windowCount: n })} 
             />
          </div>

          {/* Mobile Window Selector */}
          <div className="md:hidden w-full mb-1">
            <div className="bg-gray-100 rounded-lg p-0.5 flex justify-between">
                {[1,2,3,4,6].map(n => (
                    <button 
                        key={n}
                        onClick={() => setConfig({ ...config, windowCount: Number(n) as any })}
                        className={`flex-1 py-1 text-[10px] font-medium rounded-md transition-all ${config.windowCount === n ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                    >
                        {n}
                    </button>
                ))}
            </div>
          </div>

          {/* Global Input - Pill Shape */}
          <div className={`flex-1 w-full flex items-center gap-2 bg-gray-100/80 rounded-full ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#007AFF]/30 focus-within:bg-white transition-all duration-300 shadow-inner ${isDense ? 'p-1' : 'p-1.5'}`}>
            
            <input 
                type="file" 
                multiple 
                accept="image/*, .txt, .md, .csv, .json, .js, .ts, .py, .html, .css" 
                className="hidden" 
                ref={globalFileInputRef}
                onChange={handleGlobalFileSelect} 
            />
            
            <button
                onClick={() => globalFileInputRef.current?.click()}
                className={`ml-1 text-gray-400 hover:text-[#007AFF] hover:bg-blue-50 rounded-full transition-all active:scale-90 ${isDense ? 'p-1' : 'p-1.5'}`}
            >
                <Paperclip size={isDense ? 14 : 18} strokeWidth={2} />
            </button>

            <input
                type="text"
                value={globalInput}
                onChange={(e) => setGlobalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAll()}
                placeholder={t.sendToAllPlaceholder}
                className={`flex-1 bg-transparent border-none outline-none font-normal text-gray-900 placeholder-gray-400 px-2 ${isDense ? 'h-7 text-[13px]' : 'h-8 sm:h-9 text-[14px]'}`}
            />
            
            <button
                onClick={handleSendAll}
                disabled={!globalInput.trim() && globalAttachments.length === 0}
                className={`rounded-full transition-all duration-300 ${(!globalInput.trim() && globalAttachments.length === 0) ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#007AFF] text-white hover:bg-[#0062cc] shadow-md transform hover:scale-105 active:scale-95'} ${isDense ? 'p-1' : 'p-1.5'}`}
            >
                <ArrowUp size={isDense ? 14 : 18} strokeWidth={2.5} />
            </button>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
