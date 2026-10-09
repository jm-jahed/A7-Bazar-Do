# Bazar Dor (বাজার দর)

Bazar Dor (বাজার দর) is a daily commodity market price tracking web application for Bangladesh, providing real-time commodity prices, market fluctuation insights, and cross-market price comparisons.

---

## 🌟 Main Assignment Features

- **Navbar, Bengali Date & Price Ticker**: Fixed top header showing the current Bengali calendar date, category navigation links, user auth state, and an infinite horizontal ticker for commodity price changes.
- **Hero Section & Product Listings**: Hero banner with scroll anchor (`#সব-পণ্য`), top price risers (**আজ দাম বেড়েছে ▲**), top price fallers (**আজ দাম কমেছে ▼**), and a responsive all-products catalog grid with Bengali numerals.
- **Category Pages & Bengali Numeral Sorting (C1)**: Category-specific listings with dynamic 3-way sorting (`ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`) accurately parsed and sorted by Bengali numeral values.
- **Protected Product Details (`/product/[slug]`)**: Server-authenticated route requiring sign-in with safe return redirect, displaying price summaries (Min/Max/Avg) and market-by-market price comparisons.
- **Better Auth Authentication & Profile Update (C3)**: User registration, credentials and social login options, session persistence via SQLite, and user name update functionality on `/profile/update`.
- **Layout, Loading States & 404 Route**: Responsive design across mobile, tablet, and desktop, skeleton loaders for data fetching, toast notifications, and dedicated 404 error page.

---

## 🛠️ Technologies Used

- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Better Auth (SQLite persistence)
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

---

## 📦 Data Source & Endpoints

- **Live JSON Data**: `https://raw.githubusercontent.com/programming-hero-web-course-4/b11-a7-bazar-dor-data/refs/heads/main/data.json`

---

## 🚀 Installation & Local Setup

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

---

## 📋 Assignment Requirements Checklist

- [x] Responsive layout on mobile, tablet, and desktop devices
- [x] Clear and meaningful Git commit history (20+ commits)
- [x] Navbar with brand logo, live Bengali date, category links, and scrolling ticker
- [x] Hero section with CTA anchor scroll and banner image
- [x] Home page product sections: Risers (Top 6), Fallers (Top 6), and All Products grid
- [x] Category listing page with empty state and skeleton loaders
- [x] **Challenge C1**: Sort control handling Bengali numerals numerically
- [x] Protected product details route with login redirect and market price tables
- [x] Authentication pages (`/signin`, `/signup`) with Better Auth and toast notifications
- [x] **Challenge C3**: Profile information update feature (`/profile/update`)
- [x] Custom 404 page with navigation back to home
- [x] **Challenge C2**: Assignment-focused README documentation

---

## 📬 GitHub Repository

- **GitHub Repository**: [https://github.com/jm-jahed/A7-Bazar-Do.git](https://github.com/jm-jahed/A7-Bazar-Do.git)
