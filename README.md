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
- Icons: Lucide React & React Icons

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB via Mongoose
- Authentication: JSON Web Tokens (JWT) & bcrypt
- File Storage: Cloudinary (for images) and local storage (for PDF resumes)
- Security: Helmet, CORS, Express Rate Limit

## Key Features

- Dynamic Content Management: Manage Projects, Skills, Experience, and Profile details through a secure Admin Dashboard.
- Secure Authentication: HTTP-only cookie-based JWT authentication for the administrator.
- High Performance: Fully optimized with next/dynamic lazy loading, Icon tree-shaking, and Image optimization.
- Interactive UI: Fluid transitions and spring animations using Framer Motion.
- Responsive Design: Mobile-first approach scaling cleanly to desktop viewports.
- Contact System: Integrated contact form that saves messages directly to the database for admin review.

## Prerequisites

Before setting up the project locally, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- MongoDB (running locally or a MongoDB Atlas URI)
- Cloudinary Account (for image hosting)

## Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Krushnakant1979/Personal-Portfolio.git
cd Personal-Portfolio
```

### 2. Install dependencies
Install dependencies for both the frontend and backend applications.

```bash
# Install Client Dependencies
cd client
npm install

# Install Server Dependencies
cd ../server
npm install
```

### 3. Environment Configuration

You will need to create two environment files.

**Backend Configuration (server/.env)**
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/krushna_portfolio
JWT_SECRET=your_secure_jwt_secret_key
CLIENT_URL=http://localhost:3000

# Cloudinary Setup (Required for project images)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend Configuration (client/.env.local)**
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Database Seeding
To populate the database with your initial admin account and default settings, run the seed script:

```bash
cd server
node src/seed/index.js
```
Note: The default credentials created by the seed script are `krushnakantrutele1979@gmail.com` and password `admin123`. Please change this password immediately in production.

### 5. Running the Application

Open two terminal instances from the root directory.

**Terminal 1 (Backend API)**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client)**
```bash
cd client
npm run dev
```

The application will be accessible at `http://localhost:3000`.

## Deployment Recommendations

- **Frontend:** Vercel is recommended for the Next.js client for zero-configuration deployments. Ensure you set the `NEXT_PUBLIC_API_URL` environment variable.
- **Backend:** Deploy the Express API to a VPS (e.g., DigitalOcean, AWS EC2, or Hostinger). Persistent storage is required to retain uploaded Resume PDFs. Ensure CORS is configured properly via the `CLIENT_URL` environment variable.
- **Database:** MongoDB Atlas is recommended for a managed, cloud-hosted database.
