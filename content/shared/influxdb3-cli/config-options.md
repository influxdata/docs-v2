<!-- Comment to allow starting shortcode -->

{{< product-name >}} lets you customize your configuration by using
`influxdb3` command options or by setting environment variables.

## Configure your server

Pass configuration options using either command options or environment variables.
Command options take precedence over environment variables.

### Global vs serve-specific options

Some options are **global** (specified before the command) while others are **serve-specific** (specified after `serve`):

- **Global options**: Apply to the `influxdb3` CLI itself (for example, `--num-io-threads`)
- **Serve options**: Apply only to the `serve` command (for example, `--node-id`, `--object-store`, `--verbose`)

#### Example command with global and serve-specific options

{{% show-in "core" %}}

<!--pytest.mark.skip-->

```sh
influxdb3 --num-io-threads=4 serve \
  --node-id node0 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --verbose \
  --log-filter info
```

{{% /show-in %}}

{{% show-in "enterprise" %}}

<!--pytest.mark.skip-->

```sh
influxdb3 --num-io-threads=4 serve \
  --node-id node0 \
  --cluster-id cluster0 \
  --license-email example@email.com \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --verbose \
  --log-filter info
```

{{% /show-in %}}

##### Example environment variables

<!--pytest.mark.skip-->

```sh
{{% show-in "enterprise" %}}export INFLUXDB3_ENTERPRISE_LICENSE_EMAIL=example@email.com
export INFLUXDB3_ENTERPRISE_CLUSTER_ID=cluster0
{{% /show-in %}}export INFLUXDB3_NODE_IDENTIFIER_PREFIX=my-node
export INFLUXDB3_OBJECT_STORE=file
export INFLUXDB3_DB_DIR=~/.influxdb3
export LOG_FILTER=info

influxdb3 serve
```

## Global configuration options

The following options apply to the `influxdb3` CLI globally and must be specified **before** any subcommand (for example, `serve`):

### num-io-threads

Sets the number of threads allocated to the IO runtime thread pool. IO threads handle HTTP request serving, line protocol parsing, and file operations.

> \[!Important]
> `--num-io-threads` is a **global option** that must be specified before the `serve` command.

{{% show-in "enterprise" %}}
**Default:** `2`
{{% /show-in %}}

```bash
# Set IO threads (global option before serve)
influxdb3 --num-io-threads=8 serve --node-id=node0 --object-store=file
```

{{% show-in "enterprise" %}}
For detailed information about thread allocation, see the [Resource Limits](#resource-limits) section.
{{% /show-in %}}

| influxdb3 option   | Environment variable       |
| :----------------- | :------------------------- |
| `--num-io-threads` | `INFLUXDB3_NUM_IO_THREADS` |

***

## Server configuration options

- [General](#general)
  {{% show-in "enterprise" %}}- [Licensing](#licensing){{% /show-in %}}
- [Security](#security)
- [AWS](#aws)
- [Google Cloud Service](#google-cloud-service)
- [Microsoft Azure](#microsoft-azure)
- [Object Storage](#object-storage)
- [Logs](#logs)
- [Traces](#traces)
- [DataFusion](#datafusion)
- [HTTP](#http)
- [Memory](#memory)
- [Write-Ahead Log (WAL)](#write-ahead-log-wal)
- [Compaction](#compaction)
- [Caching](#caching)
- [Processing Engine](#processing-engine)
  {{% show-in "enterprise" %}}
- [Cluster Management](#cluster-management)
  {{% /show-in %}}
- [Resource Limits](#resource-limits)
- [Data Lifecycle Management](#data-lifecycle-management)
- [Telemetry](#telemetry)
- [TCP Listeners](#tcp-listeners)

***

### General

{{% show-in "enterprise" %}}

- [cluster-id](#cluster-id)
  {{% /show-in %}}
- [data-dir](#data-dir)
  {{% show-in "enterprise" %}}
- [mode](#mode)
  {{% /show-in %}}
- [node-id](#node-id)
  {{% show-in "enterprise" %}}
- [node-id-from-env](#node-id-from-env)
  {{% /show-in %}}
- [object-store](#object-store)
- [query-file-limit](#query-file-limit)
  {{% show-in "enterprise" %}}
- [use-pacha-tree](#use-pacha-tree)
  {{% /show-in %}}

{{% show-in "enterprise" %}}

#### cluster-id

Specifies the cluster identifier that prefixes the object store path for the Enterprise Catalog.
This value must be different than the [`--node-id`](#node-id) value.

| influxdb3 serve option | Environment variable              |
| :--------------------- | :-------------------------------- |
| `--cluster-id`         | `INFLUXDB3_ENTERPRISE_CLUSTER_ID` |

***

{{% /show-in %}}

#### data-dir

For the `file` object store, defines the location {{< product-name >}} uses to store files locally.
Required when using the `file` [object store](#object-store).

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--data-dir`           | `INFLUXDB3_DB_DIR`   |

***

{{% show-in "enterprise" %}}

#### mode

Sets the mode to start the server in, allowing you to create specialized nodes in a distributed cluster.

This option supports the following values:

- `all` *(default)*: Enables all server modes
- `ingest`: Enables only data ingest capabilities
- `query`: Enables only query capabilities
- `compact`: Enables only compaction processes
- `process`: Enables only data processing capabilities

You can specify multiple modes using a comma-delimited list (for example, `ingest,query`).

**Default:** `all`

> \[!Important]
> **Thread allocation for different modes:**
>
> - **Ingest mode**: Benefits from additional IO threads for line protocol parsing. For high-throughput
>   scenarios with multiple concurrent writers, consider increasing [`--num-io-threads`](#num-io-threads) (global option)
>   to 8-16+ to optimize performance. DataFusion threads are still needed for snapshot operations.
>
> - **Query mode**: Benefits from maximizing DataFusion threads. Use most available cores for DataFusion
>   with minimal IO threads (2-4).
>
> - **Compact mode**: Primarily uses DataFusion threads for sort/dedupe operations.
>
> - **All mode**: Requires balanced thread allocation based on your workload mix.

**Example configurations:**

```bash
# High-throughput ingest node (32 cores)
influxdb3 --num-io-threads=12 serve --mode=ingest --datafusion-num-threads=20

# Query-optimized node (32 cores)
influxdb3 --num-io-threads=4 serve --mode=query --datafusion-num-threads=28

# Balanced all-in-one (32 cores)
influxdb3 --num-io-threads=6 serve --mode=all --datafusion-num-threads=26
```

| influxdb3 serve option | Environment variable        |
| :--------------------- | :-------------------------- |
| `--mode`               | `INFLUXDB3_ENTERPRISE_MODE` |

***

{{% /show-in %}}

#### node-id

Specifies the node identifier used as a prefix in all object store file paths.
This should be unique for any hosts sharing the same object store
configuration--for example, the same bucket.

| influxdb3 serve option | Environment variable               |
| :--------------------- | :--------------------------------- |
| `--node-id`            | `INFLUXDB3_NODE_IDENTIFIER_PREFIX` |

***

{{% show-in "enterprise" %}}

#### node-id-from-env

Specifies the node identifier used as a prefix in all object store file paths.
Takes the name of an environment variable as an argument and uses the value of that environment variable as the node identifier.
This option cannot be used with the `--node-id` option.

| influxdb3 serve option | Environment variable                 |
| :--------------------- | :----------------------------------- |
| `--node-id-from-env`   | `INFLUXDB3_NODE_IDENTIFIER_FROM_ENV` |

##### Example using --node-id-from-env

```bash
export DATABASE_NODE=node0 && influxdb3 serve \
  --node-id-from-env DATABASE_NODE \
  --cluster-id cluster0 \
  --object-store file \
  --data-dir ~/.influxdb3/data
```

***

{{% /show-in %}}

#### object-store

Specifies which object storage to use to store Parquet files.
This option supports the following values:

- `memory`: Effectively no object persistence
- `memory-throttled`: Like `memory` but with latency and throughput that somewhat resembles a cloud object store
- `file`: Stores objects in the local filesystem (must also set `--data-dir`)
- `s3`: Amazon S3 (must also set `--bucket`, `--aws-access-key-id`, `--aws-secret-access-key`, and possibly `--aws-default-region`)
- `google`: Google Cloud Storage (must also set `--bucket` and `--google-service-account`)
- `azure`: Microsoft Azure blob storage (must also set `--bucket`, `--azure-storage-account`, and `--azure-storage-access-key`)

| influxdb3 serve option | Environment variable     |
| :--------------------- | :----------------------- |
| `--object-store`       | `INFLUXDB3_OBJECT_STORE` |

***

{{% show-in "enterprise" %}}

#### use-pacha-tree

Enables the PachaTree storage engine.

> [!Caution]
> PachaTree is an experimental feature not for production use.
> It may not be compatible with other features and configuration options.

**Default:** `false`

| influxdb3 serve option | Environment variable           |
| :--------------------- | :----------------------------- |
| `--use-pacha-tree`     | `INFLUXDB3_USE_PACHA_TREE`     |

***

{{% /show-in %}}

{{% show-in "enterprise" %}}

### Licensing

#### license-email

Specifies the email address to associate with your {{< product-name >}} license
and automatically responds to the interactive email prompt when the server starts.
This option is mutually exclusive with [license-file](#license-file).

| influxdb3 serve option | Environment variable                 |
| :--------------------- | :----------------------------------- |
| `--license-email`      | `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` |

***

#### license-file

Specifies the path to a license file for {{< product-name >}}. When provided, the license
file's contents are used instead of requesting a new license.
This option is mutually exclusive with [license-email](#license-email).

| influxdb3 serve option | Environment variable                |
| :--------------------- | :---------------------------------- |
| `--license-file`       | `INFLUXDB3_ENTERPRISE_LICENSE_FILE` |

***

#### license-type

Specifies the type of {{% product-name %}} license to use and bypasses the
interactive license prompt. Provide one of the following license types:

- `home`
- `trial`
- `commercial`

| influxdb3 serve option | Environment variable                |
| :--------------------- | :---------------------------------- |
| `--license-type`       | `INFLUXDB3_ENTERPRISE_LICENSE_TYPE` |

***

{{% /show-in %}}

### Security

- [tls-key](#tls-key)
- [tls-cert](#tls-cert)
- [tls-minimum-versions](#tls-minimum-version)
- [without-auth](#without-auth)
- [disable-authz](#disable-authz)
- [admin-token-recovery-http-bind](#admin-token-recovery-http-bind)
- [admin-token-file](#admin-token-file)
  {{% show-in "enterprise" %}}- [permission-tokens-file](#permission-tokens-file){{% /show-in %}}

#### tls-key

The path to a key file for TLS to be enabled.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--tls-key`            | `INFLUXDB3_TLS_KEY`  |

***

#### tls-cert

The path to a cert file for TLS to be enabled.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--tls-cert`           | `INFLUXDB3_TLS_CERT` |

***

#### tls-minimum-version

The minimum version for TLS.
Valid values are `tls-1.2` or `tls-1.3`.
Default is `tls-1.2`.

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--tls-minimum-version` | `INFLUXDB3_TLS_MINIMUM_VERSION` |

***

#### without-auth

Disables authentication for all server actions (CLI commands and API requests).
The server processes all requests without requiring tokens or authentication.

| influxdb3 serve option | Environment variable           |
| :--------------------- | :----------------------------- |
| `--without-auth`       | `INFLUXDB3_START_WITHOUT_AUTH` |

***

#### disable-authz

Optionally disable authz by passing in a comma separated list of resources.
Valid values are `health`, `ping`, and `metrics`.

| influxdb3 serve option | Environment variable      |
| :--------------------- | :------------------------ |
| `--disable-authz`      | `INFLUXDB3_DISABLE_AUTHZ` |

***

#### admin-token-recovery-http-bind

Enables an admin token recovery HTTP server on a separate port.
This server allows regenerating lost admin tokens without existing authentication.
The server automatically shuts down after a successful token regeneration.

> \[!Warning]
> This option creates an unauthenticated endpoint that can regenerate admin tokens.
> Only use this when you have lost access to your admin token and ensure the
> server is only accessible from trusted networks.

**Default:** `127.0.0.1:8182` (when enabled)

| influxdb3 serve option             | Environment variable                       |
| :--------------------------------- | :----------------------------------------- |
| `--admin-token-recovery-http-bind` | `INFLUXDB3_ADMIN_TOKEN_RECOVERY_HTTP_BIND` |

##### Example usage

```bash
# Start server with recovery endpoint
influxdb3 serve --admin-token-recovery-http-bind

# In another terminal, regenerate the admin token
influxdb3 create token --admin --regenerate --host http://127.0.0.1:8182
```

***

#### admin-token-file

Specifies an offline admin token file to use if no tokens exist when the server
starts. Once started, you can interact with the server using the provided token.
Offline admin tokens are designed to help with automated deployments.

| influxdb3 serve option | Environment variable         |
| :--------------------- | :--------------------------- |
| `--admin-token-file`   | `INFLUXDB3_ADMIN_TOKEN_FILE` |

Offline admin tokens are defined in a JSON-formatted file.
Use the following command to generate an offline admin token file:

<!-- pytest.mark.skip -->

```bash { placeholders="./path/to/admin-token.json" }
influxdb3 create token --admin \
  --name "example-admin-token" \
  --expiry 1d \
  --offline \
  --output-file ./path/to/admin-token.json
```

{{< expand-wrapper >}}
{{% expand "View example offline admin token file" %}}

```json
{
  "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
  "name": "example-admin-token",
  "expiry_millis": 1756400061529
}
```

{{% /expand %}}
{{< /expand-wrapper >}}

##### Example usage

<!-- pytest.mark.skip -->

```bash { placeholders="./path/to/admin-token.json" }
# Generate an admin token offline
influxdb3 create token \
  --admin \
  --name "example-admin-token" \
  --expiry 1d \
  --offline \
  --output-file ./path/to/admin-token.json

# Start {{% product-name %}} using the generated token
influxdb3 serve --admin-token-file ./path/to/admin-token.json
```

***

{{% show-in "enterprise" %}}

#### permission-tokens-file

Specifies an offline permission (resource) tokens file to use if no resource
tokens exist when the server starts. Once started, you can interact with the
server using the provided tokens. Offline permission tokens are designed to help
with automated deployments.

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--permission-tokens-file` | `INFLUXDB3_PERMISSION_TOKENS_FILE` |

Multiple tokens with database-level permissions can be defined.
You can also specify databases to create at startup.
Use the a command similar to the following to generate an offline permission
token file:

```bash { placeholders="./path/to/tokens.json" }
influxdb3 create token \
  --name "example-token" \
  --permission "db:db1,db2:read,write" \
  --permission "db:db3:read" \
  --expiry 1d \
  --offline \
  --create-databases db1,db2 \
  --output-file ./path/to/tokens.json
```

{{< expand-wrapper >}}
{{% expand "View example offline permission tokens file" %}}

```json
{
  "create_databases": [
    "db1",
    "db2",
    "d3"
  ],
  "tokens": [
    {
      "token": "apiv3_0XXXX-xxxXxXxxxXX_OxxxX...",
      "name": "example-token",
      "expiry_millis": 1756400061529,
      "permissions": [
        "db:db1,db2:read,write",
        "db:db3:read"
      ]
    }
  ]
}
```

{{% /expand %}}
{{< /expand-wrapper >}}

> \[!Note]
> If you write a new offline permission token to an existing permission token file,
> the command appends the new token to the existing output file.

##### Example usage

<!-- pytest.mark.skip -->

```bash { placeholders="./path/to/tokens.json" }
# Generate an admin token offline
influxdb3 create token \
  --name "example-token" \
  --permission "db:db1,db2:read,write" \
  --permission "db:db3:read" \
  --expiry 1d \
  --offline \
  --create-databases db1,db2 \
  --output-file ./path/to/tokens.json

# Start {{% product-name %}} using the generated token
influxdb3 serve --permission-tokens-file ./path/to/tokens.json
```

***

{{% /show-in %}}

### AWS

- [aws-access-key-id](#aws-access-key-id)
- [aws-secret-access-key](#aws-secret-access-key)
- [aws-default-region](#aws-default-region)
- [aws-endpoint](#aws-endpoint)
- [aws-session-token](#aws-session-token)
- [aws-allow-http](#aws-allow-http)
- [aws-skip-signature](#aws-skip-signature)
- [aws-credentials-file](#aws-credentials-file)

#### aws-access-key-id

When using Amazon S3 as the object store, set this to an access key that has
permission to read from and write to the specified S3 bucket.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-access-key-id`  | `AWS_ACCESS_KEY_ID`  |

***

#### aws-secret-access-key

When using Amazon S3 as the object store, set this to the secret access key that
goes with the specified access key ID.

| influxdb3 serve option    | Environment variable    |
| :------------------------ | :---------------------- |
| `--aws-secret-access-key` | `AWS_SECRET_ACCESS_KEY` |

***

#### aws-default-region

When using Amazon S3 as the object store, set this to the region that goes with
the specified bucket if different from the fallback value.

**Default:** `us-east-1`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-default-region` | `AWS_DEFAULT_REGION` |

***

#### aws-endpoint

When using an Amazon S3 compatibility storage service, set this to the endpoint.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-endpoint`       | `AWS_ENDPOINT`       |

***

#### aws-session-token

When using Amazon S3 as an object store, set this to the session token. This is
handy when using a federated login or SSO and fetching credentials via the UI.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-session-token`  | `AWS_SESSION_TOKEN`  |

***

#### aws-allow-http

Allows unencrypted HTTP connections to AWS.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-allow-http`     | `AWS_ALLOW_HTTP`     |

***

#### aws-skip-signature

If enabled, S3 object stores do not fetch credentials and do not sign requests.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--aws-skip-signature` | `AWS_SKIP_SIGNATURE` |

***

#### aws-credentials-file

Specifies the path to your S3 credentials file.
When using a credentials file, settings in the file override the corresponding
CLI flags.

S3 credential files are JSON-formatted and should contain the following:

```json { placeholders="AWS_(ACCESS_KEY_ID|SECRET_ACCESS_KEY|SESSION_TOKEN)|UNIX_SECONDS_TIMESTAMP" }
{
  "aws_access_key_id": "AWS_ACCESS_KEY_ID",
  "aws_secret_access_key": "AWS_SECRET_ACCESS_KEY",
  "aws_session_token": "AWS_SESSION_TOKEN",
  "expiry": "UNIX_SECONDS_TIMESTAMP"
}
```

The `aws_session_token` and `expiry` fields are optional.
The file is automatically checked for updates at the expiry time or at 1-hour
intervals.

If the object store returns an "Unauthenticated" error, InfluxDB will attempt to
update its in-memory credentials from this file and then retry the object store
request.

| influxdb3 serve option   | Environment variable   |
| :----------------------- | :--------------------- |
| `--aws-credentials-file` | `AWS_CREDENTIALS_FILE` |

***

### Google Cloud Service

- [google-service-account](#google-service-account)

#### google-service-account

When using Google Cloud Storage as the object store, set this to the path to the
JSON file that contains the Google credentials.

| influxdb3 serve option     | Environment variable     |
| :------------------------- | :----------------------- |
| `--google-service-account` | `GOOGLE_SERVICE_ACCOUNT` |

***

### Microsoft Azure

- [azure-storage-account](#azure-storage-account)
- [azure-storage-access-key](#azure-storage-access-key)
- [azure-endpoint](#azure-endpoint)
- [azure-allow-http](#azure-allow-http)

#### azure-storage-account

When using Microsoft Azure as the object store, set this to the name you see
when navigating to **All Services > Storage accounts > `[name]`**.

| influxdb3 serve option    | Environment variable    |
| :------------------------ | :---------------------- |
| `--azure-storage-account` | `AZURE_STORAGE_ACCOUNT` |

***

#### azure-storage-access-key

When using Microsoft Azure as the object store, set this to one of the Key
values in the Storage account's **Settings > Access keys**.

| influxdb3 serve option       | Environment variable       |
| :--------------------------- | :------------------------- |
| `--azure-storage-access-key` | `AZURE_STORAGE_ACCESS_KEY` |

***

#### azure-endpoint

When using Microsoft Azure as the object store, set this to the Azure Blob
Storage endpoint.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--azure-endpoint`     | `AZURE_ENDPOINT`     |

***

#### azure-allow-http

When using Microsoft Azure as the object store, allow unencrypted HTTP requests
to Azure Blob Storage.

**Default:** `false`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--azure-allow-http`   | `AZURE_ALLOW_HTTP`   |

***

### Object Storage

- [bucket](#bucket)
- [object-store-connection-limit](#object-store-connection-limit)
- [object-store-http2-only](#object-store-http2-only)
- [object-store-http2-max-frame-size](#object-store-http2-max-frame-size)
- [object-store-max-retries](#object-store-max-retries)
- [object-store-retry-timeout](#object-store-retry-timeout)
- [object-store-cache-endpoint](#object-store-cache-endpoint)

#### bucket

Sets the name of the object storage bucket to use. Must also set
`--object-store` to a cloud object storage for this option to take effect.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--bucket`             | `INFLUXDB3_BUCKET`   |

***

#### object-store-connection-limit

When using a network-based object store, limits the number of connections to
this value.

**Default:** `16`

| influxdb3 serve option            | Environment variable            |
| :-------------------------------- | :------------------------------ |
| `--object-store-connection-limit` | `OBJECT_STORE_CONNECTION_LIMIT` |

***

#### object-store-http2-only

Forces HTTP/2 connections to network-based object stores.

| influxdb3 serve option      | Environment variable      |
| :-------------------------- | :------------------------ |
| `--object-store-http2-only` | `OBJECT_STORE_HTTP2_ONLY` |

***

#### object-store-http2-max-frame-size

Sets the maximum frame size (in bytes/octets) for HTTP/2 connections.

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--object-store-http2-max-frame-size` | `OBJECT_STORE_HTTP2_MAX_FRAME_SIZE` |

***

#### object-store-max-retries

Defines the maximum number of times to retry a request.

| influxdb3 serve option       | Environment variable       |
| :--------------------------- | :------------------------- |
| `--object-store-max-retries` | `OBJECT_STORE_MAX_RETRIES` |

***

#### object-store-retry-timeout

Specifies the maximum length of time from the initial request after which no
further retries are be attempted.

| influxdb3 serve option         | Environment variable         |
| :----------------------------- | :--------------------------- |
| `--object-store-retry-timeout` | `OBJECT_STORE_RETRY_TIMEOUT` |

***

#### object-store-cache-endpoint

Sets the endpoint of an S3-compatible, HTTP/2-enabled object store cache.

| influxdb3 serve option          | Environment variable          |
| :------------------------------ | :---------------------------- |
| `--object-store-cache-endpoint` | `OBJECT_STORE_CACHE_ENDPOINT` |

***

### Logs

- [log-filter](#log-filter)
- [log-destination](#log-destination)
- [log-format](#log-format)
- [query-log-size](#query-log-size)

#### log-filter

Sets the filter directive for logs. Use this option to control the verbosity of
server logs globally or for specific components.

##### Log levels

The following log levels are available (from least to most verbose):

| Level   | Description                                                                                           |
| :------ | :---------------------------------------------------------------------------------------------------- |
| `error` | Only errors                                                           |
| `warn`  | Warnings and errors                                                                                   |
| `info`  | Informational messages, warnings, and errors _(default)_                                              |
| `debug` | Debug information for troubleshooting, plus all above levels                                          |
| `trace` | Very detailed tracing information, plus all above levels (produces high log volume)                   |

##### Basic usage

To set the log level globally, pass one of the log levels:

<!--pytest.mark.skip-->

```sh
influxdb3 serve --log-filter debug
```

##### Targeted filtering

Globally enabling `debug` or `trace` produces a high volume of log output.
For more targeted debugging, you can set different log levels for specific
components using the format `<global_level>,<component>=<level>`.

###### Debug write buffer operations

<!--pytest.mark.skip-->

```sh
influxdb3 serve --log-filter info,influxdb3_write_buffer=debug
```

###### Trace WAL operations

<!--pytest.mark.skip-->

```sh
influxdb3 serve --log-filter info,influxdb3_wal=trace
```

###### Multiple targeted filters

<!--pytest.mark.skip-->

```sh
influxdb3 serve --log-filter info,influxdb3_write_buffer=debug,influxdb3_wal=debug
```

{{% show-in "enterprise" %}}

###### Debug Enterprise storage engine operations

<!--pytest.mark.skip-->

```sh
influxdb3 serve --log-filter info,influxdb3_pacha_tree=debug
```

{{% /show-in %}}

##### Common component names

The following are common component names you can use for targeted filtering:

| Component                             | Description                                              |
| :------------------------------------ | :------------------------------------------------------- |
| `influxdb3_write_buffer`              | Write buffer operations                                  |
| `influxdb3_wal`                       | Write-ahead log operations                               |
| `influxdb3_catalog`                   | Catalog and schema operations                            |
| `influxdb3_cache`                     | Caching operations                                       |
{{% show-in "enterprise" %}}`influxdb3_pacha_tree`                | Enterprise storage engine operations                     |
`influxdb3_enterprise`                  | Enterprise-specific features                             |
{{% /show-in %}}

> [!Note]
> Targeted filtering requires knowledge of the codebase component names.
> The component names correspond to Rust package names in the InfluxDB 3 source
> code. Use `debug` or `trace` sparingly on specific components to avoid
> excessive log output.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--log-filter`         | `LOG_FILTER`         |

***

#### log-destination

Specifies the destination for logs.

This option supports the following values:

- `stdout` *(default)*
- `stderr`

**Default:** `stdout`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--log-destination`    | `LOG_DESTINATION`    |

***

#### log-format

Defines the message format for logs.

This option supports the following values:

- `full` *(default)*

**Default:** `full`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--log-format`         | `LOG_FORMAT`         |

***

#### query-log-size

Defines the size of the query log. Up to this many queries remain in the
log before older queries are evicted to make room for new ones.

**Default:** `1000`

| influxdb3 serve option | Environment variable       |
| :--------------------- | :------------------------- |
| `--query-log-size`     | `INFLUXDB3_QUERY_LOG_SIZE` |

***

### Traces

- [traces-exporter](#traces-exporter)
- [traces-exporter-jaeger-agent-host](#traces-exporter-jaeger-agent-host)
- [traces-exporter-jaeger-agent-port](#traces-exporter-jaeger-agent-port)
- [traces-exporter-jaeger-service-name](#traces-exporter-jaeger-service-name)
- [traces-exporter-jaeger-trace-context-header-name](#traces-exporter-jaeger-trace-context-header-name)
- [traces-jaeger-debug-name](#traces-jaeger-debug-name)
- [traces-jaeger-tags](#traces-jaeger-tags)
- [traces-jaeger-max-msgs-per-second](#traces-jaeger-max-msgs-per-second)

#### traces-exporter

Sets the type of tracing exporter.

**Default:** `none`

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--traces-exporter`    | `TRACES_EXPORTER`    |

***

#### traces-exporter-jaeger-agent-host

Specifies the Jaeger agent network hostname for tracing.

**Default:** `0.0.0.0`

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--traces-exporter-jaeger-agent-host` | `TRACES_EXPORTER_JAEGER_AGENT_HOST` |

***

#### traces-exporter-jaeger-agent-port

Defines the Jaeger agent network port for tracing.

**Default:** `6831`

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--traces-exporter-jaeger-agent-port` | `TRACES_EXPORTER_JAEGER_AGENT_PORT` |

***

#### traces-exporter-jaeger-service-name

Sets the Jaeger service name for tracing.

**Default:** `iox-conductor`

| influxdb3 serve option                  | Environment variable                  |
| :-------------------------------------- | :------------------------------------ |
| `--traces-exporter-jaeger-service-name` | `TRACES_EXPORTER_JAEGER_SERVICE_NAME` |

***

#### traces-exporter-jaeger-trace-context-header-name

Specifies the header name used for passing trace context.

**Default:** `uber-trace-id`

| influxdb3 serve option                               | Environment variable                               |
| :--------------------------------------------------- | :------------------------------------------------- |
| `--traces-exporter-jaeger-trace-context-header-name` | `TRACES_EXPORTER_JAEGER_TRACE_CONTEXT_HEADER_NAME` |

***

#### traces-jaeger-debug-name

Specifies the header name used for force sampling in tracing.

**Default:** `jaeger-debug-id`

| influxdb3 serve option       | Environment variable                |
| :--------------------------- | :---------------------------------- |
| `--traces-jaeger-debug-name` | `TRACES_EXPORTER_JAEGER_DEBUG_NAME` |

***

#### traces-jaeger-tags

Defines a set of `key=value` pairs to annotate tracing spans with.

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--traces-jaeger-tags` | `TRACES_EXPORTER_JAEGER_TAGS` |

***

#### traces-jaeger-max-msgs-per-second

Specifies the maximum number of messages sent to a Jaeger service per second.

**Default:** `1000`

| influxdb3 serve option                | Environment variable                |
| :------------------------------------ | :---------------------------------- |
| `--traces-jaeger-max-msgs-per-second` | `TRACES_JAEGER_MAX_MSGS_PER_SECOND` |

***

### DataFusion

- [datafusion-num-threads](#datafusion-num-threads)
- [datafusion-max-parquet-fanout](#datafusion-max-parquet-fanout)
- [datafusion-use-cached-parquet-loader](#datafusion-use-cached-parquet-loader)
- [datafusion-config](#datafusion-config)

<!--docs:exclude
--datafusion-runtime-type: development-only Tokio runtime configuration
--datafusion-runtime-disable-lifo-slot: development-only Tokio runtime configuration
--datafusion-runtime-event-interval: development-only Tokio runtime configuration
--datafusion-runtime-global-queue-interval: development-only Tokio runtime configuration
--datafusion-runtime-max-blocking-threads: development-only Tokio runtime configuration
--datafusion-runtime-max-io-events-per-tick: development-only Tokio runtime configuration
--datafusion-runtime-thread-keep-alive: development-only Tokio runtime configuration
--datafusion-runtime-thread-priority: development-only Tokio runtime configuration
-->

#### datafusion-num-threads

Sets the maximum number of DataFusion runtime threads to use.

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--datafusion-num-threads` | `INFLUXDB3_DATAFUSION_NUM_THREADS` |

***

#### datafusion-max-parquet-fanout

When multiple Parquet files are required in a sorted way
(deduplication for example), specifies the maximum fanout.

**Default:** `1000`

| influxdb3 serve option            | Environment variable                      |
| :-------------------------------- | :---------------------------------------- |
| `--datafusion-max-parquet-fanout` | `INFLUXDB3_DATAFUSION_MAX_PARQUET_FANOUT` |

***

#### datafusion-use-cached-parquet-loader

Uses a cached Parquet loader when reading Parquet files from the object store.

| influxdb3 serve option                   | Environment variable                             |
| :--------------------------------------- | :----------------------------------------------- |
| `--datafusion-use-cached-parquet-loader` | `INFLUXDB3_DATAFUSION_USE_CACHED_PARQUET_LOADER` |

***

#### datafusion-config

Provides custom configuration to DataFusion as a comma-separated list of
`key:value` pairs.

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--datafusion-config`  | `INFLUXDB3_DATAFUSION_CONFIG` |

***

### HTTP

- [max-http-request-size](#max-http-request-size)
- [http-bind](#http-bind)

#### max-http-request-size

Specifies the maximum size of HTTP requests.

**Default:** `10485760`

| influxdb3 serve option    | Environment variable              |
| :------------------------ | :-------------------------------- |
| `--max-http-request-size` | `INFLUXDB3_MAX_HTTP_REQUEST_SIZE` |

***

#### http-bind

Defines the address on which InfluxDB serves HTTP API requests.

**Default:** `0.0.0.0:8181`

| influxdb3 serve option | Environment variable       |
| :--------------------- | :------------------------- |
| `--http-bind`          | `INFLUXDB3_HTTP_BIND_ADDR` |

***

### Memory

- [exec-mem-pool-bytes](#exec-mem-pool-bytes)
- [force-snapshot-mem-threshold](#force-snapshot-mem-threshold)

#### exec-mem-pool-bytes

Specifies the size of the memory pool used for query processing and data operations.
This memory pool is used when {{% product-name %}} processes queries and performs
internal data management tasks.
Can be given as absolute value in bytes or as a percentage of the total available memory--for
example: `8000000000` or `10%`.

{{% show-in "core" %}}**Default:** `8589934592`{{% /show-in %}}
{{% show-in "enterprise" %}}**Default:** `20%`{{% /show-in %}}

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--exec-mem-pool-bytes` | `INFLUXDB3_EXEC_MEM_POOL_BYTES` |

***

#### force-snapshot-mem-threshold

Specifies the threshold for the internal memory buffer. Supports either a
percentage (portion of available memory) or absolute value in MB--for example: `70%` or `1000`.

{{% show-in "core" %}}**Default:** `70%`{{% /show-in %}}
{{% show-in "enterprise" %}}**Default:** `50%`{{% /show-in %}}

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--force-snapshot-mem-threshold` | `INFLUXDB3_FORCE_SNAPSHOT_MEM_THRESHOLD` |

***

### Write-Ahead Log (WAL)

- [wal-flush-interval](#wal-flush-interval)
- [wal-snapshot-size](#wal-snapshot-size)
- [wal-max-write-buffer-size](#wal-max-write-buffer-size)
- [snapshotted-wal-files-to-keep](#snapshotted-wal-files-to-keep)
- [wal-replay-fail-on-error](#wal-replay-fail-on-error)
- [wal-replay-concurrency-limit](#wal-replay-concurrency-limit)

#### wal-flush-interval

Specifies the interval to flush buffered data to a WAL file. Writes that wait
for WAL confirmation take up to this interval to complete.
Use `s` for seconds or `ms` for milliseconds. For local disks, `100 ms` is recommended.

**Default:** `1s`

| influxdb3 serve option | Environment variable           |
| :--------------------- | :----------------------------- |
| `--wal-flush-interval` | `INFLUXDB3_WAL_FLUSH_INTERVAL` |

***

#### wal-snapshot-size

Defines the number of WAL files to attempt to remove in a snapshot. This,
multiplied by the interval, determines how often snapshots are taken.

**Default:** `600`

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--wal-snapshot-size`  | `INFLUXDB3_WAL_SNAPSHOT_SIZE` |

***

#### wal-max-write-buffer-size

Specifies the maximum number of write requests that can be buffered before a
flush must be executed and succeed.

**Default:** `100000`

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--wal-max-write-buffer-size` | `INFLUXDB3_WAL_MAX_WRITE_BUFFER_SIZE` |

***

#### snapshotted-wal-files-to-keep

Specifies the number of snapshotted WAL files to retain in the object store.
Flushing the WAL files does not clear the WAL files immediately;
they are deleted when the number of snapshotted WAL files exceeds this number.

**Default:** `300`

| influxdb3 serve option            | Environment variable              |
| :-------------------------------- | :-------------------------------- |
| `--snapshotted-wal-files-to-keep` | `INFLUXDB3_NUM_WAL_FILES_TO_KEEP` |

***

#### wal-replay-fail-on-error

Determines whether WAL replay should fail when encountering errors.

**Default:** `false`

| influxdb3 serve option       | Environment variable                 |
| :--------------------------- | :----------------------------------- |
| `--wal-replay-fail-on-error` | `INFLUXDB3_WAL_REPLAY_FAIL_ON_ERROR` |

***

#### wal-replay-concurrency-limit

Concurrency limit during WAL replay.
Setting this number too high can lead to OOM.
The default is dynamically determined.

**Default:** `max(num_cpus, 10)`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--wal-replay-concurrency-limit` | `INFLUXDB3_WAL_REPLAY_CONCURRENCY_LIMIT` |

***

### Compaction

{{% show-in "enterprise" %}}

<!--- [compaction-row-limit](#compaction-row-limit) - NOT YET RELEASED in v3.5.0 -->

- [compaction-max-num-files-per-plan](#compaction-max-num-files-per-plan)
- [compaction-gen2-duration](#compaction-gen2-duration)
- [compaction-multipliers](#compaction-multipliers)
- [compaction-cleanup-wait](#compaction-cleanup-wait)
- [compaction-check-interval](#compaction-check-interval)
  {{% /show-in %}}
- [gen1-duration](#gen1-duration)

{{% show-in "enterprise" %}}

<!---
#### compaction-row-limit

NOTE: This option is not yet released in v3.5.0. Uncomment when available in a future release.

Specifies the soft limit for the number of rows per file that the compactor
writes. The compactor may write more rows than this limit.

**Default:** `1000000`

| influxdb3 serve option   | Environment variable                        |
| :----------------------- | :------------------------------------------ |
| `--compaction-row-limit` | `INFLUXDB3_ENTERPRISE_COMPACTION_ROW_LIMIT` |

---
-->

#### compaction-max-num-files-per-plan

Sets the maximum number of files included in any compaction plan.

**Default:** `500`

| influxdb3 serve option                | Environment variable                                     |
| :------------------------------------ | :------------------------------------------------------- |
| `--compaction-max-num-files-per-plan` | `INFLUXDB3_ENTERPRISE_COMPACTION_MAX_NUM_FILES_PER_PLAN` |

***

#### compaction-gen2-duration

Specifies the duration of the first level of compaction (gen2). Later levels of
compaction are multiples of this duration. This value should be equal to or
greater than the gen1 duration.

**Default:** `20m`

| influxdb3 serve option       | Environment variable                            |
| :--------------------------- | :---------------------------------------------- |
| `--compaction-gen2-duration` | `INFLUXDB3_ENTERPRISE_COMPACTION_GEN2_DURATION` |

***

#### compaction-multipliers

Specifies a comma-separated list of multiples defining the duration of each
level of compaction. The number of elements in the list determines the number of
compaction levels. The first element specifies the duration of the first level
(gen3); subsequent levels are multiples of the previous level.

**Default:** `3,4,6,5`

| influxdb3 serve option     | Environment variable                          |
| :------------------------- | :-------------------------------------------- |
| `--compaction-multipliers` | `INFLUXDB3_ENTERPRISE_COMPACTION_MULTIPLIERS` |

***

#### compaction-cleanup-wait

Specifies the amount of time that the compactor waits after finishing a compaction run
to delete files marked as needing deletion during that compaction run.

**Default:** `10m`

| influxdb3 serve option      | Environment variable                           |
| :-------------------------- | :--------------------------------------------- |
| `--compaction-cleanup-wait` | `INFLUXDB3_ENTERPRISE_COMPACTION_CLEANUP_WAIT` |

***

#### compaction-check-interval

Specifies how often the compactor checks for new compaction work to perform.

**Default:** `10s`

| influxdb3 serve option        | Environment variable                             |
| :---------------------------- | :----------------------------------------------- |
| `--compaction-check-interval` | `INFLUXDB3_ENTERPRISE_COMPACTION_CHECK_INTERVAL` |

***

{{% /show-in %}}

#### gen1-duration

Specifies the duration that Parquet files are arranged into. Data timestamps
land each row into a file of this duration. Supported durations are `1m`,
`5m`, and `10m`. These files are known as "generation 1" files{{% show-in "enterprise" %}}, which the
compactor can merge into larger generations{{% /show-in %}}{{% show-in "core" %}} that the
compactor in InfluxDB 3 Enterprise can merge into larger generations{{% /show-in %}}.

**Default:** `10m`

| influxdb3 serve option | Environment variable      |
| :--------------------- | :------------------------ |
| `--gen1-duration`      | `INFLUXDB3_GEN1_DURATION` |

***

### Caching

- [preemptive-cache-age](#preemptive-cache-age)
- [parquet-mem-cache-size](#parquet-mem-cache-size)
- [parquet-mem-cache-prune-percentage](#parquet-mem-cache-prune-percentage)
- [parquet-mem-cache-prune-interval](#parquet-mem-cache-prune-interval)
- [parquet-mem-cache-query-path-duration](#parquet-mem-cache-query-path-duration)
- [disable-parquet-mem-cache](#disable-parquet-mem-cache)
- [table-index-cache-max-entries](#table-index-cache-max-entries)
- [table-index-cache-concurrency-limit](#table-index-cache-concurrency-limit)
  {{% show-in "enterprise" %}}
- [last-value-cache-disable-from-history](#last-value-cache-disable-from-history)
  {{% /show-in %}}
- [last-cache-eviction-interval](#last-cache-eviction-interval)
  {{% show-in "enterprise" %}}
- [distinct-value-cache-disable-from-history](#distinct-value-cache-disable-from-history)
  {{% /show-in %}}
- [distinct-cache-eviction-interval](#distinct-cache-eviction-interval)

#### preemptive-cache-age

Specifies the interval to prefetch into the Parquet cache during compaction.

**Default:** `3d`

| influxdb3 serve option   | Environment variable             |
| :----------------------- | :------------------------------- |
| `--preemptive-cache-age` | `INFLUXDB3_PREEMPTIVE_CACHE_AGE` |

***

#### parquet-mem-cache-size

Specifies the size of the in-memory Parquet cache. Accepts values in megabytes (as an integer) or as a percentage of total available memory (for example, `20%`, `4096`).

**Default:** `20%`

> \[!Note]
>
> #### Breaking change in v3.0.0
>
> In v3.0.0, `--parquet-mem-cache-size-mb` was replaced with `--parquet-mem-cache-size`.
> The new option accepts both megabytes (integer) and percentage values.
> The default changed from `1000` MB to `20%` of total available memory.

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--parquet-mem-cache-size` | `INFLUXDB3_PARQUET_MEM_CACHE_SIZE` |

#### parquet-mem-cache-prune-percentage

Specifies the percentage of entries to prune during a prune operation on the
in-memory Parquet cache.

**Default:** `0.1`

| influxdb3 serve option                 | Environment variable                           |
| :------------------------------------- | :--------------------------------------------- |
| `--parquet-mem-cache-prune-percentage` | `INFLUXDB3_PARQUET_MEM_CACHE_PRUNE_PERCENTAGE` |

***

#### parquet-mem-cache-prune-interval

Sets the interval to check if the in-memory Parquet cache needs to be pruned.

**Default:** `1s`

| influxdb3 serve option               | Environment variable                         |
| :----------------------------------- | :------------------------------------------- |
| `--parquet-mem-cache-prune-interval` | `INFLUXDB3_PARQUET_MEM_CACHE_PRUNE_INTERVAL` |

***

#### parquet-mem-cache-query-path-duration

{{% show-in "enterprise" %}}
A [duration](/influxdb3/enterprise/reference/glossary/#duration) that specifies
{{% /show-in %}}{{% show-in "core" %}}
Specifies
{{% /show-in %}}
the time window for caching recent Parquet files in memory. Default is `5h`.

Only files containing data with a timestamp between `now` and `now - duration`
are cached when accessed during queries--for example, with the default `5h` setting:

- Current time: `2024-06-10 15:00:00`
- Cache window: Last 5 hours (`2024-06-10 10:00:00` to now)

If a query requests data from `2024-06-09` (old) and `2024-06-10 14:00` (recent):

- **Cached**: Parquet files with data from `2024-06-10 14:00` (within 5-hour window)
- **Not cached**: Parquet files with data from `2024-06-09` (outside 5-hour window)

| influxdb3 serve option                    | Environment variable                              |
| :---------------------------------------- | :------------------------------------------------ |
| `--parquet-mem-cache-query-path-duration` | `INFLUXDB3_PARQUET_MEM_CACHE_QUERY_PATH_DURATION` |

***

#### disable-parquet-mem-cache

Disables the in-memory Parquet cache. By default, the cache is enabled.

| influxdb3 serve option        | Environment variable                  |
| :---------------------------- | :------------------------------------ |
| `--disable-parquet-mem-cache` | `INFLUXDB3_DISABLE_PARQUET_MEM_CACHE` |

***

#### table-index-cache-max-entries

Specifies the maximum number of entries in the table index cache.

**Default:** `1000`

| influxdb3 serve option            | Environment variable                      |
| :-------------------------------- | :---------------------------------------- |
| `--table-index-cache-max-entries` | `INFLUXDB3_TABLE_INDEX_CACHE_MAX_ENTRIES` |

***

#### table-index-cache-concurrency-limit

Limits the concurrency level for table index cache operations.

**Default:** `8`

| influxdb3 serve option                  | Environment variable                            |
| :-------------------------------------- | :---------------------------------------------- |
| `--table-index-cache-concurrency-limit` | `INFLUXDB3_TABLE_INDEX_CACHE_CONCURRENCY_LIMIT` |

{{% show-in "enterprise" %}}

***

#### last-value-cache-disable-from-history

Disables populating the last-N-value cache from historical data.
If disabled, the cache is still populated with data from the write-ahead log (WAL).

| influxdb3 serve option                    | Environment variable                                         |
| :---------------------------------------- | :----------------------------------------------------------- |
| `--last-value-cache-disable-from-history` | `INFLUXDB3_ENTERPRISE_LAST_VALUE_CACHE_DISABLE_FROM_HISTORY` |

{{% /show-in %}}

***

#### last-cache-eviction-interval

Specifies the interval to evict expired entries from the Last-N-Value cache,
expressed as a human-readable duration--for example: `20s`, `1m`, `1h`.

**Default:** `10s`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--last-cache-eviction-interval` | `INFLUXDB3_LAST_CACHE_EVICTION_INTERVAL` |

## {{% show-in "enterprise" %}}

#### distinct-value-cache-disable-from-history

Disables populating the distinct value cache from historical data.
If disabled, the cache is still populated with data from the write-ahead log (WAL).

| influxdb3 serve option                        | Environment variable                                             |
| :-------------------------------------------- | :--------------------------------------------------------------- |
| `--distinct-value-cache-disable-from-history` | `INFLUXDB3_ENTERPRISE_DISTINCT_VALUE_CACHE_DISABLE_FROM_HISTORY` |

{{% /show-in %}}

***

#### distinct-cache-eviction-interval

Specifies the interval to evict expired entries from the distinct value cache,
expressed as a human-readable duration--for example: `20s`, `1m`, `1h`.

**Default:** `10s`

| influxdb3 serve option               | Environment variable                         |
| :----------------------------------- | :------------------------------------------- |
| `--distinct-cache-eviction-interval` | `INFLUXDB3_DISTINCT_CACHE_EVICTION_INTERVAL` |

***

#### query-file-limit

Limits the number of Parquet files a query can access.
If a query attempts to read more than this limit, {{< product-name >}} returns an error.

{{% show-in "core" %}}
**Default:** `432`

With the default `432` setting and the default [`gen1-duration`](#gen1-duration)
setting of 10 minutes, queries can access up to a 72 hours of data, but
potentially less depending on whether all data for a given 10 minute block of
time was ingested during the same period.

You can increase this limit to allow more files to be queried, but be aware of
the following side-effects:

- Degraded query performance for queries that read more Parquet files
- Increased memory usage
- Your system potentially killing the `influxdb3` process due to Out-of-Memory
  (OOM) errors
- If using object storage to store data, many GET requests to access the data
  (as many as 2 per file)

> \[!Note]
> We recommend keeping the default setting and querying smaller time ranges.
> If you need to query longer time ranges or faster query performance on any query
> that accesses an hour or more of data, [InfluxDB 3 Enterprise](/influxdb3/enterprise/)
> optimizes data storage by compacting and rearranging Parquet files to achieve
> faster query performance.
> {{% /show-in %}}

| influxdb3 serve option | Environment variable         |
| :--------------------- | :--------------------------- |
| `--query-file-limit`   | `INFLUXDB3_QUERY_FILE_LIMIT` |

***

### Processing Engine

- [plugin-dir](#plugin-dir)
- [plugin-repo](#plugin-repo)
- [virtual-env-location](#virtual-env-location)
- [package-manager](#package-manager)

#### plugin-dir

Specifies the local directory that contains Python plugins and their test files.

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--plugin-dir`         | `INFLUXDB3_PLUGIN_DIR` |

***

#### plugin-repo

Specifies the base URL of the remote repository used when referencing plugins with the `gh:` prefix.
When you create a trigger with a plugin filename starting with `gh:`, InfluxDB fetches
the plugin code from this repository URL.

The URL construction automatically handles trailing slashes—both formats work identically:

- `https://example.com/plugins/` (with trailing slash)
- `https://example.com/plugins` (without trailing slash)

**Default:** The official InfluxDB 3 plugins repository at `https://raw.githubusercontent.com/influxdata/influxdb3_plugins/main/`

| influxdb3 serve option | Environment variable    |
| :--------------------- | :---------------------- |
| `--plugin-repo`        | `INFLUXDB3_PLUGIN_REPO` |

##### Example usage

```bash
# Use a custom organization repository
influxdb3 serve \
  --plugin-dir ~/.plugins \
  --plugin-repo "https://raw.githubusercontent.com/myorg/influxdb-plugins/main/"

# Use an internal mirror
influxdb3 serve \
  --plugin-dir ~/.plugins \
  --plugin-repo "https://internal.company.com/influxdb-plugins/"

# Set via environment variable
export INFLUXDB3_PLUGIN_REPO="https://custom-repo.example.com/plugins/"
influxdb3 serve --plugin-dir ~/.plugins
```

***

#### virtual-env-location

Specifies the location of the Python virtual environment that the processing
engine uses.

| influxdb3 serve option   | Environment variable |
| :----------------------- | :------------------- |
| `--virtual-env-location` | `VIRTUAL_ENV`        |

***

#### package-manager

Specifies the Python package manager that the Processing Engine uses to install plugin dependencies.

This option supports the following values:

- `discover` *(default)*: Automatically detect and use available package manager (`uv` or `pip`)
- `pip`: Use pip package manager exclusively
- `uv`: Use uv package manager exclusively
- `disabled`: Disable automatic package installation (all dependencies must be pre-installed)

**Default:** `discover`

##### Security mode (disabled)

When set to `disabled`, {{< product-name >}} blocks all package installation attempts for security and compliance requirements.
The Processing Engine and plugins continue to function normally, but package installation requests (via CLI or API) return a `403 Forbidden` error.

This mode is designed for:

- **Enterprise security requirements**: Prevent arbitrary package installation
- **Compliance environments**: Control exactly which packages are available
- **Air-gapped deployments**: Pre-install all dependencies before deployment
- **Multi-tenant scenarios**: Prevent tenants from installing potentially malicious packages

> \[!Important]
> Before using `--package-manager disabled`, administrators must pre-install all required Python packages into the virtual environment that plugins will use.

**Example:**

```bash
# Start InfluxDB 3 with disabled package manager
influxdb3 serve \
  --node-id node0 \
  --object-store file \
  --data-dir ~/.influxdb3 \
  --plugin-dir ~/.plugins \
  --package-manager disabled
```

For more information about plugins and package management, see [Processing Engine plugins](/influxdb3/version/plugins/).

| influxdb3 serve option | Environment variable        |
| :--------------------- | :-------------------------- |
| `--package-manager`    | `INFLUXDB3_PACKAGE_MANAGER` |

{{% show-in "enterprise" %}}

***

### Cluster Management

- [replication-interval](#replication-interval)
- [catalog-sync-interval](#catalog-sync-interval)
- [wait-for-running-ingestor](#wait-for-running-ingestor)

#### replication-interval

Specifies the interval at which data replication occurs between cluster nodes.

**Default:** `250ms`

| influxdb3 serve option   | Environment variable                        |
| :----------------------- | :------------------------------------------ |
| `--replication-interval` | `INFLUXDB3_ENTERPRISE_REPLICATION_INTERVAL` |

***

#### catalog-sync-interval

Defines how often the catalog synchronizes across cluster nodes.

**Default:** `10s`

| influxdb3 serve option    | Environment variable                         |
| :------------------------ | :------------------------------------------- |
| `--catalog-sync-interval` | `INFLUXDB3_ENTERPRISE_CATALOG_SYNC_INTERVAL` |

***

#### wait-for-running-ingestor

Specifies how long to wait for a running ingestor during startup.

**Default:** `10s`

| influxdb3 serve option        | Environment variable                             |
| :---------------------------- | :----------------------------------------------- |
| `--wait-for-running-ingestor` | `INFLUXDB3_ENTERPRISE_WAIT_FOR_RUNNING_INGESTOR` |

{{% /show-in %}}

***

### Resource Limits

{{% show-in "enterprise" %}}

- [num-cores](#num-cores)
  {{% /show-in %}}
- [datafusion-num-threads](#datafusion-num-threads)
- *[num-io-threads](#num-io-threads) - See [Global configuration options](#global-configuration-options)*
  {{% show-in "enterprise" %}}
- [num-database-limit](#num-database-limit)
- [num-table-limit](#num-table-limit)
- [num-total-columns-per-table-limit](#num-total-columns-per-table-limit)

#### num-cores

Limits the number of CPU cores that the InfluxDB 3 Enterprise process can use when running on systems where resources are shared.

**Default:** All available cores on the system

Maximum cores allowed is determined by your {{% product-name %}} license:

- **Trial**: up to 256 cores
- **At-Home**: 2 cores
- **Commercial**: per contract

When specified, InfluxDB automatically assigns the number of DataFusion threads and IO threads based on the core count.

**Default thread assignment logic when `num-cores` is set:**

- **1-2 cores**: 1 IO thread, 1 DataFusion thread
- **3 cores**: 1 IO thread, 2 DataFusion threads
- **4+ cores**: 2 IO threads, (n-2) DataFusion threads

This automatic allocation applies when you don't explicitly set [`--num-io-threads`](#num-io-threads) and [`--datafusion-num-threads`](#datafusion-num-threads).

> \[!Note]
> You can override the automatic thread assignment by explicitly setting [`--num-io-threads`](#num-io-threads)
> and [`--datafusion-num-threads`](#datafusion-num-threads).
> This is particularly important for specialized
> workloads like [ingest mode](#mode) where you may need more IO threads than the default allocation.

**Constraints:**

- Must be at least 2
- Cannot exceed the number of cores available on the system
- Total thread count from `--num-io-threads` (global option) and `--datafusion-num-threads` cannot exceed the `num-cores` value

| influxdb3 serve option | Environment variable             |
| :--------------------- | :------------------------------- |
| `--num-cores`          | `INFLUXDB3_ENTERPRISE_NUM_CORES` |
| {{% /show-in %}}       |                                  |

#### datafusion-num-threads

Sets the number of threads allocated to the DataFusion runtime thread pool.
DataFusion threads handle:

- Query execution and processing
- Data aggregation and transformation
- Snapshot creation (sort/dedupe operations)
- Parquet file generation

{{% show-in "core" %}}
**Default:** All available cores minus IO threads

> \[!Note]
> DataFusion threads are used for both query processing and snapshot operations.
> {{% /show-in %}}

{{% show-in "enterprise" %}}
**Default:**

- If not specified and `--num-cores` is not set: All available cores minus IO threads
- If not specified and `--num-cores` is set: Automatically determined based on core count (see [`--num-cores`](#num-cores))

> \[!Note]
> DataFusion threads are used for both query processing and snapshot operations.
> Even ingest-only nodes use DataFusion threads during WAL snapshot creation.

**Constraints:** When used with `--num-cores`, the sum of `--num-io-threads` and `--datafusion-num-threads` cannot exceed the `num-cores` value
{{% /show-in %}}

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--datafusion-num-threads` | `INFLUXDB3_DATAFUSION_NUM_THREADS` |

> \[!Note]
> [`--num-io-threads`](#num-io-threads) is a [global configuration option](#global-configuration-options).

## {{% show-in "enterprise" %}}

#### num-database-limit

Limits the total number of active databases.
Default is {{% influxdb3/limit "database" %}}.

| influxdb3 serve option | Environment variable                      |
| :--------------------- | :---------------------------------------- |
| `--num-database-limit` | `INFLUXDB3_ENTERPRISE_NUM_DATABASE_LIMIT` |

***

#### num-table-limit

Limits the total number of active tables across all databases.
Default is {{% influxdb3/limit "table" %}}.

| influxdb3 serve option | Environment variable                   |
| :--------------------- | :------------------------------------- |
| `--num-table-limit`    | `INFLUXDB3_ENTERPRISE_NUM_TABLE_LIMIT` |

***

#### num-total-columns-per-table-limit

Limits the total number of columns per table.
Default is {{% influxdb3/limit "column" %}}.

| influxdb3 serve option                | Environment variable                                     |
| :------------------------------------ | :------------------------------------------------------- |
| `--num-total-columns-per-table-limit` | `INFLUXDB3_ENTERPRISE_NUM_TOTAL_COLUMNS_PER_TABLE_LIMIT` |

{{% /show-in %}}

***

### Data Lifecycle Management

- [gen1-lookback-duration](#gen1-lookback-duration)
- [retention-check-interval](#retention-check-interval)
- [delete-grace-period](#delete-grace-period)
- [hard-delete-default-duration](#hard-delete-default-duration)

#### gen1-lookback-duration

Specifies how far back to look when creating generation 1 Parquet files.

**Default:** `24h`

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--gen1-lookback-duration` | `INFLUXDB3_GEN1_LOOKBACK_DURATION` |

***

#### retention-check-interval

The interval at which retention policies are checked and enforced.
Enter as a human-readable time--for example: `30m` or `1h`.

**Default:** `30m`

| influxdb3 serve option       | Environment variable                 |
| :--------------------------- | :----------------------------------- |
| `--retention-check-interval` | `INFLUXDB3_RETENTION_CHECK_INTERVAL` |

***

#### delete-grace-period

Specifies the grace period before permanently deleting data.

**Default:** `24h`

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--delete-grace-period` | `INFLUXDB3_DELETE_GRACE_PERIOD` |

***

#### hard-delete-default-duration

Sets the default duration for hard deletion of data.

**Default:** `90d`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--hard-delete-default-duration` | `INFLUXDB3_HARD_DELETE_DEFAULT_DURATION` |

***

### Telemetry

- [disable-telemetry-upload](#disable-telemetry-upload)
- [telemetry-endpoint](#telemetry-endpoint)

#### disable-telemetry-upload

Disables the upload of telemetry data to InfluxData.

**Default:** `false`

| influxdb3 serve option       | Environment variable                 |
| :--------------------------- | :----------------------------------- |
| `--disable-telemetry-upload` | `INFLUXDB3_TELEMETRY_DISABLE_UPLOAD` |

***

#### telemetry-endpoint

Specifies the endpoint for telemetry data uploads.

| influxdb3 serve option | Environment variable           |
| :--------------------- | :----------------------------- |
| `--telemetry-endpoint` | `INFLUXDB3_TELEMETRY_ENDPOINT` |

***

### TCP Listeners

- [tcp-listener-file-path](#tcp-listener-file-path)
- [admin-token-recovery-tcp-listener-file-path](#admin-token-recovery-tcp-listener-file-path)

#### tcp-listener-file-path

Specifies the file path for the TCP listener configuration.

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--tcp-listener-file-path` | `INFLUXDB3_TCP_LISTINER_FILE_PATH` |

***

#### admin-token-recovery-tcp-listener-file-path

Specifies the TCP listener file path for admin token recovery operations.

| influxdb3 serve option                          | Environment variable                                    |
| :---------------------------------------------- | :------------------------------------------------------ |
| `--admin-token-recovery-tcp-listener-file-path` | `INFLUXDB3_ADMIN_TOKEN_RECOVERY_TCP_LISTENER_FILE_PATH` |
