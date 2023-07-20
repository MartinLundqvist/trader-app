# Define the base image
FROM node:18

# This file must be run from the project root!

# Set the working directory in the container
WORKDIR /trader

# Copy package.json and package-lock.json
COPY /trader/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY /trader/ .

# Expose the port the app runs in
ENV PORT=4001
EXPOSE 4001

# The command to run the app
CMD [ "npm", "start" ]
