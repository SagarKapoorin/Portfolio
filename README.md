# Sagar Kapoor Portfolio

Live Demo: https://sagar-ntho.onrender.com

## Table of Contents
1. [About](#about)
2. [Features](#features)
3. [Technologies](#technologies)
4. [Architecture](#architecture)
5. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Environment Variables](#environment-variables)
   - [Installation](#installation)
   - [Running Locally](#running-locally)
   - [Background Worker](#background-worker)
   - [Docker](#docker)
6. [CI/CD](#ci-cd)
7. [Contact](#contact)

## About

A personal developer portfolio showcasing projects, experience, hire request management, and payment integration.

## Features

- Responsive UI with Next.js 15 and Tailwind CSS
- Authentication via NextAuth (Email/Password, GitHub, Google)
- Hire requests with monthly limits and email notifications
- Payment integration using Razorpay (order creation, webhook handling)
- Payment history dashboard with filtering and Redis caching
- Background queue processing for emails (Redis, NodeMailer, MJML + Handlebars)
- Database management with Prisma and PostgreSQL
- Caching with Redis
- Form validation with React Hook Form and Zod
- Animations with Framer Motion
- Analytics integration with PostHog
- Process management with PM2

## Technologies

>- Frontend:
>  - Next.js 15 (React 19, App Router, Server Components)
>  - React, React Hook Form, Zod, React Toastify
>  - Tailwind CSS, Headless UI, Tabler Icons, Lucide React
>  - Framer Motion, react-fast-marquee
>  - Styled Components, clsx
>  - MJML, Handlebars
>
>- Backend & API:
>  - Next.js API Routes
>  - NextAuth (Credentials, GitHub, Google)
>  - Prisma ORM, PostgreSQL
>  - Redis (caching, queue)
>  - Razorpay Node SDK
>  - NodeMailer for email delivery
>  - bcryptjs for password hashing
>  - PostHog for analytics
>
>- DevOps & Tools:
>  - Docker & Docker Compose
>  - PM2 for process and worker management
>  - GitHub Actions for CI/CD

## Architecture

>High-level overview:
>
>```
>Browser (Next.js Frontend)
>   ↕   (HTTP)
>API Routes (Next.js Backend)
>   ↕
>Redis (Cache & Queue)
>   ↕          ↕
>Prisma → PostgreSQL  Background Worker
>                   (Email via NodeMailer, MJML, Handlebars)
>```

## Getting Started

### Prerequisites

- Node.js v16+ and npm
- PostgreSQL
- Redis
- Razorpay account

### Environment Variables

| Name                           | Description                                                 |
| ------------------------------ | ----------------------------------------------------------- |
| DATABASE_URL                   | PostgreSQL connection string                                |
| REDIS_URL                      | Redis connection URL                                        |
| NEXTAUTH_SECRET                | Secret for NextAuth JWT                                     |
| GITHUB_CLIENT_ID               | GitHub OAuth app client ID                                  |
| GITHUB_CLIENT_SECRET           | GitHub OAuth app client secret                              |
| GOOGLE_CLIENT_ID               | Google OAuth client ID                                      |
| GOOGLE_CLIENT_SECRET           | Google OAuth client secret                                  |
| BCRYPT_SALT_ROUNDS             | Salt rounds for bcrypt (default: 10)                        |
| RAZORPAY_KEY_ID                | Razorpay API key ID                                         |
| RAZORPAY_KEY_SECRET            | Razorpay API key secret                                     |
| RAZORPAY_WEBHOOK_SECRET        | Razorpay webhook secret                                     |
| ADMIN_EMAIL                    | SMTP username (e.g., Gmail address)                         |
| MAIL_PASS                      | SMTP password or app password                               |
| EMAIL_FROM                     | Email address used in outgoing emails                       |
| SITE_URL / NEXT_PUBLIC_BASE_URL| Base URL of your deployed application                       |
| NEXT_PUBLIC_RESUME_URL         | URL to resume (used in header & social links)               |
| NEXT_PUBLIC_POSTHOG_KEY        | PostHog project key                                         |
| NEXT_PUBLIC_POSTHOG_API_HOST   | PostHog API host (default: https://app.posthog.com)         |

### Installation

```bash
npm ci
```

### Running Locally

```bash
npm run dev
```

Navigate to `http://localhost:3000`.

### Background Worker

```bash
npm run worker
```

### Docker

Standalone Docker:
```bash
docker build -t portfolio:latest .
docker run -d --env-file .env -p 3000:3000 portfolio:latest
```

Docker Compose:
```bash
docker-compose up --build -d
```

## CI/CD

> GitHub Actions workflows (in `.github/workflows/ci-cd.yml`):
> 1. Lint & build on pull requests to `main`.
> 2. Build & push Docker image on pushes to `main`.

## Contact

- Live Demo: https://sagar-ntho.onrender.com
- Author: Sagar Kapoor
- Email: sagarbadal70@gmail.com
