#!/bin/bash

# Zen Habits - Project Setup Script
echo "🚀 Setting up Zen Habits project..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Copy environment files
echo "📝 Setting up environment files..."
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    echo "✅ Created server/.env from example"
else
    echo "⚠️  server/.env already exists"
fi

if [ ! -f "client/.env" ]; then
    cp client/.env.example client/.env
    echo "✅ Created client/.env from example"
else
    echo "⚠️  client/.env already exists"
fi

# Initialize git repository (if not already initialized)
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Zen Habits project setup"
    echo "✅ Git repository initialized"
else
    echo "⚠️  Git repository already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update environment variables in server/.env and client/.env"
echo "2. Start MongoDB (local) or set up MongoDB Atlas"
echo "3. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🌐 URLs:"
echo "- Frontend: http://localhost:3000"
echo "- Backend:  http://localhost:5000"
echo ""
echo "📚 Documentation:"
echo "- README.md - Project overview and setup"
echo "- docs/API.md - API documentation"
echo "- docs/DEPLOYMENT.md - Deployment guide"
echo "- CONTRIBUTING.md - Contribution guidelines"
echo ""
echo "Happy coding! 🧘‍♂️✨"