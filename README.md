
# 🚀 GameVault Top-Up Marketplace

A sleek, mobile-responsive gaming top-up marketplace built with React, Tailwind CSS, and Supabase.

## 🛠️ Tech Stack
- **Frontend**: React (ESM modules)
- **Styling**: Tailwind CSS
- **Database/Auth**: Supabase
- **Icons**: Lucide React

## 📦 Deployment Guide

### Option 1: Vercel (Recommended)
1. Push your code to a GitHub repository (excluding `.env`).
2. Import the project in [Vercel](https://vercel.com).
3. In the **Environment Variables** section, add:
   - `SUPABASE_URL`: Your Supabase Project URL.
   - `SUPABASE_ANON_KEY`: Your Supabase Anon Key.
4. Click **Deploy**.

### Option 2: Netlify
1. Connect your GitHub/GitLab repo to [Netlify](https://netlify.com).
2. Set the build command to `npm run build` (if applicable) or leave blank for static.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` in the **Site Settings > Environment Variables**.
4. Deploy the site.

## ⚙️ Local Development
1. Clone the repository.
2. Ensure you have a `.env` file with the correct Supabase credentials.
3. Open `index.html` using a local development server (like VS Code Live Server or `npx serve`).

## 🛡️ Security Note
Never share your `SUPABASE_SERVICE_ROLE_KEY`. Only use the `SUPABASE_ANON_KEY` in frontend applications.
