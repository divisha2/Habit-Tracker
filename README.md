# Zen Habits - Habit Tracker App

A beautiful, minimalist habit tracking application built with the MERN stack. Track your daily habits, visualize your progress with interactive charts, and build lasting streaks.

![Zen Habits Dashboard](https://via.placeholder.com/800x400/DA627D/FFFFFF?text=Zen+Habits+Dashboard)

## ✨ Features

### 🎯 Core Functionality
- **One-Tap Check-In**: Mark habits complete with a single click
- **Streak Tracking**: Monitor current and longest streaks
- **Progress Visualization**: Beautiful charts and heatmaps
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile

### 📊 Analytics & Visualization
- **Activity Heatmap**: GitHub-style calendar showing daily activity
- **30-Day Trend Chart**: Track your consistency over time
- **Monthly Streak Calendar**: Visual calendar with completion intensity
- **Progress Overview**: Real-time completion percentages

### 🔐 Authentication
- **Secure Sign Up/Sign In**: JWT-based authentication
- **Profile Management**: Emoji-based profile icons
- **Session Persistence**: Stay logged in across browser sessions
- **Protected Routes**: Secure access to personal data

### 🎨 Design
- **Apple-Inspired UI**: Clean, minimal, and intuitive
- **Coral & Navy Palette**: Warm, motivational color scheme
- **Smooth Animations**: Delightful micro-interactions
- **Typography**: Playfair Display + Inter font combination

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zen-habits.git
   cd zen-habits
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both client and server directories:

   **Server (.env)**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/zen-habit-tracker
   CORS_ORIGIN=http://localhost:3000
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

   **Client (.env)**
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Start the application**
   ```bash
   # Start backend (from server directory)
   cd server
   npm run dev

   # Start frontend (from client directory)
   cd ../client
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
zen-habits/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components (Landing, SignIn, SignUp)
│   │   ├── contexts/      # React contexts (AuthContext)
│   │   ├── utils/         # Utility functions
│   │   └── services/      # API service layer
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Database configuration
│   └── package.json
├── shared/               # Shared types and utilities
└── docs/                # Documentation files
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Recharts** - Chart library
- **Nivo** - Advanced data visualization
- **date-fns** - Date manipulation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 📱 Screenshots

### Landing Page
Beautiful landing page with feature highlights and call-to-action.

### Dashboard
- Compact habits list with one-tap completion
- Progress overview with percentage and stats
- Monthly streak calendar
- Activity heatmap with blue color scheme
- 30-day trend visualization

### Authentication
- Clean sign-up and sign-in forms
- Form validation and error handling
- Emoji-based profile icons

## 🔧 Development

### Available Scripts

**Client (Frontend)**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

**Server (Backend)**
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm test             # Run tests
```

### Code Style
- ESLint configuration for consistent code style
- Prettier for code formatting
- Tailwind CSS for styling
- Component-based architecture

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `cd client && npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Set environment variables in your hosting dashboard

### Backend (Railway/Heroku)
1. Set up MongoDB Atlas or your preferred database
2. Configure environment variables
3. Deploy the server directory
4. Update CORS_ORIGIN to your frontend URL

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-super-secure-jwt-secret
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Apple's Human Interface Guidelines
- Color palette inspired by modern design trends
- Icons provided by Lucide React
- Charts powered by Recharts and Nivo

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the setup guides in `SETUP_COMPLETE.md`

---

**Built with ❤️ using React, Node.js, and MongoDB**