# Incident Tracker Frontend

A modern, high-performance incident management dashboard built with React and Material UI. Inspired by Jira and Zoho Sprints for a professional, "always-editable" user experience.

## Features

- **Professional Dashboard**: Summary cards for quick stats and a sortable, filterable incident table.
- **Always-Editable Detail View**: Modify incident details (Status, Severity, Description) instantly without leaving the page.
- **Rich User Interface**: Deep integration with Material UI for premium feel, include custom-styled severity and status chips.
- **Smart Loading**: Optimized skeleton loaders and layout transitions to prevent "jumps" during data fetching.
- **Responsive Layout**: Sidebar-driven navigation with a focus on core incident data.
- **Form Management**: Robust form handling and validation with React Hook Form.

## Tech Stack

- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Material UI (MUI) + Vanilla CSS
- **API Client**: Axios
- **Form Handling**: React Hook Form
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v18+)
- Backend API running (see `incident-tracker-backend`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL="http://localhost:3000/api"
   ```

### Running the App

- **Development Mode**:
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm run build
  npm run preview
  ```

## Project Structure

- `src/pages`: Main view components (Dashboard, Create, Detail).
- `src/components`: Shared UI components (Layout, Navigation).
- `src/services`: API abstraction layer using Axios.
- `src/utils`: Helper functions for date formatting and utilities.
- `src/types`: Centralized TypeScript interfaces.

## Layout Design

- **Sidebar (Left)**: Contextual metadata (Service, Severity, Status, Owner).
- **Main Content (Right)**: Core incident data (Title, Summary/Description).
- **Header**: Navigation, Breadcrumbs, and Action buttons (Save/Delete).
