<div align="center">

<img src="https://img.shields.io/badge/VoxHire-AI%20Recruiter-6C3CE1?style=for-the-badge&logo=robot&logoColor=white" alt="VoxHire" height="50"/>

# 🎙️ VOX HIRE — AI Recruiter Voice Agent

**Automate your first-round interviews with the power of real-time AI voice conversations.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Now-6C3CE1?style=for-the-badge)](https://vox-hire-voice-agent.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/h1a2r3s4h/VoxHire---Voice-agent)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

*VOX HIRE is an AI-powered recruitment platform that conducts voice interviews autonomously — screening candidates faster, smarter, and at scale.*

</div>

---

## 📸 Screenshots

### 🏠 Landing Page
![Landing Page](public/1.png)

### 📊 Recruiter Dashboard
![Dashboard](public/2.png)

---

## 🧠 What is VOX HIRE?

VOX HIRE is an **AI-powered recruiter voice agent** designed to automate the **first stage of recruitment**. Companies can create interview sessions, share links with candidates, and let the AI handle the rest — from asking questions to generating structured feedback.

> Candidates simply join an interview link and interact with an **AI recruiter** in real-time voice conversations. No human involvement needed at the screening stage.

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 **AI Interview Generation** | Automatically generates tailored interview questions using AI prompts |
| 🗣️ **Voice-based Interviews** | Real-time voice conversations powered by Vapi AI |
| 🧑‍💼 **Candidate Management** | Create, manage, and track interview sessions effortlessly |
| 📊 **AI Feedback & Scoring** | Structured feedback generated from candidate responses |
| 🔗 **Interview Link Sharing** | Instantly share interview links with candidates |
| 🔐 **Secure Authentication** | Google OAuth via Supabase for secure recruiter login |
| 🐳 **Docker Support** | Fully containerized for consistent local and production deployments |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js** | Full-stack React framework |
| **React.js** | Frontend UI components |
| **Tailwind CSS** | Modern, utility-first styling |
| **Vapi AI** | Real-time voice AI conversations |
| **Supabase** | Database, backend & authentication |
| **Vercel** | Deployment & hosting |
| **Docker** | Containerization & consistent environments |

---

## ⚙️ Installation & Setup

### Option A — Local Development (Node.js)

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/h1a2r3s4h/VoxHire---Voice-agent.git
```

#### 2️⃣ Navigate to the Project Folder

```bash
cd VoxHire---Voice-agent
```

#### 3️⃣ Install Dependencies

```bash
npm install
```

or with Yarn:

```bash
yarn install
```

#### 4️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_HOST_URL=http://localhost:3000
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

> 💡 Get your Supabase credentials from the [Supabase Dashboard](https://supabase.com/) and your Vapi key from the [Vapi Console](https://vapi.ai/).

#### 5️⃣ Start the Development Server

```bash
npm run dev
```

Open your browser and go to `http://localhost:3000`

---

### Option B — Docker (Recommended for Production-like Setup)

> 🐳 The project is fully Dockerized using `output: "standalone"` in `next.config.mjs` for an optimized production build.

#### 1️⃣ Setup Environment Variables

Create a `.env.production` file (for Docker) or `.env.local` (for local dev):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_HOST_URL=http://localhost:3000
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

> ⚠️ **Never commit real `.env` files to GitHub.** Use `.env.example` with placeholder values for the repository instead.

#### 2️⃣ Build the Docker Image

```bash
docker build -t voice-ai-agent .
```

#### 3️⃣ Run the Container

```bash
docker run -p 3000:3000 --env-file .env.production voice-ai-agent
```

If port `3000` is already in use:

```bash
docker run -p 3001:3000 --env-file .env.production voice-ai-agent
```

#### 4️⃣ Open the App

- `http://localhost:3000`
- or `http://localhost:3001` if using alternate port

#### Files Added for Docker Support

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage build for optimized Next.js image |
| `.dockerignore` | Prevents unnecessary files from being copied into the image |
| `docker-compose.yml` | Optional compose setup for local orchestration |
| `next.config.mjs` | Updated with `output: "standalone"` for Docker compatibility |

#### What to Push vs. What to Keep Local

| ✅ Safe to Push | ❌ Never Push |
|----------------|--------------|
| `Dockerfile` | `.env.local` |
| `.dockerignore` | `.env.production` |
| `docker-compose.yml` | Real API keys |
| `next.config.mjs` | Any file with secrets |
| `.env.example` (placeholder values only) | — |

---

## 🚀 Deployment

### Vercel (Recommended)

VOX HIRE is deployed on **Vercel**. Connect your GitHub repository to [Vercel](https://vercel.com/) and it will auto-deploy on every push to `main`.

**Manual build:**

```bash
npm run build
```

### Docker (Self-hosted)

Use the Docker setup above for self-hosted or cloud VM deployments.

---

## 📁 Project Structure

```
VoxHire---Voice-agent/
├── public/              # Static assets & screenshots
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Supabase client & utility functions
├── services/            # External service integrations
├── Dockerfile           # Docker image definition
├── .dockerignore        # Docker build exclusions
├── .env.local           # Local environment variables (not committed)
├── .env.production      # Production environment variables (not committed)
├── next.config.mjs      # Next.js configuration (standalone output)
└── README.md
```

---

## 🔮 Roadmap & Future Improvements

- [ ] 📧 Email OTP authentication for candidates
- [ ] ⚡ Redis rate limiting for OTP requests
- [ ] 🐇 RabbitMQ for scalable interview processing
- [ ] 🏆 AI scoring & ranking for candidates
- [ ] 📈 Interview analytics dashboard
- [ ] 🔄 Docker Compose for full-stack local orchestration

---

## 👨‍💻 Author

<div align="center">

**Harshit Gangwar**

*Building the future of recruitment, one voice at a time.*

[![GitHub](https://img.shields.io/badge/GitHub-h1a2r3s4h-181717?style=flat-square&logo=github)](https://github.com/h1a2r3s4h)

---

⭐ **If you find this project useful, please give it a star on [GitHub](https://github.com/h1a2r3s4h/VoxHire---Voice-agent)!** It helps a lot.

</div>