# Set some defauls and allow overriding from the CLI, which could be useful for
# testing new versions before bumping defaults.
# ALPINE_VERSION should be a valid version from:
# https://hub.docker.com/_/alpine
# ALPINE_REPO probably wants to match your alpine MAJ.MIN version, but could
# also be edge if you need fancy new packages.
ARG ALPINE_VERSION=3.13.4
ARG ALPINE_REPO=v3.13

# Get the base image
FROM alpine:$ALPINE_VERSION

# Install required packages
# Node lives in the Edge branch
ARG ALPINE_REPO
RUN apk add \
    --no-cache \
    --repository=http://dl-cdn.alpinelinux.org/alpine/${ALPINE_REPO}/main \
    nodejs \
    npm

# Copy the source into the container
COPY . /app

# Install frontend
# We need webpack to build the frontend stuff, so we can't do a production
# install here.
WORKDIR /app/frontend
RUN npm install

# The prodbuild target disables the watch that's used during development
RUN npm run prodbuild

# Install backend
# atlassian-connect.json isn't reachable unless it's in the public/ directory
WORKDIR /app/backend
RUN cp atlassian-connect.json public/
RUN npm install --production

# Include the Dockerfile in the container
COPY Dockerfile /Dockerfile

# Finally, we can run the app
# The ECS Task Definition will set the NODE_ENV environment here to
# "production"
WORKDIR /app/backend
ENTRYPOINT ["node", "app.js"]
