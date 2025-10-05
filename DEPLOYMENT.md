## Vercel Deployment Guide 🚀

Complete step-by-step guide for deploying LEO-Xplorer to Vercel.

### Prerequisites
- [ ] GitHub account
- [ ] Vercel account (free)
- [ ] Code pushed to GitHub repository

### Method 1: GitHub Integration (Recommended)

#### Step 1: Prepare Repository
1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

#### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Find and import your `leo-xplorer` repository
4. Configure project:
   - **Project Name**: `leo-xplorer` (or your preferred name)
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: `.` (default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)

#### Step 3: Environment Variables (Optional)
1. In Vercel dashboard → Project Settings → Environment Variables
2. Add: `VITE_GEMINI_API_KEY` with your Gemini API key
3. **Note**: App works without API key using comprehensive mock data

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project-name.vercel.app`

### Method 2: Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login and Deploy
```bash
vercel login
cd /path/to/leo-xplorer
vercel
```

#### Step 3: Follow CLI Prompts
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name:** leo-xplorer
- **Directory:** ./
- **Override settings?** No

#### Step 4: Set Environment Variables
```bash
vercel env add VITE_GEMINI_API_KEY
```

### Post-Deployment Checklist
- [ ] Site loads correctly at Vercel URL
- [ ] All pages and navigation work
- [ ] Form submissions work
- [ ] Charts and visualizations render
- [ ] Mobile responsiveness works
- [ ] AI report generation works (if API key set)

### Automatic Deployments
✅ Vercel automatically deploys on every push to main branch
✅ Preview deployments for pull requests
✅ Custom domains available (free for personal use)

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### Troubleshooting

**Build Fails:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Run `npm run build` locally to test

**Environment Variables Not Working:**
- Ensure variable names start with `VITE_`
- Redeploy after adding environment variables
- Check variable values in Vercel dashboard

**404 Errors:**
- Vercel.json handles SPA routing automatically
- Ensure vercel.json is in project root

### Performance Optimization
✅ Automatic code splitting enabled
✅ Static assets cached for 1 year
✅ Gzip compression enabled
✅ Global CDN distribution

---

### Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Vercel Commands
vercel                  # Deploy current directory
vercel --prod          # Deploy to production
vercel domains add     # Add custom domain
vercel env ls          # List environment variables
```

**Your app will be live at: `https://leo-xplorer.vercel.app` 🎉**