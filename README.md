# Code Compiler (Web + Mobile IDE)

This project is a full-stack **multi-platform code compiler and IDE** that supports Python, C, C++, and Java.

It includes:
- Web-based code compiler (React)
- Mobile IDE (Expo React Native)
- Monaco Editor (VS Code-like experience on mobile)
- Judge0 backend (Docker-based execution engine)

Users can write, edit, and execute code from both web and mobile interfaces.

---

# Features

## Web App
- Code editor with language support (Python, C, C++, Java)
- REST API-based execution backend
- Simple browser-based interface

## Mobile App (Expo React Native)
- VS Code-style mobile IDE
- Monaco Editor inside WebView
- Custom floating language selector (replaces Picker)
- Run & fullscreen editor modes
- Clean toolbar UI optimized for mobile

## Editor (Monaco)
- Syntax highlighting
- Real-time code editing
- Stable WebView integration (no flickering)
- Controlled React Native ↔ WebView messaging system

## Execution Backend
- Migrated from Piston API → **Judge0**
- Docker-based execution environment
- Stable and production-ready code execution
- No external API instability or 401 issues

---

# Backend Architecture (Judge0)

The backend now uses **Judge0 CE (self-hosted via Docker recommended)**:

### Why Judge0?
- More stable than Piston API
- Fully customizable
- No API rate limits
- Production-ready sandbox execution

### Recommended Setup
- Docker-based Judge0 instance
- Express.js wrapper API (`/compile`)
- Language mapping handled server-side

---

# Getting Started

## Prerequisites
Ensure you have installed:

- Node.js
- npm
- Docker (for Judge0 backend)
- Expo Go (for mobile testing)

---

# Installation

## 1. Clone repository

```bash
git clone https://github.com/tomiwaadewolu/code-compiler.git
cd code-compiler
npm install
```

## 2. Backend Setup (Judge0 / Express)

```bash
cd server
npm install
node index.js
```

Ensure Judge0 (Docker or API) is running before starting server.

## 3. Web App

```bash
cd web
npm install
npm start
```

## 4. Mobile App (Expo)

```bash
cd mobile
npm install
npx expo start
```

Scan QR code using Expo Go app.

# Project Structure

```
code-compiler/
  server/        # Express backend (Judge0 integration)
  web/           # React web IDE
  mobile/        # Expo React Native mobile IDE
  README.md
  .gitignore
```

# Key Technical Improvements

## Mobile IDE Upgrade
- Replaced native Picker with custom dropdown modal
- Fixed UI overlap issues in toolbar
- Added fullscreen editor mode
- Improved mobile layout stability

## Monaco Stability Fix
- Removed re-render loop issues in WebView
- Added guarded messaging between RN ↔ Monaco
- Prevented editor flickering on keystrokes
- Stable single-instance Monaco lifecycle

## Backend Migration
- Switched from Piston API → Judge0
- Improved execution reliability
- Removed external API instability (401 issues)
- Docker-ready architecture for production use

# Supported Languages
- Python
- C
- C++
- Java

# Future Improvements
- Multi-file project support
- File explorer sidebar (VS Code style)
- Terminal panel (live output streaming)
- Authentication + user workspace
- Cloud save for code snippets