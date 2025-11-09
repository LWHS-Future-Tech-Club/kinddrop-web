# Deploying to Vercel

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- Your code pushed to a Git repository

## Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign up or log in with your Git provider

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your Git repository
   - Vercel will automatically detect it's a Next.js project

3. **Configure Project** (Optional)
   - **Project Name**: kinddrop-web (or your preferred name)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Add any environment variables your app needs
   - Example: `NEXT_PUBLIC_API_URL`

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (~1-2 minutes)
   - Your site will be live at `https://your-project.vercel.app`

## Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? **Select your account**
   - Link to existing project? **No**
   - Project name? **kinddrop-web**
   - In which directory is your code located? **./
**
   - Auto-detected Next.js. Continue? **Yes**
   - Override settings? **No**

4. **Production Deployment**
   ```bash
   vercel --prod
   ```

## Automatic Deployments

Once connected to Git:
- Every push to `main` branch → Production deployment
- Every push to other branches → Preview deployment
- Pull requests get unique preview URLs

## Custom Domain

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Environment Variables

Add in Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add variables for:
   - Production
   - Preview
   - Development

## Post-Deployment

After successful deployment:
- ✅ Site available at `https://your-project.vercel.app`
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic scaling
- ✅ Edge functions enabled
- ✅ Analytics available (optional)

## Monitoring

- View deployments: `vercel ls`
- View logs: `vercel logs [deployment-url]`
- Check build status in Vercel Dashboard

## Troubleshooting

If build fails:
1. Check build logs in Vercel Dashboard
2. Ensure all dependencies in package.json
3. Test build locally: `npm run build`
4. Check Node.js version compatibility

## Performance Tips

- Enable Vercel Analytics (Project Settings → Analytics)
- Use Next.js Image Optimization
- Implement ISR (Incremental Static Regeneration) for dynamic pages
- Add proper caching headers

## Links

- Vercel Dashboard: https://vercel.com/dashboard
- Next.js Deployment Docs: https://nextjs.org/docs/deployment
- Vercel CLI Docs: https://vercel.com/docs/cli
