# Agent Instructions for Rüdon Chatbot

## 📖 Project Overview

**Purpose**: An intelligent AI bot that answers questions and chats naturally.
**Type**: Web Application
**Primary Language(s)**: TypeScript
**Framework(s)**: Next.js, React
**Architecture**: The project is a standard Next.js application. It uses a single API route for handling chat functionality and a frontend built with React and shadcn/ui.

## 📁 Directory Structure

```
/
├── app/ - Main application source code, including API routes and pages.
│   ├── api/chat/route.ts - API endpoint for the chatbot.
│   └── page.tsx - The main page of the application.
├── lib/ - Utility functions.
│   └── utils.ts
├── node_modules/ - Project dependencies.
├── .env.local.example - Example for environment variables file.
├── next.config.mjs - Configuration file for Next.js.
├── package.json - Project dependencies and scripts.
└── tsconfig.json - TypeScript configuration.
```

## 🚀 Development Setup

### Installation
```bash
# Clone repository
git clone [repo-url]
cd rudon-chatbot

# Install dependencies
npm install
```

### Environment Variables
Create a `.env.local` file in the root of the project and add the following environment variables:

```bash
MISTRAL_API_KEY=your_mistral_api_key
```

### Build

```bash
npm run build
```

### Run Locally

```bash
npm run dev
```

### Run Tests
There are currently no tests in this project.

## 🎨 Code Style & Conventions

- **Formatting**: The project uses Prettier for code formatting, which is integrated with ESLint.
- **Naming conventions**:
- Variables: `camelCase`
- Classes: `PascalCase`
- Files: `kebab-case`
- Constants: `UPPER_SNAKE_CASE`
- **File organization**: The project follows the standard Next.js `app` directory structure.

## 🧪 Testing Guidelines

There are currently no testing guidelines for this project.

## 🏗️ Important Patterns & Conventions

### API Design

- The project uses a single API endpoint at `/api/chat` for handling chat functionality.
- The API follows the Vercel AI SDK conventions.

## 🔒 Security Considerations

### Sensitive Files (Never Commit)

- `.env.local` - Environment variables

### Environment Variables

```bash
# Required variables (add to .env.local)
MISTRAL_API_KEY=your_mistral_api_key
```

## ✅ Common Tasks

### Adding a New API Endpoint

1. Create a new file in `app/api/` with a descriptive name.
2. Implement the business logic for the new endpoint.

### Adding a New React Component

1. Create a new component file in a `components/` directory (to be created).
2. Add styles for the component.
3. Write tests for the component.
4. Export the component from an `index.ts` file in the `components/` directory.

## 📤 Git & Commit Conventions

### Branch Naming

- Feature: `feature/user-authentication`
- Bug fix: `fix/login-error`
- Hotfix: `hotfix/security-patch`
- Refactor: `refactor/api-structure`

### Commit Messages

Follow Conventional Commits:

```
feat(auth): add password reset functionality
fix(api): resolve race condition in user creation
docs(readme): update installation instructions
```

## 🚢 Deployment

The project is configured to be deployed on Vercel.

### Environments

- **Development**: Deployed from the `develop` branch.
- **Production**: Deployed from the `main` branch.

### Deploy Commands

Deployment is handled automatically by Vercel when changes are pushed to the `main` or `develop` branches.
