# ---- Backend Dockerfile (Node.js + Express) ----
FROM node:20-alpine

WORKDIR /app

# Install production dependencies first (better layer caching).
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source.
COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "src/server.js"]
