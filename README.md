# Bazar Dor (বাজার দর)

**Live Demo**: [https://a7-bazar-do.vercel.app](https://a7-bazar-do.vercel.app/)

Bazar Dor is a web application for tracking daily commodity market prices, daily price fluctuations, and cross-market price comparisons across local markets in Bangladesh.

## Features

- **Navbar, Bengali Date & Price Ticker**: Fixed header displaying the current Bengali calendar date, category navigation links, user authentication status, and a continuous marquee ticker showing commodity price changes.
- **Hero Banner & Product Sections**: Hero banner with scroll navigation to product sections, top price risers (আজ দাম বেড়েছে ▲), top price fallers (আজ দাম কমেছে ▼), and a responsive product grid displaying details in Bengali numerals.
- **Category Pages & Bengali Numeral Sorting (Challenge C1)**: Dynamic category filtering with 3-way sorting (`ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`) accurately parsed and sorted by Bengali numerical values.
- **Protected Product Details Route**: Protected route (`/product/[slug]`) requiring authentication with return redirect, displaying price summaries (Minimum, Maximum, Average) and market-by-market comparisons.
- **Authentication & Profile Update (Challenge C3)**: User registration and sign-in with Better Auth, SQLite session persistence, toast feedback, and user profile information updates at `/profile/update`.
- **Responsive Layout & Fallback UI**: Fully responsive across mobile, tablet, and desktop viewports, skeleton loading indicators, and custom 404 error handling.

## Technologies Used

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Better Auth (SQLite persistence)
- **Notifications**: React Hot Toast

## Data Source

- **Primary API**: `https://openapi.programming-hero.com/api/bazardor`
- **Fallback API**: `https://openapi.programming-hero.com/api/bazardor`
- **Raw JSON Data**: `https://raw.githubusercontent.com/programming-hero-web-course-4/b11-a7-bazar-dor-data/refs/heads/main/data.json`

## Installation & Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/jm-jahed/A7-Bazar-Do.git
cd a7-bazar-do
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_32_character_secret_key_here
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Links

- **Live URL**: [https://a7-bazar-do.vercel.app](https://a7-bazar-do.vercel.app/)
- **GitHub Repository**: [https://github.com/jm-jahed/A7-Bazar-Do.git](https://github.com/jm-jahed/A7-Bazar-Do.git)
