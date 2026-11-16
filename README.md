# PRO LIFE — Best Flavored Protein Drinks

An immersive, high-performance web experience for **PRO LIFE Protein Drinks**, featuring an interactive 60fps canvas scroll-driven 3D animation, instant flavor switching across three signature flavors (**Dutch Chocolate**, **Wild Strawberry**, and **Cookies & Cream**), responsive light product sections, and an integrated checkout interface.

---

## ⚡ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: Canvas 2D frame interpolation with sub-pixel rendering & smooth lerp
- **Hosting**: Configured for [Vercel](https://vercel.com/) with edge asset caching

---

## 🚀 Step 1: Push to GitHub

To push this codebase to a new GitHub repository:

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files (.gitignore automatically excludes node_modules and build artifacts)
git add .

# 3. Commit the changes
git commit -m "Initial commit: PRO LIFE Protein Drinks"

# 4. Set main as the default branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🌐 Step 2: Deploy to Vercel

This repository includes a pre-configured `vercel.json` optimized for Vite:

1. Go to [vercel.com](https://vercel.com/) and log in.
2. Click **Add New…** ➜ **Project**.
3. Select your newly created GitHub repository.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. Click **Deploy**. Your site will be live within ~1 minute!

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
├── public/
│   ├── frames/             # 190 high-definition frames per flavor for 3D animation
│   │   ├── chocolate/
│   │   ├── strawberry/
│   │   └── cookies/
│   └── initial_frames/     # High-res poster frames for instant initial load
├── src/
│   ├── components/
│   │   ├── HeroCanvas.tsx  # Scroll-scrubbed 60fps canvas renderer & flavor selector
│   │   ├── LightSections.tsx # Product cards, sampler pack, routine, reviews, & CTA
│   │   └── Navbar.tsx      # Adaptive frosted glass navigation & quick-order modal
│   ├── types.ts            # Type definitions for flavors & animation states
│   ├── App.tsx             # Root layout & scroll-based flavor synchronization
│   ├── index.css           # Global typography, Tailwind v4 imports, & utilities
│   └── main.tsx            # React application entry point
├── package.json
├── vercel.json             # Vercel SPA routing & immutable edge cache headers
├── vite.config.ts          # Vite build & alias configuration
└── tsconfig.json
```
