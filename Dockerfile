# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy dependency files first
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies including devDependencies
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy all source files
COPY . .

# Build the project
RUN npm run build

FROM node:18-alpine

WORKDIR /app

# Copy production files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# IMPORTANT: Copy the generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Verify Prisma client exists
RUN ls -la node_modules/.prisma/client && \
    ls -la node_modules/@prisma/client

EXPOSE 3000

# Run migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]