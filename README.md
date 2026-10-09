# Bazar Dor (বাজার দর)

Bazar Dor is a web application for tracking daily commodity market prices, price fluctuations, and market comparisons across local markets in Bangladesh.

---

## Features

1. **Market Overview and Live Price Ticker**: Header with current Bengali date and an infinite horizontal price ticker showing real-time commodity prices and percentage changes.
2. **Top Risers, Fallers, and All Products**: Homepage sections categorizing top price gainers (আজ দাম বেড়েছে), top price fallers (আজ দাম কমেছে), and a full responsive product grid matching the Figma design.
3. **Category Filtering and Multi-Option Sorting (Challenge C1)**: Browse products by category (rice, lentils, oil, vegetables, etc.) with sorting options (`ডিফল্ট`, `দাম: কম থেকে বেশি`, and `দাম: বেশি থেকে কম`) handling Bengali numerals numerically.
4. **Protected Product Details Route (`/product/[slug]`)**: Server-side authenticated view displaying price statistics (minimum, maximum, average) and market-by-market price tables with safe callback redirection for unauthenticated visitors.
5. **Authentication and Profile Management (Challenge C3)**: User registration and login using Better Auth (email/password and social login), session persistence via SQLite, and user name update functionality on `/profile`.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Server Components, SSR)
- **Library**: React 19
- **Styling**: Tailwind CSS v4
- **Authentication**: Better Auth with SQLite persistence
- **Language**: TypeScript
- **Notifications**: React Hot Toast

---

## Prerequisites

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher

---

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd a7-bazar-do
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your_32_character_secret_key_here
   BETTER_AUTH_URL=http://localhost:3000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev` — Starts local development server
- `npm run build` — Builds production bundle
- `npm start` — Runs production server
- `npm run lint` — Runs ESLint checks

---

## Submission Details

- **Live Link**: [Live Deployment URL](https://your-deployment-url.vercel.app)
- **GitHub Repository Link**: [GitHub Repository URL](https://github.com/your-username/a7-bazar-dor)
