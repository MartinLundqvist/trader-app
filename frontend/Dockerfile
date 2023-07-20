# Define the base image
FROM node:18

# This file needs to be run from the project root folder!

# Copy shared files (types and schemas)
WORKDIR /trader
COPY /trader/ .

# Copy applicaiton files
WORKDIR /frontend

# Copy package.json and package-lock.json or yarn.lock
COPY /frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY /frontend/ .

# Build the app
RUN npm run build

# Expose the port the app runs in
ENV PORT=3000
EXPOSE 3000

# The command to serve the app
CMD [ "npm", "run", "start" ]
