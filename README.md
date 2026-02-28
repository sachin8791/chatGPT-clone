# ChatGPT Clone

A modern ChatGPT clone built with Next.js 14, TypeScript, TailwindCSS, MongoDB, and OpenAI API.

## Features

- 🚀 **Streaming AI Responses** - Real-time typing effect with OpenAI GPT-4o-mini
- 💬 **Chat History** - Persistent chat sessions stored in MongoDB
- 🎨 **Modern UI** - Dark theme with glassmorphism effects
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 📝 **Markdown Support** - Rich text formatting with syntax highlighting
- 🔧 **Chat Management** - Create new chats, delete conversations, view history
- ⚡ **Auto-scroll** - Automatically scroll to latest messages

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **AI**: OpenAI API (GPT-4o-mini)
- **UI Components**: Lucide React icons, React Markdown, Syntax Highlighter

## Prerequisites

- Node.js 18+ 
- MongoDB instance (local or cloud)
- OpenAI API key

## Setup

1. **Clone and install dependencies**
```bash
npm install
```

2. **Environment variables**
Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/chatgpt-clone
OPENAI_API_KEY=your_openai_api_key_here
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `POST /api/chat` - Send message and get streaming response
- `GET /api/chats` - Get all chat sessions
- `POST /api/chats` - Create new chat session
- `GET /api/chats/[id]` - Get specific chat with messages
- `DELETE /api/chats/[id]` - Delete chat session

## Database Schema

### Chat Collection
```typescript
{
  _id: ObjectId,
  title: string,
  createdAt: Date
}
```

### Message Collection
```typescript
{
  _id: ObjectId,
  chatId: ObjectId,
  role: 'user' | 'assistant',
  content: string,
  createdAt: Date
}
```

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/route.ts
│   │   └── chats/[id]/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Sidebar.tsx
│   ├── MessageBubble.tsx
│   └── ChatInput.tsx
├── lib/
│   ├── mongodb.ts
│   ├── models.ts
│   └── database.ts
└── README.md
```

## Usage

1. **Start a new chat** - Click "New Chat" button in sidebar
2. **Send messages** - Type your message and press Enter
3. **View history** - Click on any chat in the sidebar to load it
4. **Delete chats** - Hover over chat in sidebar and click trash icon
5. **Copy code** - Hover over code blocks and click copy button

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
Make sure to set the same environment variables as in development.

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning or commercial purposes.
