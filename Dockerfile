FROM node:18-alpine

WORKDIR /app

# Copy frontend build
COPY frontend/build ./frontend/build

# Copy backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source
COPY backend/src ./src

EXPOSE 3000

CMD ["node", "src/index.js"]
