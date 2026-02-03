# Stage 1: Dependencies
FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY api/package.json ./api/
COPY web/package.json ./web/

RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/api/node_modules ./api/node_modules

COPY package.json bun.lock ./
COPY packages/shared ./packages/shared
COPY api ./api

WORKDIR /app/api

RUN bun run build

# Stage 3: Production
FROM oven/bun:1-alpine AS runner

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/api/package.json ./api/package.json

WORKDIR /app/api

EXPOSE 8000

ENV NODE_ENV=production

CMD ["bun", "run", "dist/index.js"]
