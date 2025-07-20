# Portfolio

This is a Next.js portfolio application.

## Running Locally

Before starting, install dependencies and build the project:

```bash
npm ci
npm run build
```

Run the Next.js server:

```bash
npm start
```

Run the background worker:

```bash
npm run worker
```
 
## Docker

### Standalone Docker

Build the Docker image:
```bash
docker build -t portfolio:latest .
```

Run the container with your `.env` file mounted:
```bash
docker run -d --env-file .env -p 3000:3000 portfolio:latest
```
By default, this picks up all variables from `.env` (e.g. DATABASE_URL, REDIS_URL, EMAIL_FROM, SMTP_*).

## Docker Compose

Bring up the full stack (app, PostgreSQL, Redis):
```bash
docker-compose up --build -d
```

Access the app at http://localhost:3000, Redis on 6379, and Postgres on 5432.

## Vercel Deployment

On Vercel you can run the mail queue processor as a scheduled function (cron).  Add a `vercel.json` at the project root:
```json
{
  "version": 2,
  "crons": [
    { "path": "/api/cron-mail", "schedule": "0 */6 * * *" }
  ]
}
```
This will trigger the `/api/cron-mail` endpoint every 6 hours to process up to 50 mail jobs. Make sure the following environment variables are set in your Vercel dashboard:
- DATABASE_URL
- REDIS_URL
- EMAIL_FROM (the "from" address for outgoing mail)
- SMTP credentials (e.g. SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- ADMIN_EMAIL (to receive admin notifications)
- SITE_URL (optional, for links in email templates)

## CI/CD (GitHub Actions)

A GitHub Actions workflow is included at `.github/workflows/ci-cd.yml`:
- On pull requests to `main`: installs dependencies, lints, and builds the project (ESLint errors are surfaced in CI)
- On push to `main`: additionally builds & pushes the Docker image to GitHub Container Registry (`ghcr.io`)

GitHub supplies the `GITHUB_TOKEN` secret automatically for registry authentication.
