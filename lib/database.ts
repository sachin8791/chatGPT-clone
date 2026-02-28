import clientPromise from './mongodb';
import { Chat, Message, ChatWithMessages } from './models';
import { ObjectId } from 'mongodb';

export async function createChat(title: string): Promise<Chat> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const chat: Chat = {
      title,
      createdAt: new Date(),
    };
    
    const result = await db.collection('chats').insertOne(chat);
    chat._id = result.insertedId;
    
    return chat;
  } catch (error) {
    console.error('Database connection error in createChat:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function getChats(): Promise<Chat[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const chats = await db
      .collection('chats')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return chats as Chat[];
  } catch (error) {
    console.error('Database connection error in getChats:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function getChatWithMessages(chatId: string): Promise<ChatWithMessages | null> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const chat = await db.collection('chats').findOne({ _id: new ObjectId(chatId) });
    if (!chat) return null;
    
    const messages = await db
      .collection('messages')
      .find({ chatId: new ObjectId(chatId) })
      .sort({ createdAt: 1 })
      .toArray();
    
    return {
      ...(chat as Chat),
      messages: messages as Message[],
    } as ChatWithMessages;
  } catch (error) {
    console.error('Database connection error in getChatWithMessages:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function addMessage(chatId: string, role: 'user' | 'assistant', content: string): Promise<Message> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const message: Message = {
      chatId: new ObjectId(chatId),
      role,
      content,
      createdAt: new Date(),
    };
    
    const result = await db.collection('messages').insertOne(message);
    message._id = result.insertedId;
    
    return message;
  } catch (error) {
    console.error('Database connection error in addMessage:', error);
    throw new Error('Failed to connect to database');
  }
}

export async function deleteChat(chatId: string): Promise<void> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    await db.collection('chats').deleteOne({ _id: new ObjectId(chatId) });
    await db.collection('messages').deleteMany({ chatId: new ObjectId(chatId) });
  } catch (error) {
    console.error('Database connection error in deleteChat:', error);
    throw new Error('Failed to connect to database');
  }
}
