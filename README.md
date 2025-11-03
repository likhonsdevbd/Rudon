# Rüdon - Intelligent AI Bot

Rüdon is an intelligent AI bot that answers questions and chats naturally. It's a web application built with Next.js and the Vercel AI SDK.

## Features

-   Interactive chat interface in your browser.
-   Powered by Mistral AI models.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/rudon-chatbot.git
    cd rudon-chatbot
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Environment Setup

Create a `.env.local` file in the root of the project and add your Mistral API key:

```
MISTRAL_API_KEY=your-mistral-api-key
```

## Usage

To start the development server, run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The main page of the application is located at `app/page.tsx`. The chat API endpoint is at `app/api/chat/route.ts`.

## Project Structure

```
.
├── app/                  # Next.js App Router directory
│   ├── api/chat/route.ts # API endpoint for the chatbot
│   └── page.tsx          # Main application page
├── lib/                  # Utility functions
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```
