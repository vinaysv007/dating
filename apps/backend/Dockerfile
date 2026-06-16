FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate

FROM base AS builder
WoRKDIR /app
COPY backend/package.json backend/pnpm-lock.yaml ./ 
RUN pnpm install --frozen-lockfile
COPY backend ./
RUN pnpm run build

FROM base AS runtime
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

WORKDIR /app
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN pnpm install --production --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
