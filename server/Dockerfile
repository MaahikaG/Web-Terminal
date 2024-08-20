# Use the official Node.js image as a base
FROM node:10-buster

# Install Python 2
RUN apt-get update && \
    apt-get install -y python2 python-pip && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]