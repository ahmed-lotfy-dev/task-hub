# Stage 1: Dependencies
FROM oven/bun:1-alpine AS deps

WORKDIR /app

COPY package.json bun.lock ./
COPY packages/shared/package.json ./packages/shared/
COPY web/package.json ./web/
COPY api/package.json ./api/

RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/web/node_modules ./web/node_modules

COPY package.json bun.lock ./
COPY packages/shared ./packages/shared
COPY web ./web

WORKDIR /app/web

ARG API_URL=http://api:8000
ENV VITE_API_URL=${API_URL}

RUN bun run build

# Stage 3: Production
FROM oven/bun:1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/web/.output ./.output
COPY --from=builder /app/web/package.json ./package.json

EXPOSE 3000

ENV NODE_ENV=production

CMD ["bun", "run", ".output/server/index.mjs"]
