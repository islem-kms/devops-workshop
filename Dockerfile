# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy your application code to the container
COPY . .

# Expose the port your application will run on
EXPOSE 3300

# Define the command to start your application
CMD ["node", "minimal.js"]
