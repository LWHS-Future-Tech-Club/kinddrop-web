
# KindDrop Web

A Next.js application for spreading kindness and positivity through messages. Built with Next.js 15, React 18, and Tailwind CSS.

The original design is available at https://www.figma.com/design/Z3FEIOq4GvMJBegbCN7aEH/Kindness-Message-Website.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

Build for production:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
kinddrop-web/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── login/             # Login page
│   ├── signup/            # Sign up page
│   └── dashboard/         # Dashboard page
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # UI components (shadcn/ui)
│   │   └── ...           # Feature components
│   ├── pages/            # Page components
│   ├── styles/           # Global styles
│   └── guidelines/       # Design guidelines
├── public/               # Static assets
└── ...config files
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository to Vercel
3. Vercel will automatically detect Next.js and configure the build settings
4. Deploy!

Alternatively, you can deploy using the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Features

- 🎨 Beautiful UI with Tailwind CSS
- ⚡ Fast performance with Next.js 15
- 📱 Fully responsive design
- 🎭 Smooth animations with Motion
- 🎯 Type-safe with TypeScript
- 🔒 Modern authentication flow
- 💬 Message composition and feed
- 🛍️ Points and shop system

## Environment Variables

Create a `.env.local` file in the root directory for environment-specific configuration:

```bash
# Add your environment variables here
# NEXT_PUBLIC_API_URL=your_api_url
```

## License

This project is private and proprietary.
  