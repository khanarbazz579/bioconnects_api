# Base image
FROM --platform=linux/amd64 node:18-alpine AS development

ARG BUILDTIME_ENV=stage
ARG NODE_ENV_ARG=development
ARG NODE_OPTIONS_ARG="--max-old-space-size=2048"

# Insatall Curl
RUN apk --no-cache add curl

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm ci --legacy-peer-deps

# Bundle app source
COPY . .

# Creates a "dist" folder
RUN npm run build:$BUILDTIME_ENV

ENV NODE_ENV=$NODE_ENV_ARG

ENV NODE_OPTIONS=$NODE_OPTIONS_ARG

# Start the server using the production build
CMD ["node", "dist/main.js" ]