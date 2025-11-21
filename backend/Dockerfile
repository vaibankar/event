# Stage 1: Build & Install dependencies
FROM node:20-alpine as builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

# Stage 2: Production Image
FROM node:20-alpine
WORKDIR /app
# Copy only necessary files from the builder stage
COPY --from=builder /app /app
# Use the correct startup command for your server file
CMD ["node", "server.js"]