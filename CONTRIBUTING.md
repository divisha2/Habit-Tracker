# Contributing to Zen Habits

Thank you for your interest in contributing to Zen Habits! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/zen-habits.git
   cd zen-habits
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   - Copy `.env.example` files in both `client` and `server` directories
   - Rename them to `.env` and fill in your values

4. **Start Development**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style
- Use ESLint and Prettier configurations provided
- Follow React best practices and hooks patterns
- Use Tailwind CSS for styling (no custom CSS unless necessary)
- Write meaningful commit messages

### Component Structure
```jsx
// Component imports
import React from 'react';
import { Icon } from 'lucide-react';

// Component definition
const ComponentName = ({ prop1, prop2 }) => {
  // Hooks and state
  const [state, setState] = useState();

  // Event handlers
  const handleEvent = () => {
    // Implementation
  };

  // Render
  return (
    <div className="tailwind-classes">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### File Naming
- Components: `PascalCase.jsx`
- Utilities: `camelCase.js`
- Pages: `PascalCase.jsx`
- Hooks: `useCamelCase.js`

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/OS information
- Console errors (if any)

### Bug Report Template
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

## ✨ Feature Requests

We welcome feature requests! Please:
- Check existing issues first
- Provide clear use case and rationale
- Include mockups or examples if helpful
- Consider implementation complexity

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Screenshots, mockups, or examples.
```

## 🔄 Pull Request Process

### Before Submitting
1. **Create an issue** first (unless it's a small fix)
2. **Fork the repository** and create a feature branch
3. **Write tests** for new functionality
4. **Update documentation** if needed
5. **Test thoroughly** on different devices/browsers

### PR Guidelines
- Use descriptive branch names: `feature/add-habit-categories`
- Write clear PR titles and descriptions
- Reference related issues: `Fixes #123`
- Keep PRs focused and atomic
- Include screenshots for UI changes

### PR Template
```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Added/updated tests
- [ ] All tests pass

## Screenshots
Include screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd server && npm test

# Frontend tests (if available)
cd client && npm test
```

### Test Guidelines
- Write unit tests for utilities and helpers
- Test components with user interactions
- Mock external dependencies
- Aim for meaningful test coverage

## 📚 Documentation

### Code Documentation
- Use JSDoc for complex functions
- Add comments for business logic
- Document component props with PropTypes or TypeScript
- Keep README files updated

### API Documentation
- Document all endpoints
- Include request/response examples
- Note authentication requirements
- Explain error responses

## 🎨 Design Guidelines

### UI/UX Principles
- Follow Apple Human Interface Guidelines
- Maintain consistent spacing and typography
- Use the established color palette
- Ensure accessibility (WCAG 2.1 AA)
- Test on multiple screen sizes

### Color Palette
- Primary: `#DA627D` (Coral)
- Secondary: `#243B4A` (Navy)
- Accent: `#F5E6D3` (Warm Beige)
- Surface: `#FFFFFF` (White)

### Typography
- Display: Playfair Display (serif)
- Body: Inter (sans-serif)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
- Automatic deployment from main branch
- Environment variables configured in dashboard
- Build command: `npm run build`
- Output directory: `dist`

### Backend (Railway/Heroku)
- Deploy from server directory
- Set environment variables
- Use production MongoDB Atlas

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: [your-email@example.com] for sensitive issues

### Response Times
- Issues: Within 48 hours
- PRs: Within 72 hours
- Security issues: Within 24 hours

## 🏆 Recognition

Contributors will be:
- Added to the README contributors section
- Mentioned in release notes
- Invited to join the core team (for significant contributions)

## 📜 Code of Conduct

### Our Pledge
We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Enforcement
Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated promptly and fairly.

---

Thank you for contributing to Zen Habits! 🙏