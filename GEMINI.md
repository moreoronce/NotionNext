# NotionNext

## Project Overview

**NotionNext** is a static blog generator that uses Notion as a Content Management System (CMS). It is built with Next.js and React, styled with Tailwind CSS, and designed to be deployed on Vercel. It allows users to manage their content entirely within Notion while providing a highly customizable, SEO-friendly, and performant web interface.

## Key Features

*   **Notion as CMS:** Write and manage content in Notion; the site updates automatically.
*   **Multi-Theme Support:** Switch between various themes (Next, Medium, Hexo, etc.) easily.
*   **Static Generation (SSG):** High performance and SEO optimized.
*   **Rich Integrations:** Supports multiple comment systems (Twikoo, Giscus, Gitalk), analytics (Google Analytics, Ackee), and more.
*   **Customizable:** extensive configuration via `blog.config.js` and `conf/` directory.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org) (React)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com)
*   **Rendering:** [react-notion-x](https://github.com/NotionX/react-notion-x)
*   **Language:** JavaScript / TypeScript
*   **Testing:** Jest

## Getting Started

### Prerequisites

*   Node.js >= 16.0.0
*   npm >= 8.0.0
*   Git

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tangly1024/NotionNext.git
    cd NotionNext
    ```

2.  **Initialize development environment:**
    ```bash
    npm run init-dev
    ```

3.  **Start development server:**
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:3000`.

4.  **Build for production:**
    ```bash
    npm run build
    ```

## Project Structure

*   `components/`: Reusable React components.
*   `pages/`: Next.js pages and routing.
*   `lib/`: Utility libraries, core logic, and API wrappers.
    *   `config/`: Configuration handling.
    *   `notion/`: Notion API interaction.
*   `themes/`: Theme-specific components and layouts.
*   `conf/`: Granular configuration files (split from the main config).
*   `scripts/`: Build, maintenance, and development scripts.
*   `public/`: Static assets.
*   `blog.config.js`: Main project configuration file.

## Configuration

The core configuration resides in `blog.config.js`. Additional modular configurations are found in the `conf/` directory.

**Key Environment Variables (`.env` or Vercel Config):**
*   `NOTION_PAGE_ID`: (Required) The ID of the root Notion page containing your blog posts.
*   `NEXT_PUBLIC_THEME`: Selects the active theme.

## Development Guidelines

### Coding Standards

*   **Formatting:** Prettier (`npm run format`)
*   **Linting:** ESLint (`npm run lint`)
*   **Type Checking:** TypeScript (`npm run type-check`)

### Naming Conventions

*   **Components:** PascalCase (e.g., `LazyImage`)
*   **Files:** kebab-case (e.g., `lazy-image.js`)
*   **Variables/Functions:** camelCase (e.g., `getUserData`)
*   **Constants:** UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Commit Convention

This project follows the **Conventional Commits** specification:
`<type>(<scope>): <description>`

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`.

## Available Scripts

*   `npm run dev`: Start dev server.
*   `npm run build`: Production build.
*   `npm run lint`: Run ESLint.
*   `npm run format`: Format code with Prettier.
*   `npm run test`: Run Jest tests.
*   `npm run quality`: Run comprehensive quality checks (lint, format, type-check).
*   `npm run dev-tools`: Access helper tools for development.
