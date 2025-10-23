# Base image with Node.js
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
# Copy package*.json first to leverage Docker layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy application source code
COPY . .

# Expose app port (adjust if needed)
EXPOSE 4000

# Start the app
CMD ["node", "index.js"]
