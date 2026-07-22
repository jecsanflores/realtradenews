FROM node:18-alpine

WORKDIR /app

# Build frontend
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

# Setup and run backend
COPY backend ./backend
RUN cd backend && npm install

EXPOSE 3000
CMD ["node", "backend/src/index.js"]
