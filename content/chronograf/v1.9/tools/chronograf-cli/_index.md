---
title: chronograf CLI
description: >
  The `chronograf` command line interface (CLI) includes options to manage many aspects of Chronograf security.
menu:
  chronograf_1_9:
    name: chronograf CLI
    parent: Tools
    weight: 10

---

The `chronograf` command line interface (CLI) includes options to manage Chronograf security.

## Usage
```
chronograf [flags]
```

## Chronograf service flags

| Flag                         | Description                                                                                                                              | Env. Variable        |
|:-----------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------|:---------------------|
| `--host`                     | IP the Chronograf service listens on. By default, `0.0.0.0`                                                                              | `$HOST`              |
| `--port`                     | Port the Chronograf service listens on for insecure connections. By default, `8888`                                                      | `$PORT`              |
| `-b`,`--bolt-path`           | File path to the BoltDB file. By default, `./chronograf-v1.db`                                                                           | `$BOLT_PATH`         |
| `-c`,`--canned-path`         | File path to the directory of canned dashboard files. By default, `/usr/share/chronograf/canned`                                         | `$CANNED_PATH`       |
| `--resources-path`           | Path to directory of canned dashboards, sources, Kapacitor connections, and organizations. By default, `/usr/share/chronograf/resources` | `$RESOURCES_PATH`    |
| `-p`, `--basepath`           | URL path prefix under which all Chronograf routes will be mounted.                                                                       | `$BASE_PATH`         |
| `--status-feed-url`          | URL of JSON feed to display as a news feed on the client status page. By default, `https://www.influxdata.com/feed/json`                 | `$STATUS_FEED_URL`   |
| `-v`, `--version`            | Displays the version of the Chronograf service                                                                                           |                      |
| `-h`, `--host-page-disabled` | Disables the hosts page                                                                                                                  | `$HOST_PAGE_DISABLED`|

## InfluxDB connection flags

| Flag                  | Description                                                                             | Env. Variable        |
| :-------------------- | :-------------------------------------------------------------------------------------- | :------------------- |
| `--influxdb-url`      | InfluxDB URL, including the protocol, IP address, and port                              | `$INFLUXDB_URL`      |
| `--influxdb-username` | InfluxDB username                                                                       | `$INFLUXDB_USERNAME` |
| `--influxdb-password` | InfluxDB password                                                                       | `$INFLUXDB_PASSWORD` |
| `--influxdb-org`      | InfluxDB 2.x or InfluxDB Cloud organization name                                        | `$INFLUXDB_ORG`      |
| `--influxdb-token`    | InfluxDB 2.x or InfluxDB Cloud [authentication token](/influxdb/cloud/security/tokens/) | `$INFLUXDB_TOKEN`    |

## Kapacitor connection flags

| Flag                   | Description                                                                    | Env. Variable         |
|:-----------------------|:-------------------------------------------------------------------------------|:----------------------|
| `--kapacitor-url`      | Location of your Kapacitor instance, including `http://`, IP address, and port | `$KAPACITOR_URL`      |
| `--kapacitor-username` | Username for your Kapacitor instance                                           | `$KAPACITOR_USERNAME` |
| `--kapacitor-password` | Password for your Kapacitor instance                                           | `$KAPACITOR_PASSWORD` |

## TLS (Transport Layer Security) flags

| Flag                | Description                                                                             | Env. Variable       |
|:---------           |:------------------------------------------------------------                            |:--------------------|
| `--cert`            | File path to PEM-encoded public key certificate                                         | `$TLS_CERTIFICATE`  |
| `--key`             | File path to private key associated with given certificate                              | `$TLS_PRIVATE_KEY`  |
| `--tls-ciphers`     | Comma-separated list of supported cipher suites. Use `help` to print available ciphers. | `$TLS_CIPHERS`      |
| `--tls-min-version` | Minimum version of the TLS protocol that will be negotiated. (default: 1.2)             | `$TLS_MIN_VERSION`  |
| `--tls-max-version` | Maximum version of the TLS protocol that will be negotiated.                            | `$TLS_MAX_VERSION`  |

## Other service option flags

| Flag                         | Description                                                                                                                                         | Env. Variable         |
|:---------------------------- |:------------------------------------------------------------------------                                                                            |:----------------------|
| `--custom-link`              | Adds a custom link to Chronograf user menu options using `<display_name>:<link_address>` syntax. For multiple custom links, include multiple flags. |                       |
| `-r`, `--reporting-disabled` | Disables reporting of usage statistics. Usage statistics reported once every 24 hours include: `OS`, `arch`, `version`, `cluster_id`, and `uptime`. | `$REPORTING_DISABLED` |
| `-l`, `--log-level`          | Sets the logging level. Valid values include `info` (default), `debug`, and `error`.                                                                | `$LOG_LEVEL`          |
| `-d`, `--develop`            | Runs the Chronograf service in developer mode                                                                                                       |                       |
| `-h`, `--help`               | Displays command line help for Chronograf                                                                                                           |                       |

## Authentication option flags

### General authentication flags

| Flag                                 | Description                                                                                                                                                                                                                                                                                         | Env. Variable    |
|:-------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------|
| `-t`, `--token-secret`               | Secret for signing tokens                                                                                                                                                                                                                                                                           | `$TOKEN_SECRET`  |
| `--auth-duration`                    | Total duration, in hours, of cookie life for authentication. Default value is `720h`.                                                                                                                                                                                                               | `$AUTH_DURATION` |
| `--public-url`                       | Public URL required to access Chronograf using a web browser. For example, if you access Chronograf using the default URL, the public URL value would be `http://localhost:8888`. Required for Google OAuth 2.0 authentication. Used for Auth0 and some generic OAuth 2.0 authentication providers. | `$PUBLIC_URL`    |
| `—htpasswd <path to .htpasswd file>` | Password file for use with HTTP basic authentication (username and password). See [NGINX documentation](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-http-basic-authentication/) for more on password files.                                                              | `$HTPASSWD`      |

### GitHub-specific OAuth 2.0 authentication flags

| Flag                           | Description                                                             | Env. Variable       |
|:-------------------------------|:------------------------------------------------------------------------|:--------------------|
| `-i`, `--github-client-id`     | GitHub client ID value for OAuth 2.0 support                            | `$GH_CLIENT_ID`     |
| `-s`, `--github-client-secret` | GitHub client secret value for OAuth 2.0 support                        | `$GH_CLIENT_SECRET` |
| `-o`, `--github-organization`  | Restricts authorization to users from specified Github organizations. To add more than one organization, add multiple flags. Optional. | `$GH_ORGS`          |

### Google-specific OAuth 2.0 authentication flags

| Flag                     | Description                                                                     | Env. Variable           |
|:-------------------------|:--------------------------------------------------------------------------------|:------------------------|
| `--google-client-id`     | Google client ID value for OAuth 2.0 support                                    | `$GOOGLE_CLIENT_ID`     |
| `--google-client-secret` | Google client secret value for OAuth 2.0 support                                | `$GOOGLE_CLIENT_SECRET` |
| `--google-domains`       | Restricts authorization to users from specified Google email domain. To add more than one domain, add multiple flags. Optional. | `$GOOGLE_DOMAINS`       |


### Auth0-specific OAuth 2.0 authentication flags

| Flag                    | Description                                                                                                                                                                                                                   | Env. Variable          |
|:------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-----------------------|
| `--auth0-domain`        | Subdomain of your Auth0 client. Available on the configuration page for your Auth0 client.                                                                                                                                    | `$AUTH0_DOMAIN`        |
| `--auth0-client-id`     | Auth0 client ID value for OAuth 2.0 support                                                                                                                                                                                   | `$AUTH0_CLIENT_ID`     |
| `--auth0-client-secret` | Auth0 client secret value for OAuth 2.0 support                                                                                                                                                                               | `$AUTH0_CLIENT_SECRET` |
| `--auth0-organizations` | Restricts authorization to  users specified Auth0 organization. To add more than one organization, add multiple flags. Optional. Organizations are set using an organization key in the user’s `app_metadata`.  | `$AUTH0_ORGS`          |

### Heroku-specific OAuth 2.0 authentication flags

| Flag                    | Description                                                                              | Env. Variable       |
|:------------------------|:-----------------------------------------------------------------------------------------|:--------------------|
| `--heroku-client-id`    | Heroku client ID value for OAuth 2.0 support                                             | `$HEROKU_CLIENT_ID` |
| `--heroku-secret`       | Heroku secret for OAuth 2.0 support                                                      | `$HEROKU_SECRET`    |
| `--heroku-organization` | Restricts authorization to  users from specified Heroku organization. To add more than one organization, add multiple flags. Optional. | `$HEROKU_ORGS`      |

### Generic OAuth 2.0 authentication flags

| Flag                      | Description                                                                    | Env. Variable            |
|:--------------------------|:-------------------------------------------------------------------------------|:-------------------------|
| `--generic-name`          | Generic OAuth 2.0 name presented on the login page                             | `$GENERIC_NAME`          |
| `--generic-client-id`     | Generic OAuth 2.0 client ID value. Can be used for a custom OAuth 2.0 service. | `$GENERIC_CLIENT_ID`     |
| `--generic-client-secret` | Generic OAuth 2.0 client secret value                                          | `$GENERIC_CLIENT_SECRET` |
| `--generic-scopes`        | Scopes requested by provider of web client                                     | `$GENERIC_SCOPES`        |
| `--generic-domains`       | Email domain required for user email addresses                                 | `$GENERIC_DOMAINS`       |
| `--generic-auth-url`      | Authorization endpoint URL for the OAuth 2.0 provider                          | `$GENERIC_AUTH_URL`      |
| `--generic-token-url`     | Token endpoint URL for the OAuth 2.0 provider                                  | `$GENERIC_TOKEN_URL`     |
| `--generic-api-url`       | URL that returns OpenID UserInfo-compatible information                        | `$GENERIC_API_URL`       |

### etcd flags

| Flag                      | Description                                                                                                | Env. Variable           |
|:--------------------------|:-----------------------------------------------------------------------------------------------------------|:------------------------|
| `-e`, `--etcd-endpoints`  | etcd endpoint URL (include multiple flags for multiple endpoints)                                          | `$ETCD_ENDPOINTS`       |
| `--etcd-username`         | etcd username                                                                                              | `$ETCD_USERNAME`        |
| `--etcd-password`         | etcd password                                                                                              | `$ETCD_PASSWORD`        |
| `--etcd-dial-timeout`     | Total time to wait before timing out while connecting to etcd endpoints (0 means no timeout, default: -1s) | `$ETCD_DIAL_TIMEOUT`    |
| `--etcd-request-timeout`  | Total time to wait before timing out the etcd view or update (0 means no timeout, default: -1s)            | `$ETCD_REQUEST_TIMEOUT` |
| `--etcd-cert`             | Path to PEM encoded TLS public key certificate for use with TLS                                            | `$ETCD_CERTIFICATE`     |
| `--etcd-key`              | Path to private key associated with given certificate for use with TLS                                     | `$ETCD_PRIVATE_KEY`     |
