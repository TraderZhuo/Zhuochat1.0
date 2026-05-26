
import React, { useEffect, useState } from 'react';
import { Key, Server, ArrowRight, KeyRound, X } from 'lucide-react';
import { DEFAULT_BASE_URL, TRANSLATIONS } from '../types';

interface WelcomeScreenProps {
  onSave: (apiKey: string, baseUrl: string, language: 'zh' | 'en') => void;
  onClose?: () => void;
  initialApiKey?: string;
  initialBaseUrl?: string;
  initialLanguage?: 'zh' | 'en';
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSave,
  onClose,
  initialApiKey = '',
  initialBaseUrl = DEFAULT_BASE_URL,
  initialLanguage = 'zh'
}) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [baseUrl, setBaseUrl] = useState(initialBaseUrl);
  const t = TRANSLATIONS[initialLanguage];

  useEffect(() => {
    setApiKey(initialApiKey);
    setBaseUrl(initialBaseUrl || DEFAULT_BASE_URL);
  }, [initialApiKey, initialBaseUrl, initialLanguage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim(), baseUrl.trim(), initialLanguage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 font-sans text-gray-900 animate-in fade-in duration-200">

      <div className="bg-white/95 backdrop-blur-2xl p-5 sm:p-6 rounded-[22px] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)] max-w-[420px] w-full border border-white/80 ring-1 ring-black/5 relative z-10 transition-all duration-300 animate-in zoom-in-95">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all active:scale-95"
            title={t.close}
          >
            <X size={16} />
          </button>
        )}

        <div className="mb-6 flex items-start gap-3 pr-8">
          <div className="w-10 h-10 bg-gradient-to-b from-gray-800 to-black rounded-xl flex items-center justify-center shadow-sm ring-1 ring-white/10 flex-shrink-0">
             <KeyRound size={20} className="text-white/90" strokeWidth={1.9} />
          </div>
          <div className="min-w-0 pt-0.5">
            <h1 className="text-[19px] font-semibold text-gray-900 tracking-tight">{t.apiModalTitle}</h1>
            <p className="mt-1 text-gray-500 text-[13px] leading-relaxed font-normal">{t.apiModalSubtitle}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-gray-400 ml-1">
              {t.apiEndpoint}
            </label>
            <div className="relative group">
              <Server size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                autoComplete="url"
                inputMode="url"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border-0 bg-gray-50/80 ring-1 ring-gray-200/80 focus:ring-2 focus:ring-black/10 focus:bg-white outline-none transition-all duration-300 text-gray-800 text-[14px] font-medium placeholder-gray-400"
                placeholder="https://openrouter.ai/api/v1"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
             <label className="text-[11px] font-semibold text-gray-400 ml-1">
              {t.apiKey}
            </label>
            <div className="relative group">
              <Key size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors duration-300" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-10 pr-3.5 py-3 rounded-xl border-0 bg-gray-50/80 ring-1 ring-gray-200/80 focus:ring-2 focus:ring-black/10 focus:bg-white outline-none transition-all duration-300 text-gray-800 text-[14px] font-medium placeholder-gray-400"
                placeholder="sk-or-..."
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!apiKey}
            className="w-full mt-1 bg-[#1d1d1f] hover:bg-black disabled:opacity-45 disabled:cursor-not-allowed text-white text-[14px] font-medium py-3 px-5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
          >
            {t.saveApiSettings}
            <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="mt-5 text-[11px] text-center text-gray-400 font-medium">
          {t.localStorageHint}
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
