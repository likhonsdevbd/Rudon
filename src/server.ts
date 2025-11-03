// API Routes with Google Generative AI
// Install: npm install @google/generative-ai express cors dotenv
// Install: npm install -D @types/node @types/express

import { GoogleGenerativeAI } from '@google/generative-ai';
import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Types
interface Message {
role: 'user' | 'model';
parts: { text: string }[];
}

interface ChatRequest {
messages: Message[];
temperature?: number;
stream?: boolean;
}

interface PromptEnhanceRequest {
prompt: string;
context?: string;
}

interface CodeInterpreterRequest {
task: string;
language?: string;
context?: string[];
}

// Utilities
function stripIndents(strings: TemplateStringsArray, ...values: any[]): string {
const fullString = strings.reduce((acc, str, i) => {
return acc + str + (values[i] || '');
}, '');

const lines = fullString.split('\n');
const minIndent = lines
.filter(line => line.trim().length > 0)
.reduce((min, line) => {
const indent = line.match(/^\s*/)?.[0].length || 0;
return Math.min(min, indent);
}, Infinity);

return lines
.map(line => line.slice(minIndent))
.join('\n')
.trim();
}

// Route 1: Chat Completion (Streaming & Non-Streaming)
app.post('/api/chat', async (req: Request, res: Response) => {
try {
const {
messages,
temperature = 0.7,
stream = false,
}: ChatRequest = req.body;

if (!messages || messages.length === 0) {
  return res.status(400).json({ error: 'Messages array is required' });
}

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite"});
const chat = model.startChat({
    history: messages.slice(0, -1),
});

const result = await chat.sendMessageStream(messages[messages.length - 1].parts[0].text);

if (stream) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
  }
  res.write('data: [DONE]\n\n');
  res.end();
} else {
    const response = await result.response;
    const text = response.text();
    res.json({
        message: {
        role: 'assistant',
        content: text,
        },
    });
}

} catch (error: any) {
console.error('Chat error:', error);
res.status(500).json({ error: error.message || 'Internal server error' });
}
});

// Route 2: Prompt Enhancement
app.post('/api/enhance-prompt', async (req: Request, res: Response) => {
try {
const { prompt, context }: PromptEnhanceRequest = req.body;

if (!prompt) {
  return res.status(400).json({ error: 'Prompt is required' });
}

const enhanceSystemPrompt = stripIndents`
  You are an expert prompt engineer. Your task is to improve the user's prompt to make it:
  1. More clear and specific
  2. Better structured
  3. More likely to get high-quality results

  ${context ? `Context: ${context}` : ''}

  IMPORTANT: Only respond with the improved prompt and nothing else!

  <original_prompt>
    ${prompt}
  </original_prompt>
`;

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite"});
const result = await model.generateContent(enhanceSystemPrompt);
const response = await result.response;
const text = response.text();

res.json({
  originalPrompt: prompt,
  enhancedPrompt: text,
});

} catch (error: any) {
console.error('Enhance prompt error:', error);
res.status(500).json({ error: error.message || 'Internal server error' });
}
});

// Route 3: Code Interpreter with Planning
app.post('/api/code-interpreter', async (req: Request, res: Response) => {
try {
const { task, language = 'python', context = [] }: CodeInterpreterRequest = req.body;

if (!task) {
  return res.status(400).json({ error: 'Task is required' });
}

const systemPrompt = stripIndents`
  You are an expert code interpreter and planner.

  Task: ${task}
  Language: ${language}
  ${context.length > 0 ? `Context:\n${context.join('\n')}` : ''}

  First, create a step-by-step plan to accomplish this task.
  Then, provide the complete, executable code.

  Format your response as:

  ## Plan
  1. Step 1
  2. Step 2
  ...

  ## Code
  \`\`\`${language}
  // Your code here
  \`\`\`

  ## Expected Output
  Description of what the code will produce
`;

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite"});
const result = await model.generateContentStream(systemPrompt);

res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

let fullResponse = '';
for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullResponse += chunkText;
    res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
}

res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
res.end();

} catch (error: any) {
console.error('Code interpreter error:', error);
res.status(500).json({ error: error.message || 'Internal server error' });
}
});

// Route 4: Multi-step Thinking Agent
app.post('/api/agent', async (req: Request, res: Response) => {
try {
const { query, maxSteps = 5 } = req.body;

if (!query) {
  return res.status(400).json({ error: 'Query is required' });
}

res.setHeader('Content-Type', 'text/event-stream');
res.setHeader('Cache-Control', 'no-cache');
res.setHeader('Connection', 'keep-alive');

let conversationHistory: any[] = [];
let currentStep = 0;
let taskCompleted = false;

while (currentStep < maxSteps && !taskCompleted) {
  currentStep++;

  const systemPrompt = stripIndents`
    You are a reasoning agent working on: ${query}

    Step ${currentStep}/${maxSteps}

    Previous steps: ${conversationHistory.length > 0 ?
      conversationHistory.map((h, i) => `Step ${i + 1}: ${h.content.substring(0, 100)}...`).join('\n')
      : 'None'}

    For this step:
    1. Think about what needs to be done
    2. Take action or provide analysis
    3. Determine if the task is complete

    Format:
    ## Thinking
    [Your reasoning]

    ## Action
    [What you're doing]

    ## Status
    [CONTINUE or COMPLETE]
  `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite"});
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const stepResult = response.text();

  conversationHistory.push({
    step: currentStep,
    content: stepResult,
  });

  res.write(`data: ${JSON.stringify({
    step: currentStep,
    content: stepResult,
  })}\n\n`);

  // Check if task is complete
  if (stepResult.toLowerCase().includes('status') &&
      stepResult.toLowerCase().includes('complete')) {
    taskCompleted = true;
  }

  await new Promise(resolve => setTimeout(resolve, 500));
}

res.write(`data: ${JSON.stringify({
  done: true,
  totalSteps: currentStep,
  completed: taskCompleted,
})}\n\n`);
res.end();

} catch (error: any) {
console.error('Agent error:', error);
res.status(500).json({ error: error.message || 'Internal server error' });
}
});

// Route 5: Batch Processing
app.post('/api/batch', async (req: Request, res: Response) => {
try {
const { prompts, temperature = 0.7 } = req.body;

if (!Array.isArray(prompts) || prompts.length === 0) {
  return res.status(400).json({ error: 'Prompts array is required' });
}

const results = [];
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite"});

for (const prompt of prompts) {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const tokenCount = await model.countTokens(prompt);

  results.push({
    prompt,
    response: text,
    tokens: tokenCount.totalTokens,
  });
}

res.json({
  results,
  totalPrompts: prompts.length,
  totalTokens: results.reduce((sum, r) => sum + r.tokens, 0),
});

} catch (error: any) {
console.error('Batch error:', error);
res.status(500).json({ error: error.message || 'Internal server error' });
}
});


// Health check
app.get('/api/health', (req: Request, res: Response) => {
res.json({
status: 'healthy',
timestamp: new Date().toISOString(),
model: 'gemini-1.5-flash-lite',
});
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
console.log(`📍 API endpoints:`);
console.log(`   POST /api/chat - Chat completions`);
console.log(`   POST /api/enhance-prompt - Prompt enhancement`);
console.log(`   POST /api/code-interpreter - Code generation with planning`);
console.log(`   POST /api/agent - Multi-step reasoning agent`);
console.log(`   POST /api/batch - Batch processing`);
console.log(`   GET  /api/health - Health check`);
});
