'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';

export default function Chat() {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-2xl p-4 bg-white rounded-lg shadow-md">
        <div className="mb-4">
          {messages.map(m => (
            <div key={m.id} className={`mb-2 ${m.role === 'user' ? 'text-right' : ''}`}>
              <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {m.parts.map((p, i) => (
                  <span key={i}>{p.type === 'text' ? p.text : ''}</span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            className="flex-grow p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-r-lg hover:bg-blue-600">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
