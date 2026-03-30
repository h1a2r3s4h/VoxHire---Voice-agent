<div align="center">

<img src="https://img.shields.io/badge/VoxHire-AI%20Recruiter-6C3CE1?style=for-the-badge&logo=robot&logoColor=white" alt="VoxHire" height="50"/>

# 🎙️ VOX HIRE — AI Recruiter Voice Agent

**Automate your first-round interviews with the power of real-time AI voice conversations.**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20Now-6C3CE1?style=for-the-badge)](https://vox-hire-voice-agent.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/h1a2r3s4h/VoxHire---Voice-agent)
[![Next.js](https://img.shields.io/badge/Next.js-Framework-000000?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

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

---

## ⚙️ Installation & Setup

Follow these steps to run VOX HIRE locally.

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/h1a2r3s4h/VoxHire---Voice-agent.git
```

### 2️⃣ Navigate to the Project Folder

```bash
cd VoxHire---Voice-agent
```

### 3️⃣ Install Dependencies

```bash
npm install
```

or with Yarn:

```bash
yarn install
```

### 4️⃣ Setup Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_HOST_URL=http://localhost:3000
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key
```

> 💡 You can get your Supabase credentials from the [Supabase Dashboard](https://supabase.com/) and your Vapi key from the [Vapi Console](https://vapi.ai/).

### 5️⃣ Start the Development Server

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:3000
```

---

## 🚀 Deployment

VOX HIRE is deployed on **Vercel**.

**Option 1 — Build manually:**

```bash
npm run build
```

**Option 2 — Auto-deploy via Vercel:**

Connect your GitHub repository directly to [Vercel](https://vercel.com/) and it will deploy automatically on every push.

---

## 🔮 Roadmap & Future Improvements

- [ ] 📧 Email OTP authentication for candidates
- [ ] ⚡ Redis rate limiting for OTP requests
- [ ] 🐇 RabbitMQ for scalable interview processing
- [ ] 🏆 AI scoring & ranking for candidates
- [ ] 📈 Interview analytics dashboard

---

## 📁 Project Structure

```
VoxHire---Voice-agent/
├── public/              # Static assets & screenshots
├── app/                 # Next.js app directory
├── components/          # Reusable React components
├── lib/                 # Supabase client & utility functions
├── .env.local           # Environment variables (not committed)
└── README.md
```

---

## 👨‍💻 Author

<div align="center">

**Harshit Gangwar**

*Building the future of recruitment, one voice at a time.*

[![GitHub](https://img.shields.io/badge/GitHub-h1a2r3s4h-181717?style=flat-square&logo=github)](https://github.com/h1a2r3s4h)

---

⭐ **If you find this project useful, please give it a star on [GitHub](https://github.com/h1a2r3s4h/VoxHire---Voice-agent)!** It helps a lot.

</div>