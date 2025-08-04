# Input args
#   NODE_ENV: Node environment (development, production)
#   WORKDIR: Working directory
ARG NODE_ENV=production
ARG WORKDIR=/code

# build flows
# base -> builder -> prod-runner
#      -> dev-runner

# Base stage for installing dependencies
FROM node:22.18.0-bookworm-slim as base
ARG WORKDIR=/code
WORKDIR ${WORKDIR}

# Copy package files and install dependencies
COPY package*.json .
RUN npm install --include=dev --legacy-peer-deps

# Copy the rest of the application source
COPY . .

# Stage for building the production application
FROM base as builder
RUN npm run docker:build:prod

# Production runner stage
FROM nginx:1.29-bookworm as prod-runner
# Copy built artifacts from the builder stage
COPY --from=builder /code/dist/site/browser /usr/share/nginx/html
# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Development runner stage
FROM base as dev-runner
# Install global CLI tools
RUN npm install -g npm-check-updates @angular/cli
# Set the command to run in development
CMD [ "npm", "run", "docker:dev" ]
