import { OpenAIStream } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const stream = await OpenAIStream({
      model: 'gpt-3.5-turbo', // Replace with your desired model
      prompt: message,
      max_tokens: 150,
      temperature: 0.7,
    });

    return new Response(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to communicate with Vercel AI SDK' }, { status: 500 });
  }
}
