import { NextRequest, NextResponse } from 'next/server';
import { getChats, createChat } from '@/lib/database';

export async function GET() {
  try {
    const chats = await getChats();
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    // Return empty array if database fails
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const chat = await createChat(title);
    return NextResponse.json(chat);
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Database connection failed. Please check MongoDB configuration.' },
      { status: 500 }
    );
  }
}
