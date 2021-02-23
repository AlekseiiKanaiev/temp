# Atlassian Connect app for Bitbucket Cloud

v0.0.1 initial scaffold

# Installation

1. Install [git], [node], [npm] \(2.7.5+) and [ngrok].
2. Run `npm install`.
3. Run `ngrok http 3000` and take note of the proxy's `https://..` base url.
4. Run `AC_LOCAL_BASE_URL=https://THE_NGROK_BASE_URL node app.js` from the
repository root.

# Development loop

You can manually install/update/uninstall your add-ons from
`https://bitbucket.org/account/user/USERNAME/addon-management`.

[git]: http://git-scm.com/
[node]: https://nodejs.org/
[npm]: https://github.com/npm/npm#super-easy-install
[ngrok]: https://ngrok.com/

# Resources

1. [Getting Started](https://developer.atlassian.com/cloud/bitbucket/getting-started/)
2. [App descriptor](https://developer.atlassian.com/cloud/bitbucket/app-descriptor/)

