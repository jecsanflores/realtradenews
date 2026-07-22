FROM node:18-alpine

WORKDIR /app

# Build frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Setup backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]
