# Use the official Node.js image as a base
FROM node:22.5.1-alpine3.19

# Install Python 3 and pip
RUN apk add --no-cache python3 py3-pip make g++
RUN apk add --no-cache libpng-dev

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 1234

# Start the application
CMD ["npm", "start"]