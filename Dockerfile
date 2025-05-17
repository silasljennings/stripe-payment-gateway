# Step 1: Build the React frontend
FROM node:20-alpine as build

# Set working directory for the frontend build
WORKDIR /home/node/app
COPY . .

# Install dependencies for frontend (React app)
RUN npm install

# Expose the port your Express server will run on
EXPOSE 8080

# Start the backend server (assuming you serve the React app with Express)
CMD ["npm", "run", "server"]