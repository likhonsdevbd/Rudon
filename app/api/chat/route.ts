import { mistral } from '@ai-sdk/mistral';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: mistral('mistral-large-latest'),
    messages,
  });

  return result.toTextStreamResponse();
}
