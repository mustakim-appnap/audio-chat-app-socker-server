# Use the official Node.js 14 image as a base
FROM node:14

# Set working directory within the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g nodemon && npm install pm2 -g && npm install -g prettier

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on (replace 3000 with your actual port if different)
EXPOSE 4000

# Command to run your app (replace 'app.js' with your entry file)
# CMD ["node", "app.js"]

CMD ["pm2-runtime", "start", "app.js"]