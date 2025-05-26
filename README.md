# BloX App

BloX App is designed to streamline user and blog management. It provides a centralized dashboard where teams can efficiently manage user accounts and publish blog posts. The application displays tables listing all users and blogs, accompanied by intuitive charts to visualize publishing activity and user engagement metrics. This MVP is built with the intention to evolve with additional features over time.

## Demo

**Live Demo:** [https://blox-app-gamma.vercel.app](https://blox-app-gamma.vercel.app)

**Demo Video:**

[![BloX App Demo Video Thumbnail](https://img.youtube.com/vi/i5UrxUOcLo0/default.jpg)](https://www.youtube.com/watch?v=i5UrxUOcLo0)

### Demo Account

To explore the application, you can use the following credentials:

- **Email:** `irfan@gmail.com`
- **Access Token:** `1d84ac2a788b76c25af2dcf2396cf05a1dcac21bf15705bf3eb8127970cbab94`

## Features

### Authentication System

- **Secure Login Process**
  - Input validation with immediate error feedback
  - Success feedback messages upon successful authentication
  - Automatic redirection to dashboard after login
- **Session Management**
  - "Remember Me" functionality to persist user sessions
  - 30-day token validity when "Remember Me" is enabled
  - 24-hour token validity for standard login

### User Interface & Experience

- **Responsive Layout**

  - Optimized for all screen sizes (desktop, tablet, mobile)
  - Adaptive components that adjust to viewport dimensions
  - Touch-friendly interface elements for mobile users

- **Intuitive Navigation**
  - Sticky header with app logo and user profile
  - Collapsible sidebar with organized navigation groups
  - Clear categorization of dashboard and management tools

### Dashboard Features

- **Statistical Overview**

  - Summary cards showing total users, posts, user status, and gender distribution
  - Interactive charts for Blog Post Quantity, User Status, and User Gender
  - Real-time data visualization for key metrics

- **Data Management**
  - Advanced filtering with debounce implementation for efficient searches
  - Sortable columns for better data organization
  - Pagination for handling large datasets
  - URL query persistence for sharing filtered views

### Content Management

- **User Management**

  - Create, read, update, and delete (CRUD) operations for user data
  - Comprehensive user profile management
  - User status tracking (active/inactive)
  - Gender distribution monitoring

- **Blog Management**
  - Create and edit posts with rich text editor
  - Post status management (draft/published)
  - Author assignment capabilities
  - Content categorization

## Architecture & Technical Implementation

### Clean Code Architecture

BloX App implements a clean code architecture that separates components. The application also leverages Next.js Partial Prerendering to optimize performance:

- Server components for initial static content delivery
- Client components for interactive elements
- Automatic static optimization where appropriate

### Composable UI Components

The UI follows a composable pattern with reusable components that:

- Maintain consistent styling and behavior
- Can be combined to create complex interfaces
- Reduce code duplication and improve maintainability

### Data Fetching & State Management

- Optimized data fetching with caching strategies
- Debounced filtering for table data to minimize API calls
- URL-based query persistence for shareable filter states
- Efficient state management to reduce unnecessary re-renders

## Project Structure

```
blox-app/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── app/                 # Next.js app router pages
│   │   ├── (admin)/         # Admin protected routes
│   │   │   ├── page.tsx     # Dashboard page
│   │   │   ├── posts/       # Posts management
│   │   │   └── users/       # User management
│   │   ├── api/             # API routes
│   │   │    └── auth/       # Authentication endpoints
│   │   │         ├── login  # Login API endpoints
│   │   │         ├── logout # Logout API endpoints
│   │   │         └── me     # Current User API endpoints
│   │   └── login/           # Public login page
│   ├── components/          # Reusable UI components
│   │   ├── (admin)/         # Admin-specific components
│   │   └── ...             # Shared components
│   ├── lib/                # Utility functions
│   └── server/             # Server-side code
│       ├── actions.ts      # Server actions
├── types/                  # TypeScript type definitions
└── .env                    # Environment variables
```

## Implementation Details

### Login Page

- Form validation with real-time feedback
- Successful login redirects to the dashboard
- "Remember me" option extends session duration
- Secure token storage and management

### Layout (Header & Navbar)

- Sticky header with BloX logo and user profile
- Collapsible sidebar with toggle functionality
- Organized navigation groups for Dashboard and Blog Management
- Responsive design adjusts for different screen sizes

### Dashboard Statistics

- Summary cards with key metrics
- Three statistical charts:
  - Blog Post Quantity
  - User Status distribution
  - User Gender distribution
- Data visualization components for clear metric representation

### User and Post Management

- Data tables with advanced features:
  - Debounced search functionality
  - URL query-based filtering (persistent across page refreshes)
  - Sortable columns with indicators
  - Pagination controls
- CRUD operations with appropriate feedback messages
- Form validation for data integrity

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/irfan-za/blox-app.git
   cd blox-app
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Environment Configuration:**

   - Create a `.env` file by copying the contents of `.env.example`.
   - Obtain a GoRest access token from [https://gorest.co.in](https://gorest.co.in) (login required).
   - Add the following variables to your `.env` file:
     ```
     GOREST_ACCESS_TOKEN=your_access_token_here
     ACCESS_TOKEN=your-access-token
     EMAIL=your-email
     API_URL=https://gorest.co.in/public/v2
     WEBSITE_URL=http://localhost:3000
     ```

4. **Run the development server:**

   ```bash
   pnpm dev
   ```

5. **Access the application:**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guidelines

### API Integration

- The app uses the GoRest API for user and post management
- Rate limiting considerations should be taken into account
- Authentication is handled via access token in request headers

### Component Development

- Follow the existing component structure for consistency
- Use TypeScript interfaces for props
- Implement proper error handling and loading states
- Test components across different viewport sizes

### Performance Optimization

- Leverage Next.js Partial Prerendering for optimal loading
- Implement proper memoization for expensive calculations
- Use efficient data fetching strategies with appropriate caching

## Tech Stack

BloX App is built using the following technologies:

- **Frontend:**

  - [React](https://reactjs.org/) - A JavaScript library for building user interfaces
  - [Next.js](https://nextjs.org/) - The React Framework for Production
  - [Ant Design](https://ant.design/) - A design system for enterprise-level products
  - [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript
  - [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
  - [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and node.js
  - [TanStack Query](https://tanstack.com/query/latest) - Powerful asynchronous state management
  - [ECharts](https://echarts.apache.org/en/index.html) - A powerful charting and visualization library

- **Backend:**
  - [GoRest](https://gorest.co.in/) - Public data APIs for testing and prototyping
