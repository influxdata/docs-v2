---
title: Troubleshoot sign-in
seotitle: Troubleshoot sign-in to InfluxDB 3 Explorer
description: >
  Find the fix for an InfluxDB 3 Explorer sign-in problem by its symptom:
  incorrect credentials, an unreachable server, a server that can't sign
  users in, and SSO errors.
menu:
  influxdb3_explorer:
    name: Troubleshoot sign-in
    parent: Authentication
weight: 110
---

Find the fix for a {{% product-name %}} sign-in problem by its symptom.
Most symptoms appear as messages on the **Sign in** page.

## Find your symptom

- **Explorer doesn't display a Sign in page**: the server doesn't require
  sign-in.
  See [Explorer doesn't require sign-in](#explorer-doesnt-require-sign-in).
- **`Incorrect username or password`**: Explorer doesn't accept your
  credentials.
  See [Incorrect username or password](#incorrect-username-or-password).
- **`Could not reach this server`**: Explorer can't connect to the
  InfluxDB 3 server.
  See [Explorer can't reach the server](#explorer-cant-reach-the-server).
- **`This deployment has user authentication enabled but cannot issue
  credentials`** or **`This server has user authentication enabled but offers
  no sign-in method this application can use`**: the server doesn't have a way
  to sign users in.
  See [The server can't sign users in](#the-server-cant-sign-users-in).
- **`This deployment has already been set up`**: someone created the first
  user.
  See [Someone already set up the server](#someone-already-set-up-the-server).
- **Explorer opens the Sign in page, but the server doesn't have any users**:
  the server already has an operator token.
  See
  [The server has an operator token but no users](#the-server-has-an-operator-token-but-no-users).
- **`Could not sign you in with your identity provider`**: the server doesn't
  accept your identity.
  See [Identity provider sign-in fails](#identity-provider-sign-in-fails).
- **`This server signs people in through an identity provider, but this
  application is not configured for it`**: Explorer can't start SSO.
  See [Sign in with SSO isn't available](#sign-in-with-sso-isnt-available).
- **Explorer's data belongs to another deployment**: Explorer's stored data
  came from a different cluster.
  See
  [Resolve "Explorer's data belongs to another deployment"](/influxdb3/explorer/install/upgrade/#resolve-explorers-data-belongs-to-another-deployment).

## Explorer doesn't require sign-in

The server doesn't have user authentication turned on, or the server is
InfluxDB 3 Core.
InfluxDB 3 Enterprise doesn't require sign-in when you start it with
`--user-auth-type none` or `--without-auth`.
See
[When Explorer requires sign-in](/influxdb3/explorer/authentication/#when-explorer-requires-sign-in).

## Incorrect username or password

The server didn't accept the username and password.
Explorer displays the same message for an unknown username and for an
incorrect password.

If the message persists, one of the following might apply:

- **Your user signs in with SSO only.**
  A user that an administrator adds with the **SSO** method doesn't have a
  password.
  Click **Sign in with SSO** instead.
- **The password is lost.**
  An administrator can't reset a password.
  See
  [Forgotten passwords](/influxdb3/explorer/manage-users/account/#forgotten-passwords).

## Explorer can't reach the server

Explorer displays one of the following messages:

```text
Could not reach this server to check how to sign in. Check that it is running, then reload the page.
```

```text
Could not reach this server to sign you in. Check that it is running, then try again.
```

On the setup page, the message is the following:

```text
Could not reach this server. Waiting for it to come back.
```

Check that the InfluxDB 3 server is running and that Explorer can connect to
it.
Explorer continues to require sign-in while it can't reach the server.

## The server can't sign users in

Explorer displays one of the following messages:

```text
This deployment has user authentication enabled but cannot issue credentials, so nobody can sign in.
```

```text
This server has user authentication enabled but offers no sign-in method this application can use.
```

The server has user authentication turned on, but doesn't have a key to sign
credentials or an identity provider to issue them.
Restart the server with one of the following:

- `--jwt-key-id` and `--jwt-private-key` for password sign-in
- `--oauth-client-id` for an identity provider

The server also turns off password sign-in when the private key isn't in
PKCS#1 format, or when you set only one of the two options.

For more information, see
[Configure JWT signing keys](/influxdb3/enterprise/admin/security/manage-users/#configure-jwt-signing-keys)
in the InfluxDB 3 Enterprise documentation.

## Someone already set up the server

Explorer displays the following message:

```text
This deployment has already been set up.
```

Someone created the first user from another browser or with the CLI.
Sign in with that user, or ask the person who created the user to add a user
for you.

## The server has an operator token but no users

Explorer opens the **Sign in** page, but nobody has a user to sign in with.

Explorer opens the setup page only for a server that has no users and no
operator token.
A server that used token authentication before you turned on user
authentication already has an operator token.

Create the first user with the `influxdb3` CLI and the operator token.
See
[influxdb3 CLI](/influxdb3/explorer/authentication/set-up-first-user/#influxdb3-cli).

## Identity provider sign-in fails

Explorer displays the following message, followed by the reason that the
server reported:

```text
Could not sign you in with your identity provider.
```

The cause is one of the following:

- [The server doesn't have a user for your identity](#the-server-doesnt-have-a-user-for-your-identity)
- [The server doesn't accept tokens from your identity provider](#the-server-doesnt-accept-tokens-from-your-identity-provider)

### The server doesn't have a user for your identity

The reported reason includes your identity.
Ask an administrator to add a user with that identity as the OAuth ID, either
[in Explorer](/influxdb3/explorer/manage-users/add/#add-a-user-that-signs-in-with-sso)
or with the `influxdb3` CLI--for example:

```bash { placeholders="SUBJECT|ROLE" }
influxdb3 create user --oauth-id SUBJECT --role ROLE
```

Replace the following:

- {{% code-placeholder-key %}}`SUBJECT`{{% /code-placeholder-key %}}:
  the identity that Explorer reported
- {{% code-placeholder-key %}}`ROLE`{{% /code-placeholder-key %}}:
  the role to assign to the user

### The server doesn't accept tokens from your identity provider

The issuer or audience that the server expects is different from the one that
your identity provider sends.
Ask an administrator to check the identity provider settings of the server.
See
[Authenticate with OAuth/OIDC](/influxdb3/enterprise/admin/security/manage-users/#optional-authenticate-with-oauthoidc)
in the InfluxDB 3 Enterprise documentation.

## Sign in with SSO isn't available

Explorer displays the following message:

```text
This server signs people in through an identity provider, but this application is not configured for it.
```

The server uses an identity provider, but Explorer doesn't have the address
that your identity provider uses to return you to Explorer.
For the integrated Explorer UI, start the server with `--webui-public-uri` set
to the URL that you use to open Explorer.
See
[Configure SSO for the Explorer UI](/influxdb3/enterprise/admin/explorer-ui/#configure-sso-for-the-explorer-ui)
in the InfluxDB 3 Enterprise documentation.
