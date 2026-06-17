# Express Backend with pnpm

# Stage 1: Build the backend
FROM node:22-bookworm-slim AS backend-builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
WORKDIR /app/apps/backend
RUN pnpm run build

# Stage 2: Runtime image
FROM node:22-bookworm-slim AS runtime
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

WORKDIR /app

# Copy built app from builder stage
COPY --from=backend-builder /app/pnpm-lock.yaml ./
COPY --from=backend-builder /app/pnpm-workspace.yaml ./
COPY --from=backend-builder /app/package.json ./
COPY --from=backend-builder /app/apps/backend ./apps/backend

RUN pnpm install --filter backend --prod

WORKDIR /app/apps/backend

EXPOSE 3001
USER node

CMD ["node", "dist/index.js"]