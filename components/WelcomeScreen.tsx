
import React, { useState } from 'react';
import { Key, Server, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { DEFAULT_BASE_URL, TRANSLATIONS } from '../types';

interface WelcomeScreenProps {
  onSave: (apiKey: string, baseUrl: string, language: 'zh' | 'en') => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSave }) => {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');

  const t = TRANSLATIONS[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim(), baseUrl.trim(), lang);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7] p-6 font-sans text-gray-900 relative overflow-hidden">
      
      {/* Background Ambient Light */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gray-200/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gray-300/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Language Toggle */}
      <div className="absolute top-8 right-8 z-10">
        <button 
          onClick={() => setLang(l => l === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/60 rounded-full shadow-sm hover:bg-white/80 transition-all text-xs font-medium text-gray-600 active:scale-95"
        >
          <Globe size={14} />
          {lang === 'zh' ? 'English' : '简体中文'}
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-2xl p-10 md:p-12 rounded-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] max-w-[440px] w-full border border-white/80 ring-1 ring-black/5 relative z-10 transition-all duration-500 animate-in fade-in zoom-in-95">
        <div className="text-center mb-10">
          {/* Updated Icon to match App Header Dark Style exactly */}
          <div className="w-20 h-20 bg-gradient-to-b from-gray-800 to-black rounded-[22px] mx-auto mb-6 flex items-center justify-center shadow-lg shadow-gray-900/20 ring-1 ring-white/10">
             <Sparkles size={40} className="text-white/90" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{t.welcomeTitle}</h1>
          <p className="text-gray-500 text-[15px] leading-relaxed font-normal">{t.welcomeSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-3">
              {t.apiEndpoint}
            </label>
            <div className="relative group">
              <Server size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 bg-white/50 ring-1 ring-gray-200/80 focus:ring-2 focus:ring-black/10 focus:bg-white outline-none transition-all duration-300 text-gray-800 text-[14px] font-medium placeholder-gray-400"
                placeholder="https://openrouter.ai/api/v1"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider ml-3">
              {t.apiKey}
            </label>
            <div className="relative group">
              <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-0 bg-white/50 ring-1 ring-gray-200/80 focus:ring-2 focus:ring-black/10 focus:bg-white outline-none transition-all duration-300 text-gray-800 text-[14px] font-medium placeholder-gray-400"
                placeholder="sk-or-..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!apiKey}
            className="w-full mt-2 bg-[#1d1d1f] hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-medium py-3.5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-gray-900/10 active:scale-[0.98]"
          >
            {t.startChat}
            <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="mt-8 text-xs text-center text-gray-400 font-medium">
          {t.localStorageHint}
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
