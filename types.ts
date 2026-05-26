

export interface TokenUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface Attachment {
  type: 'image' | 'file';
  content: string; // Base64 for image, Text content for file
  name: string;
  mimeType: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  usage?: TokenUsage;
  attachments?: Attachment[]; 
}

export interface ChatWindowData {
  id: string;
  modelId: string;
  messages: Message[];
  isLoading: boolean;
  error?: string;
  systemPrompt?: string; 
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
  };
}

export interface AppConfig {
  apiKey: string;
  baseUrl: string;
  windowCount: 1 | 2 | 3 | 4 | 6;
  language: 'zh' | 'en';
}

// Based on OpenRouter popular/top rankings
export const DEFAULT_MODELS = [
  { id: 'openai/gpt-4o', name: 'GPT-4o' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5' },
  { id: 'meta-llama/llama-3.1-70b-instruct', name: 'Llama 3.1 70B' },
  { id: 'mistral/mistral-large', name: 'Mistral Large 2' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'x-ai/grok-beta', name: 'Grok Beta' },
  { id: 'perplexity/llama-3.1-sonar-huge-128k-online', name: 'Perplexity Llama 3.1 Online' }
];

export const DEFAULT_BASE_URL = "https://openrouter.ai/api/v1";

export const getDefaultModelsForBaseUrl = (baseUrl: string): OpenRouterModel[] => {
  const url = (baseUrl || '').toLowerCase();

  if (url.includes('openrouter.ai')) return DEFAULT_MODELS;

  if (url.includes('deepseek')) {
    return [
      { id: 'deepseek-chat', name: 'DeepSeek Chat' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner' }
    ];
  }

  if (url.includes('api.openai.com') || url.includes('openai.azure.com')) {
    return [
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4o', name: 'GPT-4o' }
    ];
  }

  if (url.includes('moonshot') || url.includes('kimi')) {
    return [
      { id: 'moonshot-v1-8k', name: 'Moonshot v1 8K' },
      { id: 'moonshot-v1-32k', name: 'Moonshot v1 32K' }
    ];
  }

  if (url.includes('dashscope') || url.includes('aliyun')) {
    return [
      { id: 'qwen-plus', name: 'Qwen Plus' },
      { id: 'qwen-turbo', name: 'Qwen Turbo' }
    ];
  }

  if (url.includes('siliconflow')) {
    return [
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3' },
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen2.5 72B Instruct' }
    ];
  }

  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    return [
      { id: 'llama3.1', name: 'llama3.1' },
      { id: 'qwen2.5', name: 'qwen2.5' }
    ];
  }

  return [
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini' }
  ];
};

// Helper to estimate tokens (rough approximation: 1 token ~= 4 chars)
export const estimateTokens = (text: string): number => Math.ceil(text.length / 4);

export const TRANSLATIONS = {
  zh: {
    welcomeTitle: "ZhuoChat",
    welcomeSubtitle: "输入您的 API 密钥以开始体验多模型并行对话。",
    apiModalTitle: "连接模型服务",
    apiModalSubtitle: "配置兼容 OpenAI 的接口地址和 API Key。",
    apiEndpoint: "接口地址",
    apiKey: "API 密钥",
    startChat: "开始对话",
    saveApiSettings: "保存并连接",
    connectApiHint: "连接 API 后即可发送消息。",
    localStorageHint: "您的密钥仅存储在本地浏览器中。",
    exportAll: "导出所有对话表格",
    logout: "退出登录",
    apiSettings: "API 设置",
    configureApi: "配置 API",
    windowCount: "窗口布局",
    sendToAllPlaceholder: "同时询问所有窗口...",
    sendToAllLabel: "发送给全部",
    sendToAll: "发送",
    clearChat: "清空",
    exportChat: "导出当前对话",
    typeMessage: "问这个模型...",
    selectModel: "选择模型",
    windowLabel: "窗口",
    modelSheetTitle: "选择模型",
    emptyTitle: "准备对比回答",
    loading: "加载中...",
    modelLoading: "模型列表更新中...",
    noApiKey: "请先配置 API Key",
    defaultError: "发生错误",
    searchModel: "搜索模型 (例如: gpt, claude...)",
    noModelFound: "未找到相关模型",
    useCustomModel: "使用这个模型 ID",
    popular: "热门模型",
    favorites: "已收藏",
    allModels: "所有模型",
    freeModels: "免费模型",
    onlineModels: "联网模型 (Online)",
    settings: "设置",
    systemPrompt: "角色设定 / 系统提示词",
    systemPromptPlaceholder: "例如：你是一位资深的 Python 架构师，请用简洁的代码回答...",
    estTokens: "预估消耗",
    tokens: "Tokens",
    usage: "用量",
    cost: "预估",
    copy: "复制",
    copied: "已复制",
    edit: "编辑",
    regenerate: "重新生成",
    inspect: "查看 Payload",
    cancel: "取消",
    saveAndSubmit: "提交",
    close: "关闭",
    attach: "上传附件 (图片/文档)",
  },
  en: {
    welcomeTitle: "ZhuoChat",
    welcomeSubtitle: "Enter your credentials to start parallel model chatting.",
    apiModalTitle: "Connect model service",
    apiModalSubtitle: "Configure an OpenAI-compatible endpoint and API key.",
    apiEndpoint: "API Endpoint",
    apiKey: "API Key",
    startChat: "Start Chatting",
    saveApiSettings: "Save and Connect",
    connectApiHint: "Connect an API before sending messages.",
    localStorageHint: "Your keys are stored locally in your browser.",
    exportAll: "Export All CSV",
    logout: "Log Out",
    apiSettings: "API Settings",
    configureApi: "Configure API",
    windowCount: "Layout",
    sendToAllPlaceholder: "Ask every window...",
    sendToAllLabel: "All windows",
    sendToAll: "Send",
    clearChat: "Clear",
    exportChat: "Export Chat",
    typeMessage: "Ask this model...",
    selectModel: "Select Model",
    windowLabel: "Window",
    modelSheetTitle: "Choose model",
    emptyTitle: "Ready for a comparison",
    loading: "Loading...",
    modelLoading: "Loading models...",
    noApiKey: "API Key required",
    defaultError: "Error occurred",
    searchModel: "Search models (e.g., gpt, claude...)",
    noModelFound: "No models found",
    useCustomModel: "Use this model ID",
    popular: "Popular Models",
    favorites: "Favorites",
    allModels: "All Models",
    freeModels: "Free Models",
    onlineModels: "Online Models",
    settings: "Settings",
    systemPrompt: "System Prompt / Persona",
    systemPromptPlaceholder: "E.g. You are a senior Python Architect. Answer concisely...",
    estTokens: "Est. Cost",
    tokens: "Tokens",
    usage: "Usage",
    cost: "Est.",
    copy: "Copy",
    copied: "Copied",
    edit: "Edit",
    regenerate: "Regenerate",
    inspect: "Inspect Payload",
    cancel: "Cancel",
    saveAndSubmit: "Submit",
    close: "Close",
    attach: "Attach (Image/Doc)",
  }
};
