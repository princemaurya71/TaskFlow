# 📝 Minimalist & Accessible Todo List
<img width="954" height="884" alt="image" src="https://github.com/user-attachments/assets/99fd6ff3-54d2-460a-b446-960615929af8" />


A fast, responsive, and fully accessible task management web application built with **React 19**, **TypeScript**, **Tailwind CSS v4**, and **Motion**. Designed with privacy-first client-side local storage persistence, dark mode support, fluid layout transitions, and rich keyboard navigation.

---

## ✨ Features

- **🔐 Privacy First & Offline Ready**: All task data is stored securely in your browser's `localStorage`. No external tracking or server storage required.
- **🎨 Modern Minimalist Design**: Clean typographic hierarchy, subtle borders, and smooth UI transitions.
- **🌓 Dark & Light Mode**: Seamless theme toggling with automatic system preference detection.
- **🚀 Task Management**:
  - Add, edit (double-click or edit button), delete, and toggle task completion.
  - Priority levels (*High*, *Medium*, *Low*).
  - Category tags (*General*, *Work*, *Personal*, *Health*, *Finance*, *Urgent*).
  - Optional due dates with overdue warning badges.
  - Quick undo action via toast notifications when deleting or clearing tasks.
- **🔍 Smart Search, Filters & Sorting**:
  - Search by task title or category tag.
  - Filter by status (*All*, *Active*, *Completed*) or priority level.
  - Sort by *Newest First*, *Oldest First*, *Priority (High to Low)*, or *Due Date*.
- **⌨️ Keyboard Shortcuts & Accessibility**:
  - Screen reader support with ARIA live region announcements.
  - Full keyboard accessibility and focus rings.
  - Keyboard shortcuts guide modal (Press `?`).
- **⚡ Smooth Motion & Animations**: Polished loading screen, fluid item re-ordering, checkbox micro-interactions, and toast popups powered by `motion`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `N` or `Cmd+K` / `Ctrl+K` | Focus new task input field |
| `/` | Focus search bar |
| `1`, `2`, `3` | Switch filter tabs (*All*, *Active*, *Completed*) |
| `Shift + C` | Clear all finished tasks |
| `Esc` | Clear search / Blur active input / Close modals |
| `?` | Toggle keyboard shortcuts modal |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or pnpm / yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/todo-list.git
   cd todo-list
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Build for production**:
   ```bash
   npm run build
   ```

