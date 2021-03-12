---
title: Chronograf configuration options
description: >
  Options available in the Chronograf configuration file and environment variables.
menu:
  chronograf_1_8:
    name: Configuration options
    weight: 30
    parent: Administration
---

Chronograf is configured using the configuration file (/etc/default/chronograf) and environment variables. If you do not uncomment a configuration option, the system uses its default setting. The configuration settings in this document are set to their default settings. For more information, see [Configure Chronograf](/chronograf/v1.8/administration/configuration/).

* [Usage](#usage)
* [Chronograf service options](#chronograf-service-options)
  - [InfluxDB connection options](#influxdb-connection-options)
  - [Kapacitor connection options](#kapacitor-connection-options)
  - [TLS (Transport Layer Security) options](#tls-transport-layer-security-options)
  - [etcd options](#etcd-options)
  - [Other service options](#other-service-options)
* [Authentication options](#authentication-options)
    * [General authentication options](#general-authentication-options)
    * [GitHub-specific OAuth 2.0 authentication options](#github-specific-oauth-2-0-authentication-options)
    * [Google-specific OAuth 2.0 authentication options](#google-specific-oauth-2-0-authentication-options)
    * [Auth0-specific OAuth 2.0 authentication options](#auth0-specific-oauth-2-0-authentication-options)
    * [Heroku-specific OAuth 2.0 authentication options](#heroku-specific-oauth-2-0-authentication-options)
    * [Generic OAuth 2.0 authentication options](#generic-oauth-2-0-authentication-options)

## Usage

Start the Chronograf service, and include any options after `chronograf`, where `[OPTIONS]` are options separated by spaces:

```sh
 chronograf [OPTIONS]
```

**Linux examples**

- To start `chronograf` without options:

```sh
  sudo systemctl start chronograf
```

- To start `chronograf` and set options for develop mode and to disable reporting:

```sh
  sudo systemctl start chronograf --develop --reporting-disabled
```

**MacOS X examples**

- To start `chronograf` without options:

```sh
  chronograf
```

- To start `chronograf` and add shortcut options for develop mode and to disable reporting:

```sh
  chronograf -d -r
```

> ***Note:*** Command line options take precedence over corresponding environment variables.


## Chronograf service options

#### `--host=`

The IP that the `chronograf` service listens on.

Default value: `0.0.0.0`

Example: `--host=0.0.0.0`

Environment variable: `$HOST`

#### `--port=`

The port that the `chronograf` service listens on for insecure connections.

Default: `8888`

Environment variable: `$PORT`

#### `--bolt-path=` | `-b`

The file path to the BoltDB file.

Default value: `./chronograf-v1.db`

Environment variable: `$BOLT_PATH`

#### `--canned-path=` | `-c`

The path to the directory of [canned dashboards](/chronograf/v1.8/guides/using-precreated-dashboards) files.

Default value: `/usr/share/chronograf/canned`

Environment variable: `$CANNED_PATH`

#### `--resources-path=`

Path to directory of canned dashboards, sources, Kapacitor connections, and organizations.

Default value: `/usr/share/chronograf/resources`

Environment variable: `$RESOURCES_PATH`

#### `--basepath=` | `-p`

The URL path prefix under which all `chronograf` routes will be mounted.

Environment variable: `$BASE_PATH`

#### `--status-feed-url=`

URL of JSON feed to display as a news feed on the client Status page.

Default value: `https://www.influxdata.com/feed/json`

Environment variable: `$STATUS_FEED_URL`

#### `--version` | `-v`

Displays the version of the Chronograf service.

Example:
```sh
$ chronograf -v
2018/01/03 14:11:19 Chronograf 1.4.0.0-rc1-26-gb74ae387 (git: b74ae387)
```

## InfluxDB connection options

> InfluxDB connection details specified via command line when starting Chronograf do not persist when Chronograf is shut down.
> To persist connection details, [include them in a `.src` file](/chronograf/v1.8/administration/creating-connections/#manage-influxdb-connections-using-src-files) located in your [`--resources-path`](#resources-path).

### `--influxdb-url=`

The location of your InfluxDB instance, including `http://`, IP address, and port.

Example: `--influxdb-url=http:///0.0.0.0:8086`

Environment variable: `$INFLUXDB_URL`

### `--influxdb-username=`

The [username] for your InfluxDB instance.

Environment variable: `$INFLUXDB_USERNAME`

### `--influxdb-password=`

The [password] for your InfluxDB instance.

Environment variable: `$INFLUXDB_PASSWORD`

## Kapacitor connection options

> Kapacitor connection details specified via command line when starting Chronograf do not persist when Chronograf is shut down.
> To persist connection details, [include them in a `.kap` file](/chronograf/v1.8/administration/creating-connections/#manage-kapacitor-connections-using-kap-files) located in your [`--resources-path`](#resources-path).

### `--kapacitor-url=`

The location of your Kapacitor instance, including `http://`, IP address, and port.

Example: `--kapacitor-url=http://0.0.0.0:9092`.

Environment variable: `$KAPACITOR_URL`

### `--kapacitor-username=`

The username for your Kapacitor instance.

Environment variable: `$KAPACITOR_USERNAME`

### `--kapacitor-password=`

The password for your Kapacitor instance.

Environment variable: `$KAPACITOR_PASSWORD`

### TLS (Transport Layer Security) options

See [Configuring TLS (Transport Layer Security) and HTTPS](/chronograf/v1.8/administration/managing-security/#configure-tls-transport-layer-security-and-https) for more information.

#### `--cert=`

The file path to PEM-encoded public key certificate.

Environment variable: `$TLS_CERTIFICATE`

#### `--key=`

The file path to private key associated with given certificate.

Environment variable: `$TLS_PRIVATE_KEY`

### etcd options

#### `--etcd-endpoints=` | `-e`

List of etcd endpoints.

##### CLI example

```sh
## Single parameter
--etcd-endpoints=localhost:2379

## Mutiple parameters
--etcd-endpoints=localhost:2379 \
--etcd-endpoints=192.168.1.61:2379 \
--etcd-endpoints=192.192.168.1.100:2379
```

Environment variable: `$ETCD_ENDPOINTS`

##### Environment variable example

```sh
## Single parameter
ETCD_ENDPOINTS=localhost:2379

## Mutiple parameters
ETCD_ENDPOINTS=localhost:2379,192.168.1.61:2379,192.192.168.1.100:2379
```


#### `--etcd-username=`

Username to log into etcd.

Environment variable: `$ETCD_USERNAME`

#### `--etcd-password=`

Password to log into etcd.

Environment variable: `$ETCD_PASSWORD`

#### `--etcd-dial-timeout=`

Total time to wait before timing out while connecting to etcd endpoints.
0 means no timeout.
The default is 1s.

Environment variable: `$ETCD_DIAL_TIMEOUT`

#### `--etcd-request-timeout=`

Total time to wait before timing out an etcd view or update request.
0 means no timeout.
The default is 1s.

Environment variable: `$ETCD_REQUEST_TIMEOUT`

#### `--etcd-cert=`

Path to etcd PEM-encoded TLS public key certificate.

Environment variable: `$ETCD_CERTIFICATE`

#### `--etcd-key=`

Path to private key associated with specified etcd certificate.

Environment variable: `$ETCD_PRIVATE_KEY`

### Other service options

#### `--custom-link <display_name>:<link_address>`

Custom link added to Chronograf User menu options. Useful for providing links to internal company resources for your Chronograf users. Can be used when any OAuth 2.0 authentication is enabled. To add another custom link, repeat the custom link option.

Example: `--custom-link InfluxData:http://www.influxdata.com/`

#### `--reporting-disabled` | `-r`

Disables reporting of usage statistics.
Usage statistics reported once every 24 hours include: `OS`, `arch`, `version`, `cluster_id`, and `uptime`.

Environment variable: `$REPORTING_DISABLED`

#### `--log-level=` | `-l`

Set the logging level.

Valid values: `debug` | `info` | `error`

Default value: `info`

Example: `--log-level=debug`

Environment variable: `$LOG_LEVEL`

#### `--develop` | `-d`

Run the `chronograf` service in developer mode.

#### `--help` | `-h`

Displays the command line help for `chronograf`.

#### `--host-page-disabled` | `-H`

Disables rendering and serving of the Hosts List page (/sources/$sourceId/hosts).

Environment variable: `$HOST_PAGE_DISABLED=true`

## Authentication options

### General authentication options

#### `--auth-duration=`

The total duration (in hours) of cookie life for authentication.

Default value: `720h`

Authentication expires on browser close when `--auth-duration=0`.

Environment variable: `$AUTH_DURATION`

#### `--inactivity-duration=`

The duration that a token is valid without any new activity.

Default value: `5m`

Environment variable: `$INACTIVITY_DURATION`

#### `--public-url=`

The public URL required to access Chronograf using a web browser. For example, if you access Chronograf using the default URL, the public URL value would be `http://localhost:8888`.
Required for Google OAuth 2.0 authentication. Used for Auth0 and some generic OAuth 2.0 authentication providers.

Environment variable: `$PUBLIC_URL`

#### `--token-secret=` | `-t`

The secret for signing tokens.

Environment variable: `$TOKEN_SECRET`


### GitHub-specific OAuth 2.0 authentication options

See [Configuring GitHub authentication](/chronograf/v1.8/administration/managing-security/#configure-github-authentication) for more information.

#### `--github-client-id=` | `-i`

The GitHub client ID value for OAuth 2.0 support.

Environment variable: `$GH_CLIENT_ID`

#### `--github-client-secret=` | `-s`

The GitHub Client Secret value for OAuth 2.0 support.

Environment variable: `$GH_CLIENT_SECRET`

#### `--github-organization=` | `-o`

[Optional] Specify a GitHub organization membership required for a user.

##### CLI example

```sh
## Single parameter
--github-organization=org1

## Mutiple parameters
--github-organization=org1 \
--github-organization=org2 \
--github-organization=org3
```

Environment variable: `$GH_ORGS`

##### Environment variable example

```sh
## Single parameter
GH_ORGS=org1

## Mutiple parameters
GH_ORGS=org1,org2,org3
```

### Google-specific OAuth 2.0 authentication options

See [Configuring Google authentication](/chronograf/v1.8/administration/managing-security/#configure-google-authentication) for more information.

#### `--google-client-id=`

The Google Client ID value required for OAuth 2.0 support.

Environment variable: `$GOOGLE_CLIENT_ID`

#### `--google-client-secret=`

The Google Client Secret value required for OAuth 2.0 support.

Environment variable: `$GOOGLE_CLIENT_SECRET`

#### `--google-domains=`

[Optional] Restricts authorization to users from specified Google email domains.

##### CLI example

```sh
## Single parameter
--google-domains=delorean.com

## Mutiple parameters
--google-domains=delorean.com \
--google-domains=savetheclocktower.com
```

Environment variable: `$GOOGLE_DOMAINS`

##### Environment variable example

```sh
## Single parameter
GOOGLE_DOMAINS=delorean.com

## Mutiple parameters
GOOGLE_DOMAINS=delorean.com,savetheclocktower.com
```

### Auth0-specific OAuth 2.0 authentication options

See [Configuring Auth0 authentication](/chronograf/v1.8/administration/managing-security/#configure-auth0-authentication) for more information.

#### `--auth0-domain=`

The subdomain of your Auth0 client; available on the configuration page for your Auth0 client.

Example: https://myauth0client.auth0.com

Environment variable: `$AUTH0_DOMAIN`

#### `--auth0-client-id=`

The Auth0 Client ID value required for OAuth 2.0 support.

Environment variable: `$AUTH0_CLIENT_ID`

#### `--auth0-client-secret=`

The Auth0 Client Secret value required for OAuth 2.0 support.

Environment variable: `$AUTH0_CLIENT_SECRET`

#### `--auth0-organizations=`

[Optional] The Auth0 organization membership required to access Chronograf.
Organizations are set using an "organization" key in the user's `app_metadata`.
Lists are comma-separated and are only available when using environment variables.

##### CLI example

```sh
## Single parameter
--auth0-organizations=org1

## Mutiple parameters
--auth0-organizations=org1 \
--auth0-organizations=org2 \
--auth0-organizations=org3
```

Environment variable: `$AUTH0_ORGS`

##### Environment variable example

```sh
## Single parameter
AUTH0_ORGS=org1

## Mutiple parameters
AUTH0_ORGS=org1,org2,org3
```

### Heroku-specific OAuth 2.0 authentication options

See [Configuring Heroku authentication](/chronograf/v1.8/administration/managing-security/#configure-heroku-authentication) for more information.

### `--heroku-client-id=`                         
The Heroku Client ID for OAuth 2.0 support.

**Environment variable:** `$HEROKU_CLIENT_ID`

### `--heroku-secret=`                            
The Heroku Secret for OAuth 2.0 support.

**Environment variable:** `$HEROKU_SECRET`

### `--heroku-organization=`                      
The Heroku organization memberships required for access to Chronograf.

##### CLI example

```sh
## Single parameter
--heroku-organization=org1

## Mutiple parameters
--heroku-organization=org1 \
--heroku-organization=org2 \
--heroku-organization=org3
```

**Environment variable:** `$HEROKU_ORGS`

##### Environment variable example

```sh
## Single parameter
HEROKU_ORGS=org1

## Mutiple parameters
HEROKU_ORGS=org1,org2,org3
```

### Generic OAuth 2.0 authentication options

See [Configure OAuth 2.0](/chronograf/v1.8/administration/managing-security/#configure-oauth-2-0) for more information.

#### `--generic-name=`

The generic OAuth 2.0 name presented on the login page.

Environment variable: `$GENERIC_NAME`

#### `--generic-client-id=`

The generic OAuth 2.0 Client ID value.
Can be used for a custom OAuth 2.0 service.

Environment variable: `$GENERIC_CLIENT_ID`

#### `--generic-client-secret=`

The generic OAuth 2.0 Client Secret value.

Environment variable: `$GENERIC_CLIENT_SECRET`

#### `--generic-scopes=`

The scopes requested by provider of web client.

Default value: `user:email`

##### CLI example

```sh
## Single parameter
--generic-scopes=api

## Mutiple parameters
--generic-scopes=api \
--generic-scopes=openid \
--generic-scopes=read_user
```

Environment variable: `$GENERIC_SCOPES`

##### Environment variable example

```sh
## Single parameter
GENERIC_SCOPES=api

## Mutiple parameters
GENERIC_SCOPES=api,openid,read_user
```

#### `--generic-domains=`

The email domain required for user email addresses.

Example: `--generic-domains=example.com`

##### CLI example

```sh
## Single parameter
--generic-domains=delorean.com

## Mutiple parameters
--generic-domains=delorean.com \
--generic-domains=savetheclocktower.com
```

Environment variable: `$GENERIC_DOMAINS`

##### Environment variable example

```sh
## Single parameter
GENERIC_DOMAINS=delorean.com

## Mutiple parameters
GENERIC_DOMAINS=delorean.com,savetheclocktower.com
```

#### `--generic-auth-url=`

The authorization endpoint URL for the OAuth 2.0 provider.

Environment variable: `$GENERIC_AUTH_URL`

#### `--generic-token-url=`

The token endpoint URL for the OAuth 2.0 provider.

Environment variable: `$GENERIC_TOKEN_URL`

#### `--generic-api-url=`

The URL that returns OpenID UserInfo-compatible information.

Environment variable: `$GENERIC_API_URL`
