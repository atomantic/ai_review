# AI-Powered Development Workflow Demo

Demo repository for an 8-minute talk showcasing AI integration in development workflows, focusing on automated linting fixes.

## Talk Overview

Demonstrates how AI tools eliminate the traditional distinction between "warn" and "error" in linting - fixing cyclomatic complexity becomes as trivial as fixing whitespace when AI handles the heavy lifting.

## Demo Flow

1. **Live Coding**: Build JavaScript/Node.js components with complex logic
2. **AI Linting**: Use CLI AI tools in non-interactive mode to fix complex issues
3. **GitHub Integration**: Automated Copilot code review on push
4. **Amazon Q**: Automated AI task completion

## Key Message

**Traditional Approach**: Warn vs Error distinction based on human effort
- Warn: "Hard to fix manually" (cyclomatic complexity, code smells)
- Error: "Easy to fix manually" (syntax, whitespace)

**AI-Enhanced Approach**: All issues become equally trivial to fix
- Set all linting rules to ERROR (including cyclomatic complexity)
- AI handles complexity refactoring as easily as formatting
- Eliminates artificial warn/error categorization
- Focus shifts to code quality, not fixing difficulty

## Project Structure

```
ai_review/
├── src/
│   ├── components/          # JavaScript components (intentionally complex)
│   ├── services/           # API services with linting errors
│   └── utils/              # Utility functions with high cyclomatic complexity
├── .github/
│   └── workflows/          # CI/CD with AI code review
└── package.json             # Contains AI linting scripts
```

## Demo Script

### Phase 1: Live Coding (2 min)
- Create JavaScript functions with intentionally complex logic
- Add nested conditionals, code duplication
- Show ESLint errors (all rules set to ERROR)

### Phase 2: AI Linting (4 min)
- Run `npm run lint` - show errors, automatically invokes AI fix
- Demonstrate `npm run lint:ai:q` for Amazon Q AI fixing
- Compare before/after: complexity → clean, readable code

### Phase 3: GitHub Workflow (2 min)
- Push to GitHub
- Show Copilot automated code review
- Amazon Q handles remaining tasks
- Auto-merge when AI approves

## Setup

```bash
npm install
npm run dev              # For local testing
npm run lint             # Smart linting - auto-invokes AI fix on errors
npm run lint:ai:q        # Use Amazon Q for AI fixing
```

## Implementation Steps

**Step 1: Foundation**
- JavaScript/Node.js project with complex components
- Intentionally write complex functions (authentication flow, data processing)
- Configure ESLint with ALL rules as ERRORS (including cyclomatic complexity)

**Step 2: AI Integration**
- Add package.json script for AI linting (lint:ai:q)
- Configure main lint script to auto-invoke AI fixing on errors
- GitHub Actions with Copilot review
- Test full pipeline locally

**Step 3: Polish & Practice**
- Refine demo timing (8 min total)
- Practice live coding portion
- Backup plans for demo failures

### Key Demo Components

1. **Complex Function Example** (for live refactoring):
   ```javascript
   // 15+ cyclomatic complexity
   function processUserData(user, permissions, settings) {
     // Nested ifs, multiple return paths, complex logic
   }
   ```

2. **Package.json AI Scripts**:
   ```bash
   npm run lint             # Auto-invokes AI fix on errors
   npm run lint:ai:q        # Use Amazon Q for fixing
   ```

3. **GitHub Workflow**:
   - Trigger on push
   - Copilot review
   - Auto-merge on AI approval

## Talk Takeaway

AI transforms development from "managing technical debt" to "writing intent, letting AI handle implementation details"