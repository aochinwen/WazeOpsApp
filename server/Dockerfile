# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# We install devDependencies too because we are using ts-node in 'npm run dev/start'
# For production, you should ideally compile to JS, but for simplicity we keep ts-node.
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose port (Cloud Run defaults to 8080)
ENV PORT 8080
EXPOSE 8080

# Start the server
CMD ["npm", "run", "start"]
