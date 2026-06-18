# Step-by-Step Setup Guide

## 🎬 Getting Started (5 minutes)

### Step 1: Start the Development Server
```bash
cd c:\Users\Sneh.Kurhade\Desktop\Portfolio\port
npm start
```
Expected output:
```
✔ Compiled successfully.
✔ Build complete. Watching for file changes...

→ Local:      http://localhost:4200/
```
🎯 Open http://localhost:4200 in your browser

### Step 2: Navigate to Chat Page
Click **"Chat"** in the navigation menu
OR go directly to: http://localhost:4200/chat

You should see:
```
┌─────────────────────────────────────┐
│ Chat with AI Sneh                   │
│                                     │
│ ⚙️ Configure Groq API               │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │ Hi! I'm AI Sneh. I can provide  │ │
│ │ responses locally, or you can   │ │
│ │ configure my Groq API key for   │ │
│ │ faster, more intelligent        │ │
│ │ answers. Ask me anything!       │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Step 3: Click "Configure Groq API"
Click the blue ⚙️ button

```
┌─────────────────────────────────┐
│ Enter your Groq API key for    │
│ faster, more intelligent resp... │
│                                 │
│ [gsk_xxxxxxxxxxxxxxxxxxxx    ] │
│ [Save] [Cancel]                 │
│                                 │
│ Get free key at console.groq... │
└─────────────────────────────────┘
```

### Step 4: Paste Your API Key
Click in the text field and paste:
```
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
```

### Step 5: Click "Save"
```
✅ Groq API configured successfully! 
   I'll now use Groq for faster, more intelligent responses.
```

### Step 6: Start Chatting! 🎉
Type in the chat input:
```
Ask me something... 
e.g., "What AI projects have you built?"
```

Try these example questions:
- ✅ "Tell me about Sneh"
- ✅ "What are his strongest skills?"
- ✅ "Show me Angular projects"
- ✅ "Explain his RAG experience"

Expected response (200-500ms):
```
┌──────────────────────────────────┐
│ You: "Tell me about Sneh"        │
│                                  │
│ AI: "I'm Sneh Kurhade, a Full   │
│ Stack Developer with 4+ years   │
│ of experience in enterprise     │
│ software development...          │
│                                  │
│ Sources: Biography, Current Role│
└──────────────────────────────────┘
```

## 🧪 Verification Checklist

- [ ] Chat page loads
- [ ] "Configure Groq API" button visible
- [ ] Can enter API key
- [ ] "Groq API configured successfully" message appears
- [ ] ⚡ Groq Configured button shows (configured state)
- [ ] Can send messages
- [ ] Responses come back in <1 second
- [ ] Sources are shown in responses
- [ ] Suggested questions work

## 🔍 Troubleshooting

### Issue: "Invalid API key" error

**Cause:** API key is incorrect

**Solution:**
1. Check the key format (should start with `gsk_`)
2. Go to https://console.groq.com and verify key is active
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try again

### Issue: Slow responses (>3 seconds)

**Cause:** Network issue or Groq server load

**Solution:**
1. Check internet connection
2. Wait a few seconds
3. Try a simpler question
4. System automatically falls back to local responses

### Issue: Chat not working at all

**Cause:** Groq API or local fallback issue

**Solution:**
1. Open browser DevTools (F12)
2. Check Console for error messages
3. Try refreshing page
4. Delete Groq API key and use fallback mode

### Issue: Responses are generic

**Cause:** RAG didn't find relevant documents

**Solution:**
1. Try rephrasing the question
2. Use specific keywords (skills, projects, experience)
3. Check that documents are in knowledge base

## 🎯 Example Q&A Session

### Question 1: General Inquiry
```
You: "Who are you?"

Groq Response:
"I'm Sneh Kurhade, a Full Stack Developer with 4+ 
years of professional experience in enterprise 
software development. I specialize in building scalable 
web applications using modern technologies like 
Angular and .NET, with recent expertise in AI/LLM 
technologies including RAG pipelines and Groq integration.

I'm passionate about clean code, scalable architecture, 
and leveraging technology to solve complex problems."

Sources: Biography, Current Role
Time: 245ms
```

### Question 2: Skills Deep Dive
```
You: "What AI/ML technologies do you know?"

Groq Response:
"I'm actively working with AI and LLM technologies:

• RAG (Retrieval Augmented Generation) pipelines - 
  implementing systems that retrieve relevant context 
  before generating responses
• Groq API for fast LLM responses - 10x faster than 
  traditional LLMs
• Vector databases - experience with semantic search 
  and vector embeddings
• LLMs - working with Mixtral, Llama 2, Gemma models
• Prompt engineering - crafting effective prompts

I've built multiple AI-powered projects including 
resume analyzers and this portfolio chatbot. AI is 
a rapidly evolving area where I stay current."

Sources: Skills - AI/LLM, Project - AI Resume Assistant
Time: 312ms
```

### Question 3: Project-Specific
```
You: "Tell me about the Lending Platform"

Groq Response:
"The Enterprise Lending Platform is one of my key 
projects built for Nedbank. It's a full-stack 
application handling millions of transactions.

Technology Stack:
- Frontend: Angular with responsive design
- Backend: .NET Core REST APIs
- Database: SQL Server with optimization
- Cloud: Azure deployment and infrastructure
- CI/CD: Azure DevOps pipelines

Key achievements:
- Led AngularJS to Angular migration (40% performance 
  improvement)
- Built and maintained the application
- Reduced API response times by 30% through optimization
- Managed Azure cloud infrastructure

This is a great example of my enterprise development 
and full-stack capabilities."

Sources: Projects - Enterprise Lending, Experience - Nihilent
Time: 278ms
```

## 📊 What's Happening Behind the Scenes

### Flow Diagram:
```
User Question
    ↓
1. RAG Service
   - Converts question to searchable terms
   - Searches 9 documents
   - Finds top 5 relevant chunks
   ⏱️ ~50ms
    ↓
2. Context Building
   - Formats chunks with titles
   - Creates context string
   ⏱️ ~10ms
    ↓
3. Groq API Call
   - Sends formatted message
   - HTTP request with Bearer token
   - Waits for response
   ⏱️ ~200ms
    ↓
4. Response Processing
   - Parse Groq response
   - Extract answer text
   - Add source citations
   ⏱️ ~20ms
    ↓
AI Response with Sources
⏱️ Total: ~280ms
```

## 🔧 Customization

### Change Default Model
Edit `src/app/services/groq.service.ts`:
```typescript
// Line ~25
private model = 'mixtral-8x7b-32768'; // Change to:
private model = 'llama2-70b-4096';    // For better quality
private model = 'gemma-7b-it';         // For speed
```

### Add More Knowledge
Edit `src/app/services/rag.service.ts`:
```typescript
// In initializeDocuments() method, add:
{
  id: 'new-doc',
  title: 'My New Document',
  source: 'Documentation',
  content: 'Your new knowledge here...'
}
```

### Adjust RAG Parameters
In `RagService`:
```typescript
private chunkSize = 500;     // Words per chunk
private overlapSize = 100;   // Word overlap
// In retrieveRelevantChunks():
const topK = 5;  // Change to retrieve more/fewer chunks
```

## 🚀 Advanced: Deployment

### Build for Production
```bash
npm run build
# Creates dist/port/ folder
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist/port
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

## 📈 Monitoring

### Check Your Usage
1. Visit https://console.groq.com
2. Look at "API Keys" section
3. View usage statistics
4. See remaining free tier requests

### Monitor Performance
1. Open Chrome DevTools (F12)
2. Go to "Network" tab
3. Ask a question
4. See Groq API request details:
   - Status: 200
   - Time: ~200ms
   - Size: ~1-2KB response

## 🎓 Understanding RAG

### Why RAG is Better:
```
Without RAG:
Question → LLM → Generic Answer ❌

With RAG:
Question → Find Documents → LLM + Context → Specific Answer ✓
```

### Example:
```
Question: "What's your strongest skill?"

Without RAG:
"Full-stack development is important. 
Professional developers should know multiple languages."
(Generic, not specific to you)

With RAG:
"Based on my experience, my strongest skill is 
Angular development where I led a major migration 
for Nedbank, improving performance by 40%."
(Specific to your background)
```

## 💡 Tips & Tricks

### Get Better Responses:
1. **Be specific:** "Angular" > "frontend"
2. **Ask about projects:** "Lending Platform details"
3. **Ask for examples:** "Show me your best projects"
4. **Ask about skills:** "Azure expertise?"

### Optimize Performance:
1. Close other browser tabs
2. Check internet connection
3. Refresh if slow
4. Use Firefox or Chrome (best performance)

### Learn From Responses:
1. Note what sources are cited
2. See what documents match your query
3. Understand RAG retrieval logic
4. Improve your questions

## 🎯 Next Steps

1. ✅ **Start chatting** - Try all example questions
2. ⭐ **Test fallback** - Delete API key to try local mode
3. 🔧 **Customize** - Add your own documents
4. 🚀 **Deploy** - Push to live hosting
5. 📊 **Monitor** - Check Groq usage

## 📞 Support

### Common Issues Resolved:
- "Why is my response slow?" → Internet/Groq load
- "Why is the answer generic?" → RAG didn't find context
- "API key not working?" → Invalid format or inactive key
- "Chat not responding?" → Check browser console
- "How do I add documents?" → Edit RagService

### Getting Help:
1. Check IMPLEMENTATION_SUMMARY.md
2. Review RAG_GROQ_SETUP.md
3. Check browser console (F12)
4. Ask the AI chatbot itself!

---

**You're all set! 🎉 Enjoy your AI-powered portfolio with RAG + Groq!** ⚡

Happy chatting! 💬
