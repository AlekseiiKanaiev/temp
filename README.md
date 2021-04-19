# Atlassian Connect app for Bitbucket Cloud

v0.0.1 initial scaffold

# Installation

1. Install [git], [node], [npm] \(2.7.5+) and [ngrok].
2. Run `npm install`.
3. Run `ngrok http 3000` and take note of the proxy's `https://..` base url.
4. Run `AC_LOCAL_BASE_URL=https://THE_NGROK_BASE_URL node app.js` from the
repository root.

# Build app
go to ./frontend
1. Run `npm install`.
2. Run `npm run build`. (file bundled.snyk.repo.page will be put into backend/public/dist)
go to ./backend
1. Run `npm install`.
2. Run `node app.js`.

# Development loop

You can manually install/update/uninstall your add-ons from
`https://bitbucket.org/account/user/USERNAME/addon-management`.

[git]: http://git-scm.com/
[node]: https://nodejs.org/
[npm]: https://github.com/npm/npm#super-easy-install
[ngrok]: https://ngrok.com/

# Building the Docker Container

From the root of the repository, execute the following commands:

## Build the container

```
docker build -t bitbucket .
```

## Log in to the ECR Repository

```
# The ECR repo given below is for the dev account.
aws ecr get-login-password \
    --region us-west-2 \
| docker login \
    --username AWS \
    --password-stdin \
    084284883363.dkr.ecr.us-west-2.amazonaws.com
```

## Tag and Push the Image to the ECR Repository

```
# The ECR repos here are for the dev account.
TAG=<YOUR TAG>

# Tag
docker tag bitbucket 084284883363.dkr.ecr.us-west-2.amazonaws.com/bitbucket:${TAG}

# Push
docker push 084284883363.dkr.ecr.us-west-2.amazonaws.com/bitbucket:${TAG}
```

# Resources

1. [Getting Started](https://developer.atlassian.com/cloud/bitbucket/getting-started/)
2. [App descriptor](https://developer.atlassian.com/cloud/bitbucket/app-descriptor/)
