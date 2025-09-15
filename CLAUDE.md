# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Buzzphrase Buddy Matrix Robot Demo that showcases AI integration in development workflows through fun, interactive terminal animations. The project features an animated ASCII robot with Matrix-style falling characters, tech buzzphrase speech bubbles, complex animation timing, and color effects. The codebase demonstrates how AI tools can refactor sophisticated animation logic into clean, maintainable code.

## Core Architecture

- **ES Module Project**: Uses `"type": "module"` in package.json
- **Interactive Terminal Application**: Entry point is `src/index.js`
- **Component Structure**:
  - `src/components/matrixRain.js` - Matrix falling characters animation system
  - `src/utils/terminalUtils.js` - Terminal setup, cursor control, and ANSI color management
  - `src/utils/logger.js` - Winston logging for structured output
  - `src/index.js` - Main application with embedded robot ASCII art and direct rendering logic
- **Key Features**:
  - Real-time animation loop with complex frame timing
  - Multi-layered rendering (Matrix background + Robot + Speech bubbles)
  - Interactive keyboard controls (Q to quit)
  - ANSI color codes for terminal styling
  - Tech buzzphrase generation with `buzzphrase` package
  - Persistent speech bubbles with text wrapping
  - Robot color transitions with cyan glow effect

## Development Commands

### Testing and Linting
- `npm test` - Runs lint check (primary test command)
- `npm run lint:check` - Check for ESLint errors only
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format with Prettier and fix ESLint issues
- `npm run lint` - Combined format and lint fix

### AI-Powered Fixing
- `npm run fix:all:q` - Use Amazon Q to fix ALL ESLint errors and warnings, then create PR
- `npm run fix:all:c` - Use Claude to fix ALL ESLint errors and warnings, then create PR
- `npm run fix:err:q` - Use Amazon Q to fix only ESLint errors (not warnings), then create PR
- `npm run fix:err:c` - Use Claude to fix only ESLint errors (not warnings), then create PR

### Code Review Commands
- `npm run cr:q` - Use Amazon Q to address PR code review feedback
- `npm run cr:c` - Use Claude to address PR code review feedback

### Development
- `npm run dev` - Start the application locally

## ESLint Configuration

The project uses a strategic ESLint configuration that demonstrates the AI-enhanced approach:

- **Traditional "Easy" Fixes as ERRORS**: Syntax, formatting, basic code issues that were traditionally easy to fix manually
- **Complex Issues as WARNINGS**: Cyclomatic complexity, code depth, function length, etc. - issues that traditionally required human effort but AI can now handle easily

Key complexity rules (set to reasonable industry standards):
- `complexity`: max 10
- `max-depth`: max 4
- `max-statements`: max 15
- `max-lines-per-function`: max 200

## AI Integration Patterns

This project demonstrates several AI integration patterns:

1. **Non-interactive AI Fixing**: Scripts use `--no-interactive` and `--dangerously-skip-permissions` flags
2. **Automated PR Creation**: AI tools are configured to create branches, commit, push, and open PRs
3. **Comprehensive Error Handling**: AI is instructed to fix ALL issues before stopping
4. **Tool Trust**: Uses `--trust-all-tools` for Amazon Q integration

## Demo Workflow

The repository is designed for an 8-minute talk demonstration:
1. **Visual Demo**: Run `npm run dev` to show the interactive Matrix Robot demo with falling character effects
2. **Linting Reality**: Run `npm test` to reveal dozens of ESLint errors from complex animation code
3. **AI Magic**: Use `npm run fix:all:q` or `npm run fix:all:c` to watch AI refactor the animation system
4. **GitHub Integration**: AI creates PRs with refactored code that maintains visual effects while improving maintainability

## Animation Complexity Examples

The codebase intentionally includes complex patterns that demonstrate AI's refactoring capabilities:

- **Nested Animation Loops**: 4+ levels of nesting in render functions
- **Complex Timing Logic**: Frame rate calculations with magic numbers
- **Multi-layered Rendering**: Matrix background + ASCII art with collision detection
- **Interactive Input Handling**: Raw terminal input processing with complex key mapping

When working with this codebase, remember that the intentionally complex animation code and strict linting rules are part of the demo - the goal is to show how AI can handle sophisticated refactoring of real-world complex logic (like game engines or animation systems) that would traditionally be time-consuming for humans to refactor manually.