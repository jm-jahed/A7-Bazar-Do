# বাজার দর (BazarDor)

A modern web application to track daily commodity market prices, price fluctuations, and market-by-market price comparisons across Bangladesh.

## Links

- **Live URL**: [https://a7-bazar-do.vercel.app](https://a7-bazar-do.vercel.app/)
- **GitHub Repository**: [https://github.com/jm-jahed/A7-Bazar-Do.git](https://github.com/jm-jahed/A7-Bazar-Do.git)

## Key Features

1. **Navbar, Live Bengali Date & Price Ticker**: Fixed header with today's Bengali calendar date, category navigation pills, user authentication status, and an infinite scrolling ticker displaying real-time commodity price changes.
2. **Hero Banner & Market Highlights**: Interactive hero section with quick navigation to all products, top 6 price risers (আজ দাম বেড়েছে ▲), and top 6 price fallers (আজ দাম কমেছে ▼).
3. **Category Filtering & Price Sorting (Challenge C1)**: Dynamic category filtering with a 3-way sort dropdown (`ডিফল্ট`, `দাম: কম থেকে বেশি`, `দাম: বেশি থেকে কম`) accurately handling Bengali numerals.
4. **Protected Product Details Route**: Server-protected details page (`/product/[slug]`) requiring user authentication with return redirect, displaying overall price statistics (Minimum, Maximum, Average) and detailed market-by-market price breakdown.
5. **Authentication & Profile Update (Challenge C3)**: User registration and login using Better Auth with session persistence, error/success toast notifications, and profile information update at `/profile/update`.

## Technologies Used

- **Framework**: Next.js (App Router)
- **UI Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **Notifications**: React Hot Toast
