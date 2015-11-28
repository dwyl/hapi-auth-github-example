# `hapi-auth-github` *example*

A ***quick example*** of how to use ***GitHub Authentication*** in your Hapi app.

## *Why*?

We wrote a **Hapi Plugin** that simplifies letting the people using your app
authenticate with their GitHub account:
https://github.com/dwyl/hapi-auth-github

## *What*?

basic example.

## How?

```js
link: '<https://api.github.com/user/issues?access_token=6b5b70cab3d6c7d2567f7c86700c2c0516482d14&page=2>; rel="next", <https://api.github.com/user/issues?access_token=6b5b70cab3d6c7d2567f7c86700c2c0516482d14&page=8>; rel="last"',
```

### Environment Variables

You will need to have the following environment vairables to run this example app:

```sh
GITHUB_CLIENT_ID=YourGitHubClientIDE # see: http://git.io/vRthZ for full instructions
GITHUB_CLIENT_SECRET=SuperSecret     # copy this from your GitHub App settings (see above)
BASE_URL=http://localhost:8000       # same as Authorized JavaScript Origin for your GitHub App
PORT=8000                            # the port on your local machine you want to run the app on
JWT_SECRET=SomethingSuperSecretive!  # a secret used to sign session tokens
```

> Note: If you (*or anyone on your team*) are new to
Environment Variables or need a refresher,  
see: [https://github.com/dwyl/**learn-environment-variables**](https://github.com/dwyl/learn-environment-variables)

> Note #2: if you want to help improve/extend this example,
ask me for the sample `.env` file to get up and running faster!
