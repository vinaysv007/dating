# Express Backend with pnpm

# Stage 1: Build the backend
FROM node:22-bookworm-slim AS backend-builder
SHELL ["/bin/sh", "-c"]
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY apps/backend ./
RUN pnpm run build

# Stage 2: Runtime image
FROM node:22-bookworm-slim AS runtime
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app
COPY apps/backend/package.json apps/backend/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Copy built app from builder stage
COPY --from=backend-builder /app/dist ./dist

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]