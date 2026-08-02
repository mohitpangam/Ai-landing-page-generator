# 🚀 AI SaaS Landing Page Generator

A full-stack, AI-powered SaaS landing page builder built with **Next.js 15 (App Router)**, **Tailwind CSS v4**, **Prisma 7**, **Neon PostgreSQL**, and **Google Gemini 2.5 Flash AI**.

🌐 **Live Demo:** [https://ai-landing-page-generator-theta.vercel.app](https://ai-landing-page-generator-theta.vercel.app)

---

## ✨ Key Features

- 🤖 **AI-Powered Page Generation**: Generate complete, structured landing page schemas (Hero, Features, Testimonials, Pricing, CTA, FAQ, Footer) from a single prompt in seconds using Gemini 2.5 Flash.
- 🎨 **Visual Drag & Drop Editor**: Reorder sections seamlessly via `@dnd-kit`, edit copy inline directly on the canvas, and preview layouts across Desktop, Tablet, and Mobile viewports.
- ✨ **AI Copy Assistant & Tone Rewriter**: Rewrite headlines, subheadlines, and CTAs in 1 click (Punchy, Professional, Shorten, Expand, or Custom Prompts).
- 🌙 **Custom Color Picker & Dark Mode**: Full custom HEX color picker alongside preset swatches and 1-click Dark Mode toggle.
- 🕒 **Version History & Rollback**: Automatic snapshot history allowing instant 1-click version restoration.
- 🔍 **SEO & OpenGraph Previews**: Live Google Search snippet preview and OpenGraph social share card preview with character count optimization.
- 📦 **Dual Code Export**: Download full, standalone **Next.js 15 + Tailwind ZIP projects** or **Single-File HTML & CSS bundles**.
- 🌐 **One-Click Public Publishing**: Publish landing pages to live public URLs (`/p/[slug]`) with built-in, privacy-friendly analytics (**👁️ Page Views**, **🎯 CTA Clicks**, **📈 % CTR**).
- 🔐 **Authentication**: NextAuth / Auth.js with Google OAuth & Credentials provider.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router, Server Components) |
| **Styling** | Tailwind CSS v4, Vanilla CSS Tokens |
| **Database & ORM** | Neon Serverless PostgreSQL + Prisma 7 ORM |
| **AI Model** | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| **Authentication** | Auth.js (NextAuth v5) + Google OAuth |
| **State Management** | Zustand |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` |
| **Deployment** | Vercel Serverless Functions |

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/mohitpangam/Ai-landing-page-generator.git
cd Ai-landing-page-generator/ai-landing-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="your-32-char-random-secret"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Run database migrations & start local dev server
```bash
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🛡️ License

Distributed under the MIT License.
