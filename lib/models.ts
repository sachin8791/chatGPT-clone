import { ObjectId } from 'mongodb';
import { getChatsCollection, getMessagesCollection } from './mongodb';

export interface Chat {
  _id?: ObjectId;
  title: string;
  createdAt: Date;
}

export interface Message {
  _id?: ObjectId;
  chatId: ObjectId;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatWithMessages extends Chat {
  messages?: Message[];
}

export class ChatService {
  static async createChat(title: string): Promise<Chat> {
    const collection = await getChatsCollection();
    const chat: Omit<Chat, '_id'> = {
      title,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(chat as unknown as Document);
    return { ...chat, _id: result.insertedId };
  }

  static async getChats(): Promise<Chat[]> {
    const collection = await getChatsCollection();
    const chats = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return chats as Chat[];
  }

  static async getChat(id: string): Promise<Chat | null> {
    const collection = await getChatsCollection();
    const chat = await collection.findOne({ _id: new ObjectId(id) });
    return chat as Chat | null;
  }

  static async deleteChat(id: string): Promise<boolean> {
    const chatsCollection = await getChatsCollection();
    const messagesCollection = await getMessagesCollection();
    
    const result = await chatsCollection.deleteOne({ _id: new ObjectId(id) });
    await messagesCollection.deleteMany({ chatId: new ObjectId(id) });
    
    return result.deletedCount > 0;
  }

  static async updateChatTitle(id: string, title: string): Promise<boolean> {
    const collection = await getChatsCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );
    return result.modifiedCount > 0;
  }
}

export class MessageService {
  static async createMessage(
    chatId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<Message> {
    const collection = await getMessagesCollection();
    const message: Omit<Message, '_id'> = {
      chatId: new ObjectId(chatId),
      role,
      content,
      createdAt: new Date(),
    };
    const result = await collection.insertOne(message as unknown as Document);
    return { ...message, _id: result.insertedId };
  }

  static async getMessages(chatId: string): Promise<Message[]> {
    const collection = await getMessagesCollection();
    const messages = await collection
      .find({ chatId: new ObjectId(chatId) })
      .sort({ createdAt: 1 })
      .toArray();
    return messages as Message[];
  }

  static async deleteMessages(chatId: string): Promise<boolean> {
    const collection = await getMessagesCollection();
    const result = await collection.deleteMany({ chatId: new ObjectId(chatId) });
    return result.deletedCount > 0;
  }
}
