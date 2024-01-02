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

# Install app dependencies
COPY ./site/package.json ./site/package-lock.json ./
RUN npm install

# Copy app source
COPY ./site/ /code/



# Build the app for production
FROM nginx:1.25-bookworm as prod-builder
ARG NODE_ENV
ARG WORKDIR
WORKDIR ${WORKDIR}
ENV NODE_ENV=${NODE_ENV}

# Install system dependencies
RUN apt-get update && apt-get install -y

# Copy installed dependencies from builder
COPY --from=app-base . .

# Copy build contents to nginx
RUN ${BUILD_CMD}
RUN cp -r /code/dist/ /usr/share/nginx/html

# Copy the nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

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
CMD [ "ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--disable-host-check", "--poll", "250" ]