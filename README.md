# Krushnakant Rutele - Personal Portfolio

A modern, production-ready personal portfolio and content management system built with a decoupled architecture. It features a high-performance frontend for public viewing and a secure administrative backend for content management.

## Project Architecture

This project is separated into two distinct environments:
- **Client (Frontend):** A Next.js 14 App Router application providing a highly optimized, responsive, and animated user interface.
- **Server (Backend):** An Express.js REST API providing secure endpoints, database interactions, and authentication for the admin dashboard.

## Tech Stack

### Frontend
- Framework: Next.js (App Router)
- Language: JavaScript (ES6+)
- Styling: Tailwind CSS (with Glassmorphism design system)
- Animations: Framer Motion

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB via Mongoose
- Authentication: JSON Web Tokens (JWT) & bcrypt
- File Storage: Cloudinary (for images) and local storage (for PDF resumes)
- Security: Helmet, CORS, Express Rate Limit

## Key Features

- **Dynamic Content Management:** Manage Projects, Skills, Experience, and Profile details through a custom, secure Admin Dashboard without needing to touch code.
- **Secure Authentication:** HTTP-only cookie-based JWT authentication protects the administrator routes.
- **High Performance:** Fully optimized with dynamic lazy loading for large components, tree-shaking for icons, and advanced Image optimization for maximum Lighthouse scores.
- **Interactive UI:** Fluid transitions, staggered reveals, and spring-based micro-animations built with Framer Motion.
- **Responsive Design:** Mobile-first approach scaling cleanly and natively to tablet and desktop viewports.
- **Integrated Contact System:** A direct contact form that saves messages securely to the database for admin review.

## Overview

This repository serves as a showcase of my ability to architect and build complete full-stack applications from scratch. It demonstrates proficiency in modern React patterns (Next.js App Router), secure backend API design, database schema modeling, and advanced CSS/animation techniques.

*(Note: This repository is a showcase of my personal work. Setup instructions and environment variables have been intentionally omitted to protect proprietary configurations.)*
