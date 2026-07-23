<!-- Comment to allow starting shortcode -->

{{< product-name >}} lets you customize your configuration by using
`influxdb3` command options or by setting environment variables.

## Configure your server

Pass configuration options using either command options or environment variables.
Command options take precedence over environment variables.

### TOML configuration files

DEB and RPM installs include a TOML configuration file at
`/etc/influxdb3/influxdb3-{{< product-key >}}.conf`.
The systemd launcher reads this file and converts each entry to an
`INFLUXDB3_*` environment variable (the pattern is `INFLUXDB3_<KEY>`
with hyphens replaced by underscores and uppercased) before invoking
`influxdb3 serve`.

`influxdb3 serve` does not yet natively read TOML; the file's effect is
applied through the environment variables the launcher sets.
CLI flags passed to `influxdb3 serve` still override values defined in
the TOML file because they override the environment variables that
file becomes.

For day-to-day systemd operation — including the edit-and-restart
workflow for applying changes — see
[Run as a system service (Linux)](/influxdb3/version/install/#run-as-a-system-service-linux).

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
{{% show-in "enterprise" %}}export INFLUXDB3_LICENSE_EMAIL=example@email.com
export INFLUXDB3_CLUSTER_ID=cluster0
{{% /show-in %}}export INFLUXDB3_NODE_ID=my-node
export INFLUXDB3_OBJECT_STORE=file
export INFLUXDB3_DATA_DIR=~/.influxdb3
export INFLUXDB3_LOG_FILTER=info

influxdb3 serve
```

### Deprecated environment variable names

Several environment variables were renamed so that each variable matches its
command option.
{{% show-in "enterprise" %}}In addition, Enterprise-specific variables dropped
the `ENTERPRISE_` segment--for example, `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL`
is now `INFLUXDB3_LICENSE_EMAIL`.{{% /show-in %}}
Legacy names remain supported as deprecated aliases; the server logs a
deprecation warning at startup when it detects one.
If both the new and the legacy name are set, the new name takes precedence.
Option tables on this page list deprecated aliases where they exist.

Use the following tables to migrate a deployment configuration--for example,
Helm values or a systemd environment file--in one pass.

#### Renamed options (legacy names aliased)

The following `influxdb3 serve` options and their environment variables were
renamed.
Legacy names remain supported as deprecated aliases.

| Legacy name | New name |
| :---------- | :------- |
| `--disable-parquet-mem-cache`<br>`INFLUXDB3_DISABLE_PARQUET_MEM_CACHE` | `--disable-file-cache`<br>`INFLUXDB3_DISABLE_FILE_CACHE` |
| `--exec-mem-pool-bytes`<br>`INFLUXDB3_EXEC_MEM_POOL_BYTES` | `--exec-mem-pool-size`<br>`INFLUXDB3_EXEC_MEM_POOL_SIZE` |
| `--parquet-mem-cache-query-path-duration`<br>`INFLUXDB3_PARQUET_MEM_CACHE_QUERY_PATH_DURATION` | `--file-cache-recency`<br>`INFLUXDB3_FILE_CACHE_RECENCY` |
| `--parquet-mem-cache-size`<br>`INFLUXDB3_PARQUET_MEM_CACHE_SIZE` | `--file-cache-size`<br>`INFLUXDB3_FILE_CACHE_SIZE` |
| `--query-log-size`<br>`INFLUXDB3_QUERY_LOG_SIZE` | `--query-log-max-entries`<br>`INFLUXDB3_QUERY_LOG_MAX_ENTRIES` |
| `--wal-max-write-buffer-size`<br>`INFLUXDB3_WAL_MAX_WRITE_BUFFER_SIZE` | `--wal-max-buffered-writes`<br>`INFLUXDB3_WAL_MAX_BUFFERED_WRITES` |
| `--wal-snapshot-size`<br>`INFLUXDB3_WAL_SNAPSHOT_SIZE` | `--wal-files-per-snapshot`<br>`INFLUXDB3_WAL_FILES_PER_SNAPSHOT` |
{{% show-in "enterprise" %}}| `--wait-for-running-ingestor`<br>`INFLUXDB3_WAIT_FOR_RUNNING_INGESTOR` | `--wait-for-running-ingester`<br>`INFLUXDB3_WAIT_FOR_RUNNING_INGESTER` |{{% /show-in %}}

#### Renamed environment variables (legacy names aliased)

The following environment variables were renamed to match their command
options; the option names are unchanged.
Legacy names remain supported as deprecated aliases.

| Legacy name | New name |
| :---------- | :------- |
| `INFLUXDB3_DB_DIR` | `INFLUXDB3_DATA_DIR` |
| `INFLUXDB3_NODE_IDENTIFIER_FROM_ENV` | `INFLUXDB3_NODE_ID_FROM_ENV` |
| `INFLUXDB3_NODE_IDENTIFIER_PREFIX` | `INFLUXDB3_NODE_ID` |
| `INFLUXDB3_NUM_WAL_FILES_TO_KEEP` | `INFLUXDB3_SNAPSHOTTED_WAL_FILES_TO_KEEP` |
| `INFLUXDB3_START_WITHOUT_AUTH` | `INFLUXDB3_WITHOUT_AUTH` |
| `INFLUXDB3_TCP_LISTINER_FILE_PATH` | `INFLUXDB3_TCP_LISTENER_FILE_PATH` |
| `INFLUXDB3_TELEMETRY_DISABLE_UPLOAD` | `INFLUXDB3_DISABLE_TELEMETRY_UPLOAD` |

{{% show-in "enterprise" %}}

#### Renamed Enterprise environment variables (legacy names aliased)

Enterprise-specific environment variables dropped the `ENTERPRISE_` segment.
Legacy names remain supported as deprecated aliases.

| Legacy name | New name |
| :---------- | :------- |
| `INFLUXDB3_ENTERPRISE_API_UPLOAD_CHECK_INTERVAL` | `INFLUXDB3_API_UPLOAD_CHECK_INTERVAL` |
| `INFLUXDB3_ENTERPRISE_API_UPLOAD_CONCURRENT_STATUS_READS` | `INFLUXDB3_API_UPLOAD_CONCURRENT_STATUS_READS` |
| `INFLUXDB3_ENTERPRISE_CATALOG_SYNC_INTERVAL` | `INFLUXDB3_CATALOG_SYNC_INTERVAL` |
| `INFLUXDB3_ENTERPRISE_CLUSTER_ID` | `INFLUXDB3_CLUSTER_ID` |
| `INFLUXDB3_ENTERPRISE_COMPACTED_DATA_LOAD_CONCURRENCY_LIMIT` | `INFLUXDB3_COMPACTED_DATA_LOAD_CONCURRENCY_LIMIT` |
| `INFLUXDB3_ENTERPRISE_COMPACTED_DATA_SKIP_FILE_INDEX` | `INFLUXDB3_COMPACTED_DATA_SKIP_FILE_INDEX` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_CHECK_INTERVAL` | `INFLUXDB3_COMPACTION_CHECK_INTERVAL` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_CLEANUP_WAIT` | `INFLUXDB3_COMPACTION_CLEANUP_WAIT` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_GEN2_DURATION` | `INFLUXDB3_COMPACTION_GEN2_DURATION` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_MAX_NUM_FILES_PER_PLAN` | `INFLUXDB3_COMPACTION_MAX_NUM_FILES_PER_PLAN` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_MULTIPLIERS` | `INFLUXDB3_COMPACTION_MULTIPLIERS` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_ROW_LIMIT` | `INFLUXDB3_COMPACTION_ROW_LIMIT` |
| `INFLUXDB3_ENTERPRISE_COMPACTION_SNAPSHOTS_LIMIT` | `INFLUXDB3_COMPACTION_SNAPSHOTS_LIMIT` |
| `INFLUXDB3_ENTERPRISE_CONN_INFO` | `INFLUXDB3_CONN_INFO` |
| `INFLUXDB3_ENTERPRISE_DISTINCT_VALUE_CACHE_DISABLE_FROM_HISTORY` | `INFLUXDB3_DISTINCT_VALUE_CACHE_DISABLE_FROM_HISTORY` |
| `INFLUXDB3_ENTERPRISE_INTERNODE_BIND_ADDR` | `INFLUXDB3_INTERNODE_BIND_ADDR` |
| `INFLUXDB3_ENTERPRISE_INTERNODE_JWT_PRIMARY` | `INFLUXDB3_INTERNODE_JWT_PRIMARY` |
| `INFLUXDB3_ENTERPRISE_INTERNODE_JWT_SECONDARY` | `INFLUXDB3_INTERNODE_JWT_SECONDARY` |
| `INFLUXDB3_ENTERPRISE_INTERNODE_TLS_CA` | `INFLUXDB3_INTERNODE_TLS_CA` |
| `INFLUXDB3_ENTERPRISE_INTERNODE_TLS_CERT` | `INFLUXDB3_INTERNODE_TLS_CERT` |
| `INFLUXDB3_ENTERPRISE_INTERNODE_TLS_KEY` | `INFLUXDB3_INTERNODE_TLS_KEY` |
| `INFLUXDB3_ENTERPRISE_LAST_VALUE_CACHE_DISABLE_FROM_HISTORY` | `INFLUXDB3_LAST_VALUE_CACHE_DISABLE_FROM_HISTORY` |
| `INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` | `INFLUXDB3_LICENSE_EMAIL` |
| `INFLUXDB3_ENTERPRISE_LICENSE_FILE` | `INFLUXDB3_LICENSE_FILE` |
| `INFLUXDB3_ENTERPRISE_LICENSE_TYPE` | `INFLUXDB3_LICENSE_TYPE` |
| `INFLUXDB3_ENTERPRISE_MODE` | `INFLUXDB3_MODE` |
| `INFLUXDB3_ENTERPRISE_NUM_CORES` | `INFLUXDB3_NUM_CORES` |
| `INFLUXDB3_ENTERPRISE_NUM_DATABASE_LIMIT` | `INFLUXDB3_NUM_DATABASE_LIMIT` |
| `INFLUXDB3_ENTERPRISE_NUM_TABLE_LIMIT` | `INFLUXDB3_NUM_TABLE_LIMIT` |
| `INFLUXDB3_ENTERPRISE_NUM_TOTAL_COLUMNS_PER_TABLE_LIMIT` | `INFLUXDB3_NUM_TOTAL_COLUMNS_PER_TABLE_LIMIT` |
| `INFLUXDB3_ENTERPRISE_REPLICATION_INTERVAL` | `INFLUXDB3_REPLICATION_INTERVAL` |
| `INFLUXDB3_ENTERPRISE_USE_PACHA_TREE` | `INFLUXDB3_USE_PACHA_TREE` |
| `INFLUXDB3_ENTERPRISE_WAIT_FOR_RUNNING_COMPACTOR` | `INFLUXDB3_WAIT_FOR_RUNNING_COMPACTOR` |
| `INFLUXDB3_ENTERPRISE_WAIT_FOR_RUNNING_INGESTER` | `INFLUXDB3_WAIT_FOR_RUNNING_INGESTER` |
| `INFLUXDB3_ENTERPRISE_WAIT_FOR_RUNNING_INGESTOR` | `INFLUXDB3_WAIT_FOR_RUNNING_INGESTOR` |

#### Removed pt- option names (no aliases)

Options for the upgraded storage engine (PachaTree) dropped the `pt-`
prefix without backward compatibility: old `--pt-*` flags cause a startup
error, and legacy `INFLUXDB3_PT_*` and `INFLUXDB3_ENTERPRISE_PT_*`
environment variables are ignored (the server logs a warning at startup for
each one that is still set).
For the complete old-to-new name table, see
[Migrate from `--pt-*` option names](/influxdb3/enterprise/performance-preview/configure/#migrate-from-pt-option-names).

{{% /show-in %}}

### Size option values

Options that accept a size value use the following format:

- A bare number is a size in **bytes**--for example, `10485760`.
- Unit suffixes `b`, `kb`, `mb`, `gb`, and `tb` (case-insensitive) are
  accepted--for example, `10mb` or `8GB`.
- Where noted, a percentage of total available memory is accepted--for
  example, `20%`.

> \[!Important]
> #### Bare numbers rejected during megabyte-to-byte transition
>
> [`--exec-mem-pool-size`](#exec-mem-pool-size),
> [`--file-cache-size`](#file-cache-size), and
> [`--force-snapshot-mem-threshold`](#force-snapshot-mem-threshold)
> previously interpreted a bare number as megabytes.
> In this release, these options **reject bare numbers**; a bare number will
> mean bytes in a future release.
> Specify an explicit unit suffix (for example, `100mb`) or a percentage
> (for example, `20%`).

## Global configuration options

The following options apply to the `influxdb3` CLI globally and must be specified **before** any subcommand (for example, `serve`):

### num-io-threads

Sets the number of threads allocated to the IO runtime thread pool. IO threads handle HTTP request serving, line protocol parsing, and file operations.

> \[!Important]
> `--num-io-threads` is a **global option** that must be specified before the `serve` command.

{{% show-in "enterprise" %}}
**Default:** `2` on Parquet-engine clusters; the licensed core count on
clusters running the upgraded storage engine (the default for new clusters).
Values above the licensed core count are capped with a startup warning.
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

{{% show-in "enterprise" %}}

> \[!Note]
> #### Storage engines and option visibility
>
> New {{% product-name %}} clusters default to the upgraded storage engine.
> Clusters that started on 3.10 or earlier keep the Parquet engine until you
> run the storage engine upgrade by restarting the cluster with
> [`--upgrade-pacha-tree`](#upgrade-pacha-tree).
>
> The default `influxdb3 serve --help` output shows a single unified
> storage-engine section.
> Parquet-specific tuning options (for example, `compaction-*`, `gen1-*`,
> `wal-files-per-snapshot`, and the `num-*` limits) no longer appear in the
> default help output but remain functional for clusters that have not run
> the storage engine upgrade.
> Use `influxdb3 serve --help-all` to list every option.

{{% /show-in %}}

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
- [upgrade-pacha-tree](#upgrade-pacha-tree)
  {{% /show-in %}}

{{% show-in "enterprise" %}}

#### cluster-id

Specifies the cluster identifier that prefixes the object store path for the Enterprise Catalog.
This value must be different than the [`--node-id`](#node-id) value.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--cluster-id`         | `INFLUXDB3_CLUSTER_ID` (preferred)<br>`INFLUXDB3_ENTERPRISE_CLUSTER_ID` (deprecated; supported for backward compatibility) |

***

{{% /show-in %}}

#### data-dir

For the `file` object store, defines the location {{< product-name >}} uses to store files locally.
Required when using the `file` [object store](#object-store).

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--data-dir`           | `INFLUXDB3_DATA_DIR` (preferred)<br>`INFLUXDB3_DB_DIR` (deprecated; supported for backward compatibility) |

***

{{% show-in "enterprise" %}}

#### mode

Sets the mode to start the server in, allowing you to create specialized nodes in a distributed cluster.

This option supports the following values:

- `all` *(default)*: Enables all server modes
- `ingest`: Enables only data ingest capabilities
- `query`: Enables only query capabilities
- `compact`: Enables only compaction processes
- `process`: Activates the [Processing Engine](/influxdb3/enterprise/reference/processing-engine/) so the node can execute trigger plugins. `process` has no API surface of its own — it doesn't accept writes or serve queries. Setting [`--plugin-dir`](#plugin-dir) implicitly adds `process` mode regardless of `--mode`. Conversely, `--mode=process` requires `--plugin-dir`. In a multi-node cluster, combine `process` with another mode (typically `query`) so plugins can call `influxdb3_local.query()` locally.

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

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--mode`               | `INFLUXDB3_MODE` (preferred)<br>`INFLUXDB3_ENTERPRISE_MODE` (deprecated; supported for backward compatibility) |

***

{{% /show-in %}}

#### node-id

Specifies the node identifier used as a prefix in all object store file paths.
This should be unique for any hosts sharing the same object store
configuration--for example, the same bucket.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--node-id`            | `INFLUXDB3_NODE_ID` (preferred)<br>`INFLUXDB3_NODE_IDENTIFIER_PREFIX` (deprecated; supported for backward compatibility) |

***

{{% show-in "enterprise" %}}

#### node-id-from-env

Specifies the node identifier used as a prefix in all object store file paths.
Takes the name of an environment variable as an argument and uses the value of that environment variable as the node identifier.
This option cannot be used with the `--node-id` option.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--node-id-from-env`   | `INFLUXDB3_NODE_ID_FROM_ENV` (preferred)<br>`INFLUXDB3_NODE_IDENTIFIER_FROM_ENV` (deprecated; supported for backward compatibility) |

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

#### upgrade-pacha-tree {#upgrade-pacha-tree}

<span id="use-pacha-tree"></span>

Migrates the cluster's existing Parquet data to the upgraded storage engine.

New clusters default to the upgraded storage engine.
Clusters that started on 3.10 or earlier keep the Parquet engine until you run
the storage engine upgrade by restarting the cluster with
`--upgrade-pacha-tree`.
New clusters do not need this flag.
For the upgrade procedure, see
[Upgrade from Parquet](/influxdb3/enterprise/performance-preview/#upgrade-from-parquet).

**Default:** `false`

> \[!Note]
> `--use-pacha-tree` (environment variable `INFLUXDB3_USE_PACHA_TREE`; legacy
> `INFLUXDB3_ENTERPRISE_USE_PACHA_TREE`) is deprecated.
> It is still accepted and keeps its previous behavior--on an existing Parquet
> cluster it starts the same migration as `--upgrade-pacha-tree`--but the
> server logs a deprecation warning at startup.

| influxdb3 serve option | Environment variable |
| :--------------------- | :------------------- |
| `--upgrade-pacha-tree` | `INFLUXDB3_UPGRADE_PACHA_TREE` |

***

{{% /show-in %}}

{{% show-in "enterprise" %}}

### Licensing

#### license-email

Specifies the email address to associate with your {{< product-name >}} license
and automatically responds to the interactive email prompt when the server starts.
This option is mutually exclusive with [license-file](#license-file).

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--license-email`      | `INFLUXDB3_LICENSE_EMAIL` (preferred)<br>`INFLUXDB3_ENTERPRISE_LICENSE_EMAIL` (deprecated; supported for backward compatibility) |

***

#### license-file

Specifies the path to a license file for {{< product-name >}}. When provided, the license
file's contents are used instead of requesting a new license.
This option is mutually exclusive with [license-email](#license-email).

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--license-file`       | `INFLUXDB3_LICENSE_FILE` (preferred)<br>`INFLUXDB3_ENTERPRISE_LICENSE_FILE` (deprecated; supported for backward compatibility) |

***

#### license-type

Specifies the type of {{% product-name %}} license to use and bypasses the
interactive license prompt. Provide one of the following license types:

- `home`
- `trial`
- `commercial`

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--license-type`       | `INFLUXDB3_LICENSE_TYPE` (preferred)<br>`INFLUXDB3_ENTERPRISE_LICENSE_TYPE` (deprecated; supported for backward compatibility) |

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
  {{% show-in "enterprise" %}}- [permission-tokens-file](#permission-tokens-file)
- [without-user-auth](#without-user-auth)
- [jwt-key-id](#jwt-key-id)
- [jwt-private-key](#jwt-private-key)
- [jwt-issuer](#jwt-issuer)
- [jwt-default-ttl-seconds](#jwt-default-ttl-seconds)
- [oauth-issuer](#oauth-issuer)
- [oauth-audience](#oauth-audience)
- [oauth-client-id](#oauth-client-id)
- [oauth-scopes](#oauth-scopes)
- [rbac-authoring-disabled](#rbac-authoring-disabled){{% /show-in %}}

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

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--without-auth`       | `INFLUXDB3_WITHOUT_AUTH` (preferred)<br>`INFLUXDB3_START_WITHOUT_AUTH` (deprecated; supported for backward compatibility) |

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

#### without-user-auth

Disables user authentication.
Set to `false` to enable multi-user authentication, where users authenticate
with a username and password to receive a JWT.

> [!Note]
> #### User authentication is a preview feature
>
> Multi-user authentication is available as a preview in {{% product-name %}}
> 3.10 and is **off by default**. Existing `apiv3_` token workflows are
> unaffected.

**Default:** `true`

| influxdb3 serve option | Environment variable          |
| :--------------------- | :---------------------------- |
| `--without-user-auth`  | `INFLUXDB3_WITHOUT_USER_AUTH` |

***

#### jwt-key-id

RSA key ID used for signing JWTs for user authentication.
Required together with [jwt-private-key](#jwt-private-key) to enable JWT authentication.

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--jwt-key-id`         | `INFLUXDB3_JWT_KEY_ID` |

***

#### jwt-private-key

RSA private key (PEM) used for signing JWTs for user authentication.
Required together with [jwt-key-id](#jwt-key-id) to enable JWT authentication.

| influxdb3 serve option | Environment variable        |
| :--------------------- | :-------------------------- |
| `--jwt-private-key`    | `INFLUXDB3_JWT_PRIVATE_KEY` |

***

#### jwt-issuer

Issuer claim for user authentication JWTs.

**Default:** `influxdb3-enterprise`

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--jwt-issuer`         | `INFLUXDB3_JWT_ISSUER` |

***

#### jwt-default-ttl-seconds

Default TTL (in seconds) for user authentication JWTs.

| influxdb3 serve option      | Environment variable                |
| :-------------------------- | :---------------------------------- |
| `--jwt-default-ttl-seconds` | `INFLUXDB3_JWT_DEFAULT_TTL_SECONDS` |

***

#### oauth-issuer

OAuth issuer URL for validating OAuth tokens.
Required together with [oauth-audience](#oauth-audience) to enable OAuth authentication.

| influxdb3 serve option | Environment variable    |
| :--------------------- | :---------------------- |
| `--oauth-issuer`       | `INFLUXDB3_OAUTH_ISSUER` |

***

#### oauth-audience

OAuth audience for validating OAuth tokens.
Required together with [oauth-issuer](#oauth-issuer) to enable OAuth authentication.

| influxdb3 serve option | Environment variable      |
| :--------------------- | :------------------------ |
| `--oauth-audience`     | `INFLUXDB3_OAUTH_AUDIENCE` |

***

#### oauth-client-id

OAuth client ID for the device-code login flow.
Required to enable `influxdb3 auth login --oauth`.

| influxdb3 serve option | Environment variable       |
| :--------------------- | :------------------------- |
| `--oauth-client-id`    | `INFLUXDB3_OAUTH_CLIENT_ID` |

***

#### oauth-scopes

OAuth scopes to request during device-code login (comma-separated).

**Default:** `openid,offline_access`

| influxdb3 serve option | Environment variable    |
| :--------------------- | :---------------------- |
| `--oauth-scopes`       | `INFLUXDB3_OAUTH_SCOPES` |

***

#### rbac-authoring-disabled

Disables RBAC authoring (creating or modifying custom roles).
Accepts `true` or `false`.

<!-- TODO: Confirm the environment variable name and default value.
This flag is recognized by the server but is not listed in
`influxdb3 serve --help-all` (verified against 3.10.0-0.rc.2). -->

| influxdb3 serve option      | Environment variable |
| :-------------------------- | :------------------- |
| `--rbac-authoring-disabled` |                      |

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
- [object-store-request-timeout](#object-store-request-timeout)
- [object-store-max-retries](#object-store-max-retries)
- [object-store-retry-timeout](#object-store-retry-timeout)
- [object-store-cache-endpoint](#object-store-cache-endpoint)
- [object-store-tls-allow-insecure](#object-store-tls-allow-insecure)
- [object-store-tls-ca](#object-store-tls-ca)

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

| influxdb3 serve option            | Environment variables            |
| :-------------------------------- | :------------------------------ |
| `--object-store-connection-limit` | `INFLUXDB3_OBJECT_STORE_CONNECTION_LIMIT` (preferred)<br>`OBJECT_STORE_CONNECTION_LIMIT` (deprecated; supported for backward compatibility) |

***

#### object-store-http2-only

Forces HTTP/2 connections to network-based object stores.

| influxdb3 serve option      | Environment variables      |
| :-------------------------- | :------------------------ |
| `--object-store-http2-only` | `INFLUXDB3_OBJECT_STORE_HTTP2_ONLY` (preferred)<br>`OBJECT_STORE_HTTP2_ONLY` (deprecated; supported for backward compatibility) |

***

#### object-store-http2-max-frame-size

Sets the maximum frame size (in bytes/octets) for HTTP/2 connections.

| influxdb3 serve option                | Environment variables                |
| :------------------------------------ | :---------------------------------- |
| `--object-store-http2-max-frame-size` | `INFLUXDB3_OBJECT_STORE_HTTP2_MAX_FRAME_SIZE` (preferred)<br>`OBJECT_STORE_HTTP2_MAX_FRAME_SIZE` (deprecated; supported for backward compatibility) |

***

#### object-store-request-timeout

Sets the HTTP request timeout for object store requests.

**Default:** `30s`

| influxdb3 serve option           | Environment variables           |
| :------------------------------- | :----------------------------- |
| `--object-store-request-timeout` | `INFLUXDB3_OBJECT_STORE_REQUEST_TIMEOUT` (preferred)<br>`OBJECT_STORE_REQUEST_TIMEOUT` (deprecated; supported for backward compatibility) |

***

#### object-store-max-retries

Defines the maximum number of times to retry a request.

| influxdb3 serve option       | Environment variables       |
| :--------------------------- | :------------------------- |
| `--object-store-max-retries` | `INFLUXDB3_OBJECT_STORE_MAX_RETRIES` (preferred)<br>`OBJECT_STORE_MAX_RETRIES` (deprecated; supported for backward compatibility) |

***

#### object-store-retry-timeout

Specifies the maximum length of time from the initial request after which no
further retries are be attempted.

| influxdb3 serve option         | Environment variables         |
| :----------------------------- | :--------------------------- |
| `--object-store-retry-timeout` | `INFLUXDB3_OBJECT_STORE_RETRY_TIMEOUT` (preferred)<br>`OBJECT_STORE_RETRY_TIMEOUT` (deprecated; supported for backward compatibility) |

***

#### object-store-cache-endpoint

Sets the endpoint of an S3-compatible, HTTP/2-enabled object store cache.

| influxdb3 serve option          | Environment variables          |
| :------------------------------ | :---------------------------- |
| `--object-store-cache-endpoint` | `INFLUXDB3_OBJECT_STORE_CACHE_ENDPOINT` (preferred)<br>`OBJECT_STORE_CACHE_ENDPOINT` (deprecated; supported for backward compatibility) |

***

#### object-store-tls-allow-insecure

Allows invalid TLS certificates when connecting to object storage.

{{% warn %}}
This disables TLS certificate verification and should only be used for testing.
{{% /warn %}}

| influxdb3 serve option              | Environment variables              |
| :---------------------------------- | :-------------------------------- |
| `--object-store-tls-allow-insecure` | `INFLUXDB3_OBJECT_STORE_TLS_ALLOW_INSECURE` (preferred)<br>`OBJECT_STORE_TLS_ALLOW_INSECURE` (deprecated; supported for backward compatibility) |

***

#### object-store-tls-ca

Specifies the path to a custom CA certificate file (PEM format) for verifying
object store connections. Use this when your object store uses a certificate
signed by a private CA.

| influxdb3 serve option  | Environment variables  |
| :---------------------- | :-------------------- |
| `--object-store-tls-ca` | `INFLUXDB3_OBJECT_STORE_TLS_CA` (preferred)<br>`OBJECT_STORE_TLS_CA` (deprecated; supported for backward compatibility) |

***

### Logs

- [log-filter](#log-filter)
- [log-destination](#log-destination)
- [log-format](#log-format)
- [query-log-max-entries](#query-log-max-entries)

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
influxdb3 serve --log-filter info,influxdb3_enterprise=debug
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

{{% show-in "enterprise" %}}
| Component              | Description                  |
| :---------------------- | :---------------------------- |
| `influxdb3_enterprise` | Enterprise-specific features |
{{% /show-in %}}

> [!Note]
> Targeted filtering requires knowledge of the codebase component names.
> The component names correspond to Rust package names in the InfluxDB 3 source
> code. Use `debug` or `trace` sparingly on specific components to avoid
> excessive log output.

| influxdb3 serve option | Environment variables |
| :--------------------- | :------------------- |
| `--log-filter`         | `INFLUXDB3_LOG_FILTER` (preferred)<br>`LOG_FILTER` (deprecated; supported for backward compatibility) |

***

#### log-destination

Specifies the destination for logs.

This option supports the following values:

- `stdout` *(default)*
- `stderr`

**Default:** `stdout`

| influxdb3 serve option | Environment variables |
| :--------------------- | :------------------- |
| `--log-destination`    | `INFLUXDB3_LOG_DESTINATION` (preferred)<br>`LOG_DESTINATION` (deprecated; supported for backward compatibility) |

***

#### log-format

Defines the message format for logs.

This option supports the following values:

- `full` *(default)*

**Default:** `full`

| influxdb3 serve option | Environment variables |
| :--------------------- | :------------------- |
| `--log-format`         | `INFLUXDB3_LOG_FORMAT` (preferred)<br>`LOG_FORMAT` (deprecated; supported for backward compatibility) |

***

#### query-log-max-entries

Defines the maximum number of entries in the query log. Up to this many
queries remain in the log before older queries are evicted to make room for
new ones.

**Default:** `1000`

> \[!Note]
> `--query-log-max-entries` was previously named `--query-log-size`.
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option    | Environment variables |
| :------------------------ | :-------------------- |
| `--query-log-max-entries`<br>`--query-log-size` (deprecated alias) | `INFLUXDB3_QUERY_LOG_MAX_ENTRIES` (preferred)<br>`INFLUXDB3_QUERY_LOG_SIZE` (deprecated; supported for backward compatibility) |

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

| influxdb3 serve option | Environment variables |
| :--------------------- | :------------------- |
| `--traces-exporter`    | `INFLUXDB3_TRACES_EXPORTER` (preferred)<br>`TRACES_EXPORTER` (deprecated; supported for backward compatibility) |

***

#### traces-exporter-jaeger-agent-host

Specifies the Jaeger agent network hostname for tracing.

**Default:** `0.0.0.0`

| influxdb3 serve option                | Environment variables                |
| :------------------------------------ | :---------------------------------- |
| `--traces-exporter-jaeger-agent-host` | `INFLUXDB3_TRACES_EXPORTER_JAEGER_AGENT_HOST` (preferred)<br>`TRACES_EXPORTER_JAEGER_AGENT_HOST` (deprecated; supported for backward compatibility) |

***

#### traces-exporter-jaeger-agent-port

Defines the Jaeger agent network port for tracing.

**Default:** `6831`

| influxdb3 serve option                | Environment variables                |
| :------------------------------------ | :---------------------------------- |
| `--traces-exporter-jaeger-agent-port` | `INFLUXDB3_TRACES_EXPORTER_JAEGER_AGENT_PORT` (preferred)<br>`TRACES_EXPORTER_JAEGER_AGENT_PORT` (deprecated; supported for backward compatibility) |

***

#### traces-exporter-jaeger-service-name

Sets the Jaeger service name for tracing.

**Default:** `iox-conductor`

| influxdb3 serve option                  | Environment variables                  |
| :-------------------------------------- | :------------------------------------ |
| `--traces-exporter-jaeger-service-name` | `INFLUXDB3_TRACES_EXPORTER_JAEGER_SERVICE_NAME` (preferred)<br>`TRACES_EXPORTER_JAEGER_SERVICE_NAME` (deprecated; supported for backward compatibility) |

***

#### traces-exporter-jaeger-trace-context-header-name

Specifies the header name used for passing trace context.

**Default:** `uber-trace-id`

| influxdb3 serve option                               | Environment variables                               |
| :--------------------------------------------------- | :------------------------------------------------- |
| `--traces-exporter-jaeger-trace-context-header-name` | `INFLUXDB3_TRACES_EXPORTER_JAEGER_TRACE_CONTEXT_HEADER_NAME` (preferred)<br>`TRACES_EXPORTER_JAEGER_TRACE_CONTEXT_HEADER_NAME` (deprecated; supported for backward compatibility) |

***

#### traces-jaeger-debug-name

Specifies the header name used for force sampling in tracing.

**Default:** `jaeger-debug-id`

| influxdb3 serve option       | Environment variables                |
| :--------------------------- | :---------------------------------- |
| `--traces-jaeger-debug-name` | `INFLUXDB3_TRACES_EXPORTER_JAEGER_DEBUG_NAME` (preferred)<br>`TRACES_EXPORTER_JAEGER_DEBUG_NAME` (deprecated; supported for backward compatibility) |

***

#### traces-jaeger-tags

Defines a set of `key=value` pairs to annotate tracing spans with.

| influxdb3 serve option | Environment variables          |
| :--------------------- | :---------------------------- |
| `--traces-jaeger-tags` | `INFLUXDB3_TRACES_EXPORTER_JAEGER_TAGS` (preferred)<br>`TRACES_EXPORTER_JAEGER_TAGS` (deprecated; supported for backward compatibility) |

***

#### traces-jaeger-max-msgs-per-second

Specifies the maximum number of messages sent to a Jaeger service per second.

**Default:** `1000`

| influxdb3 serve option                | Environment variables                |
| :------------------------------------ | :---------------------------------- |
| `--traces-jaeger-max-msgs-per-second` | `INFLUXDB3_TRACES_JAEGER_MAX_MSGS_PER_SECOND` (preferred)<br>`TRACES_JAEGER_MAX_MSGS_PER_SECOND` (deprecated; supported for backward compatibility) |

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
A bare number is a size in bytes; unit suffixes (`b`, `kb`, `mb`, `gb`, `tb`)
are also accepted--for example, `10mb`.

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

- [exec-mem-pool-size](#exec-mem-pool-size)
- [force-snapshot-mem-threshold](#force-snapshot-mem-threshold)

#### exec-mem-pool-size

Specifies the size of the memory pool used for query processing and data operations.
This memory pool is used when {{% product-name %}} processes queries and performs
internal data management tasks.
Provide a value with a unit suffix or as a percentage of the total available
memory--for example: `8gb` or `10%`.
Bare numbers are rejected during the
[megabyte-to-byte transition](#size-option-values).

**Default:** `20%`

> \[!Note]
> `--exec-mem-pool-size` was previously named `--exec-mem-pool-bytes`.
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--exec-mem-pool-size`<br>`--exec-mem-pool-bytes` (deprecated alias) | `INFLUXDB3_EXEC_MEM_POOL_SIZE` (preferred)<br>`INFLUXDB3_EXEC_MEM_POOL_BYTES` (deprecated; supported for backward compatibility) |

***

#### force-snapshot-mem-threshold

Specifies the threshold for the internal memory buffer. Supports either a
percentage (portion of available memory) or a value with a unit suffix--for
example: `70%` or `1000mb`.
Bare numbers are rejected during the
[megabyte-to-byte transition](#size-option-values).

**Default:** `50%`

| influxdb3 serve option           | Environment variable                     |
| :------------------------------- | :--------------------------------------- |
| `--force-snapshot-mem-threshold` | `INFLUXDB3_FORCE_SNAPSHOT_MEM_THRESHOLD` |

***

### Write-Ahead Log (WAL)

- [checkpoint-interval](#checkpoint-interval)
- [wal-flush-interval](#wal-flush-interval)
- [wal-files-per-snapshot](#wal-files-per-snapshot)
- [wal-max-buffered-writes](#wal-max-buffered-writes)
- [snapshotted-wal-files-to-keep](#snapshotted-wal-files-to-keep)
- [wal-replay-fail-on-error](#wal-replay-fail-on-error)
- [wal-replay-concurrency-limit](#wal-replay-concurrency-limit)

{{% show-in "enterprise" %}}

> \[!Note]
> `wal-files-per-snapshot`, `wal-max-buffered-writes`, and
> `snapshotted-wal-files-to-keep` apply to the Parquet engine only
> (clusters that started on 3.10 or earlier that have not run the
> [storage engine upgrade](#upgrade-pacha-tree)).
> `wal-flush-interval` applies to both engines.

{{% /show-in %}}

#### checkpoint-interval {#checkpoint-interval metadata="v3.8.2+"}

Sets the interval for consolidating
[snapshots](/influxdb3/version/admin/backup-restore/#file-structure) into
monthly checkpoints for faster server startup.
Snapshots accumulate in object storage over time and are not automatically deleted.

Without checkpointing, the server loads individual snapshots on startup.
The number of snapshots is determined by the lookback window
([`gen1-lookback-duration`](#gen1-lookback-duration), default 1 month)
divided by [`gen1-duration`](#gen1-duration) (default 10 minutes),
with a minimum of 100.
With default settings, that can be up to ~4,320 snapshots.

With checkpointing enabled, the server periodically consolidates snapshot
metadata into checkpoints in object storage.
On startup, the server loads one to two checkpoints per calendar month,
then loads only snapshots created since the last checkpoint.
Enabling checkpointing does not delete old snapshots.

Up to 10 checkpoints load concurrently during startup.
The server retains two checkpoints per calendar month and handles month rollovers automatically.

Accepts a [duration](/influxdb3/version/reference/glossary/#duration) value--for example: `1h`, `30m`, `10m`.

**Default:** _Not set (disabled)_

| influxdb3 serve option  | Environment variable            |
| :---------------------- | :------------------------------ |
| `--checkpoint-interval` | `INFLUXDB3_CHECKPOINT_INTERVAL` |

##### Example

<!-- pytest.mark.skip -->
```bash
influxdb3 serve --checkpoint-interval 1h
```

***

#### wal-flush-interval

Specifies the interval to flush buffered data to a WAL file. Writes that wait
for WAL confirmation take up to this interval to complete.
Use `s` for seconds or `ms` for milliseconds. For local disks, `100 ms` is recommended.

**Default:** `1s`

| influxdb3 serve option | Environment variable           |
| :--------------------- | :----------------------------- |
| `--wal-flush-interval` | `INFLUXDB3_WAL_FLUSH_INTERVAL` |

***

#### wal-files-per-snapshot

Defines the number of WAL files to attempt to remove in a snapshot. This,
multiplied by the interval, determines how often snapshots are taken.

**Default:** `600`

> \[!Note]
> `--wal-files-per-snapshot` was previously named `--wal-snapshot-size`.
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option    | Environment variables |
| :------------------------ | :-------------------- |
| `--wal-files-per-snapshot`<br>`--wal-snapshot-size` (deprecated alias) | `INFLUXDB3_WAL_FILES_PER_SNAPSHOT` (preferred)<br>`INFLUXDB3_WAL_SNAPSHOT_SIZE` (deprecated; supported for backward compatibility) |

***

#### wal-max-buffered-writes

Specifies the maximum number of write requests that can be buffered before a
flush must be executed and succeed.

**Default:** `100000`

> \[!Note]
> `--wal-max-buffered-writes` was previously named
> `--wal-max-write-buffer-size`.
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option    | Environment variables |
| :------------------------ | :-------------------- |
| `--wal-max-buffered-writes`<br>`--wal-max-write-buffer-size` (deprecated alias) | `INFLUXDB3_WAL_MAX_BUFFERED_WRITES` (preferred)<br>`INFLUXDB3_WAL_MAX_WRITE_BUFFER_SIZE` (deprecated; supported for backward compatibility) |

***

#### snapshotted-wal-files-to-keep

Specifies the number of snapshotted WAL files to retain in the object store.
Flushing the WAL files does not clear the WAL files immediately;
they are deleted when the number of snapshotted WAL files exceeds this number.

**Default:** `300`

| influxdb3 serve option            | Environment variables |
| :-------------------------------- | :-------------------- |
| `--snapshotted-wal-files-to-keep` | `INFLUXDB3_SNAPSHOTTED_WAL_FILES_TO_KEEP` (preferred)<br>`INFLUXDB3_NUM_WAL_FILES_TO_KEEP` (deprecated; supported for backward compatibility) |

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

> \[!Note]
> The `compaction-*` and `gen1-*` options apply to the Parquet engine only
> (clusters that started on 3.10 or earlier that have not run the
> [storage engine upgrade](#upgrade-pacha-tree)).
> For the upgraded storage engine's compaction options, see the
> [storage engine configuration reference](/influxdb3/enterprise/performance-preview/configure/).

- [compaction-row-limit](#compaction-row-limit)
- [compaction-max-num-files-per-plan](#compaction-max-num-files-per-plan)
- [compaction-gen2-duration](#compaction-gen2-duration)
- [compaction-multipliers](#compaction-multipliers)
- [compaction-cleanup-wait](#compaction-cleanup-wait)
- [compaction-check-interval](#compaction-check-interval)
- [compacted-data-load-concurrency-limit](#compacted-data-load-concurrency-limit)
- [compacted-data-skip-file-index](#compacted-data-skip-file-index)
  {{% /show-in %}}
- [gen1-duration](#gen1-duration)

{{% show-in "enterprise" %}}

#### compaction-row-limit

Specifies the soft limit for the number of rows per file that the compactor
writes.
The compactor may write more rows than this limit.

**Default:** `1000000`

| influxdb3 serve option   | Environment variable                        |
| :----------------------- | :------------------------------------------ |
| `--compaction-row-limit` | `INFLUXDB3_COMPACTION_ROW_LIMIT` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTION_ROW_LIMIT` (deprecated; supported for backward compatibility) |

***

#### compaction-max-num-files-per-plan

Sets the maximum number of files included in any compaction plan.

**Default:** `500`

| influxdb3 serve option                | Environment variable                                     |
| :------------------------------------ | :------------------------------------------------------- |
| `--compaction-max-num-files-per-plan` | `INFLUXDB3_COMPACTION_MAX_NUM_FILES_PER_PLAN` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTION_MAX_NUM_FILES_PER_PLAN` (deprecated; supported for backward compatibility) |

***

#### compaction-gen2-duration

Specifies the duration of the first level of compaction (gen2). Later levels of
compaction are multiples of this duration. This value should be equal to or
greater than the gen1 duration.

**Default:** `20m`

| influxdb3 serve option       | Environment variable                            |
| :--------------------------- | :---------------------------------------------- |
| `--compaction-gen2-duration` | `INFLUXDB3_COMPACTION_GEN2_DURATION` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTION_GEN2_DURATION` (deprecated; supported for backward compatibility) |

***

#### compaction-multipliers

Specifies a comma-separated list of multiples defining the duration of each
level of compaction. The number of elements in the list determines the number of
compaction levels. The first element specifies the duration of the first level
(gen3); subsequent levels are multiples of the previous level.

**Default:** `3,4,6,5`

| influxdb3 serve option     | Environment variable                          |
| :------------------------- | :-------------------------------------------- |
| `--compaction-multipliers` | `INFLUXDB3_COMPACTION_MULTIPLIERS` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTION_MULTIPLIERS` (deprecated; supported for backward compatibility) |

***

#### compaction-cleanup-wait

Specifies the amount of time that the compactor waits after finishing a compaction run
to delete files marked as needing deletion during that compaction run.

**Default:** `10m`

| influxdb3 serve option      | Environment variable                           |
| :-------------------------- | :--------------------------------------------- |
| `--compaction-cleanup-wait` | `INFLUXDB3_COMPACTION_CLEANUP_WAIT` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTION_CLEANUP_WAIT` (deprecated; supported for backward compatibility) |

***

#### compaction-check-interval

Specifies how often the compactor checks for new compaction work to perform.

**Default:** `10s`

| influxdb3 serve option        | Environment variable                             |
| :---------------------------- | :----------------------------------------------- |
| `--compaction-check-interval` | `INFLUXDB3_COMPACTION_CHECK_INTERVAL` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTION_CHECK_INTERVAL` (deprecated; supported for backward compatibility) |

***

#### compacted-data-load-concurrency-limit

Specifies the maximum number of concurrent object store fetches while a node
loads compacted data (compaction detail and generation detail files), both at
startup and when a consumer picks up new compaction summaries.

The default bounds the transient memory used by in-flight downloads and is
sized so the load saturates neither a 10 GbE network interface nor the shared
object store connection pool (see
[object-store-connection-limit](#object-store-connection-limit)).
Increase the limit for faster startup when the compaction index is large and
the host has network headroom; decrease it if the object store throttles the
load or memory is tight during startup.

This option isn't supported in the TOML configuration file; use the command
option or environment variable.

**Default:** `20`

| influxdb3 serve option                    | Environment variable                                         |
| :---------------------------------------- | :----------------------------------------------------------- |
| `--compacted-data-load-concurrency-limit` | `INFLUXDB3_COMPACTED_DATA_LOAD_CONCURRENCY_LIMIT` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTED_DATA_LOAD_CONCURRENCY_LIMIT` (deprecated; supported for backward compatibility) |

***

#### compacted-data-skip-file-index

Loads compacted data without building the in-memory file index.

Use this option when the file index has grown too large to fit in host memory
and the node can't start. Without the index, queries can't prune to a subset of
files and instead scan all files in the matching time range, so queries are
correct but slower. Pruning generations by time range is unaffected.

The setting applies to the node as a whole: a node started with this option also
skips index merges for newly compacted generations, and continues to persist
full indexes to the object store for other nodes to use.

This option isn't supported in the TOML configuration file; use the command
option or environment variable.

**Default:** `false`

| influxdb3 serve option             | Environment variable                                   |
| :--------------------------------- | :----------------------------------------------------- |
| `--compacted-data-skip-file-index` | `INFLUXDB3_COMPACTED_DATA_SKIP_FILE_INDEX` (preferred)<br>`INFLUXDB3_ENTERPRISE_COMPACTED_DATA_SKIP_FILE_INDEX` (deprecated; supported for backward compatibility) |

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
- [file-cache-size](#file-cache-size)
- [parquet-mem-cache-prune-percentage](#parquet-mem-cache-prune-percentage)
- [parquet-mem-cache-prune-interval](#parquet-mem-cache-prune-interval)
- [file-cache-recency](#file-cache-recency)
- [disable-file-cache](#disable-file-cache)
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

#### file-cache-size

Specifies the size of the in-memory data file cache.
Provide a value with a unit suffix or as a percentage of total available
memory--for example, `4gb` or `20%`.
Bare numbers are rejected during the
[megabyte-to-byte transition](#size-option-values).

This is a total budget.
{{% show-in "enterprise" %}}
With the Parquet engine, the budget is used entirely by the in-memory Parquet
cache.
During the storage engine upgrade with hybrid query enabled, the budget
is split 50/50 between the hybrid-query Parquet cache and the upgraded
engine's file cache; otherwise, the single active cache receives the full
budget.
{{% /show-in %}}

**Default:** `20%`

> \[!Note]
> `--file-cache-size` was previously named `--parquet-mem-cache-size`.
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--file-cache-size`<br>`--parquet-mem-cache-size` (deprecated alias) | `INFLUXDB3_FILE_CACHE_SIZE` (preferred)<br>`INFLUXDB3_PARQUET_MEM_CACHE_SIZE` (deprecated; supported for backward compatibility) |

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

#### file-cache-recency

{{% show-in "enterprise" %}}
A [duration](/influxdb3/enterprise/reference/glossary/#duration) that specifies
{{% /show-in %}}{{% show-in "core" %}}
Specifies
{{% /show-in %}}
the time window for caching recent data files in memory.

{{% show-in "core" %}}**Default:** `5h`{{% /show-in %}}
{{% show-in "enterprise" %}}**Default:** `3d`{{% /show-in %}}

Only files containing data with a timestamp between `now` and `now - duration`
are cached when accessed during queries--for example, with a `5h` setting:

- Current time: `2024-06-10 15:00:00`
- Cache window: Last 5 hours (`2024-06-10 10:00:00` to now)

If a query requests data from `2024-06-09` (old) and `2024-06-10 14:00` (recent):

- **Cached**: data files with data from `2024-06-10 14:00` (within 5-hour window)
- **Not cached**: data files with data from `2024-06-09` (outside 5-hour window)

> \[!Note]
> `--file-cache-recency` was previously named
> `--parquet-mem-cache-query-path-duration`.
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--file-cache-recency`<br>`--parquet-mem-cache-query-path-duration` (deprecated alias) | `INFLUXDB3_FILE_CACHE_RECENCY` (preferred)<br>`INFLUXDB3_PARQUET_MEM_CACHE_QUERY_PATH_DURATION` (deprecated; supported for backward compatibility) |

***

#### disable-file-cache {#disable-file-cache}

<span id="disable-data-file-cache"></span>

Disables the in-memory data file cache. By default, the cache is enabled.
{{% show-in "enterprise" %}}
This disables data file caching in both the Parquet and upgraded storage
engines.
{{% /show-in %}}

> \[!Note]
> `--disable-file-cache` was previously named `--disable-parquet-mem-cache`.
> The legacy option and environment variable names (including
> `disable-data-file-cache`) are deprecated aliases.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--disable-file-cache`<br>`--disable-parquet-mem-cache` (deprecated alias)<br>`--disable-data-file-cache` (deprecated alias) | `INFLUXDB3_DISABLE_FILE_CACHE` (preferred)<br>`INFLUXDB3_DISABLE_PARQUET_MEM_CACHE`, `INFLUXDB3_DISABLE_DATA_FILE_CACHE` (deprecated; supported for backward compatibility) |

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
| `--last-value-cache-disable-from-history` | `INFLUXDB3_LAST_VALUE_CACHE_DISABLE_FROM_HISTORY` (preferred)<br>`INFLUXDB3_ENTERPRISE_LAST_VALUE_CACHE_DISABLE_FROM_HISTORY` (deprecated; supported for backward compatibility) |

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
| `--distinct-value-cache-disable-from-history` | `INFLUXDB3_DISTINCT_VALUE_CACHE_DISABLE_FROM_HISTORY` (preferred)<br>`INFLUXDB3_ENTERPRISE_DISTINCT_VALUE_CACHE_DISABLE_FROM_HISTORY` (deprecated; supported for backward compatibility) |

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
- [restrict-plugin-triggers-to](#restrict-plugin-triggers-to)
  {{% show-in "enterprise" %}}- [plugin-dir-only](#plugin-dir-only){{% /show-in %}}

#### plugin-dir

Specifies the local directory that contains Python plugins and their test files.

| influxdb3 serve option | Environment variable   |
| :--------------------- | :--------------------- |
| `--plugin-dir`         | `INFLUXDB3_PLUGIN_DIR` |

##### Default behavior by deployment type

| Deployment | Default state | Configuration |
|:-----------|:--------------|:--------------|
| Docker images | **Enabled** | `INFLUXDB3_PLUGIN_DIR=/plugins` |
| DEB/RPM packages | **Enabled** | `plugin-dir="/var/lib/influxdb3/plugins"` |
| Binary/source | Disabled | No `plugin-dir` configured |

##### Disable the Processing Engine

To disable the Processing Engine, ensure `plugin-dir` is not configured.

> [!Warning]
> Setting `plugin-dir=""` or `INFLUXDB3_PLUGIN_DIR=""` (empty string) does **not** disable the Processing Engine.
> You must comment out, remove, or unset the configuration — not set it to empty.

{{% show-in "enterprise" %}}
**Docker:** Use `INFLUXDB3_UNSET_VARS` to unset default environment variables that are preconfigured in the container image.

`INFLUXDB3_UNSET_VARS` accepts a comma-separated list of environment variable names to unset in the container entrypoint before {{< product-name >}} starts.
This lets you disable or override image defaults (for example, `INFLUXDB3_PLUGIN_DIR`, logging, or other configuration variables) without modifying the container image itself.

To disable the default plugin directory, unset `INFLUXDB3_PLUGIN_DIR`:
```bash
docker run -e INFLUXDB3_UNSET_VARS="INFLUXDB3_PLUGIN_DIR" influxdb:3-enterprise
```
{{% /show-in %}}

{{% show-in "core" %}}
**Docker:** Use a custom entrypoint:

```bash
docker run --entrypoint /bin/sh influxdb:3-core -c 'unset INFLUXDB3_PLUGIN_DIR && exec influxdb3 serve --object-store memory'
```
{{% /show-in %}}

**systemd (DEB/RPM):** Comment out or remove `plugin-dir` in the configuration file:

```bash
sudo nano /etc/influxdb3/influxdb3-{{< product-key >}}.conf
```

```toml
# plugin-dir="/var/lib/influxdb3/plugins"
```

Then restart the service:

```bash
sudo systemctl restart influxdb3-{{< product-key >}}
```

When the Processing Engine is disabled:

- The Python environment and PyO3 bindings are not initialized
- Plugin-related operations return a "No plugin directory configured" error
- The server runs with reduced resource usage

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

> [!Caution]
> #### Deprecated in {{% product-name %}} 3.10
>
> `--package-manager` is deprecated.
> Python and `pip` are bundled with {{< product-name >}}, and `pip` is always
> used for plugin dependency installation.
> The server still starts if you set this option, but prints a deprecation
> warning.
> `disabled` continues to block plugin package installation API calls for
> compatibility.

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

***

#### restrict-plugin-triggers-to

Restrict plugin triggers to one or more trigger types.
Provide one or more of `wal`, `schedule`, or `request`.

| influxdb3 serve option          | Environment variable                    |
| :------------------------------ | :-------------------------------------- |
| `--restrict-plugin-triggers-to` | `INFLUXDB3_RESTRICT_PLUGIN_TRIGGERS_TO` |

{{% show-in "enterprise" %}}

***

#### plugin-dir-only

Only allow plugins that already exist in the configured plugin directory.
Blocks plugin installation from any other source.

| influxdb3 serve option | Environment variable        |
| :--------------------- | :-------------------------- |
| `--plugin-dir-only`    | `INFLUXDB3_PLUGIN_DIR_ONLY` |

{{% /show-in %}}

{{% show-in "enterprise" %}}

***

### Cluster Management

- [replication-interval](#replication-interval)
- [catalog-sync-interval](#catalog-sync-interval)
- [wait-for-running-ingester](#wait-for-running-ingester)
- [conn-info](#conn-info)

#### replication-interval

Specifies the interval at which data replication occurs between cluster nodes.

**Default:** `250ms`

| influxdb3 serve option   | Environment variable                        |
| :----------------------- | :------------------------------------------ |
| `--replication-interval` | `INFLUXDB3_REPLICATION_INTERVAL` (preferred)<br>`INFLUXDB3_ENTERPRISE_REPLICATION_INTERVAL` (deprecated; supported for backward compatibility) |

***

#### catalog-sync-interval

Defines how often the catalog synchronizes across cluster nodes.

**Default:** `10s`

| influxdb3 serve option    | Environment variable                         |
| :------------------------ | :------------------------------------------- |
| `--catalog-sync-interval` | `INFLUXDB3_CATALOG_SYNC_INTERVAL` (preferred)<br>`INFLUXDB3_ENTERPRISE_CATALOG_SYNC_INTERVAL` (deprecated; supported for backward compatibility) |

***

#### wait-for-running-ingester

Specifies how long to wait for a running ingester during startup.

**Default:** `10s`

> \[!Note]
> `--wait-for-running-ingester` was previously named
> `--wait-for-running-ingestor` (misspelled).
> The legacy option and environment variable names are deprecated aliases.

| influxdb3 serve option        | Environment variables |
| :---------------------------- | :-------------------- |
| `--wait-for-running-ingester`<br>`--wait-for-running-ingestor` (deprecated alias) | `INFLUXDB3_WAIT_FOR_RUNNING_INGESTER` (preferred)<br>`INFLUXDB3_ENTERPRISE_WAIT_FOR_RUNNING_INGESTOR` (deprecated; supported for backward compatibility) |

***

#### conn-info

In multi-node deployments, specifies the connection information used to reach
the ingester over the internode gRPC port (not the HTTP port).
Required for Processing Engine plugin writes from non-ingester nodes, and used
together with the `--internode-bind-addr` option.

| influxdb3 serve option | Environment variables |
| :--------------------- | :-------------------- |
| `--conn-info`          | `INFLUXDB3_CONN_INFO` (preferred)<br>`INFLUXDB3_ENTERPRISE_CONN_INFO` (deprecated; supported for backward compatibility) |

{{% /show-in %}}

***

### Resource Limits

{{% show-in "enterprise" %}}

- [num-cores](#num-cores)
  {{% /show-in %}}
- [max-concurrent-queries](#max-concurrent-queries)
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

> \[!Note]
> #### Thread defaults on the upgraded storage engine
>
> The default thread assignment logic above applies to Parquet-engine
> clusters.
> On clusters running the upgraded storage engine (the default for new
> clusters), the IO and DataFusion
> runtimes each default to the licensed core count, and the node consumes the
> licensed core count regardless of thread configuration.
> Thread counts set above the licensed core count are capped with a startup
> warning instead of rejected, and the combined IO + DataFusion total is not
> checked against `num-cores`.
> An at-home license always runs 1 IO thread and 1 DataFusion thread.

**Constraints (Parquet-engine clusters):**

- Must be at least 2
- Cannot exceed the number of cores available on the system
- Total thread count from `--num-io-threads` (global option) and `--datafusion-num-threads` cannot exceed the `num-cores` value

| influxdb3 serve option | Environment variable             |
| :--------------------- | :------------------------------- |
| `--num-cores`          | `INFLUXDB3_NUM_CORES` (preferred)<br>`INFLUXDB3_ENTERPRISE_NUM_CORES` (deprecated; supported for backward compatibility) |

{{% /show-in %}}

#### max-concurrent-queries

Limits the number of queries that can run concurrently.
You can also update the limit at runtime with
`POST /api/v3/configure/query_concurrency_limit`.

<!-- Environment variable not listed in `influxdb3 serve --help-all`
(verified against 3.10.0-0.rc.2). Confirm before documenting. -->

| influxdb3 serve option     | Environment variable |
| :------------------------- | :------------------- |
| `--max-concurrent-queries` |                      |

***

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

- Clusters running the upgraded storage engine (the default for new clusters): the licensed core count
- Parquet-engine clusters, if `--num-cores` is not set: all available cores minus IO threads
- Parquet-engine clusters, if `--num-cores` is set: automatically determined based on core count (see [`--num-cores`](#num-cores))

> \[!Note]
> DataFusion threads are used for both query processing and snapshot operations.
> Even ingest-only nodes use DataFusion threads during WAL snapshot creation.

**Constraints:** On Parquet-engine clusters, when used with `--num-cores`, the sum of `--num-io-threads` and `--datafusion-num-threads` cannot exceed the `num-cores` value.
On clusters running the upgraded storage engine, values above the licensed core count are capped with a startup warning.
{{% /show-in %}}

| influxdb3 serve option     | Environment variable               |
| :------------------------- | :--------------------------------- |
| `--datafusion-num-threads` | `INFLUXDB3_DATAFUSION_NUM_THREADS` |

> \[!Note]
> [`--num-io-threads`](#num-io-threads) is a [global configuration option](#global-configuration-options).

## {{% show-in "enterprise" %}}

> \[!Note]
> #### Parquet-engine limits
>
> `num-database-limit`, `num-table-limit`, and
> `num-total-columns-per-table-limit` apply to the Parquet engine only
> (clusters that started on 3.10 or earlier that have not run the
> [storage engine upgrade](#upgrade-pacha-tree)).
> On clusters running the upgraded storage engine, explicitly setting these
> options logs a startup
> warning and has no effect.
> `--max-total-columns` (documented in the
> [storage engine configuration reference](/influxdb3/enterprise/performance-preview/configure/))
> is the upgraded storage engine's counterpart of
> `--num-total-columns-per-table-limit`;
> the database and table limits have no equivalent on the upgraded engine.

#### num-database-limit

Limits the total number of active databases.
Default is {{% influxdb3/limit "database" %}}.

| influxdb3 serve option | Environment variable                      |
| :--------------------- | :---------------------------------------- |
| `--num-database-limit` | `INFLUXDB3_NUM_DATABASE_LIMIT` (preferred)<br>`INFLUXDB3_ENTERPRISE_NUM_DATABASE_LIMIT` (deprecated; supported for backward compatibility) |

***

#### num-table-limit

Limits the total number of active tables across all databases.
Default is {{% influxdb3/limit "table" %}}.

| influxdb3 serve option | Environment variable                   |
| :--------------------- | :------------------------------------- |
| `--num-table-limit`    | `INFLUXDB3_NUM_TABLE_LIMIT` (preferred)<br>`INFLUXDB3_ENTERPRISE_NUM_TABLE_LIMIT` (deprecated; supported for backward compatibility) |

***

#### num-total-columns-per-table-limit

Limits the total number of columns per table.
Default is {{% influxdb3/limit "column" %}}.

| influxdb3 serve option                | Environment variable                                     |
| :------------------------------------ | :------------------------------------------------------- |
| `--num-total-columns-per-table-limit` | `INFLUXDB3_NUM_TOTAL_COLUMNS_PER_TABLE_LIMIT` (preferred)<br>`INFLUXDB3_ENTERPRISE_NUM_TOTAL_COLUMNS_PER_TABLE_LIMIT` (deprecated; supported for backward compatibility) |

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

| influxdb3 serve option       | Environment variables |
| :--------------------------- | :-------------------- |
| `--disable-telemetry-upload` | `INFLUXDB3_DISABLE_TELEMETRY_UPLOAD` (preferred)<br>`INFLUXDB3_TELEMETRY_DISABLE_UPLOAD` (deprecated; supported for backward compatibility) |

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

| influxdb3 serve option     | Environment variables |
| :------------------------- | :-------------------- |
| `--tcp-listener-file-path` | `INFLUXDB3_TCP_LISTENER_FILE_PATH` (preferred)<br>`INFLUXDB3_TCP_LISTINER_FILE_PATH` (deprecated misspelling; supported for backward compatibility) |

***

#### admin-token-recovery-tcp-listener-file-path

Specifies the TCP listener file path for admin token recovery operations.

| influxdb3 serve option                          | Environment variable                                    |
| :---------------------------------------------- | :------------------------------------------------------ |
| `--admin-token-recovery-tcp-listener-file-path` | `INFLUXDB3_ADMIN_TOKEN_RECOVERY_TCP_LISTENER_FILE_PATH` |
