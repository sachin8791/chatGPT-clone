import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createChat, getChatWithMessages, addMessage } from '@/lib/database';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

export async function POST(request: NextRequest) {
  try {
    const { message, chatId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let currentChatId = chatId;

    if (!currentChatId) {
      const chat = await createChat(message.slice(0, 50) + (message.length > 50 ? '...' : ''));
      currentChatId = chat._id?.toString();
    }

    await addMessage(currentChatId, 'user', message);

    const chatHistory = await getChatWithMessages(currentChatId);
    const messages = chatHistory?.messages || [];

    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: conversationHistory,
      stream: true,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = '';
        
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullResponse += content;
              const encoded = encoder.encode(content);
              controller.enqueue(encoded);
            }
          }
          
          if (fullResponse) {
            await addMessage(currentChatId, 'assistant', fullResponse);
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
