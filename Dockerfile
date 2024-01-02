# Input args
#   NODE_ENV: Node environment (development, production)
#   WORKDIR: Working directory
ARG NODE_ENV=production
ARG WORKDIR=/code

FROM node:20.9.0-bookworm-slim as app-base
# Install system dependencies
RUN apt-get update && apt-get install -y

# Input arguments
ARG NODE_ENV
ARG WORKDIR

ENV NODE_ENV=${NODE_ENV}
# Set working directory
WORKDIR ${WORKDIR}

# Copy app source
COPY ./site/ /code/
RUN npm install && \
    npm install --include=dev --legacy-peer-deps && \
    npm run docker:build:prod



FROM node:20.9.0-bookworm-slim as app-build-base

# Build the app for production
FROM nginx:1.25-bookworm as prod-builder
ARG NODE_ENV
ARG WORKDIR
WORKDIR ${WORKDIR}
ENV NODE_ENV=${NODE_ENV}

# Install system dependencies
RUN apt-get update && apt-get install -y

# Copy installed dependencies from builder
COPY --from=app-base /code/dist/site/browser /usr/share/nginx/html

# Copy the nginx configuration
COPY nginx/nginx.conf  /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


# Run the app in development mode
FROM node:20.9.0-bookworm-slim as dev-runner
ARG NODE_ENV
ARG WORKDIR
WORKDIR ${WORKDIR}
ENV NODE_ENV=${NODE_ENV}
COPY --from=app-base /code /code

# Install system dependencies
RUN apt-get update && apt-get install -y

RUN npm install -g npm-check-updates @angular/cli
RUN npm install --include=dev --legacy-peer-deps
CMD [ "npm", "run", "docker:dev" ]