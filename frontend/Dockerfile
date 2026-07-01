# Dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Development stage - Vite dev server with hot reload
FROM deps AS development
WORKDIR /app
COPY . .
EXPOSE 5173
# --host is required so the dev server is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage - produces static production build
FROM deps AS build
WORKDIR /app
# Vite bakes VITE_* env vars into the bundle at BUILD time, not run time,
# so it must be passed in as a build arg.
ARG VITE_API_URL=http://localhost:3000
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN npm run build

# Production stage - static files served by nginx
FROM nginx:1.27-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]