FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY src ./src

# IMPORTANT: run src/index.js directly (ignore package.json scripts)
CMD ["node", "src/index.js"]