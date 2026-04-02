# Use official Node.js image
FROM node:18-alpine

# Install curl for downloading go2rtc, and ffmpeg for snapshot capture
RUN apk add --no-cache curl ffmpeg

# Download go2rtc binary (Linux amd64)
RUN curl -L https://github.com/AlexxIT/go2rtc/releases/latest/download/go2rtc_linux_amd64 -o /usr/local/bin/go2rtc \
    && chmod +x /usr/local/bin/go2rtc

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
ENV GO2RTC_URL http://localhost:1984
EXPOSE 8080

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Start both go2rtc and the Express server
CMD ["/app/start.sh"]
