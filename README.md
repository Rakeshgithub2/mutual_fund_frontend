# Mutual Fund Investment Platform - Frontend

A modern, feature-rich mutual fund investment platform built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

### Core Framework

- **Next.js 14+** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **Node.js 20+** - Runtime environment

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - High-quality component library
- **Lucide React** - Beautiful icon library

### State Management & Data Fetching

- **React Hooks** - useState, useEffect, useContext
- **Zustand** - Lightweight state management (if used)
- **Axios** - HTTP client for API calls

### Forms & Validation

- **React Hook Form** - Performant form management
- **Zod** - TypeScript-first schema validation

### Authentication

- **JWT** - JSON Web Token authentication
- **Google OAuth** - Social login integration
- **bcrypt** - Password hashing

### Real-time Features

- **Socket.IO Client** - Real-time updates for market data

### Additional Tools

- **Prisma** - Type-safe database ORM (for API routes if needed)
- **date-fns** - Modern date utility library
- **clsx** - Utility for constructing className strings

## 📋 Features

### User Authentication

- ✅ Email/Password registration and login
- ✅ Google OAuth integration
- ✅ JWT-based authentication
- ✅ Secure password hashing
- ✅ Token refresh mechanism

### Fund Discovery

- ✅ Browse 1000+ mutual funds
- ✅ Advanced search and filtering
- ✅ Category-based navigation
- ✅ Real-time NAV updates
- ✅ Fund comparison tools

### Portfolio Management

- ✅ Add funds to portfolio
- ✅ Track investments
- ✅ Performance analytics
- ✅ Goal-based investing
- ✅ SIP calculator

### Market Insights

- ✅ Real-time market indices (Nifty 50, Sensex, etc.)
- ✅ Latest financial news
- ✅ Fund performance charts
- ✅ Sector allocation visualization

### User Experience

- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Infinite scroll pagination
- ✅ Loading states and skeletons
- ✅ Error handling and validation
- ✅ Toast notifications

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.0.0 or higher
- **pnpm**: v8.0.0 or higher (recommended) or npm/yarn
- **Git**: For version control

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/Rakeshgithub2/mutual_fund_frontend.git
cd mutual_fund_frontend
```

### 2. Install dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 3. Set up environment variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your values
```

**Required Environment Variables:**

```bash
# Backend API URL (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:3002

# Frontend URL (for OAuth redirects)
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5001

# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Optional: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Run Prisma setup (if using database features)

```bash
pnpm prisma generate
```

## 🚀 Development

### Start the development server

```bash
pnpm dev
```

The application will be available at [http://localhost:5001](http://localhost:5001)

### Available Scripts

```bash
# Development
pnpm dev              # Start development server on port 5001
pnpm dev:all          # Start both frontend and backend (if backend in same repo)

# Build
pnpm build            # Create production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler check

# Database (if using Prisma)
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:push      # Push schema changes to database
pnpm prisma:studio    # Open Prisma Studio
```

## 🏗️ Project Structure

```
mutual-fund-frontend/
├── app/                      # Next.js 14 App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── funds/               # Fund listing and details
│   ├── portfolio/           # User portfolio
│   ├── dashboard/           # User dashboard
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable React components
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── auth/                # Authentication components
│   └── funds/               # Fund-related components
├── lib/                     # Utility functions and helpers
│   ├── api/                 # API client functions
│   ├── utils.ts             # General utilities
│   └── validations.ts       # Zod schemas
├── hooks/                   # Custom React hooks
├── contexts/                # React Context providers
├── stores/                  # Zustand stores (if used)
├── types/                   # TypeScript type definitions
├── styles/                  # Global styles
├── public/                  # Static assets
├── prisma/                  # Prisma schema (if used)
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables (gitignored)
├── .env.production          # Production environment variables (gitignored)
├── next.config.mjs          # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🔐 Authentication Flow

### Email/Password Authentication

1. User registers with email and password
2. Password is hashed on backend
3. JWT access token and refresh token issued
4. Access token stored in memory (not localStorage for security)
5. Refresh token stored in httpOnly cookie

### Google OAuth Authentication

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After consent, redirected back with authorization code
4. Backend exchanges code for user info
5. JWT tokens issued and stored

## 🎨 UI Components

This project uses **shadcn/ui** components built on top of **Radix UI** primitives. Components are:

- ✅ Fully accessible (ARIA compliant)
- ✅ Keyboard navigable
- ✅ Customizable with Tailwind CSS
- ✅ Type-safe with TypeScript

### Key Components

- **Button** - Multiple variants (default, outline, ghost, link)
- **Card** - Container for content sections
- **Dialog** - Modal dialogs
- **Form** - Form components with validation
- **Input** - Text input with variants
- **Select** - Dropdown select
- **Table** - Data tables with sorting
- **Tabs** - Tabbed interfaces
- **Toast** - Notification system
- **Skeleton** - Loading placeholders

## 🌐 API Integration

### API Client Setup

The frontend communicates with the backend via REST API endpoints. API client is configured in `lib/api/`:

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Key API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **Funds**: `/api/funds`, `/api/funds/:id`, `/api/funds/search`
- **Portfolio**: `/api/portfolio`, `/api/portfolio/add`, `/api/portfolio/remove`
- **Market**: `/api/market/indices`, `/api/market/news`
- **User**: `/api/user/profile`, `/api/user/update`

## 🚀 Deployment

### Option 1: AWS Amplify (Recommended)

**Fastest and easiest deployment with CI/CD:**

1. **Push to GitHub** (if not already done)

2. **Connect to AWS Amplify:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select branch: `main`

3. **Configure build settings:**
   - Amplify auto-detects Next.js
   - Add environment variables in Amplify settings:
     ```
     NEXT_PUBLIC_API_URL=http://YOUR_EC2_IP:3002
     NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
     ```

4. **Deploy:**
   - Click "Save and deploy"
   - Automatic deployments on every git push

5. **Add custom domain** (optional):
   - Domain management → Add domain
   - Free SSL certificate included

**Deployment time:** ~10-15 minutes  
**Cost:** Free tier includes 1000 build minutes/month

### Option 2: AWS EC2

**Full control deployment alongside backend:**

See [AWS_FRONTEND_DEPLOYMENT_GUIDE.md](../AWS_FRONTEND_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Option 3: Vercel

**Simple deployment with Vercel CLI:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Production deployment
vercel --prod
```

## 🔧 Configuration

### Next.js Configuration

Key configurations in `next.config.mjs`:

```javascript
const nextConfig = {
  // Enable image optimization
  images: {
    unoptimized: true, // Set to false for optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Fix Google OAuth COOP errors
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },

  // Disable development indicators
  devIndicators: false,
  reactStrictMode: true,
};
```

### Tailwind Configuration

Custom theme configuration in `tailwind.config.ts` with:

- Custom color palette
- Extended spacing
- Custom animations
- Dark mode support

## 🧪 Testing

### Run Tests

```bash
# Run Jest tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Testing Tools

- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** (Mock Service Worker) - API mocking

## 🐛 Troubleshooting

### Common Issues

#### 1. Module not found errors

```bash
# Clear Next.js cache and reinstall
rm -rf .next node_modules
pnpm install
```

#### 2. Environment variables not working

- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart dev server after changing .env files
- Check browser console for undefined variables

#### 3. API connection failures

- Verify backend is running
- Check `NEXT_PUBLIC_API_URL` in .env.local
- Check browser console for CORS errors
- Ensure backend CORS is configured to allow frontend origin

#### 4. Build errors

```bash
# Type check
pnpm tsc --noEmit

# Clear TypeScript cache
rm -rf .next tsconfig.tsbuildinfo
pnpm build
```

#### 5. Google OAuth not working

- Verify redirect URIs in Google Console match your domain
- Check COOP headers in next.config.mjs
- Ensure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is correct

## 📝 Environment Variables Reference

### Required Variables

| Variable                       | Description                              | Example                          |
| ------------------------------ | ---------------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL`          | Backend API base URL (no trailing slash) | `http://localhost:3002`          |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID                   | `xxx.apps.googleusercontent.com` |

### Optional Variables

| Variable                        | Description                      | Example                 |
| ------------------------------- | -------------------------------- | ----------------------- |
| `NEXT_PUBLIC_FRONTEND_URL`      | Frontend URL for OAuth redirects | `http://localhost:5001` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics tracking ID     | `G-XXXXXXXXXX`          |
| `NEXT_PUBLIC_GEMINI_KEY`        | Gemini AI API key                | `AIza...`               |

## 🔐 Security Best Practices

- ✅ No sensitive data in client-side code
- ✅ Environment variables properly configured
- ✅ HTTPS enforced in production
- ✅ CORS properly configured
- ✅ XSS protection enabled
- ✅ CSRF protection for state-changing operations
- ✅ Input validation with Zod schemas
- ✅ Secure authentication flow

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Rakesh** - [GitHub](https://github.com/Rakeshgithub2)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Radix UI](https://www.radix-ui.com/) - Primitive components
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support, email rakesh@example.com or open an issue in the GitHub repository.

## 🔗 Related Repositories

- **Backend**: [mutual_fund_backend](https://github.com/Rakeshgithub2/mutual_fund_backend)

---

**Made with ❤️ by Rakesh**
