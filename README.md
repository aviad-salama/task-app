# Fullstack Task Tracker Application 

A modern, full-stack task management application built with React, Node.js, and PostgreSQL. This project demonstrates industry-standard architectural patterns, secure authentication, and optimistic UI updates.

**🔗 [Live Demo - https://task-app-beige-phi.vercel.app/](#)**

**🔗 [Backend API - https://task-api-backend-7oze.onrender.com](#)**

## Features

- **Secure Authentication:** JWT-based stateless authentication with securely hashed passwords (bcrypt).
- **Optimistic UI Updates:** Instant, zero-latency task creation and toggling using TanStack Query mutations.
- **Server-Side Caching:** Redis integration (via Upstash) to drastically reduce database hits and improve API response times.
- **Data Isolation:** PostgreSQL relational schema ensures users can only view and mutate their own tasks.
- **Responsive Design:** Fully styled with Tailwind CSS for mobile and desktop screens.

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- TanStack Query (React Query)
- React Hook Form

**Backend:**
- Node.js + Express.js
- TypeScript
- PostgreSQL (hosted on Neon)
- Prisma Next (Modern strongly-typed Database Client)
- Redis (Upstash) for API caching
- JWT & bcrypt for Security

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- Upstash Redis instance

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/aviad-salama/task-app.git
cd task-app
\`\`\`

### 2. Environment Variables
Create a `.env` file in the `server/` directory and add the following:
\`\`\`env
DATABASE_URL="your_postgresql_connection_string"
ACCESS_TOKEN_SECRET="your_jwt_secret"
UPSTASH_REDIS_REST_URL="your_upstash_redis_url"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token"
\`\`\`

Create a `.env` file in the `client/` directory:
\`\`\`env
VITE_API_URL="http://localhost:3000"
\`\`\`

### 3. Installation & Running Locally
This project is configured as a monorepo. You can install and run both the client and server concurrently from the root directory:

\`\`\`bash
# Install root dependencies (concurrently)
npm install

# Install client dependencies
cd client && npm install

# Install server dependencies
cd ../server && npm install

# Run the entire application from the root directory
cd ..
npm run dev
\`\`\`

The client will be running on \`http://localhost:5173\` and the server on \`http://localhost:3000\`.

## Project Structure
- \`client/\`: React frontend, modularized with custom hooks and dedicated service files for API calls.
- \`server/\`: Express backend, structured with strict Separation of Concerns (Controllers, Services, Routes, and Middleware).
