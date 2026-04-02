#!/bin/sh

# Start go2rtc in the background with the config file
echo "Starting go2rtc..."
go2rtc -config /app/go2rtc.yaml &

# Wait briefly for go2rtc to initialize
sleep 5

# Start the Express server
echo "Starting Express server..."
exec node dist/worker.js
