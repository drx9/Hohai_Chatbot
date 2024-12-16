import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message, useLocal } = await req.json();

    let responseText = '';

    if (useLocal) {
      // Call Ollama's local API
      const response = await fetch('http://localhost:11434/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-j', prompt: message }),
      });

      if (!response.ok) throw new Error('Failed to fetch from Ollama');

      const data = await response.json();
      responseText = data.response;
    } else {
      // Call Vercel AI SDK
      const response = await fetch('http://localhost:3000/api/vercel-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) throw new Error('Failed to fetch from Vercel AI SDK');

      const data = await response.json();
      responseText = data.response;
    }

    return NextResponse.json({ response: responseText });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch chatbot response' }, { status: 500 });
  }
}
