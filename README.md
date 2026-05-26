# ZhuoChat

ZhuoChat is a Vite + React multi-model chat workspace. It lets you compare responses across 1, 2, 3, 4, or 6 chat windows using an OpenAI-compatible API endpoint.

## Features

- Multi-window AI chat comparison
- OpenAI-compatible API configuration in the browser
- Model discovery from `/models` with provider-specific fallback models
- Custom model ID entry
- Markdown message rendering
- Attachment-aware prompts
- CSV export for all conversations
- Chinese and English interface switching

## Run Locally

**Prerequisite:** Node.js 18 or later.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite, usually:

   ```text
   http://127.0.0.1:5173/
   ```

4. In the app, open API settings and enter:

   - Base URL, for example `https://openrouter.ai/api/v1`
   - API key from your provider

The API key is stored only in local browser storage. Do not commit API keys to the repository.

## Build

```bash
npm run build
```

## Supported API Shape

The app expects OpenAI-compatible endpoints:

- `GET /models`
- `POST /chat/completions` with streaming responses

It can be used with OpenRouter and other OpenAI-compatible providers when they support those endpoints.
