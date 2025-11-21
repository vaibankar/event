# --- Stage 1: Build the React Application ---
FROM node:20-alpine as frontend_builder
WORKDIR /app
# Copy configuration files
COPY frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend code
COPY frontend/ .
# Build the application for production (creates files in /app/dist or /app/build)
RUN npm run build

# --- Stage 2: Production Image using NGINX ---
FROM nginx:alpine
# Copy the built application files into NGINX's static web root
COPY --from=frontend_builder /app/dist /usr/share/nginx/html
# Optional: Copy custom NGINX configuration here if needed

# NGINX runs on port 80 by default
EXPOSE 80 
CMD ["nginx", "-g", "daemon off;"]