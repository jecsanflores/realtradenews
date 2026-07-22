FROM node:18-alpine

WORKDIR /app

# Copy entire project
COPY . .

# Install frontend dependencies and build
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Expose port
EXPOSE 3000

# Start backend (which serves frontend statically)
CMD ["node", "src/index.js"]
