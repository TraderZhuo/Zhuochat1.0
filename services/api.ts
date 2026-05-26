import { OpenRouterModel, Message, TokenUsage } from '../types';

interface FetchModelsResponse {
  data: OpenRouterModel[];
}

export const fetchModels = async (apiKey: string, baseUrl: string): Promise<OpenRouterModel[]> => {
  try {
    const response = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn("Failed to fetch models, using defaults.");
      return [];
    }

    const data: FetchModelsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

const parseStreamData = (line: string) => {
  if (!line.startsWith("data:")) return null;

  const dataStr = line.slice(5).trimStart();
  if (!dataStr) return null;
  if (dataStr === "[DONE]") return { done: true };

  const data = JSON.parse(dataStr);
  return {
    done: false,
    content: data.choices?.[0]?.delta?.content,
    usage: data.usage as TokenUsage | undefined,
  };
};

export const streamChatCompletion = async (
  apiKey: string,
  baseUrl: string,
  modelId: string,
  messages: Message[],
  onChunk: (content: string) => void,
  onMetadata: (usage: TokenUsage) => void,
  systemPrompt?: string
): Promise<void> => {
  
  // Construct API messages
  let apiMessages = messages.map(m => {
    let textContent = m.content;
    const imageParts: any[] = [];

    if (m.attachments && m.attachments.length > 0) {
      m.attachments.forEach(att => {
        if (att.type === 'file') {
            // Append text file content to the user message
            textContent += `\n\n--- File: ${att.name} ---\n${att.content}\n------\n`;
        } else if (att.type === 'image') {
            imageParts.push({
                type: 'image_url',
                image_url: { url: att.content }
            });
        }
      });
    }

    if (imageParts.length > 0) {
      return {
        role: m.role,
        content: [
          { type: 'text', text: textContent },
          ...imageParts
        ]
      };
    }

    return {
      role: m.role,
      content: textContent
    };
  });

  // Prepend system prompt if it exists
  if (systemPrompt && systemPrompt.trim()) {
    apiMessages = [
      { role: 'system', content: systemPrompt.trim() },
      ...apiMessages
    ];
  }

  try {
    // Strictly minimal payload to avoid "Provider returned error"
    // caused by unsupported parameters like include_reasoning or others on generic models.
    const bodyPayload = {
      model: modelId,
      messages: apiMessages,
      stream: true,
      temperature: 0.7, // Add standard default
      max_tokens: 4000  // Add safety limit
    };

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'ZhuoChat',
      },
      body: JSON.stringify(bodyPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    if (!response.body) throw new Error("No response body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    const processLine = (line: string): boolean => {
      if (!line.startsWith("data:")) return false;

      try {
        const data = parseStreamData(line);
        if (!data) return false;
        if (data.done) return true;

        if (typeof data.content === "string") {
          onChunk(data.content);
        }

        if (data.usage) {
          onMetadata(data.usage);
        }
      } catch (e) {
        console.warn("Error parsing stream chunk", e);
      }

      return false;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        if (buffer.trim()) {
          const lines = buffer.split(/\r?\n/);
          for (const line of lines) {
            if (processLine(line)) return;
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      let newlineIndex = buffer.indexOf("\n");
      while (newlineIndex !== -1) {
        const line = buffer.slice(0, newlineIndex).replace(/\r$/, "");
        buffer = buffer.slice(newlineIndex + 1);
        if (processLine(line)) return;
        newlineIndex = buffer.indexOf("\n");
      }
    }
  } catch (error) {
    console.error("Chat completion error:", error);
    throw error;
  }
};
