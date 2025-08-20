# Unity Banking - Full-Stack Banking Application

## Overview

Unity Banking is a comprehensive full-stack banking application built with React, TypeScript, Express.js, and PostgreSQL. It provides both customer-facing features and administrative capabilities for managing banking schemes, news, documents, and system settings. The application features a professional banking interface with deposit and loan scheme management, news updates, and document handling capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing between customer and admin interfaces
- **Styling**: Tailwind CSS with custom banking theme variables and shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state management, caching, and API synchronization
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Comprehensive shadcn/ui component library with Radix UI primitives for accessibility

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database ORM**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Session Management**: Simplified session-based authentication for admin access
- **API Design**: RESTful endpoints for CRUD operations on schemes, news, documents, and user management
- **Error Handling**: Centralized error middleware with proper HTTP status codes and JSON responses

### Data Storage Solutions
- **Primary Database**: PostgreSQL configured through Drizzle ORM with connection pooling via @neondatabase/serverless
- **Schema Design**: Well-structured tables for users, schemes, news, documents, and settings with UUID primary keys
- **Migration System**: Drizzle Kit for database schema migrations and version control
- **Development Storage**: In-memory storage implementation for development and testing environments
- **Data Validation**: Zod schemas integrated with Drizzle for runtime type validation

### Authentication and Authorization
- **Admin Authentication**: Username/password-based login system with server-side session management
- **Session Storage**: Simplified session handling for admin panel access control
- **Route Protection**: Middleware-based authentication checks for admin-only endpoints
- **Public Access**: Customer-facing pages and scheme information accessible without authentication

### Project Structure and Conventions
- **Monorepo Design**: Organized into client/, server/, and shared/ directories for clear separation of concerns
- **Shared Types**: Common TypeScript interfaces and Zod schemas in shared/ directory for type consistency
- **Path Aliases**: Configured TypeScript path mapping for clean imports (@/, @shared/, @assets/)
- **Development Workflow**: Hot reload for both client and server code during development
- **Build Process**: Separate build processes for client (Vite) and server (esbuild) with optimized production bundles

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support
- **Database Migrations**: Drizzle Kit for schema management and version control

### UI and Styling
- **Radix UI**: Comprehensive collection of accessible UI primitives for form controls, dialogs, and interactive components
- **Tailwind CSS**: Utility-first CSS framework with custom banking theme configuration
- **Lucide React**: Modern icon library for consistent iconography throughout the application
- **Google Fonts**: Inter font family for professional typography

### Development and Build Tools
- **Vite**: Next-generation frontend build tool with HMR and optimized bundling
- **TypeScript**: Static type checking and modern JavaScript features
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins
- **ESBuild**: Fast JavaScript/TypeScript bundler for server-side code

### Third-party Libraries
- **React Hook Form**: Performant forms library with validation support
- **Date-fns**: Modern date utility library for date formatting and manipulation
- **Class Variance Authority**: Utility for creating variant-based component APIs
- **Embla Carousel**: Lightweight carousel library for image sliders and content rotation