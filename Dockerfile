# Set some defauls and allow overriding from the CLI, which could be useful for
# testing new versions before bumping defaults.
# ALPINE_VERSION should be a valid version from:
# https://hub.docker.com/_/alpine
ARG ALPINE_VERSION=3.13.4

# NODE_VERSION should be a valid version from:
# https://pkgs.alpinelinux.org/packages?name=nodejs&branch=edge
ARG NODE_VERSION=14.16.1-r0

# Get the base image
FROM alpine:$ALPINE_VERSION

# Install required packages
# Node lives in the Edge branch
ARG NODE_VERSION
RUN apk add \
    --no-cache \
    --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main \
    nodejs=$NODE_VERSION \
    npm=$NODE_VERSION

# Copy the source into the container
COPY . /app

# Install frontend
WORKDIR /app/frontend

# fsevents is macOS only. We have to remove it before we can proceed.
# This will also cause npm to.... install(!) dependencies, just to remove
# something from the JSON.
RUN npm uninstall --save-dev fsevents

# npm install should work now as macOS specific packages are gone.
RUN npm install --production

# The prodbuild target disables the watch that's used during development
RUN npm run prodbuild

# Install backend
WORKDIR /app/backend

# atlassian-connect.json isn't reachable unless it's in the public/ directory
RUN cp atlassian-connect.json public/
RUN npm install --production

# Include the Dockerfile in the container
COPY Dockerfile /Dockerfile

# Finally, we can run the app
# The ECS Task Definition will set the NODE_ENV environment here to
# "production"
WORKDIR /app/backend
ENTRYPOINT ["node", "app.js"]
