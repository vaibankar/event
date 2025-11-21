# --- Stage 1: Build the Application ---
FROM node:20-alpine as builder
WORKDIR /app

# Copy package.json and package-lock.json first
# This optimizes Docker caching, as dependencies change less frequently than code
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (replace 'build' with your framework's build command if different)
# For example, 'npm run build' for a typical React/Vue app
RUN npm run build

# --- Stage 2: Create the Production Image (using NGINX for serving static files) ---
# Use a lightweight NGINX image to serve the static front-end files efficiently
FROM nginx:alpine
# Copy the built application files from the 'builder' stage into NGINX's web root
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: Copy a custom NGINX configuration file if needed
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default HTTP port for NGINX
EXPOSE 80

# The NGINX container starts automatically with its default command
CMD ["nginx", "-g", "daemon off;"]
