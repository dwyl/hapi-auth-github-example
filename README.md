# `hapi-auth-github` *example*

A ***quick example*** of how to use ***GitHub OAuth Authentication*** in your Hapi app
using https://github.com/dwyl/hapi-auth-github

[![Build Status](https://travis-ci.org/nelsonic/hapi-auth-github-example.svg)](https://travis-ci.org/nelsonic/hapi-auth-github-example)
[![codecov.io](https://codecov.io/github/nelsonic/hapi-auth-github-example/coverage.svg?branch=master)](https://codecov.io/github/nelsonic/hapi-auth-github-example?branch=master)
[![Code Climate](https://codeclimate.com/github/nelsonic/hapi-auth-github-example/badges/gpa.svg)](https://codeclimate.com/github/nelsonic/hapi-auth-github-example)
[![Dependency Status](https://david-dm.org/nelsonic/hapi-auth-github-example.svg)](https://david-dm.org/nelsonic/hapi-auth-github-example)
[![devDependency Status](https://david-dm.org/nelsonic/hapi-auth-github-example/dev-status.svg)](https://david-dm.org/nelsonic/hapi-auth-github-example#info=devDependencies)

## *Why*?

We wrote a **Hapi Plugin** that *simplifies* letting the
***people using your app authenticate with*** their ***GitHub*** account:
https://github.com/dwyl/hapi-auth-github

## *What*?

Basic example.

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


### Example `profile` object:

```js
{
  "login": "nelsonic",
  "id": 194400,
  "avatar_url": "https://avatars.githubusercontent.com/u/194400?v=3",
  "gravatar_id": "",
  "url": "https://api.github.com/users/nelsonic",
  "html_url": "https://github.com/nelsonic",
  "followers_url": "https://api.github.com/users/nelsonic/followers",
  "following_url": "https://api.github.com/users/nelsonic/following{/other_user}",
  "gists_url": "https://api.github.com/users/nelsonic/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/nelsonic/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/nelsonic/subscriptions",
  "organizations_url": "https://api.github.com/users/nelsonic/orgs",
  "repos_url": "https://api.github.com/users/nelsonic/repos",
  "events_url": "https://api.github.com/users/nelsonic/events{/privacy}",
  "received_events_url": "https://api.github.com/users/nelsonic/received_events",
  "type": "User",
  "site_admin": false,
  "name": "Nelson",
  "company": "dwyl.io",
  "blog": "http://www.dwyl.io/",
  "location": "London",
  "email": "contact.nelsonic+github@gmail.com",
  "hireable": null,
  "bio": null,
  "public_repos": 208,
  "public_gists": 18,
  "followers": 210,
  "following": 163,
  "created_at": "2010-02-02T08:44:49Z",
  "updated_at": "2015-12-03T10:43:53Z",
  "private_gists": 0,
  "total_private_repos": 1,
  "owned_private_repos": 1,
  "disk_usage": 213198,
  "collaborators": 3,
  "plan": {
    "name": "micro",
    "space": 976562499,
    "collaborators": 0,
    "private_repos": 5
  }
}
```
