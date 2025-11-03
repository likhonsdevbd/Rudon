# Agent Instructions for rudon-chatbot (Next.js Version)

## 📖 Project Overview

**Purpose**: An intelligent AI chatbot built as a modern web application.
**Type**: Web App
**Primary Language(s)**: TypeScript
**Framework(s)**: Next.js (App Router), React
**Key Libraries**:
- Vercel AI SDK (`ai` package) for chat functionality.
- `@ai-sdk/mistral` for connecting to Mistral models.
- `shadcn-ui` for UI components.
- `tailwindcss` for styling.

**Architecture**: This is a Next.js application. The frontend is a single-page chat interface built with React and `shadcn-ui`. The backend logic is handled by a Next.js API route (`/api/chat`) that securely communicates with an AI model and streams the response back to the client.

## 🤖 Agent Workflow Protocol

As an AI agent working on this repository, you **must** adhere to the following protocol:

1.  **Initial Scan & Planning**: Before making any code changes, perform a full scan of the codebase to understand the current structure and logic.
2.  **Create `Todo.md`**: After the initial scan, create a `Todo.md` file outlining the planned tasks. This file should be kept up-to-date as you complete each task.
3.  **Security First**: Always prioritize security. Never hardcode API keys or other secrets. Use environment variables (`.env.local`).
4.  **Consult Documentation**: If you encounter a problem or are unsure about the usage of a library (e.g., Vercel AI SDK, Next.js, `shadcn-ui`), you should proactively scan the official documentation for that library to find a solution.
5.  **Error-Free Focus**: Strive to produce high-quality, error-free code. Run the linter (`npm run lint`) and test your changes thoroughly.

## 📁 Directory Structure

```
.
├── app/
│   ├── api/chat/route.ts   # The core API endpoint for the chatbot
│   ├── globals.css         # Global styles and Tailwind directives
│   ├── layout.tsx          # Root layout for the application
│   └── page.tsx            # The main chat UI component
├── components/             # shadcn-ui components
├── lib/
│   └── utils.ts            # Utility functions from shadcn-ui
├── public/                 # Static assets
├── .env.local.example      # Example for environment variables
├── components.json         # shadcn-ui configuration
├── next.config.mjs         # Next.js configuration
├── package.json
└── tsconfig.json
```

## 🚀 Development Setup

### Installation
```bash
# Clone the repository
git clone [repo-url]
cd [project-name]

# Install dependencies
npm install
```

### Environment Variables
You need to create a `.env.local` file in the root of the project and add your Mistral API key:
```bash
# .env.local
MISTRAL_API_KEY="your-mistral-api-key"
```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 Testing Guidelines

There are currently no automated tests in this project. When adding new features, you should consider adding corresponding tests.

- **Linting**: You can run the linter to check for code style issues:
  ```bash
  npm run lint
  ```

## 🔒 Security Considerations

- **API Keys**: The `MISTRAL_API_KEY` is a sensitive secret. It is used on the server-side only (in the API route) and should never be exposed to the client. Always load it from environment variables.
- **Input Validation**: While the AI SDK handles some aspects of the chat, be mindful of any user input that is processed on the server.

## ✅ Common Tasks

### Adding a New UI Component

1.  Use the `shadcn-ui` CLI to add the component:
    ```bash
    npx shadcn-ui@latest add [component-name]
    ```
2.  Import the new component into `app/page.tsx` or another client component.
3.  Use the component to build out the UI.

### Modifying the Chat Prompt

- The core logic for interacting with the AI is in `app/api/chat/route.ts`.
- You can modify the `streamText` call to add system prompts, change the model, or adjust other parameters.

## 🚢 Deployment

This application is designed to be deployed on [Vercel](https://vercel.com/).

1.  Push your code to a Git repository (e.g., GitHub).
2.  Import the project into Vercel.
3.  Set the `MISTRAL_API_KEY` environment variable in the Vercel project settings.
4.  Vercel will automatically build and deploy the application.
