# Dockerfile

# === STAGE 1: Build the React/Vite Frontend ===
FROM node:24-alpine AS client-builder

WORKDIR /app/client

# Copy client dependencies and install
COPY client/package*.json ./
RUN npm install

# Copy source code and build
COPY client/ .
RUN npm run build


# === STAGE 2: Build the Node.js/Express Backend (Final Image) ===
FROM node:24-alpine AS final-builder

WORKDIR /app

# 1. Copy over the *entire* server directory
COPY server/package*.json server/
# Install server dependencies
RUN npm install --prefix server

# 2. Copy the rest of the server source code
COPY server/ server/

# 3. Copy the built frontend static files from Stage 1
COPY --from=client-builder /app/client/dist /app/client/dist

# Define environment variables used by the backend
# Node.js app expects environment variables (CLIENT_ID, REFRESH_TOKEN, etc.)
# These should be passed at runtime (e.g., in docker run or ECS/EC2)
ENV NODE_ENV=production
ENV PORT=4444

# Expose the application port
EXPOSE 4444

# Modify the server's entry point to serve the static frontend files
# For this to work, your Express server (server/index.js) MUST be configured
# to serve files from '../client/dist' when in production mode.

# Set the entry point to run the server
CMD ["node", "server/index.js"] 
# Note: You may need to install PM2 globally in this stage if you use it in the CMD.
# A simpler CMD is just: CMD [ "node", "server/index.js" ]