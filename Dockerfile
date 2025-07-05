### Dockerfile for Next.js + Worker with PM2 in multi-stage build
### Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci
## Copy Prisma schema and generate client before building
COPY prisma ./prisma
RUN npx prisma generate

## Copy rest of the source code and build
COPY . .
RUN npm run build

### Stage 2: Setup production image
FROM node:18-alpine AS production
WORKDIR /app

# Install only production dependencies
 COPY package.json package-lock.json ./
 RUN npm ci --omit=dev

# Install PM2 globally to manage both processes
 RUN npm install pm2 -g

# Copy Prisma schema and generate client for production
 COPY prisma ./prisma
 RUN npx prisma generate

## Copy built assets and necessary files
 COPY --from=builder /app/.next ./.next
# If you have a public directory, uncomment to include it
# COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
## Copy PM2 ecosystem configuration (use Docker-specific config)
COPY ecosystem-docker.config.js ./ecosystem.config.js

ENV NODE_ENV=production
EXPOSE 3000

# Use PM2 runtime to orchestrate Next.js server + worker in foreground
# Apply any pending Prisma migrations, then start PM2
CMD ["sh", "-c", "npx prisma migrate deploy && pm2-runtime start ecosystem.config.js"]