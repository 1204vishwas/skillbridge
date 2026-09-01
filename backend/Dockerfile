# ---- Backend Dockerfile (Node.js + Express + TypeScript) ----

# ---- Build stage: compile TypeScript to dist/ ----
FROM node:20-alpine AS build

WORKDIR /app

# Install all dependencies (incl. devDependencies) for the build.
COPY package*.json ./
RUN npm ci

# Copy source and compile.
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage: production dependencies + compiled output ----
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the compiled JavaScript from the build stage.
COPY --from=build /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]
