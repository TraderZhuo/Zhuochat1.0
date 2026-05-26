
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { Trash2, Download, Bot, SlidersHorizontal, Copy, RefreshCw, Pencil, X, Paperclip, FileText, ArrowUp, ChevronDown, Search, Check, Code, Zap, Star, Sparkles, Tag } from 'lucide-react';
import Ai21Icon from '@lobehub/icons/es/Ai21/components/Mono';
import AionLabsIcon from '@lobehub/icons/es/AionLabs/components/Mono';
import AlephAlphaIcon from '@lobehub/icons/es/AlephAlpha/components/Mono';
import AnthropicIcon from '@lobehub/icons/es/Claude/components/Mono';
import ArceeIcon from '@lobehub/icons/es/Arcee/components/Mono';
import BaiduIcon from '@lobehub/icons/es/Baidu/components/Mono';
import BaichuanIcon from '@lobehub/icons/es/Baichuan/components/Mono';
import BedrockIcon from '@lobehub/icons/es/Bedrock/components/Mono';
import ByteDanceIcon from '@lobehub/icons/es/ByteDance/components/Mono';
import CloudflareIcon from '@lobehub/icons/es/Cloudflare/components/Mono';
import CohereIcon from '@lobehub/icons/es/Cohere/components/Mono';
import DeepSeekIcon from '@lobehub/icons/es/DeepSeek/components/Mono';
import DeepCogitoIcon from '@lobehub/icons/es/DeepCogito/components/Mono';
import EssentialAIIcon from '@lobehub/icons/es/EssentialAI/components/Mono';
import GeminiIcon from '@lobehub/icons/es/Gemini/components/Mono';
import GroqIcon from '@lobehub/icons/es/Groq/components/Mono';
import HuggingFaceIcon from '@lobehub/icons/es/HuggingFace/components/Mono';
import HunyuanIcon from '@lobehub/icons/es/Hunyuan/components/Mono';
import IBMIcon from '@lobehub/icons/es/IBM/components/Mono';
import InflectionIcon from '@lobehub/icons/es/Inflection/components/Mono';
import InceptionIcon from '@lobehub/icons/es/Inception/components/Mono';
import KimiIcon from '@lobehub/icons/es/Kimi/components/Mono';
import KwaipilotIcon from '@lobehub/icons/es/Kwaipilot/components/Mono';
import LiquidIcon from '@lobehub/icons/es/Liquid/components/Mono';
import MetaIcon from '@lobehub/icons/es/Meta/components/Mono';
import MicrosoftIcon from '@lobehub/icons/es/Microsoft/components/Mono';
import MiniMaxIcon from '@lobehub/icons/es/MiniMax/components/Mono';
import MistralIcon from '@lobehub/icons/es/Mistral/components/Mono';
import MoonshotIcon from '@lobehub/icons/es/Moonshot/components/Mono';
import MorphIcon from '@lobehub/icons/es/Morph/components/Mono';
import NvidiaIcon from '@lobehub/icons/es/Nvidia/components/Mono';
import NousResearchIcon from '@lobehub/icons/es/NousResearch/components/Mono';
import OpenAIIcon from '@lobehub/icons/es/OpenAI/components/Mono';
import OpenRouterIcon from '@lobehub/icons/es/OpenRouter/components/Mono';
import PerplexityIcon from '@lobehub/icons/es/Perplexity/components/Mono';
import QwenIcon from '@lobehub/icons/es/Qwen/components/Mono';
import RelaceIcon from '@lobehub/icons/es/Relace/components/Mono';
import StepfunIcon from '@lobehub/icons/es/Stepfun/components/Mono';
import TencentIcon from '@lobehub/icons/es/Tencent/components/Mono';
import UpstageIcon from '@lobehub/icons/es/Upstage/components/Mono';
import VoyageIcon from '@lobehub/icons/es/Voyage/components/Mono';
import VolcengineIcon from '@lobehub/icons/es/Volcengine/components/Mono';
import WorkersAIIcon from '@lobehub/icons/es/WorkersAI/components/Mono';
import XAIIcon from '@lobehub/icons/es/XAI/components/Mono';
import XiaomiMiMoIcon from '@lobehub/icons/es/XiaomiMiMo/components/Mono';
import YandexIcon from '@lobehub/icons/es/Yandex/components/Mono';
import YiIcon from '@lobehub/icons/es/Yi/components/Mono';
import ZAIIcon from '@lobehub/icons/es/ZAI/components/Mono';
import ZeroOneIcon from '@lobehub/icons/es/ZeroOne/components/Mono';
import { ChatWindowData, OpenRouterModel, TRANSLATIONS, Attachment } from '../types';

interface ChatWindowProps {
  data: ChatWindowData;
  availableModels: OpenRouterModel[];
  onSendMessage: (id: string, content: string, attachments?: Attachment[]) => void;
  onClear: (id: string) => void;
  onExport: (id: string) => void;
  onModelChange: (id: string, modelId: string) => void;
  onSystemPromptChange: (id: string, prompt: string) => void;
  onEditMessage: (id: string, messageId: string, newContent: string) => void;
  onRegenerate: (id: string, messageId: string) => void;
  lang: 'zh' | 'en';
  isDense?: boolean;
  isApiConnected?: boolean;
  favoriteModels?: string[];
  onToggleFavorite?: (modelId: string) => void;
}

// --- Vendor Icon Logic ---

type BrandIcon = React.ComponentType<any>;

interface VendorIconSpec {
  Icon?: BrandIcon;
  color: string;
  label: string;
  name: string;
}

const fallbackVendor: VendorIconSpec = {
  color: '#6B7280',
  label: 'AI',
  name: 'AI Model',
};

const getVendorIconSpec = (modelId: string): VendorIconSpec => {
  const id = (modelId || '').toLowerCase();
  const vendor = id.split('/')[0].replace(/^~/, '');
  
  if (vendor === 'openai') return { Icon: OpenAIIcon, color: '#0F172A', label: 'OpenAI', name: 'OpenAI' };
  if (vendor === 'anthropic') return { Icon: AnthropicIcon, color: '#D97757', label: 'Claude', name: 'Claude' };
  if (vendor === 'google' || id.includes('gemini') || id.includes('gemma')) return { Icon: GeminiIcon, color: '#4285F4', label: 'Gemini', name: 'Google Gemini' };
  if (vendor === 'meta-llama' || id.includes('llama')) return { Icon: MetaIcon, color: '#0668E1', label: 'Meta', name: 'Meta' };
  if (vendor === 'mistralai' || vendor === 'mistral') return { Icon: MistralIcon, color: '#FA520F', label: 'Mistral', name: 'Mistral AI' };
  if (vendor === 'deepseek') return { Icon: DeepSeekIcon, color: '#4D6BFE', label: 'DeepSeek', name: 'DeepSeek' };
  if (vendor === 'qwen' || id.includes('alibaba')) return { Icon: QwenIcon, color: '#615CED', label: 'Qwen', name: 'Qwen' };
  if (vendor === 'minimax') return { Icon: MiniMaxIcon, color: '#FF4F4F', label: 'MiniMax', name: 'MiniMax' };
  if (vendor === 'x-ai') return { Icon: XAIIcon, color: '#111827', label: 'xAI', name: 'xAI' };
  if (vendor === 'perplexity') return { Icon: PerplexityIcon, color: '#22B8CD', label: 'PPLX', name: 'Perplexity' };
  if (vendor === 'nvidia') return { Icon: NvidiaIcon, color: '#76B900', label: 'NVIDIA', name: 'NVIDIA' };
  if (vendor === 'openrouter') return { Icon: OpenRouterIcon, color: '#111827', label: 'OpenRouter', name: 'OpenRouter' };
  if (vendor === 'z-ai') return { Icon: ZAIIcon, color: '#111827', label: 'Z.ai', name: 'Z.ai' };
  if (vendor === 'moonshotai') return id.includes('kimi')
    ? { Icon: KimiIcon, color: '#111827', label: 'Kimi', name: 'Kimi' }
    : { Icon: MoonshotIcon, color: '#111827', label: 'Moonshot', name: 'Moonshot AI' };
  if (vendor === 'baidu') return { Icon: BaiduIcon, color: '#2932E1', label: 'Baidu', name: 'Baidu' };
  if (vendor === 'bytedance-seed' || vendor === 'bytedance') return { Icon: ByteDanceIcon, color: '#111827', label: 'ByteDance', name: 'ByteDance' };
  if (vendor === 'cohere') return { Icon: CohereIcon, color: '#39594D', label: 'Cohere', name: 'Cohere' };
  if (vendor === 'microsoft') return { Icon: MicrosoftIcon, color: '#00A4EF', label: 'Microsoft', name: 'Microsoft' };
  if (vendor === 'amazon') return { Icon: BedrockIcon, color: '#FF9900', label: 'Bedrock', name: 'Amazon Bedrock' };
  if (vendor === 'tencent') return id.includes('hunyuan')
    ? { Icon: HunyuanIcon, color: '#0052D9', label: 'Hunyuan', name: 'Hunyuan' }
    : { Icon: TencentIcon, color: '#0052D9', label: 'Tencent', name: 'Tencent' };
  if (vendor === 'ibm-granite') return { Icon: IBMIcon, color: '#0F62FE', label: 'IBM', name: 'IBM' };
  if (vendor === 'xiaomi') return { Icon: XiaomiMiMoIcon, color: '#FF6900', label: 'MiMo', name: 'Xiaomi MiMo' };
  if (vendor === 'ai21') return { Icon: Ai21Icon, color: '#111827', label: 'AI21', name: 'AI21' };
  if (vendor === 'aion-labs') return { Icon: AionLabsIcon, color: '#6D5DFC', label: 'Aion', name: 'Aion Labs' };
  if (vendor === 'arcee-ai') return { Icon: ArceeIcon, color: '#4F46E5', label: 'Arcee', name: 'Arcee' };
  if (vendor === 'nousresearch') return { Icon: NousResearchIcon, color: '#111827', label: 'Nous', name: 'Nous Research' };
  if (vendor === 'liquid') return { Icon: LiquidIcon, color: '#0EA5E9', label: 'Liquid', name: 'Liquid AI' };
  if (vendor === 'relace') return { Icon: RelaceIcon, color: '#111827', label: 'Relace', name: 'Relace' };
  if (vendor === 'morph') return { Icon: MorphIcon, color: '#111827', label: 'Morph', name: 'Morph' };
  if (vendor === 'groq') return { Icon: GroqIcon, color: '#F55036', label: 'Groq', name: 'Groq' };
  if (vendor === 'volcengine') return { Icon: VolcengineIcon, color: '#1664FF', label: 'Volcengine', name: 'Volcengine' };
  if (vendor === 'cloudflare') return { Icon: CloudflareIcon, color: '#F38020', label: 'Cloudflare', name: 'Cloudflare' };
  if (vendor === 'workers-ai') return { Icon: WorkersAIIcon, color: '#F38020', label: 'Workers AI', name: 'Workers AI' };
  if (vendor === 'huggingface') return { Icon: HuggingFaceIcon, color: '#FF9D00', label: 'HF', name: 'Hugging Face' };
  if (vendor === 'inflection') return { Icon: InflectionIcon, color: '#111827', label: 'Inflection', name: 'Inflection' };
  if (vendor === 'inception') return { Icon: InceptionIcon, color: '#111827', label: 'Inception', name: 'Inception' };
  if (vendor === 'essentialai') return { Icon: EssentialAIIcon, color: '#111827', label: 'Essential', name: 'Essential AI' };
  if (vendor === 'deepcogito') return { Icon: DeepCogitoIcon, color: '#111827', label: 'Cogito', name: 'Deep Cogito' };
  if (vendor === 'kwaipilot') return { Icon: KwaipilotIcon, color: '#FF5F00', label: 'Kwai', name: 'Kwaipilot' };
  if (vendor === 'stepfun') return { Icon: StepfunIcon, color: '#111827', label: 'Stepfun', name: 'Stepfun' };
  if (vendor === 'upstage') return { Icon: UpstageIcon, color: '#111827', label: 'Upstage', name: 'Upstage' };
  if (vendor === 'voyage') return { Icon: VoyageIcon, color: '#111827', label: 'Voyage', name: 'Voyage AI' };
  if (vendor === 'baichuan') return { Icon: BaichuanIcon, color: '#1D4ED8', label: 'Baichuan', name: 'Baichuan' };
  if (vendor === '01-ai' || vendor === 'zero-one') return { Icon: ZeroOneIcon, color: '#111827', label: '01.AI', name: '01.AI' };
  if (vendor === 'yi') return { Icon: YiIcon, color: '#111827', label: 'Yi', name: 'Yi' };
  if (vendor === 'aleph-alpha') return { Icon: AlephAlphaIcon, color: '#111827', label: 'Aleph', name: 'Aleph Alpha' };
  if (vendor === 'yandex') return { Icon: YandexIcon, color: '#FC3F1D', label: 'Yandex', name: 'Yandex' };

  return fallbackVendor;
};

const ModelAvatar = ({ modelId, size = 'normal', isDense = false }: { modelId: string, size?: 'small' | 'normal' | 'large', isDense?: boolean }) => {
  const vendor = getVendorIconSpec(modelId);
  const Icon = vendor.Icon;
  
  let sizeClass = 'w-8 h-8 rounded-[9px]'; 
  let iconSize = 19;
  if (size === 'small') {
    sizeClass = 'w-6 h-6 rounded-[7px]';
    iconSize = 14;
  }
  if (size === 'large') {
    sizeClass = 'w-12 h-12 rounded-[14px]';
    iconSize = 29;
  }
  if (isDense && size === 'normal') {
    sizeClass = 'w-6 h-6 rounded-[7px]';
    iconSize = 14;
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center bg-white border border-gray-200/70 shadow-sm select-none overflow-hidden`}
      style={{ color: vendor.color }}
      title={vendor.name}
    >
      {Icon ? (
        <Icon size={iconSize} />
      ) : (
        <span className="text-[9px] font-bold tracking-tight text-gray-500 scale-90">{vendor.label}</span>
      )}
    </div>
  );
};

// Helper to remove vendor prefix (e.g., "Anthropic: Claude" -> "Claude")
const cleanModelName = (name: string) => {
  // Regex removes "Name: " or "Name/ " patterns common in OpenRouter
  return name.replace(/^[\w\s]+[:/]\s*/i, '').trim();
};

const ModelSelector = ({ 
  currentModelId, 
  models, 
  onChange, 
  t,
  isDense,
  favorites = [],
  onToggleFavorite
}: { 
  currentModelId: string, 
  models: OpenRouterModel[], 
  onChange: (id: string) => void,
  t: any,
  isDense?: boolean,
  favorites?: string[],
  onToggleFavorite?: (id: string) => void
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentModel = models.find(m => m.id === currentModelId) || { id: currentModelId, name: currentModelId };
  const displayName = cleanModelName(currentModel.name);

  // Grouping logic
  const groupedModels = useMemo(() => {
    const lowerSearch = search.toLowerCase().trim();
    let filtered = models;

    // Filter Logic:
    // If search exists, we verify against the CLEAN name first for better UX
    if (lowerSearch) {
      filtered = models.filter(m => {
        const cleanName = cleanModelName(m.name).toLowerCase();
        const id = m.id.toLowerCase();
        return cleanName.includes(lowerSearch) || id.includes(lowerSearch);
      });
      // Sort: Exact startsWith on cleanName gets priority
      filtered.sort((a, b) => {
          const aClean = cleanModelName(a.name).toLowerCase();
          const bClean = cleanModelName(b.name).toLowerCase();
          const aStarts = aClean.startsWith(lowerSearch);
          const bStarts = bClean.startsWith(lowerSearch);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
      });
    }

    const groups: Record<string, OpenRouterModel[]> = {};
    const favGroup: OpenRouterModel[] = [];
    const freeGroup: OpenRouterModel[] = [];
    const handledIds = new Set<string>();
    
    // 1. Handle Favorites (Always Top)
    filtered.forEach(m => {
      if (favorites.includes(m.id)) {
        favGroup.push(m);
        handledIds.add(m.id);
      }
    });

    // 2. Handle Free Models
    filtered.forEach(m => {
      // Don't add to free group if already in favorites to avoid duplicates in view, 
      // OR you can allow duplicates. Let's avoid duplicates for cleanliness 
      // unless we want a specific "Free" section that includes favs. 
      // For now, if it's a fav, it stays in Favs.
      if (handledIds.has(m.id)) return;

      const isFree = (m.pricing && parseFloat(m.pricing.prompt) === 0 && parseFloat(m.pricing.completion) === 0) || m.id.endsWith(':free');
      
      if (isFree) {
        freeGroup.push(m);
        handledIds.add(m.id);
      }
    });

    // 3. Handle Vendors (Rest)
    filtered.forEach(m => {
      if (handledIds.has(m.id)) return;

      const parts = m.id.split('/');
      const rawVendor = parts.length > 1 ? parts[0] : 'other';
      let displayVendor = rawVendor.charAt(0).toUpperCase() + rawVendor.slice(1);
      
      if (rawVendor.includes('llama')) displayVendor = 'Meta Llama';
      if (rawVendor === 'x-ai') displayVendor = 'xAI';
      if (rawVendor.includes('mistral')) displayVendor = 'Mistral';
      if (rawVendor === 'qwen') displayVendor = 'Qwen (Alibaba)';
      
      if (!groups[displayVendor]) groups[displayVendor] = [];
      groups[displayVendor].push(m);
    });

    const finalGroups = [];
    
    if (favGroup.length > 0) {
      finalGroups.push([t.favorites, favGroup]);
    }

    if (freeGroup.length > 0) {
      finalGroups.push([t.freeModels, freeGroup]);
    }
    
    Object.entries(groups).sort((a,b) => a[0].localeCompare(b[0])).forEach(([k, v]) => finalGroups.push([k, v]));

    return finalGroups;
  }, [models, search, t, favorites]);

  const manualModelId = search.trim();
  const canUseCustomModel = manualModelId.length > 0 && !models.some(model => model.id === manualModelId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isInsideTrigger = dropdownRef.current?.contains(target);
      const isInsidePanel = panelRef.current?.contains(target);

      if (!isInsideTrigger && !isInsidePanel) {
        setIsOpen(false);
        setSearch(''); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      setIsOpen(false);
      setSearch('');
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [isOpen]);

  const isMobileViewport = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const desktopPickerStyle = (() => {
    if (isMobileViewport || typeof window === 'undefined' || !dropdownRef.current) return undefined;

    const rect = dropdownRef.current.getBoundingClientRect();
    const width = Math.min(390, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const maxHeight = Math.min(460, window.innerHeight - rect.bottom - 20);

    return {
      top: rect.bottom + 8,
      left,
      width,
      maxHeight: Math.max(280, maxHeight),
    };
  })();

  const renderModelPicker = (isMobileSheet: boolean) => (
    <div
      ref={panelRef}
      style={isMobileSheet ? undefined : desktopPickerStyle}
      className={isMobileSheet
        ? "fixed inset-x-3 bottom-3 z-50 max-h-[78vh] bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200 ring-1 ring-black/5"
        : "fixed z-50 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top-left ring-1 ring-black/5"
      }
    >
      {isMobileSheet && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/95">
          <div>
            <div className="text-[13px] font-semibold text-gray-900">{t.modelSheetTitle}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{displayName}</div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              setSearch('');
            }}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title={t.close}
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className={`${isMobileSheet ? 'p-3' : 'p-2'} border-b border-gray-100 sticky top-0 z-20 bg-white/95 backdrop-blur`}>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder={t.searchModel}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 bg-gray-100 border-none rounded-lg font-medium focus:ring-2 focus:ring-[#007AFF]/20 focus:bg-white transition-all outline-none placeholder-gray-400 ${isMobileSheet ? 'py-2 text-[13px]' : 'py-1.5 text-[12px]'}`}
          />
        </div>
      </div>
      <div className={`overflow-y-auto flex-1 space-y-3 model-list-scrollbar ${isMobileSheet ? 'p-2 pr-3' : 'p-1 pr-2'}`}>
        {canUseCustomModel && (
          <button
            type="button"
            onClick={() => {
              onChange(manualModelId);
              setIsOpen(false);
              setSearch('');
            }}
            className={`w-full flex items-center gap-2 rounded-lg text-left transition-all text-gray-700 hover:bg-blue-50 hover:text-[#007AFF] border border-dashed border-gray-200 hover:border-[#007AFF]/30 ${isMobileSheet ? 'px-2.5 py-2' : 'px-2 py-1.5'}`}
          >
            <div className="w-6 h-6 rounded-md bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
              <Bot size={13} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold">{t.useCustomModel}</div>
              <div className="truncate text-[10px] text-gray-400">{manualModelId}</div>
            </div>
          </button>
        )}
        {groupedModels.length === 0 && !canUseCustomModel ? (
            <div className="p-4 text-center text-xs text-gray-400">
                {t.noModelFound}
            </div>
        ) : groupedModels.map((group: any) => {
            const groupName = group[0] as string;
            const groupModels = group[1] as OpenRouterModel[];
            return (
            <div key={groupName} className="relative">
                <div className="px-2 py-1 text-[9px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 bg-white/95 backdrop-blur-md z-10 truncate border-b border-gray-50 flex items-center gap-1">
                    {groupName === t.favorites && <Star size={10} className="fill-yellow-400 text-yellow-400" />}
                    {groupName === t.freeModels && <Tag size={10} className="text-green-600" />}
                    {groupName}
                </div>
                <div className="space-y-0.5 px-1 pt-1">
                {groupModels.map(model => {
                    const isSelected = currentModelId === model.id;
                    const isFav = favorites.includes(model.id);

                    return (
                        <div
                          key={`${groupName}-${model.id}`}
                          className={`group/item w-full flex items-center gap-2 rounded-lg text-left transition-all relative overflow-hidden cursor-pointer ${isMobileSheet ? 'px-2.5 py-2' : 'px-2 py-1.5'} ${
                            isSelected
                            ? 'bg-[#007AFF] text-white shadow-sm'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => {
                            onChange(model.id);
                            setIsOpen(false);
                            setSearch('');
                        }}
                        >
                            <div className={`flex-shrink-0 transition-all ${isSelected ? 'scale-95' : ''}`}>
                                <ModelAvatar modelId={model.id} size="small" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center h-8">
                                <div className="truncate text-[12px] font-medium leading-tight">
                                    {cleanModelName(model.name)}
                                </div>
                            </div>

                            {onToggleFavorite && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleFavorite(model.id);
                                }}
                                className={`p-1.5 rounded-full transition-all z-20 hover:bg-black/10 ${isFav ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'}`}
                              >
                                <Star
                                  size={12}
                                  className={isFav ? "fill-yellow-400 text-yellow-400" : (isSelected ? "text-white/70" : "text-gray-300")}
                                />
                              </button>
                            )}

                            {isSelected && !onToggleFavorite && <Check size={12} className="text-white ml-1 flex-shrink-0" />}
                        </div>
                    );
                })}
                </div>
            </div>
            );
        })}
      </div>
    </div>
  );

  return (
    <div className="relative flex-1 group min-w-0" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 w-full rounded-md hover:bg-black/5 transition-colors text-left ${isDense ? 'px-1 py-0.5' : 'px-2 py-1'}`}
      >
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className={`truncate font-semibold text-gray-900 leading-snug ${isDense ? 'text-[12px]' : 'text-[14px]'}`}>
            {displayName}
          </div>
        </div>
        <ChevronDown size={isDense ? 10 : 12} className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        createPortal(
          <>
            {isMobileViewport && (
              <button
                type="button"
                aria-label={t.close}
                onClick={() => {
                  setIsOpen(false);
                  setSearch('');
                }}
                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              />
            )}
            {renderModelPicker(isMobileViewport)}
          </>,
          document.body
        )
      )}
    </div>
  );
};

// --- Inspect Modal Component ---
const InspectModal = ({ 
    isOpen, 
    onClose, 
    message, 
    systemPrompt,
    fullContext,
    t 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    message: any; 
    systemPrompt?: string; 
    fullContext: any[]; 
    t: any;
}) => {
    if (!isOpen) return null;

    const payload = {
        model: "...",
        messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            ...fullContext.filter(m => m.timestamp <= message.timestamp).map(m => ({ 
                role: m.role, 
                content: m.attachments ? [
                    {type: 'text', text: m.content}, 
                    ...m.attachments.map((att: Attachment) => 
                        att.type === 'image' ? {type: 'image_url', image_url: '...'} : {type: 'text', text: `[File: ${att.name}]`}
                    )
                ] : m.content 
            }))
        ]
    };

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80%] flex flex-col border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-2xl">
                    <div className="flex items-center gap-2 text-gray-700 font-semibold text-sm">
                        <Code size={16} />
                        {t.inspect}
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                        <X size={16} />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-4 bg-[#f8f9fa]">
                    <pre className="text-[11px] font-mono text-gray-700 whitespace-pre-wrap break-all leading-relaxed">
                        {JSON.stringify(payload, null, 2)}
                    </pre>
                </div>
                <div className="p-2 border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                        }} 
                        className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium"
                    >
                        <Copy size={12} /> {t.copy} JSON
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main ChatWindow Component ---
const ChatWindow: React.FC<ChatWindowProps> = ({
  data,
  availableModels,
  onSendMessage,
  onClear,
  onExport,
  onModelChange,
  onSystemPromptChange,
  onEditMessage,
  onRegenerate,
  lang,
  isDense = false,
  isApiConnected = true,
  favoriteModels = [],
  onToggleFavorite
}) => {
  const [input, setInput] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectMessage, setInspectMessage] = useState<any | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[lang];

  const modelsList = availableModels;

  useEffect(() => {
    if (!editingMessageId) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data.messages, data.isLoading, editingMessageId]);

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;
    onSendMessage(data.id, input, attachments);
    setInput('');
    setAttachments([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const startEdit = (id: string, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const submitEdit = (id: string) => {
    if (editContent.trim()) {
      onEditMessage(data.id, id, editContent);
      setEditingMessageId(null);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const isImage = file.type.startsWith('image/');
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            setAttachments(prev => [...prev, {
                type: isImage ? 'image' : 'file',
                content: event.target!.result as string,
                name: file.name,
                mimeType: file.type
            }]);
          }
        };
        if (isImage) reader.readAsDataURL(file);
        else reader.readAsText(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-2xl rounded-[20px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-white/60 ring-1 ring-black/5 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.12)] relative">
      
      <InspectModal 
        isOpen={!!inspectMessage} 
        onClose={() => setInspectMessage(null)} 
        message={inspectMessage}
        systemPrompt={data.systemPrompt}
        fullContext={data.messages}
        t={t}
      />

      {showSettings && (
        <div className="absolute top-[48px] left-0 right-0 z-30 p-3 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg animate-in slide-in-from-top-2 fade-in duration-200">
           <div className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                 <Bot size={12} className="text-[#007AFF]" />
                 <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{t.systemPrompt}</label>
              </div>
              <textarea
                value={data.systemPrompt || ''}
                onChange={(e) => onSystemPromptChange(data.id, e.target.value)}
                placeholder={t.systemPromptPlaceholder}
                className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs text-gray-700 focus:ring-2 focus:ring-[#007AFF]/20 focus:bg-white outline-none transition-all resize-none"
                rows={3}
              />
           </div>
        </div>
      )}

      {/* Header - Adaptive Compact Apple Style */}
      <div className={`flex items-center justify-between border-b border-gray-200/50 bg-white/60 backdrop-blur-md z-20 transition-all duration-300 ${isDense ? 'h-9 pl-2 pr-1' : 'h-14 pl-3 pr-2'}`}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`transition-transform duration-300 hover:scale-105 flex-shrink-0`}>
             <ModelAvatar modelId={data.modelId} isDense={isDense} />
          </div>
          <ModelSelector 
            currentModelId={data.modelId} 
            models={modelsList} 
            onChange={(id) => onModelChange(data.id, id)}
            t={t}
            isDense={isDense}
            favorites={favoriteModels}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
        
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`rounded-md transition-all active:scale-90 ${showSettings ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'text-gray-400 hover:text-gray-700 hover:bg-black/5'} ${isDense ? 'p-1' : 'p-1.5'}`}
            title={t.settings}
          >
            <SlidersHorizontal size={isDense ? 14 : 16} strokeWidth={2} />
          </button>
          <button
            onClick={() => onExport(data.id)}
            title={t.exportChat}
            className={`text-gray-400 hover:text-gray-700 hover:bg-black/5 rounded-md transition-all active:scale-90 ${isDense ? 'p-1' : 'p-1.5'}`}
          >
            <Download size={isDense ? 14 : 16} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className={`flex-1 overflow-y-auto space-y-4 custom-scrollbar scroll-smooth ${isDense ? 'p-2' : 'p-4'}`}>
        {data.messages.length === 0 && (
          <div className={`h-full flex flex-col items-center justify-center text-center select-none animate-in fade-in duration-700 ${isDense ? 'px-2' : 'px-6'}`}>
            <div className="mb-3 opacity-80 transition-all duration-500">
               <ModelAvatar modelId={data.modelId} size="large" />
            </div>
            <p className={`font-semibold text-gray-700 ${isDense ? 'text-[11px]' : 'text-[14px]'}`}>{t.emptyTitle}</p>
            {!isApiConnected && (
              <p className={`mt-1 text-gray-400 leading-relaxed ${isDense ? 'text-[9px]' : 'text-[12px]'}`}>{t.connectApiHint}</p>
            )}
            {data.systemPrompt && (
              <div className="mt-3 max-w-[80%] px-2 py-0.5 bg-blue-50 text-blue-600/70 text-[9px] rounded-full border border-blue-100 truncate flex items-center gap-1">
                <Bot size={9} />
                <span className="truncate">{data.systemPrompt}</span>
              </div>
            )}
          </div>
        )}
        
        {data.messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`group/message flex flex-col relative ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            } animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            {editingMessageId === msg.id ? (
               <div className="w-full max-w-full bg-white border border-[#007AFF] rounded-[16px] p-3 shadow-md z-10">
                  <textarea 
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full text-xs outline-none resize-none bg-transparent"
                    rows={Math.max(2, editContent.split('\n').length)}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                     <button onClick={cancelEdit} className="text-[10px] px-2 py-1 text-gray-500 hover:bg-gray-100 rounded-full font-medium">{t.cancel}</button>
                     <button onClick={() => submitEdit(msg.id)} className="text-[10px] px-2 py-1 bg-[#007AFF] text-white rounded-full hover:bg-blue-600 font-medium">{t.saveAndSubmit}</button>
                  </div>
               </div>
            ) : (
                <>
                <div
                className={`px-3 py-2 text-[13px] leading-relaxed relative border shadow-sm ${
                    msg.role === 'user'
                    ? 'bg-[#007AFF] text-white border-transparent rounded-[16px] rounded-br-sm max-w-[85%]'
                    : 'bg-[#F2F2F7] text-[#1D1D1F] border-transparent rounded-[16px] rounded-bl-sm max-w-[90%]' 
                } ${isDense ? 'text-[12px] py-1.5 px-2.5 leading-snug' : ''}`}
                >
                {msg.attachments && msg.attachments.length > 0 && (
                   <div className="flex flex-wrap gap-1.5 mb-1.5">
                     {msg.attachments.map((att, idx) => (
                        <div key={idx} className={`rounded-md overflow-hidden border border-white/20 ${att.type === 'file' ? 'bg-white/10 p-1.5 flex items-center gap-1.5' : ''}`}>
                            {att.type === 'image' ? (
                                <img src={att.content} alt="attachment" className="h-24 w-auto object-cover rounded-sm" />
                            ) : (
                                <>
                                    <FileText size={16} className="text-white/90" />
                                    <span className="text-[10px] font-medium truncate max-w-[120px] text-white">{att.name}</span>
                                </>
                            )}
                        </div>
                     ))}
                   </div>
                )}

                {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1 prose-p:leading-relaxed prose-headings:text-gray-900 prose-pre:bg-white prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-lg prose-pre:p-2 prose-code:text-[#D12F7A] prose-code:bg-white prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-strong:text-gray-900 font-normal break-words">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                )}
                </div>

                {msg.role === 'assistant' && msg.usage && (
                   <div className="text-[8px] text-gray-400 mt-0.5 ml-1 flex items-center gap-1 select-none opacity-0 group-hover/message:opacity-100 transition-opacity">
                      <span>{msg.usage.total_tokens}t</span>
                   </div>
                )}

                <div className={`absolute top-full mt-0.5 flex items-center gap-0.5 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 z-10 bg-white/90 backdrop-blur-md rounded-full p-0.5 shadow-sm border border-gray-100 ${msg.role === 'user' ? 'right-0' : 'left-0'}`}>
                   
                   <button 
                     onClick={() => setInspectMessage(msg)}
                     className="p-1 text-gray-400 hover:text-purple-600 hover:bg-white rounded-full transition-colors"
                     title={t.inspect}
                   >
                     <Code size={10} />
                   </button>

                   <button 
                     onClick={() => handleCopy(msg.content, msg.id)}
                     className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
                     title={t.copy}
                   >
                     {copiedId === msg.id ? <Check size={10} className="text-green-500"/> : <Copy size={10} />}
                   </button>

                   {msg.role === 'user' && (
                     <button 
                       onClick={() => startEdit(msg.id, msg.content)}
                       className="p-1 text-gray-400 hover:text-[#007AFF] hover:bg-white rounded-full transition-colors"
                       title={t.edit}
                     >
                       <Pencil size={10} />
                     </button>
                   )}

                   {msg.role === 'assistant' && !data.isLoading && (
                     <button 
                       onClick={() => onRegenerate(data.id, msg.id)}
                       className="p-1 text-gray-400 hover:text-[#007AFF] hover:bg-white rounded-full transition-colors"
                       title={t.regenerate}
                     >
                       <RefreshCw size={10} />
                     </button>
                   )}
                </div>
                </>
            )}
          </div>
        ))}

        {data.isLoading && (
          <div className="flex items-start animate-in fade-in duration-300">
             <div className="bg-[#F2F2F7] rounded-[16px] rounded-bl-sm px-3 py-2 flex items-center gap-1">
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.3s]"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-[bounce_1s_infinite_-0.15s]"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full animate-[bounce_1s_infinite]"></div>
             </div>
          </div>
        )}

        {data.error && (
            <div className="flex items-center gap-2 text-red-600 text-[10px] bg-red-50/80 backdrop-blur-sm p-1.5 rounded-lg border border-red-100 mx-auto max-w-fit shadow-sm animate-in zoom-in-95">
                <Zap size={10} fill="currentColor" />
                <span className="font-medium">{data.error}</span>
            </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Adaptive */}
      <div className={`bg-white/70 backdrop-blur-md border-t border-gray-100/50 z-20 relative ${isDense ? 'p-1.5' : 'p-2.5'}`}>
         
         {/* Attachments Preview */}
         {attachments.length > 0 && (
             <div className="px-2 pb-1.5 flex gap-2 overflow-x-auto">
                 {attachments.map((att, idx) => (
                     <div key={idx} className="relative group flex-shrink-0 animate-in slide-in-from-bottom-2 fade-in">
                         {att.type === 'image' ? (
                            <img src={att.content} className="h-8 w-8 rounded-md object-cover border border-gray-200" alt="preview" />
                         ) : (
                            <div className="h-8 w-8 bg-white rounded-md border border-gray-200 flex flex-col items-center justify-center p-1">
                                <FileText size={12} className="text-gray-500" />
                                <span className="text-[8px] text-gray-500 w-full truncate text-center">{att.name}</span>
                            </div>
                         )}
                         <button 
                            onClick={() => removeAttachment(idx)}
                            className="absolute -top-1 -right-1 bg-gray-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                         >
                             <X size={8} />
                         </button>
                     </div>
                 ))}
             </div>
         )}

        <div className={`flex items-center gap-1.5 bg-gray-100/80 rounded-full ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-[#007AFF]/30 focus-within:bg-white transition-all duration-300 ${isDense ? 'p-0.5' : 'p-1'}`}>
          <input 
              type="file" 
              multiple 
              accept="image/*, .txt, .md, .csv, .json, .js, .ts, .py, .html, .css" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect} 
          />
          
          <button
             onClick={() => fileInputRef.current?.click()}
             className={`ml-0.5 text-gray-400 hover:text-[#007AFF] hover:bg-blue-50 rounded-full transition-all active:scale-90 ${isDense ? 'p-1' : 'p-1.5'}`}
             title={t.attach}
          >
              <Paperclip size={isDense ? 14 : 16} strokeWidth={2} />
          </button>
          
          <textarea
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
             placeholder={t.typeMessage}
             rows={1}
             className={`flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 px-1 py-1 resize-none leading-[20px] ${isDense ? 'text-[12px] h-[28px]' : 'text-[13px] h-[36px]'}`}
             style={{ maxHeight: '100px' }}
          />

          <div className="flex items-center gap-1 pr-1">
              <button
                onClick={() => onClear(data.id)}
                title={t.clearChat}
                className={`text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-90 ${isDense ? 'p-1' : 'p-1.5'}`}
              >
                <Trash2 size={isDense ? 14 : 16} strokeWidth={2} />
              </button>

              <button
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || data.isLoading}
                className={`rounded-full transition-all duration-300 ${(!input.trim() && attachments.length === 0) || data.isLoading ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#007AFF] text-white hover:bg-[#0062cc] shadow-md transform hover:scale-105 active:scale-95'} ${isDense ? 'p-1' : 'p-1.5'}`}
              >
                <ArrowUp size={isDense ? 14 : 16} strokeWidth={2.5} />
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
