# Base stage - shared setup
FROM node:20-alpine AS base
WORKDIR /app
# python3/make/g++ are needed to compile the native "bcrypt" module
RUN apk add --no-cache python3 make g++

# Dependencies stage - installs ALL deps (incl. dev) once, reused below
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Development stage - hot reload with nest start --watch
FROM base AS development
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Build stage - compiles TypeScript to dist/
FROM deps AS build
COPY . .
RUN npm run build
# Strip dev dependencies, keep only what's needed at runtime
RUN npm prune --omit=dev

# Production stage - small runtime image
FROM node:20-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["node", "dist/main"]