# PlayVault - Gaming Discovery Platform

A modern React application for discovering and exploring popular games across different categories.

## 🎮 Live Demo

Visit the live demo at: [https://www.playvault.app/](https://www.playvault.app/)

## ✨ Features

- **Game Discovery**: Browse through a curated collection of popular games
- **Categories**: Organize games by genre, platform, and popularity
- **Search**: Find games quickly with our responsive search functionality
- **Game Details**: Detailed information, screenshots, and descriptions for each game
- **Wishlist**: Save your favorite games for later
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Theme**: Professional gaming-themed UI/UX

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Testing**: Vitest + Testing Library
- **Linting**: Biome + ESLint
- **Package Manager**: Bun

## 📋 Quick Start

### Prerequisites
- Node.js 18+ or Bun 1.0+
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/ibrahimsohofi/playvault.git
cd playvault

# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ Project Structure

```
playvault/
├── src/
│   ├── components/     # React components
│   ├── data/          # Game data and configuration
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React Context providers
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── docs/             # Documentation
```

## 🎮 Adding New Games

To add a new game to the platform:

1. Add game details to `src/data/games.ts`:

```typescript
{
  id: "new-game",
  title: "New Game Title",
  description: "Game description...",
  images: {
    main: "/images/games/new-game/main.jpg",
    logo: "/images/games/new-game/logo.jpg",
    screenshots: [
      "/images/games/new-game/screenshot1.jpg",
      "/images/games/new-game/screenshot2.jpg"
    ]
  },
  category: "action",
  rating: 4.5,
  tags: ["action", "adventure", "multiplayer"]
}
```

2. Add game images to `public/images/games/new-game/`

## 🧪 Testing

```bash
# Run tests
bun test
# or
npm test

# Run tests with coverage
bun run test:coverage
```

## 🔧 Building for Production

```bash
# Build the application
bun run build
# or
npm run build

# Preview the production build
bun run preview
# or
npm run preview
```

## 📱 Features

### Game Discovery
- Browse games by category (Action, Adventure, Sports, etc.)
- Search functionality with real-time filtering
- Popular games and trending sections

### User Experience
- Fast loading with lazy component loading
- Skeleton loading states for better UX
- Error boundaries for robust error handling
- SEO optimized with meta tags and structured data

### Performance
- Code splitting for optimal bundle sizes
- Image lazy loading and optimization
- Service worker for offline support
- Gzip and Brotli compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for gaming enthusiasts
