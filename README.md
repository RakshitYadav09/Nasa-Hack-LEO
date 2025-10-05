# LEO-Xplorer 🛰️

Complete web-based consultancy platform for commercial Low Earth Orbit ventures with React, Vite, Tailwind CSS, shadcn/ui, Recharts, and AI integration.

## ✨ Features

- **Interactive Mission Planning Wizard**: Step-by-step form with live analysis and contextual guidance
- **AI-Powered Mission Analysis**: Comprehensive reports using Gemini AI integration
- **Vendor Capabilities Matrix**: Detailed comparison of launch providers (SpaceX, NASA, ULA, RocketLab, ISRO)
- **Real-time Cost Modeling**: Dynamic cost analysis based on mission parameters
- **Professional Dashboard**: Charts, analytics, and export capabilities
- **Responsive Design**: Modern UI with dark theme and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/leo-xplorer.git
   cd leo-xplorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

- `VITE_GEMINI_API_KEY`: Your Gemini AI API key for mission analysis reports
- `NODE_ENV`: Set to 'production' for deployment builds
- `VITE_API_BASE_URL`: Optional custom API base URL

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

**Note**: The app works without an API key using comprehensive mock data for demonstration.

## 📦 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🚀 Deployment

### Vercel (Recommended)

#### Method 1: GitHub Integration (Easiest)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy with Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your `leo-xplorer` repository
   - Add environment variable: `VITE_GEMINI_API_KEY` (optional)
   - Click "Deploy"

#### Method 2: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login and deploy**
   ```bash
   vercel login
   vercel
   ```

3. **Set environment variables**
   ```bash
   vercel env add VITE_GEMINI_API_KEY
   ```

### Other Platforms

#### Netlify

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy**
   - Drag and drop the `dist/` folder to [netlify.com](https://netlify.com)
   - Or connect your GitHub repository for automatic deployment

#### GitHub Pages

1. **Update repository URL in package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/leo-xplorer"
   }
   ```

2. **Enable GitHub Pages in repository settings**
   - Go to repository Settings → Pages
   - Source: "GitHub Actions"

## 🛠️ Development

### Project Structure

```
src/
├── components/          # React components
│   ├── BeginnerFriendlyForm.tsx
│   ├── EnhancedDashboard.tsx
│   └── VendorCostComparison.tsx
├── data/               # Static data and configurations
├── services/           # API services and utilities
├── utils/              # Helper functions
└── styles/             # CSS and styling
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Icons**: Heroicons
- **AI Integration**: Google Gemini API
- **Export**: html2canvas, jsPDF

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run deploy` - Deploy to GitHub Pages

## 🎯 Usage

1. **Business Planning**: Define your market opportunity and revenue targets
2. **Technical Configuration**: Set constellation parameters and launch requirements
3. **Safety & Compliance**: Plan orbital debris mitigation and regulatory compliance
4. **Analysis**: Review AI-generated mission analysis and vendor recommendations
5. **Export**: Download professional PDF reports

## 🔒 Security

- Environment variables are used for sensitive data
- API keys are never committed to version control
- Client-side validation and error handling
- Production builds exclude development tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA for space mission planning resources
- SpaceX, ULA, RocketLab, ISRO for launch vehicle data
- Google Gemini AI for intelligent mission analysis
- The open-source community for excellent tools and libraries

## 📧 Support

For support and questions:
- Open an issue on GitHub
- Email: your-email@example.com
- Documentation: [GitHub Wiki](https://github.com/yourusername/leo-xplorer/wiki)

---

**Built with ❤️ for the space industry**
