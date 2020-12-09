FROM node:14

# Create app directory
WORKDIR /app/frontend/

# Install app dependencies
COPY package*.json /app/frontend/
RUN npm install

# Uncomment to build code for  production
# npm ci --only=production

# Bundle app source code into the image
COPY . . 

# Bind to port 3000
EXPOSE 3000
CMD ["npm", "start"]
