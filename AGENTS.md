# OTA Cloud Development Guidelines

This document provides essential information for agentic coding agents working in the OTA Cloud repository.

## 📁 Project Structure

```
/opt/ota
├── backend/          # Node.js/TypeScript backend
│   ├── src/          # Source code
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── db/
│   │   └── utils/
│   ├── dist/         # Compiled output
│   ├── package.json
│   └── tsconfig.json
└── frontend/         # Vue.js frontend
    ├── src/
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## 🔨 Build Commands

### Backend (Node.js/TypeScript)
- Development: `npm run dev` (backend directory)
  - Uses `ts-node-dev --respawn src/index.ts`
- Production Build: `npm run build` (backend directory)
  - Compiles TypeScript: `tsc`
  - Copies config: `cp src/config/default.json dist/config/`
  - Copies DB init: `cp src/db/init.sql dist/db/`
- Start Server: `npm start` (backend directory)
  - Runs: `node dist/index.js`

### Frontend (Vue.js/TypeScript)
- Development: `npm run dev` (frontend directory)
  - Uses Vite dev server
- Production Build: `npm run build` (frontend directory)
  - Compiles TypeScript: `vue-tsc`
  - Bundles with Vite: `vite build`
- Preview Build: `npm run preview` (frontend directory)
  - Serves built assets locally

## 🧪 Testing

Currently, there are no automated tests in this repository. When adding tests:
- Create test files with `.test.ts` or `.spec.ts` extensions
- Place tests alongside source files or in dedicated test directories
- Use Jest or Vitest as testing framework (to be added)

To run a single test (when tests are implemented):
```bash
# Example format (adjust based on test framework)
npm test -- path/to/file.test.ts
# or
npx vitest run path/to/file.test.ts
```

## 🔍 Linting

### Backend
- Run linting: `npm run lint` (backend directory)
  - Uses ESLint: `eslint src --ext .ts`
  - Configured via package.json (no separate .eslintrc file found)

### Frontend
- No explicit lint command found in package.json
- Consider adding ESLint/Prettier configuration

## 📝 Code Style Guidelines

### TypeScript Usage
- Strict mode enabled (`"strict": true` in tsconfig.json)
- Target: ES2020
- Module: CommonJS (backend), ES modules (frontend)
- Use explicit return types for functions
- Use interfaces for object shapes
- Prefer type inference when types are obvious

### Import/Export Conventions
- Use ES6 imports/exports:
  ```typescript
  import express from 'express';
  import { adminModel } from '../models/admin.model';
  ```
- Default exports for single entities (classes, main functions)
- Named exports for utilities, constants, multiple functions
- Relative paths for internal modules, no file extensions
- Group imports: external, internal, relative

### Naming Conventions
- Classes/Interfaces: PascalCase (e.g., `AuthController`, `AdminModel`)
- Functions/Variables: camelCase (e.g., `login`, `verifyPassword`)
- Constants: UPPER_SNAKE_CASE (though not prominently used)
- Files: kebab-case (e.g., `auth.controller.ts`)
- Database tables/columns: snake_case (in SQL)

### Error Handling
- Use try/catch blocks for asynchronous operations
- Return standardized error objects:
  ```typescript
  return { success: false, message: 'Error description' };
  ```
- Log errors appropriately (console.error for server-side)
- Propagate meaningful error messages to clients when safe
- Validate inputs before processing

### Formatting
- Use 2 spaces for indentation (inferred from code)
- Semicolons optional but used consistently in codebase
- Opening braces on same line as statement
- Line length: Aim for < 100 characters
- Empty lines to separate logical blocks

### Comments
- Use JSDoc for public APIs and complex functions
- Inline comments for non-obvious logic
- Keep comments up-to-date with code changes
- Remove commented-out code

### Security Practices
- Hash passwords with bcrypt (salt rounds: 10)
- Use environment variables for secrets (via config/dotenv)
- Validate and sanitize user inputs
- Use parameterized queries to prevent SQL injection
- Implement proper authentication/authorization middleware

### Database Patterns
- Separate data access layer (models)
- Use connection pooling (mysql2/promise)
- Handle database connections properly (open/close)
- Use async/await for database operations
- Transactions for multi-step operations

### API Design
- RESTful endpoints with proper HTTP methods
- Consistent response format:
  ```typescript
  { success: boolean, data?: any, message?: string }
  ```
- Version API endpoints (/api/v1/resource)
- Use appropriate HTTP status codes
- Validate request payloads

## ⚙️ Configuration
- Use `config` package for environment-specific settings
- Default configuration: `src/config/default.json`
- Override with environment variables or external config files
- Never commit secrets to repository
- Database credentials stored in config (should be env vars in production)

## 🛠️ Development Workflow
1. Create feature branch from main
2. Make changes following code guidelines
3. Test locally (backend: `npm run dev`, frontend: `npm run dev`)
4. Lint code before committing
5. Submit pull request for review

## 📦 Dependencies
### Backend
- express: Web framework
- mysql2: MySQL database driver
- jsonwebtoken: Authentication tokens
- bcryptjs: Password hashing
- dotenv: Environment variable loading
- uuid: Unique identifier generation
- cors: Cross-origin resource sharing
- config: Configuration management

### Frontend
- vue: Progressive JavaScript framework
- vue-router: Routing for SPA
- element-plus: UI component library
- axios: HTTP client
- vite: Build tool and dev server
- vue-tsc: TypeScript checker for Vue

## 🔧 Troubleshooting
- Database connection issues: Check config/default.json
- Port already in use: Kill process on port or change PORT in config
- Build failures: Ensure TypeScript versions match
- Memory issues: Increase node memory limit if needed

## 📚 Learning Resources
- TypeScript: https://www.typescriptlang.org/
- Express.js: https://expressjs.com/
- Vue.js: https://vuejs.org/
- Element Plus: https://element-plus.org/
- Vite: https://vitejs.dev/