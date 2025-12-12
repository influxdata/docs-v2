---
title: InfluxDB OSS v2 release notes
description: Important changes and what's new in each version of InfluxDB.
menu:
  influxdb_v2:
    name: InfluxDB
    parent: Release notes
weight: 101
---

## v2.8.0 {date="2025-12-12"}

### Features

- [5e204dc](https://github.com/influxdata/influxdb/commit/5e204dc): Add optional token hashing

### Bug Fixes

- [305e61d](https://github.com/influxdata/influxdb/commit/305e61d): Fix compilation on alpine linux

### Maintenance

- [1b83d2c](https://github.com/influxdata/influxdb/commit/1b83d2c): Chore: update to go 1.23.12 (2.7)
- [40a6332](https://github.com/influxdata/influxdb/commit/40a6332): Updates post-install for linux package builds

## v2.7.12 {date="2025-05-20"}

### Features

- Add a `--pid-file` option to write a PID file to the specified location on startup. InfluxDB removes the PID file on shutdown.
- Add a `--storage-wal-flush-on-shutdown` option to flush the WAL on database shutdown to ensure all data is written to disk.
- Improve response error messages for dropped points, adding details including database, retention policy, and which bound was violated for partial writes.

### Bug Fixes

- Fix a locking issue in `TagValueIterator` that could cause reads and writes in buckets to block. [PR #26414](https://github.com/influxdata/influxdb/pull/26414)

### Maintenance

- Improved startup logging with an "are we there yet" counter for the number and percentage of shards opened.
- Update Go to 1.23.9.
- Update Flux to v0.196.1.
- Refresh dependencies to address security vulnerabilities and improve stability.

---

## v2.7.11 {date="2024-12-02"}

### Features

- Add startup logging on the percentage of shards opened.
- Improve error messages and logging during shard opening.
- Add additional logging when loading field set changes.
- Add `--pid-file` option to write a PID file on startup.
- Add `--storage-wal-flush-on-shutdown` to flush WAL on database shutdown.

### Bug Fixes

- Adds check for incompatible WAL formats during startup.
- Changes to shard loading to improve maintainability of TSM code.
- Hitting `vm.max_mmap_count` count no longer causes data to become unqueryable.

### Maintenance

- Minor user interface (UI) updates.
- Update Go to 1.22.7.


---

## v2.7.10 {date="2024-08-15"}

### Bug Fixes

- Update Flux to address performance regression.

### Maintenance

- Update Flux to 0.195.2.

---

## v2.7.9 {date="2024-08-09"}

### Bug Fixes

- Fix UI build error.

### Maintenance

- Update `go` toolchain to 1.21.12.

---

## v2.7.8 {date="2024-07-25"}

### Bug Fixes

- Prevent an infinite loop in write path.
- Fix `range()` filter behavior for timestamps before 1970-01-01 (UNIX time 0).
- Update to latest `influxdb-templates`.

### Maintenance

- Update user interface (UI) with various improvements.

---

## v2.7.7 {date="2024-07-12"}

### Features

- Disable `file://` URLs when [hardening is enabled](/influxdb/v2/reference/config-options/#hardening-enabled).

### Bug Fixes

- Ensure `TSMBatchKeyIterator` and `FileStore` close all `TSMReader`s.
- Return `MergeIterator.Close` errors.
- Ensure `GROUP BY` queries with an offset that crosses a date time boundary
  (daylight savings time, British summer time, etc.) do not fail.
- Preserve time zone information in the Task Scheduler.
- Prevent the retention service from becoming unresponsive.

### Maintenance

- Update Flux to v0.195.1.
- Update `logrus` to 1.9.3.
- Update `golang.org/x/net` to v0.23.0.
- Update `protocol` buffers to v5.26.1.
- Update `go` toolchain to 1.21.10.

---

## v2.7.6 {date="2024-04-12"}

### Features

- Add optional [stricter password requirements](/influxdb/v2/reference/config-options/#strong-passwords).

### Bug Fixes

- Fix `panic index out of range` error for invalid series keys.
- Update broken Flux and performance tests.
- Do not panic when querying empty tags.
- Improve shard deletion.
- Return and respect cursor errors.
- Update constant time code to make password strength calculations more constant.

### Maintenance

- Upgrade to Go to 1.21.9.

---

## v2.7.5 {date="2024-01-05"}

### Features

- Add authenticating ID and user ID to request logging.
- Write detailed logs from endpoint detection and response (EDR) failures.

### Bug Fixes

- Only execute `init_config` on install.
- Enable `Secure` when using TLS and enable `HttpOnly`.
- Correctly return `4xx` errors instead of `5xx` errors.
- Prevent retention service from creating orphaned shard files.

### Maintenance

- Emit build commands during tests.
- Upgrade Flux to 0.194.5.

---

## v2.7.4 {date="2023-11-14"}

_Internal changes only._

---

## v2.7.3 {date="2023-10-17"}

### Maintenance

- Upgrade Flux to 0.194.3.

---

## v2.7.1 {date="2023-04-28"}

### Bug Fixes

- Update the InfluxDB UI to remove non-functional Data Explorer.

---

## v2.7.0 {date="2023-04-05"}

### Bug Fixes

- Update user interface to resolve dashboard crashes and All Access token creation.
- Show replication queue size and replication TCP errors.
- Correctly handle when the replication queue cannot be found.
- Rename stored replication fields to be more clear.
- Prevent unauthorized writes from Flux `to()` function.
- Add error message when attempting to delete by field.
- Prevent scrapers from failing when the `Content-Type` header is not set.
- Removed timeout reached with large databases or slow servers.
- Changing file permissions on the manifest is no longer necessary.

### Maintenance

- Update Flux to v0.193.0.
- Update package repository GPG key/
- Add additional error logging when deleting a shard.
- Update to Go 1.20.1.
- Update end-to-end tests to work locally in UI repo.
- Bump `github.com/aws/aws-sdk-go` from 1.30.12 to 1.33.0.
- Bump `testcontainers-go` to 0.18.0.
- Bump `golang.org/x/net` from 0.5.0 to 0.7.0.
- Bump `containerd` to 1.6.18.
- Bump `github.com/opencontainers/runc` from 1.1.3 to 1.1.5.

---

## v2.6.1 {date="2022-12-29"}

### Bug Fixes

- Update user interface (UI) to fix dashboard page crash issue.
- Fix `All Access` token creation issue.

---

## v2.6.0 {date="2022-12-15"}

### Features

- Add the following `influxd` utilities:
  - [`influxd inspect check-schema`](/influxdb/v2/reference/cli/influxd/inspect/check-schema/)
  - [`influxd inspect merge-schema`](/influxdb/v2/reference/cli/influxd/inspect/merge-schema/)
  - [`influxd inspect report-db`](/influxdb/v2/reference/cli/influxd/inspect/report-db/)
- Validate packages during the build process.

### Bug Fixes

- Optimize [`SHOW FIELD KEY CARDINALITY`](/influxdb/v2/query-data/influxql/explore-schema/#show-field-key-cardinality)
  InfluxQL command.
- Correctly convert replication maximum age setting to seconds.
- Fix internal metadata migrations when a replication remote already exists.
- Update `/me` and `/users` routes to match documentation.
- By default, restrict file permissions to 0750 (`drwxr-x---`).
- Correctly handle `NaN` values returned from InfluxDB scrapers.
- Pin the user interface (UI) to version that addresses dashboard issues.

### Maintenance

- Upgrade to Go 1.18.9.
- Upgrade Flux to v0.191.0.

---

## v2.5.1 {date="2022-11-09"}

### Bug fixes

- Fix permissions issue in Debian and Red Hat package managers.

---

## v2.5.0 {date="2022-11-01"}

### Features

- Updated user interface (UI).
- Allow for incremental changes to `fields.idx`.

### Security updates

- Restriction to view tokens only once, immediately after creation.
- Set `SameSite=strict` on session cookie.

### Bug fixes

- Manually scheduled tasks run when expected.
- Fix error where virtual DBRP mappings were being ignored.
- Ability to back up all buckets in your InfluxDB instance.
- Improved speed of deletes when measurement is part of the predicate.
- Improved error messaging when attempting to create user with an ID that already exists.

### Maintenance

- Upgrade to [Flux 0.188.1](/flux/v0/release-notes/#v01870)
- Upgrade to [Go 1.18.7](https://go.dev/doc/go1.18)
- Upgrade to [Rust 1.63.0](https://www.rust-lang.org/)

---

## v2.4.0 {date="2022-08-19"}

### Features

- Support bucket names in the `replications` API and allow [InfluxDB 1.x DBRP](/influxdb/v2/query-data/influxql/dbrp) names as bucket names.
- Add the [InfluxQL shell (REPL)](/influxdb/v2/reference/cli/influx/v1/shell/).
- Change to operator model so that `admin` user has instance-level permissions without `operator` token.

#### Flux advancement highlights
- Add the [`join` package](/flux/v0/stdlib/join/) to support inner joins, right outer joins, left outer joins, and full outer joins.
- Promote `experimental.to()` to [`influxdb.wideTo()`](/flux/v0/stdlib/influxdata/influxdb/wideto/).
- Add [`initialZero`](/flux/v0/stdlib/universe/derivative/#initialzero) parameter to [`derivative()`](/flux/v0/stdlib/universe/derivative/).
- Add `time()` function to the [`date package`](/flux/v0/stdlib/date/) to convert timeable types (time and duration) to time types.
- Promote the following functions from `experimental.array` into the [`array` package](/flux/v0/stdlib/array/):
  - [`array.concat()`](/flux/v0/stdlib/array/concat/)
  - [`array.filter()`](/flux/v0/stdlib/array/filter/)
  - [`array.map()`](/flux/v0/stdlib/array/map/)
- Promote the following functions from the experimental `http.requests` package into the [`http/requests` package](/flux/v0/stdlib/http/requests/):
  - [`requests.do()`](/flux/v0/stdlib/http/requests/do/)
  - [`requests.get()`](/flux/v0/stdlib/http/requests/get/)
  - [`requests.peek()`](/flux/v0/stdlib/http/requests/peek/)
  - [`requests.post()`](/flux/v0/stdlib/http/requests/post/)
- Promote `experimental.bitwise()` into the [`bitwise` package](/flux/v0/stdlib/bitwise/).
- Add new [experimental.catch()](/flux/v0/stdlib/experimental/catch/) and [testing.shouldError()](/flux/v0/stdlib/testing/shoulderror/) functions.
- Support conditional expressions, constants, and literals in vectorized [`map()`](/flux/v0/stdlib/universe/map/).
- Optimize [`holtWinters()`](/flux/v0/stdlib/universe/holtwinters/) and redundant sorts.
- Deprecate the following experimental functions:
  - `http.get()`
  - `csv.from()`

### Bug fixes

- Log the log level at startup.
- Fix panic from `CreateIterator` in Flux queries.
- Fix error-caching in `bufio.Writer`.
- Remove `MATCHER_BEHAVIOR` environment variable.

### Maintenance

- Upgrade to [Go 1.18.4](https://go.dev/doc/go1.18).
- Upgrade to [Flux 0.179.0](/flux/v0/release-notes/#v01790).

---

## v2.3.0 {date="2022-06-17"}

This release includes the following [maintenance](#maintenance), [features](#features), [security updates](#security-updates) and [bug fixes](#bug-fixes).

{{% note %}}
#### Production ready: replicate data remotely

InfluxDB 2.2 introduced a technical preview of how to [replicate data from InfluxDB OSS to InfluxDB Cloud](/influxdb/v2/write-data/replication). This feature is now production ready.
{{% /note %}}

### Maintenance

- Upgrade from Flux 0.161.0 to [Flux 0.171.0](/flux/v0/release-notes/#v01710).
- Upgrade to [Go 1.18.3](https://go.dev/doc/go1.18).

### Features

- Add the [`--instance-id`](/influxdb/v2/reference/config-options/?t=JSON#instance-id) flag to `influxd` runtime to add the `_instance_id` tag to remote replications metrics. Helps to identify where the metrics came from, and ensures that two instances don't overwrite each others' data.
- Add signifier to replication `user-agent` to signify when replication write requests are made. Helps to identify metrics written via replications.

#### Flux advancement highlights

##### Performance improvements

- Vectorize arithmetic operators in `map()`.
- Vectorize logical operations in `map()`.
- Enable `movingAverage()` and `cumulativeSum()` optimizations by default.

##### Other highlights

- Add `preview()` to experimental package for limiting return rows and tables (as opposed to just rows with `limit()`).
- Add `date.scale()` to let users dynamically scale durations in dates.
- Add [OpenTracing](https://opentracing.io/docs/overview/spans/) spans to Flux transformations. Lets you monitor Flux scripts more precisely.
- Add `trace` option to Flux CLI.
- Rename `addDuration()` to [add](/flux/v0/stdlib/date/add/) and `subDuration()` to [sub](/flux/v0/stdlib/date/sub/),
and moved both of these functions from the experimental package to the date package.
- Add location support to `date.truncate()`.
- Add `_status` tag to PagerDuty record.
- Refactor operator profile to be in the query statistics.

### Security updates

Several security issues were fixed in dependencies and the toolchain used to build InfluxDB, including:
- An issue in the `gopkg.in/yaml.v3` package import that could lead to a DoS in the templates service.
- An issue in the `github.com/buger/jsonparser` package import that could potentially lead to a DoS in storage authorization.
- Cumulative security fixes for Go 1.17.8-[1.18.3](https://go.dev/doc/devel/release#go1.18.minor) are included in this release.
  These fixes resolve the following InfluxDB issues:
  - An issue with processing large PEM files that could lead to a DoS in the templates service or flux connections using `to()`.
  - An issue in TLSv1.3 and a lack of ticket randomness.
  - A minor issue with `filepath.Clean()` on Windows.

### Bug fixes

- Fix race condition when remote replicating deadlocks the remote writer that prevented writes to the target.
- Resolve error when creating v1 authorization (`v1 auth`) with a nonexistent bucket ID.
- Add fields to the `_tasks` bucket to match schema of the same bucket in InfluxDB Cloud. Provides consistency for clients accessing both.
- Fix rare case where measurement cardinality reported less than zero.
- Resolve panic on cleaning up failed iterators.

---

## v2.2.0 {date="2022-04-06"}

This release includes the following new [features](#features) and several [bug fixes](#bug-fixes).

### Features

- [Technical preview: replicate data remotely](#technical-preview-replicate-data-remotely)
- [Flux updates](#flux-updates)
- [Build maintenance](#build-maintenance)
- [Task metadata](#task-metadata)
- [Troubleshoot with new metrics](#troubleshoot-with-new-metrics)
- [Display runtime configuration in use by `influxd`](#display-runtime-configuration-in-use-by-influxd)
- [Recover user credentials](#recover-user-credentials)
- [Security updates](#security-updates), including a new `hardening-enabled` option to enable additional security.

#### Technical preview: replicate data remotely

Add the option to [replicate data from InfluxDB OSS to InfluxDB Cloud](/influxdb/v2/write-data/replication).

{{% warn %}}
On rare occasions, remote write failures may cause data in the replication queue to get stuck. To ensure data is not dropped, restart the InfluxDB instance replicating data.

To assess whether this issue is occurring, we recommend periodically doing one of the following:
- Verify your data is successfully replicated to your target bucket.
- View your queue size using [`influx replication list`](/influxdb/cloud/reference/cli/influx/replication/list/) for unexpected growth.
{{% /warn %}}

Replicating data remotely lets you do following:
  - Create a durable subscription on a per bucket basis for the purposes of replicating data on-write from an InfluxDB OSS instance to InfluxDB Cloud.
  - Store, analyze, and aggregate data locally while also forwarding newly arriving data to a centralized InfluxDB Cloud account.
  - Configure a maximum buffer size and data age restrictions to restrict the amount of data stored on disk.

#### Flux updates

- Update to [Flux v0.150.0](/flux/v0/release-notes/#v01500).
- Add option to log Flux queries that are cancelled because of server shutdown.

#### Build maintenance

- Upgrade `protobuf` library.

#### Task metadata

- Add option to pass `type=basic` to [`/api/v2/tasks`](/influxdb/v2/api/#tag/Tasks) to return task metadata without the query text.

#### Troubleshoot with new metrics

To assist with troubleshooting and operational management, expose the following metrics in Prometheus Exposition Format.

##### TSM compaction metrics

- `storage_compaction`
- `storage_compactions_active`
- `storage_compactions_duration_seconds_bucket`
- `storage_compactions_duration_seconds_count`
- `storage_compactions_duration_seconds_sum`
- `storage_compactions_queued`
- `storage_compactions_total`

##### Failed to add to replication queue metrics

- `PointsFailedToQueue`
- `BytesFailedToQueue`

##### Write status metrics

- `pointsWriteRequested`
- `pointsWriteOk`
- `pointsWriteDropped`
- `pointsWriteErr`
- `timeout`

##### Disk size metrics per shard

- `total`: number of files per shard
- `disk_bytes`: data size in bytes for each shard

##### Cache subsystem metrics

- `inuse_bytes`: Current memory consumption of cache
- `diskBytes`: Size of most recent snapshot"
- `latest_snapshot`: Unix time of most recent snapshot
- `writes_total`: Counter of all writes to cache
- `writes_err`: Counter of failed writes to cache
- `writes_dropped`: Counter of writes (with any dropped points) to cache

##### WAL subsystem metrics

- `size`: Size of WAL in bytes
- `writes`: Number of write attempts to the WAL
- `writes_err`: Number of failed write attempts to the WAL

See [InfluxDB OSS metrics](/influxdb/v2/reference/internals/metrics/) for additional detail.

#### Display runtime configuration in use by `influxd`

- Add `api/v2/config` endpoint to display the runtime configuration (for example, when you run `influxd print-config`). This endpoint lets you review runtime configuration while the instance is live.

#### Recover user credentials

To recover user credentials, use [`influx recovery user list`](/influxdb/v2/reference/cli/influxd/recovery/user/list/) to retrieve a list of users, and then use [`influx recovery user update`](/influxdb/v2/reference/cli/influxd/recovery/user/update/) to update the password for a specified user.

### Security updates

- Add the [`hardening-enabled`](/influxdb/v2/admin/security/enable-hardening) option to limit flux/pkger HTTP requests. The new `hardening-enabled` option ensures that InfluxDB first verifies the IP address of the URL is not private.
  By default, Flux HTTP and template fetching requests are allowed to access localhost and private IP addresses.
  - Disable use of jsonnet with `/api/v2/templates/apply`.
This prevents crafted authenticated requests from exfiltrating files accessible to the user InfluxDB runs as.
- Add read permissions check for querying data.
  This prevents authenticated requests using a write-only token from reading data
  via the InfluxQL `/query` compatibility API.
- Add write permissions check for `DELETE` and `DROP MEASUREMENT`.
  This prevents authenticated requests using a read-only token from deleting data
  via the InfluxQL `/query` compatibility API.
Additionally, several security issues were fixed in dependencies and
the toolchain used to build InfluxDB, including:
- The following cumulative security fixes for [Flux v0.161.0](/flux/v0/release-notes/) since 0.139.0 are included in this release:
  - Quote db identifiers.
    This addresses injection vulnerabilities in database connections using `to()`.
  - Make substring check bounds correctly.
    This prevents authenticated queries from crashing the Flux engine.
- The cumulative security fixes for [Go 1.17.8](https://go.dev/doc/devel/release#go1.17.minor) since Go 1.17.2 are included in this release.
  This addresses an issue in the InfluxDB test suite.

### Bug fixes

- Ensure manual task runs can happen concurrently.
- Extend snapshot copy of backup to filesystems that do not support hard links.
- Detect misquoted tag values and return an error.
- Fix potential deadlock in `influxd inspect dump-tsi`.
- Successfully handle errors returned by `Sketch.Merge`.
- Return `X-version` and `X-Build` headers for all requests to `/ping` endpoint.
- Add error when `meta.db` is missing.
- Sync TSI index file before closing.
- Fix race condition that could cause `restore` command to fail.
- To successfully restore a backup, use copy when a rename spans volumes.
- Disable use of jsonnet with `/api/v2/templates/apply`.
- Ensure that updating a check (`/checks/{checkID}`) does not require an owner ID.
- Remove NATS for scraper processing. Note, this fix does not alter scraper functionality--scrapers still work as they did before.
  - `nats-port` and `nats-max-payload-bytes` flags have been deprecated.
  -  NATS is no longer embedded in InfluxDB. Because InfluxDB no longer requires a port for NATS, port conflict issues are reduced.
- Resolve the issue that prevented the browser from tracking the cookie `expiry` correctly, causing the cookie to expire automatically when restarting the browser or changing tabs. Now, the cookie is correctly preserved.
- Allow unlimited Flux HTTP calls. Previously, HTTP requests failed silently after 100 MB of data transfer.
- Remove pagination limits on the `/telegrafs` API. Previously, pagination wasn't exposed to the API, so API requests were limited to the default 20 pages.

---

## v2.1.1 {date="2021-11-08"}

{{% note %}}
To address underlying installation package issues, we bumped the 2.1 release version to 2.1.1.
{{% /note %}}

This release includes several new [features](#features) and [bug fixes](#bug-fixes).

### `influx` CLI moved to separate repository

The `influx` CLI has been moved to its own GitHub [repository](https://github.com/influxdata/influx-cli/).

{{% warn %}}
#### `influxdb` release artifacts affected
Release artifacts produced by `influxdb` are impacted as follows:

- Release archives (`.tar.gz` and `.zip`) **no longer contain** the `influx` binary.
- The `influxdb2` package (`.deb` and `.rpm`) **no longer contains** the `influx` binary. Instead, the package declares a recommended dependency on the new `influxdb2-cli` package.
- The `quay.io/influxdb/influxdb` image **no longer contains** the `influx` binary. We recommend migrating to the `influxdb` image hosted on [DockerHub](https://hub.docker.com/_/influxdb).
{{% /warn %}}

#### Find supported `influx` CLI commands

With this change, versions of the `influx` CLI and InfluxDB server (`influxd`) are not guaranteed to exactly match. To check the version of the `influxd` server, see `influxd version` in `influx` CLI or use the `/health` endpoint of your InfluxDB server.

{{% note %}}
The [`influx` CLI documentation](/influxdb/v2/reference/cli/influx/) has been updated to reflect which `influx` CLI commands work with which versions of InfluxDB.
{{% /note %}}

### Features

This release includes the following new features:

- [Notebooks, annotations, and visualization updates](#notebooks-annotations-and-visualization-updates)
- [API](#api) and [CLI](#cli) updates
- Support for latest [Flux](#flux) and [Telegraf](#telegraf) releases
- Updates to the [InfluxQL](#influxql)
- [Token](#tokens) updates
- [Flux location support](#flux-location-support)

#### Notebooks, annotations, and visualization updates

- Add support for [notebooks](/influxdb/v2/tools/notebooks/) and [annotations](/influxdb/v2/visualize-data/annotations/).
- Add support for static legends to line graphs and band plots.
- Enable new dashboard auto-refresh.
- Simplify display of data for table visualizations.

#### API

- Add new parameters to GET [`/users`](/influxdb/v2/api/#operation/GetUsers) API, including: `offset`, `limit`, and `after`.
- Add the [`api/v2/backup/metadata`](/influxdb/v2/api/#operation/GetBackupMetadata) endpoint for backing up both key-value and SQL metadata, and the [`api/v2/restore/sql`](/influxdb/v2/api/#operation/GetRoutes) for restoring SQL metadata.
- Deprecated [`POST .../secrets/delete`](/influxdb/v2/api/#operation/PostOrgsIDSecrets). To delete a secret, use [`DELETE .../secrets/{secretID}`](/influxdb/v2/api/#operation/DeleteOrgsIDSecretsID).

#### CLI

##### influxd configuration

Added several new configuration options to [`influxd`](/influxdb/v2/reference/cli/influxd/):

- Add `influxd recovery` command to let you create a recovery [Operator token](/influxdb/v2/admin/tokens/#operator-token).
- Add `--sqlite-path` flag for specifying a user-defined path to the SQLite database file.
- Add `--storage-wal-max-concurrent-writes` flag to enable tuning memory pressure under heavy write load.
- Add `--storage-wal-max-write-delay` flag to prevent deadlocks when the WAL is overloaded with concurrent writes.
- Add `--storage-write-timeout` flag to set write request timeouts.
- Add `--storage-no-validate-field-size` flag to disable enforcement of max field size.
- Update `--store` flag to work with string values disk or memory. Memory continues to store metadata in-memory for testing; disk persists metadata to disk via bolt and SQLite.

For more information, see [InfluxDB configuration options](/influxdb/v2/reference/config-options/).

##### influxd inspect

Ported the following [`influxd inspect`](/influxdb/v2/reference/cli/influxd/inspect/) commands from InfluxDB 1.x:

- [influxd inspect build-tsi](/influxdb/v2/reference/cli/influxd/inspect/build-tsi/)
- [influxd inspect delete-tsm](/influxdb/v2/reference/cli/influxd/inspect/delete-tsm/)
- [influxd inspect dump-tsi](/influxdb/v2/reference/cli/influxd/inspect/dump-tsi/)
- [influxd inspect dump-tsm](/influxdb/v2/reference/cli/influxd/inspect/dump-tsm/)
- [influxd inspect dump-wal](/influxdb/v2/reference/cli/influxd/inspect/dump-wal/)
- [influxd inspect report-tsi](/influxdb/v2/reference/cli/influxd/inspect/report-tsi/)
- [influxd inspect report-tsm](/influxdb/v2/reference/cli/influxd/inspect/report-tsm/)
- [influxd inspect verify-seriesfile](/influxdb/v2/reference/cli/influxd/inspect/verify-seriesfile/)
- [influxd inspect verify-tombstone](/influxdb/v2/reference/cli/influxd/inspect/verify-tombstone/)
- [influxd inspect verify-tsm](/influxdb/v2/reference/cli/influxd/inspect/verify-tsm/)
- [influxd inspect verify-wal](/influxdb/v2/reference/cli/influxd/inspect/verify-wal/)

##### influxd downgrade

Added the [influxd downgrade command](/influxdb/v2/reference/cli/influxd/downgrade/)
to migrate InfluxDB key-value metadata schemas to earlier 2.x versions when necessary.

#### Flux

- Update to [Flux v0.139.0](/flux/v0/release-notes/#v01390).
- Enable writing to remote hosts using the Flux [`to()`](/flux/v0/stdlib/influxdata/influxdb/to/) and [`experimental.to()`](/flux/v0/stdlib/experimental/to/) functions.
- Flux now supports locations that dynamically modify time offsets based on your specified timezone. You can also specify fixed time offsets relative to UTC.
- Perform [bitwise operations](/flux/v0/stdlib/experimental/bitwise/)
  on integers and unsigned integers.
- [Query](/flux/v0/query-data/sql/vertica/) and
  [write to Vertica](/flux/v0/query-data/sql/vertica/) SQL databases.
- Add the [`hex` package](/flux/v0/stdlib/contrib/bonitoo-io/hex/)
  for working with hexadecimal string values.

#### InfluxQL

- `SHOW MEASUREMENTS ON` now supports database and retention policy wildcards. For example, `SHOW MEASUREMENTS ON *.*` to show all databases and `SHOW MEASUREMENTS ON <db>.*` to show all retention policies.
-  Add hyper log operators `merge_hll`, `sum_hll`, and `count_hll` in InfluxQL to optimize series iteration. (`count_hll` optimizes queries that can be answered without inspecting TSM data.)

#### Telegraf

- Add the following new [Telegraf plugins](/telegraf/v1/plugins/) to the Load Data page:
  - Alibaba (Aliyun) CloudMonitor Service Statistics (`aliyuncms`)
  - AMD ROCm System Management Interface (SMI) (`amd_rocm_smi`)
  - Counter-Strike: Global Offensive (CS:GO) (`csgo`)
  - Directory Monitoring (`directory_monitor`)
  - Intel Data Plane Development Kit (DPDK) (`dpdk`)
  - Elasticsearch Query (`elasticsearch_query`)
  - Internet Speed Monitor (`internet_speed`)
  - KNX (`knx_listener`)
  - Mdstat (`mdstat`)
  - Netstat (`netstat`)
  - NFS Client (`nfsclient`)
  - OpenTelemetry (`opentelemetry`)
  - RavenDB (`ravendb`)
  - SQL (`sql`)
  - Trig (`trig`)
  - Twemproxy (`twemproxy`)

For more information about each plugin, see [Telegraf plugins](/telegraf/v1/plugins/), and search for the plugin name.

#### Tokens

- Add support for standard Bearer token syntax. Now you can specify token credentials as: `Authorization: Bearer xxxxxxxx`.
- If restoring a backup overwrites the Operator token, the new token value is returned.

### Bug fixes

- Log API errors to server logs and tell clients to check the server logs for the error message.
- Fix pagination for GET [`/buckets`](/influxdb/v2/api/#operation/GetBuckets) API when displaying results. Previously, pagination was broken if a request included both an `org` filter AND the `after` request parameter. Also corrects `descending` parameter to sort when an `org` filter is used and saved.
- Sync series segment to disk after writing.
- Do not allow shard creation to create overlapping shards.
- Don't drop shard group durations when upgrading InfluxDB.

---

## v2.0.9 {date="2021-09-27"}

This release includes several new [features](#features) and [bug fixes](#bug-fixes).

### Features

New features include:

- [API updates](#api-updates)
- [Flux updates](#flux-updates)
- [Performance enhancements](#performance-enhancements)

#### API updates

- Add a new route `/api/v2/resources` that returns a list of known resources to the platform, including the following resource types. Makes it easier to update All Access tokens with current resources:

  - `AuthorizationsResourceType`
  - `BucketsResourceType`
  - `ChecksResourceType`
  - `DashboardsResourceType`
  - `DBRPResourceType`
  - `DocumentsResourceType`
  - `LabelsResourceType`
  - `NotificationEndpointResourceType`
  - `NotificationRuleResourceType`
  - `OrgsResourceType`
  - `ScraperResourceType`
  - `SecretsResourceType`
  - `SourcesResourceType`
  - `TasksResourceType`
  - `TelegrafsResourceType`
  - `UsersResourceType`
  - `VariablesResourceType`
  - `ViewsResourceType`

#### Flux updates

- Update to [Flux v0.130.0](/flux/v0/release-notes/#v01300).
- Add support for [`influxdb.cardinality()`](/flux/v0/stdlib/influxdata/influxdb/cardinality/) function.
- Operational improvements:
  - Add logging to Flux end-to-end tests (`TestFluxEndToEnd`) to help diagnose test failures.
  - Add `--flux-log-enabled` option to [`influxd`](/influxdb/v2/reference/config-options/) to show detailed logs for Flux queries.

#### Performance enhancements

- Optimize series iteration for queries that can be answered without inspecting TSM data.
- Optimize queries with predicates that contain multiple measurements.

### Bug fixes

This release includes the following bug fixes and updates:

- [API fix](#api-fix)
- [Dependency update](#dependency-update)
- [Error updates](#error-updates)
- [Limit update](#limit-update)
- [Miscellaneous operational fixes](#miscellaneous-operational-fixes)
- [Task updates](#task-updates)
- [Version maintenance](#version-maintenance)

#### API fix

- Correctly filter requests to `/api/v2/authorizations` by `org` and `user` parameters.

#### Dependency update

- Include `curl` as a dependency in `influxdb2` packages.

#### Errors updates

- Add message to set the Flux `content-type` when a query fails to parse as JSON.
- Discard excessive errors over `DefaultMaxSavedErrors (100)` to prevent out-of-memory crashes.
- Upgrade `golang.org/x/sys` to avoid panics on macs.

#### Limit update

- Implement hard limit on field size (`MaxFieldValueLength = 1048576`) while parsing line protocol.

#### Miscellaneous operational fixes

- Resolve the compaction queue stats flutter.
- Ensure the TSI index compacts log files that meet one of the following criteria:
  - Log file hasn't been updated (no new series have been added to the shard) for 4 (or more) hours (to change this duration, specify a new [`storage-compact-full-write-cold-duration`](/influxdb/v2/reference/config-options/#storage-compact-full-write-cold-duration))
  - Log file is one (or more) megabytes (to update this size, specify a new [`storage-max-index-log-file-size`](/influxdb/v2/reference/config-options/#storage-max-index-log-file-size))
- Repair bad port dropping return value names.
- Use consistent path separator in permission string representation.
- (Windows only) Copy snapshot files being backed up.

#### Task updates

- Updating an inactive task no longer schedules it.
- Preserve comments in Flux queries when saving task definitions.

#### Version maintenance

- Fix `X-Influxdb-Build` and `X-Influxdb-Version` response header at `/ping`.
- Upgrade `influxql` to latest version and fix predicate handling for `SHOW TAG VALUES` meta queries.

---

## v2.0.8 {date="2021-08-13"}

{{% warn %}} #### Upcoming changes to influx CLI packaging

Beginning in InfluxDB 2.1, the `influx` CLI will no longer be packaged with the release. Future versions of `influx` CLI will be released from the [influx-cli](https://github.com/influxdata/influx-cli) repository.

To adopt the new, separate `influx` CLI early, download the latest release from [GitHub](https://github.com/influxdata/influx-cli/releases/tag/v2.3.0) or from the [InfluxData Downloads portal](https://www.influxdata.com/downloads/).
{{% /warn %}}

### Go version

- Upgrade to Go 1.16. **Requires macOS Sierra 10.12 or later to run.**

### Features

- Add `--ui-disabled` option to `influxd` to support running with the UI disabled.
- Telemetry improvements: Do not record telemetry data for non-existent paths; replace invalid static asset paths with a slug.
- Upgrade to Flux v0.124.0.
- Upgrade to UI v2.0.8.
- Upgrade `flux-lsp-browser` to v0.5.53.

### Bug fixes

- Rename ARM RPM packages with yum-compatible names.
- Upgrade to latest version of `influxdata/cron` so that tasks can be created with interval of `every: 1w`.
- Avoid rewriting `fields.idx` unnecessarily.
- Do not close connection twice in DigestWithOptions.
- Remove incorrect optimization for group-by.
- Return an error instead of panicking when InfluxQL statement rewrites fail.
- Migrate restored KV snapshots to latest schema before using them.
- Specify which fields are missing when rejecting an incomplete onboarding request.
- Ensure `systemd` unit blocks on startup until HTTP endpoint is ready.
- Fix display and parsing of `influxd upgrade` CLI prompts in PowerShell.
- Removed unused `chronograf-migator` package and chronograf API service, and updated various "chronograf" references.
- Fix display and parsing of interactive `influx` CLI prompts in PowerShell.
- Upgrade to `golang-jwt` 3.2.1.
- Prevent silently dropped writes when there are overlapping shards.
- Invalid requests to `/api/v2` subroutes now return 404 instead of a list of links.
- Flux meta queries for `_field` take fast path if `_measurement` is the only predicate.
- Copy names from `mmap` mapped memory before closing iterator.

---

## v2.0.7 {date="2021-06-04"}

### Features

- Optimize [`table.fill()`](/flux/v0/stdlib/experimental/table/fill/)
  execution within Flux aggregate windows.
- Upgrade Flux to [v0.117.0](/flux/v0/release-notes/#v01171).
- Upgrade UI to v2.0.7.
- Upgrade `flux-lsp-browser` to v0.5.47.

### Bug Fixes

- Fix query range calculation (off by one) over partially compacted data.
- Deprecate the unsupported `PostSetupUser` API.
- Add limits to the `/api/v2/delete` endpoint for start and stop times with error messages.
- Add logging to NATS streaming server to help debug startup failures.
- Accept `--input` instead of a positional argument in `influx restore`.
- Print error instead of panicking when `influx restore` fails to find backup manifests.
- Set last-modified time of empty shard directory to the directory's last-modified time, instead of the Unix epoch.
- Remove deadlock in `influx org members list` when an organization has greater than 10 members.
- Replace telemetry file name with slug for `ttf`, `woff`, and `eot` files.
- Enable use of absolute path for `--upgrade-log` when running `influxd upgrade` on Windows.
- Make InfluxQL meta queries respect query timeouts.

---

## v2.0.6 General Availability {date="2021-04-29"}

### Bug Fixes
- Ensure query configuration written by `influxd upgrade` is valid.
- Set `query-concurrency` and `query-queue-size` configuration option defaults
  to `0` to avoid validation failures when upgrading users.
- Correctly validate when `query-concurrency` is `0` and `query-queue-size` is
  greater than `0`.

---

## v2.0.5 General Availability {date="2021-04-27"}

{{% warn %}}
InfluxDB v2.0.5 introduced a defect that prevents users from successfully upgrading
from InfluxDB 1.x to 2.0 using the `influxd upgrade` command or Docker.
To [automatically upgrade from 1.x to 2.0](/influxdb/v2/upgrade/v1-to-v2/automatic-upgrade/)
with the `influxd upgrade` command or [with Docker](/influxdb/v2/upgrade/v1-to-v2/docker/),
use [InfluxDB v2.0.6](#v206-general-availability).
{{% /warn %}}

### Windows Support
This release includes our initial Windows preview build.

### Breaking Changes

#### /debug/vars removed
Prior to this release, the `influxd` server would expose profiling information over the `/debug/vars` endpoint.
This endpoint was unauthenticated and not used by InfluxDB systems to report diagnostics.
For security and clarity, the endpoint has been removed.
Use the `/metrics` endpoint to collect system statistics.

#### `influx transpile` removed
The `transpile` command has been removed. Send InfluxQL requests directly to the server via the `/api/v2/query`
or `/query` HTTP endpoints.

#### Default query concurrency changed
The default setting for the max number of concurrent Flux queries has been changed from 10 to unlimited (`0`).
To limit query concurrency and queue size:

1. Set the `query-concurrency` config parameter to > 0 when running `influxd` to re-limit the maximum running query count,
2. Set the `query-queue-size` config parameter to > 0 to set the max number of queries that can be queued before the
   server starts rejecting requests.

#### Prefix for query-controller metrics changed
The prefix used for Prometheus metrics from the query controller has changed from `query_control_` to `qc_`.

### Features
- Add [Swift client library](https://github.com/influxdata/influxdb-client-swift)
  to the **Load Data** section of the InfluxDB UI.
- Add [`influx task retry-failed` command](/influxdb/v2/reference/cli/influx/task/retry-failed/) to rerun failed runs.
- Add [`--compression` option](/influxdb/v2/reference/cli/influx/write/#flags)
  to the `influx write` command to support Gzip inputs.
- Add new `influxd` configuration options:
  - [pprof-disabled](/influxdb/v2/reference/config-options/#pprof-disabled)
  - [metrics-disabled](/influxdb/v2/reference/config-options/#metrics-disabled)
  - [http-read-header-timeout](/influxdb/v2/reference/config-options/#http-read-header-timeout)
  - [http-read-timeout](/influxdb/v2/reference/config-options/#http-read-timeout)
  - [http-write-timeout](/influxdb/v2/reference/config-options/#http-write-timeout)
  - [http-idle-timeout](/influxdb/v2/reference/config-options/#http-idle-timeout)
- Add `/debug/pprof/all` HTTP endpoint to gather all profiles at once.
- Include the InfluxDB 1.x `http.pprof-enabled` configuration option in the 2.0 configuration file generated by the [InfluxDB upgrade process](/influxdb/v2/upgrade/v1-to-v2/automatic-upgrade/).
- Add support for [custom shard group durations](/influxdb/v2/reference/cli/influx/bucket/create#create-a-bucket-with-a-custom-shard-group-duration) on buckets.
- Optimize regular expression conditions in InfluxQL subqueries.
- Update Telegraf plugins in the InfluxDB UI to include additions and changes from
  [Telegraf 1.18](/telegraf/v1/release-notes/#v118).
- Display task IDs in the tasks list in the InfluxDB UI.
- Write to standard output (`stdout`) when `--output-path -` is passed to [`influxd inspect export-lp`](/influxdb/v2/reference/cli/influxd/inspect/export-lp/).
- Add `-p, --profilers` flag to [`influx query` command](/influxdb/v2/reference/cli/influx/query/)
  to enable [Flux profilers](/flux/v0/stdlib/profiler/) on
  a query executed from the `influx` CLI.
- Update InfluxDB OSS UI to match InfluxDB Cloud.
- Support disabling concurrency limits in the Flux controller.
- Replace unique resource IDs (UI assets, backup shards) with slugs to reduce
  cardinality of telemetry data.
- Standardize HTTP server error log output.
- Enable InfluxDB user interface features:
  - [Band visualization type](/influxdb/v2/visualize-data/visualization-types/band/)
  - [Mosiac visualization type](/influxdb/v2/visualize-data/visualization-types/mosaic/)
  - [Configure axis tick marks](/influxdb/v2/visualize-data/visualization-types/graph/#x-axis)
  - Upload CSV files through the InfluxDB UI
  - [Edit Telegraf configurations](/influxdb/v2/tools/telegraf-configs/update/#edit-the-configuration-file-directly-in-the-ui) in the InfluxDB UI
  - [Legend orientation options](/influxdb/v2/visualize-data/visualization-types/graph/#legend)
  - [Refresh a single dashboard cell](/influxdb/v2/visualize-data/dashboards/control-dashboard/#refresh-a-single-dashboard-cell)
- Upgrade to **Flux v0.113.0**.

### Bug Fixes
- Prevent "do not have an execution context" error when parsing Flux options in tasks.
- Fix swagger to match implementation of DBRPs type.
- Fix use-after-free bug in series ID iterator.
- Fix TSM and WAL segment size check to check against the local `SegmentSize`.
- Fix TSM and WAL segment size computing to correctly calculate `totalOldDiskSize`.
- Update references to the documentation site to use current URLs.
- Fix data race in then TSM engine when inspecting tombstone statistics.
- Fix data race in then TSM cache.
- Deprecate misleading `retentionPeriodHrs` key in the onboarding API.
- Fix Single Stat graphs with thresholds crashing on negative values.
- Fix InfluxDB port in Flux function UI examples.
- Remove unauthenticated, unsupported `/debug/vars` HTTP endpoint.
- Respect 24 hour clock formats in the InfluxDB UI and add more format choices.
- Prevent "do not have an execution context" error when parsing Flux options in tasks.
- Prevent time field names from being formatted in the Table visualization.
- Log error details when `influxd upgrade` fails to migrate databases.
- Fix the cipher suite used when TLS strict ciphers are enabled in `influxd`.
- Fix parse error in UI for tag filters containing regular expression meta characters.
- Prevent concurrent access panic when gathering bolt metrics.
- Fix race condition in Flux controller shutdown.
- Reduce lock contention when adding new fields and measurements.
- Escape dots in community templates hostname regular expression.

---

## v2.0.4 General Availability {date="2021-02-04"}

### Docker

#### ARM64
This release extends the Docker builds hosted in `quay.io` to support the Linux/ARM64 platform.

#### 2.x nightly images
Prior to this release, competing nightly builds caused the nightly Docker tag to contain outdated binaries. This conflict is fixed, and the image tagged with nightly now contains 2.x binaries built from the `HEAD` of the `master` branch.

### Breaking Changes

#### `inmem` index option removed

This release fully removes the `inmem` indexing option, along with the associated config options:
- `max-series-per-database`
- `max-values-per-tag`

The startup process automatically generates replacement `tsi1` indexes for shards that need it.

### Features

#### `influxd` updates
- Add new [`influxd upgrade`](/influxdb/v2/reference/cli/influxd/upgrade/) flag `—overwrite-existing-v2` to overwrite existing files at output paths (instead of aborting).
- Add new configuration options:
       - [`nats-port`](/influxdb/v2/reference/config-options/#nats-port)
       - [`nats-max-payload-bytes`](/influxdb/v2/reference/config-options/#nats-max-payload-bytes)
- Add new commands:
       - Add [`influxd print-config`](/influxdb/v2/reference/cli/influxd/print-config/) to support automated configuration inspection.
       - Add [`influxd inspect export-lp`](/influxdb/v2/reference/cli/influxd/inspect/export-lp/) to extract data in line-protocol format.

#### New Telegraf plugins in UI
- Update Telegraf plugins list in UI to include Beat, Intel PowerStats, and Rienmann.

#### Performance improvements
- Promote schema and fill query optimizations to default behavior.

#### Flux updates
- Upgrade to [Flux v0.104.0](/flux/v0/release-notes/#v0-104-0).
- Upgrade to `flux-lsp-browser` v0.5.31.

### Bug Fixes

- Standardize binary naming conventions.
- Fix configuration loading issue.
- Add Flux dictionary expressions to Swagger documentation.
- Ensure `influxdb` service sees default environment variables when running under `init.d`.
- Remove upgrade notice from new installs.
- Ensure `config.toml` is initialized on new installs.
- Include upgrade helper script (`influxdb2-upgrade.sh`) in GoReleaser manifest.
- Prevent `influx stack update` from overwriting stack name and description.
- Fix timeout setup for `influxd` graceful shutdown.
- Require user to set password during initial user onboarding.
- Error message improvements:
  - Remove duplication from task error messages.
  - Improve error message shown when influx CLI can't find an `org` by name.
  - Improve error message when opening BoltDB with unsupported file system options.
  - Improve messages in DBRP API validation errors.
- `influxd upgrade` improvements:
  - Add confirmation step with file sizes before copying data files.
  - Prevent panic in `influxd upgrade` when v1 users exist but v1 config is missing.
- Fix logging initialization for storage engine.
- Don't return 500 codes for partial write failures.
- Don't leak `.tmp` files while backing up shards.
- Allow backups to complete while a snapshot is in progress.
- Fix silent failure to register CLI arguments as required.
- Fix loading when `INFLUXD_CONFIG_PATH` points to a .yml file.
- Prevent extra output row from GROUP BY crossing DST boundary.
- Update Flux functions list in UI to reflect that `v1` package was renamed to `schema`.
- Set correct `Content-Type` on v1 query responses.
- Respect the `--skip-verify` flag when running `influx query`.
- Remove blank lines from payloads sent by `influx write`.
- Fix infinite loop in Flux parser caused by invalid array expressions.
- Support creating users without initial passwords in `influx user create`.
- Fix incorrect errors when passing `--bucket-id` to `influx write`.

---

## v2.0.3 General Availability {date="2020-12-14"}

### Breaking Changes

#### `influxd upgrade`

Previously, `influxd upgrade` would attempt to write upgraded `config.toml` files into the same directory as the source
`influxdb.conf` file. If this failed, a warning would be logged and `config.toml` would write into the `home` directory of the user who launched the upgrade.

This release breaks this behavior in two ways:

- By default, `config.toml` writes into the same directory as the Bolt DB and engine files (`~/.influxdbv2/`)
- If writing upgraded config fails, the `upgrade` process exits with an error instead of falling back to the `HOME` directory

To override the default configuration path (`~/.influxdbv2/`), use the new `--v2-config-path` option to specify the output path to the v2 configuration file (`config.toml`). For details, see [Upgrade from InfluxDB 1.x to InfluxDB 2.0](/influxdb/v2/upgrade/v1-to-v2/).

#### InfluxDB v2 packaging

We've renamed the InfluxDB v2 DEB and RPM packages to clarify versions. The package name is now `influxdb2` and conflicts with any previous `influxdb` package (including initial 2.0.0, 2.0.1, and 2.0.2 packages).

This release also defines v2-specific path defaults and provides [helper scripts](https://github.com/influxdata/influxdb/blob/master/scripts/influxdb2-upgrade.sh) for `influxd upgrade` and cleanup cases.

### Features

- Allow password to be specified as a CLI option in [`influx v1 auth create`](/influxdb/cloud/reference/cli/influx/auth/create/).
- Allow password to be specified as a CLI option in [`influx v1 auth set-password`](/influxdb/cloud/reference/cli/influx/auth/).
- Implement [delete with predicate](/influxdb/v2/write-data/delete-data/).
- Improve ID-related error messages for `influx v1 dbrp` commands.
- Update Flux to [v0.99.0](/flux/v0/release-notes/#v0-99-0).
- Update `flux-lsp-browser` to v0.5.25.
- Support for ARM64 preview build.

### Bug Fixes

- Don't log bodies of v1 write request bodies.
- Fix panic when writing a point with 100 or more tags.
- Fix validation of existing DB names when creating DBRP mappings.
- Enforce max value of 2147483647 on query concurrency to avoid startup panic.
- Automatically migrate existing DBRP mappings from old schema to avoid panic.
- Optimize shard lookup in groups containing only one shard.
- Always respect the `--name` option in `influx setup`.
- Allow for 0 (infinite) values for `--retention` in `influx setup`.
- Fix panic when using a `null` value as a record or array in a Flux query.

---

## v2.0.2 General Availability {date="2020-11-19"}

### Breaking changes

#### DBRP HTTP API now matches Swagger documentation

Previously, the database retention policy (DBRP) mapping API did not match the swagger spec. If you're using scripts based on the previous implementation instead of the swagger spec, you'll need to either update them or use the new [DBRP CLI commands](/influxdb/v2/reference/cli/influx/v1/dbrp/) instead.

### Features
- Improvements to upgrade from 1.x to 2.x:
  - Warning appears if auth is not enabled in 1.x (`auth-enabled = false`), which is not an option in 2.x. For details, see [Upgrade from InfluxDB 1.x to InfluxDB 2.0](/influxdb/v2/upgrade/v1-to-v2/).
  - `upgrade` command now checks to see if continuous queries are running and automatically exports them to a local file.
- Upgrade to [Flux v0.95.0](/flux/v0/release-notes/#v0-95-0).
- Upgrade `flux-lsp-browser` to v.0.5.23.
- Manage database retention policy (DBRP) mappings via CLI. See [`influx v1 dbrp`](/influxdb/v2/reference/cli/influx/v1/dbrp/).
- Filter task runs by time.

### Bug Fixes
- Fixes to `influx upgrade` command:
  - Remove internal subcommands from help text.
  - Validate used input paths upfront.
- Add locking during TSI iteration creation.
- Fix various typos.
- Use `--skip-verify` flag for backup/restore CLI command. This is passed to the underlying HTTP client for the `BackupService` and `RestoreService` to support backup and restore on servers with self-signed certificates.
- Don't automatically print help on `influxd` errors.
- Add `SameSite=Strict` flag to session cookie.
- Ensure `SHOW DATABASES` returns a list of the unique databases only.
- Allow scraper to ignore insecure certificates on an endpoint.
- Ensure Flux reads across all shards.
- Use the associated default retention policies defined within the DBRP mapping if no retention policy is specified as part of a v1 write API call.
- Add locking during TSI iterator creation.
- Allow self-signed certificates for scraper targets.
- Bump version in `package.json` so it appears correctly.

---

## v2.0.1 General Availability {date="2020-11-10"}

InfluxDB 2.0 general availability (GA) introduces the first **production-ready** open source version of InfluxDB 2.0. This release comprises all features and bug fixes included in prior alpha, beta, and release candidate versions.

{{% note %}}
#### Known issues

##### Delete with predicate API not implemented

The delete with predicate API (`/api/v2/delete`) has not been implemented and currently returns a `501 Not implemented` message. This API will be implemented post GA.

##### Duplicate DBRP mappings per database

When there are multiple [DBRP mappings](/influxdb/v2/reference/api/influxdb-1x/dbrp/) with the same database name in InfluxDB 1.x, SHOW DATABASES incorrectly returns duplicates.
{{% /note %}}

Highlights include:

- Support for **upgrading to InfluxDB 2.0**:
 - To upgrade **from InfluxDB 1.x**, see [Upgrade from InfluxDB 1.x to InfluxDB 2.0](/influxdb/v2/upgrade/v1-to-v2).
 - To upgrade **from InfluxDB 2.0 beta 16 or earlier**, see [Upgrade from InfluxDB 2.0 beta to InfluxDB 2.0](/influxdb/v2/install/upgrade/v2-beta-to-v2/).
- **Flux**, our powerful new functional data scripting language designed for querying, analyzing, and acting on data. This release includes [Flux v0.94.0](/flux/v0/release-notes/#v0940). If you're new to Flux, [check out how to get started with Flux](/influxdb/v2/query-data/get-started/). Next, delve deeper into the [Flux standard library](/flux/v0/stdlib//) reference docs and see how to [query with Flux](/influxdb/v2/query-data/flux/).
- Support for [InfluxDB 1.x API compatibility](/influxdb/v2/reference/api/influxdb-1x/).
- **Templates** and **stacks**. Discover how to [use community templates](/influxdb/v2/tools/influxdb-templates/use/) and how to [manage templates with stacks](/influxdb/v2/tools/influxdb-templates/stacks/).

If you're new to InfluxDB 2.0, we recommend checking out [how to get started](/influxdb/v2/get-started/) and [InfluxDB key concepts](/influxdb/v2/reference/key-concepts/).

---

## v2.0.0 {date="2020-11-09"}

### Features
- Improve  UI for v1 `influx auth` commands.
- Upgrade to [Flux v0.94.0](/flux/v0/release-notes/#v0940)
- Upgrade `flux-lsp-browser` to v0.5.22.
- Add [RAS Telegraf input plugin](/telegraf/v1/plugins//#ras).

### Bug Fixes

- Remove unused `security-script` option from `influx upgrade` command.
- Fix parsing of retention policy CLI arguments in `influx setup` and `influxd upgrade`.
- Create CLI configs during upgrade to v2.
- Allow write-only v1 tokens to find database retention policies (DBRPs).
- Update `v1 auth` description.
- Use `db`/`rp` naming convention when migrating databases to buckets.
- Improve help text for `influxd` and `--no-password` switch.
- Use `10` instead of `MaxInt` when rewriting query-concurrency.
- Remove bucket and mapping auto-creation from `/write` 1.x compatibility API.
- Fix misuse of `reflect.SliceHeader`.

---

## v2.0.0-rc.4 {date="2020-11-05"}

### Features

- Upgrade to [Flux v0.93.0](/flux/v0/release-notes/#v0930).
- Add `influx backup` and `influx restore` CLI commands to support backing up and restoring data in InfluxDB 2.0.
- Add the `v1/authorization` package to support authorizing requests to the InfluxDB 1.x API.

### Bug Fixes

- Add a new `CreateUniquePhysicalNode` method, which reads and applies the plan node ID in context. Each physical node has a unique ID to support planner rules applied more than once in a query. Previously, the same node ID (hence the same dataset ID) caused the execution engine to generate undefined results.
- A cloned task is now only activated when you select **Active**. Previously, a cloned task was activated if the original task was activated.
- Reduce the `influx` binary file size.
- Isolate the `TelegrafConfigService` and remove URM interactions.
- Use the updated HTTP client for the authorization service.
- Make `tagKeys` and `tagValues` work for edge cases involving fields.
- Correctly parse float as 64-bits.
- Add simple metrics related to installed templates.
- Remove extra multiplication of retention policies in onboarding.
- Use the `fluxinit` package to initialize the Flux library instead of builtin.
- Add Logger to the constructor function to ensure the log field is initialized.
- Return an empty iterator instead of null in `tagValues`.
- Fix the `/ready` response content type to return `application/json`.

---

## v2.0.0-rc.3 {date="2020-10-29"}

### Features

- Upgrade to [Flux v0.91.0](/flux/v0/release-notes/#v0910).
- Enable window aggregate mean pushdown.
- Add `newMultiShardArrayCursors` to aggregate array cursors.
- UI updates:
  - Upgrade `papaparse` to 5.2.0.
  - Upgrade `flux-lsp-browser` to v0.5.21.
  - Add properties for storing your tick generation selections, including a `generateAxisTicks` property to turn this feature on and off.
  - Update generate ticks into an array of properties for each axis.
  - Add the `legendColorizeRows` property to toggle the color on and off in the legend.

### Bug Fixes

- Resolve `invalid operation: fs.Bavail` error that occurred in some cases using when `DiskUsage()`. Now, `fs.Bavail` is always converted to `unit64` to ensure the types in an expression align.
- Refactor notifications to isolate the `notification/endpoint/service` package and move the rule service into its own package.
- Update to clear log out.
- Refactor to allow `newIndexSeriesCursor()` to accept an `influxql.Expr`.
- Remove unreferenced packages.

---

## v2.0.0-rc.2 {date="2020-10-22"}

### Features

- Upgrade to [Flux v0.90.0](/flux/v0/release-notes/#v0900).
- Add `--force` option to the `influx stacks rm` command, which lets you remove a stack without the confirmation prompt.
- Add `aggregate_resultset` for mean aggregate pushdown to optimize windowed results.
- Return an error if adding a resource to a stack (`influx stacks update --addResource`) fails due to an invalid resource type or resource ID.

### Bug Fixes

- Update `pkger` test templates to use valid Flux to avoid `found unexpected argument end` error. Previously, any template with a `v.dashboardVariable` returned an `undefined identifier v` error.
- Update the InfluxDB configuration file `/etc/influxdb/influxdb.conf` to recognize the user's home directory. Previously, if a user (other than root user) ran the `upgrade` command, a permissions error occurred.
- Remove the Telegraf RAS Daemon plugin and other miscellaneous Telegraf plugin updates.
- Update the `derivative` in the InfluxDB UI (`ui/src/timeMachiner`) to specify the `unit` is one second (`1s`).
- Enable the new `AuthorizationService` from authorization package in the `launcher` package (`cmd\influxd\launcher`).
- Update `config upgrade` to save the correct InfluxDB configuration filename.

---

## v2.0.0-rc.1 {date="2020-10-14"}

### Features
- Add [`influx upgrade`](/influxdb/v2/reference/cli/influxd/upgrade/) command for upgrading from 1.x to 2.0.
- Upgrade to Flux v0.89.0.

### Bug Fixes
- Enable scrapers. (Scrapers did not work in rc0.)
- Update default number of tasks listed with `influx task list` to 100.
- Add support for [duration unit identifiers](/flux/v0/spec/lexical-elements/#duration-literals) to templates.
- Preserve cell colors in imported and exported templates.
- Resolve issue to ensure the `influx` CLI successfully returns a single Telegraf configuration.
- Ensure passwords are at least 8 characters in `influx setup`.

---

## v2.0.0-rc.0 {date="2020-09-29"}

{{% warn %}}
#### Manual upgrade required

To simplify the migration for existing users of InfluxDB 1.x, this release includes significant breaking changes that require a manual upgrade from all alpha and beta versions. For more information, see [Upgrade to InfluxDB OSS 2.0rc](/influxdb/v2/install/upgrade/v2-beta-to-v2/),
{{% /warn %}}

### Breaking changes

#### Manual upgrade

- To continue using data from InfluxDB 2.0 beta 16 or earlier, you must move all existing data out of the `~/.influxdbv2` (or equivalent) path, including `influxd.bolt`. All existing dashboards, tasks, integrations, alerts, users, and tokens must be recreated. For information on how to migrate your data, see [Upgrade to InfluxDB OSS 2.0rc](/influxdb/v2/install/upgrade/v2-beta-to-v2/).

#### Port update to 8086

- Change the default port of InfluxDB from 9999 back to 8086. If you would still like to run on port 9999, you can start `influxd` with the `--http-bind-address` option. You must also [update any InfluxDB CLI configuration profiles](/influxdb/v2/reference/cli/influx/config/set/) with the new port number.

#### Support for 1.x storage engine and InfluxDB 1.x compatibility API

- Port the TSM1 storage engine. This change supports a multi-shared storage engine and InfluxQL writes and queries using the InfluxDB 1.x API compatibility [`/write`](/influxdb/v2/reference/api/influxdb-1x/write/) and [`/query`](/influxdb/v2/reference/api/influxdb-1x/query/) endpoints.

#### Disable delete with predicate API

- Disable the delete with predicate API (`/api/v2/delete`). This API now returns a `501 Not implemented` message.

### Features

#### Load Data redesign

- Update the Load Data page to increase discovery and ease of use. Now, you can [load data from sources in the InfluxDB user interface](/influxdb/v2/write-data/no-code/load-data/).

#### Community templates added to InfluxDB UI

- Add [InfluxDB community templates](/influxdb/v2/tools/influxdb-templates/) directly in the InfluxDB user interface (UI).

#### New data sources

- Add InfluxDB v2 Listener, NSD, OPC-UA, and Windows Event Log to the Sources page.

#### CLI updates

- Add option to print raw query results in [`influx query`](/influxdb/v2/reference/cli/influx/query/).
- Add ability to export resources by name using [`influx export`](/influxdb/v2/reference/cli/influx/export/).
- Add new processing options and enhancements to [`influx write`](/influxdb/v2/reference/cli/influx/write/).
- Add `--active-config` flag to [`influx` commands](/influxdb/v2/reference/cli/influx/#commands) to set the configuration for a single command.
- Add `influxd`[configuration options](/influxdb/v2/reference/config-options/#configuration-options) for storage options and InfluxQL coordinator tuning.
- Add `max-line-length` switch to the [`influx write`](/influxdb/v2/reference/cli/influx/write/) command to address `token too long errors` for large inputs.

#### API updates

- List buckets in the API now supports the `after` (ID) parameter as an alternative to `offset`.

#### Task updates

- Record last success and failure run times in the task.
- Inject the task option `latestSuccessTime` in Flux `Extern`.

### Bug Fixes

- Add description to [`influx auth`](/influxdb/v2/reference/cli/influx/auth/) command outputs.
- Resolve issues with check triggers in notification tasks by including the edge of the observed boundary.
- Detect and provide warning about duplicate tag names when writing CSV data using `influx write`.
- Ensure the group annotation does not override the existing line part (measurement, field, tag, time) in a CSV group annotation.
- Added `PATCH` to the list of allowed methods.

---

## v2.0.0-beta.16 {date="2020-08-06"}

{{% warn %}}
This release includes breaking changes:
- Remove `influx repl` command. To use the Flux REPL, build the REPL from source.
- Drop deprecated `/packages` route tree.
- Support more types for template `envRef` default value and require explicit default values.
- Remove orgs/labels nested routes from the API.
{{% /warn %}}

### Features

- Add resource links to a stack's resources from public HTTP API list/read calls.
- Enhance resource creation experience when limits are reached.
- Add `dashboards` command to `influx` CLI.
- Allow user onboarding to optionally set passwords.
- Limit query response sizes for queries built in QueryBuilder by requiring an aggregate window.

### Bug Fixes

- Require all `influx` CLI flag arguments to be valid.
- Dashboard cells correctly map results when multiple queries exist.
- Dashboard cells and overlay use UTC as query time when toggling to UTC timezone.
- Bucket names may not include quotation marks.

### UI Improvements

- Alerts page filter inputs now have tab indices for keyboard navigation.

---

## v2.0.0-beta.15 {date="2020-07-23"}

### Features

- Add event source to stacks.
- Add ability to uninstall stacks.
- Drop deprecated `influx pkg` commands.
- Add Telegraf management commands to `influx` CLI.
- Enable dynamic destination for the `influx` CLI configuration file.

### Bug Fixes

- Allow 0 to be the custom set minimum value for y domain.
- Single Stat cells render properly in Safari.
- Limit variable querying when submitting queries to used variables.

---

## v2.0.0-beta.14 {date="2020-07-08"}

### Features

- Extend `influx stacks update` command with ability to add resources without apply template.
- Consolidate all InfluxDB template and stack functionality into two new public APIs: `/api/v2/templates` and `/api/v2/stacks`.
- Extend template `Summary` and `Diff` nested types with `kind` identifiers.
- Add static builds for Linux.
- Update Flux to v.0.71.1.

### Bug Fixes

- Don't overwrite build date set via `ldflags`.
- Fix issue where define query was unusable after importing a Check.
- Update documentation links

---

## v2.0.0-beta.13 {date="2020-06-25"}

### Features

- Cancel submitted queries in the Data Explorer.
- Extend templates with the source `file|url|reader`.
- Collect stats on installed InfluxData community template usage.
- Allow raw `github.com` host URLs for `yaml|json|jsonnet` URLs in InfluxDB templates.
- Allow for remote files for all `influx template` commands.
- Extend stacks API with update capability.
- Add support for config files to `influxd` and any `cli.NewCommand` use case.
- Extend `influx stacks` command with new `influx stacks update` command.
- Skip resources in a template by kind or by `metadata.name`.
- Extend `influx apply` with resource filter capabilities.
- Provide active configuration when running `influx config` without arguments.
- Enable `influxd` binary to look for a configuration file on startup.
- Add environmental default values to the template parser.
- Templates will store which dashboard variable should be selected by default.

### Bug Fixes

- Fix `uint` overflow during setup on 32bit systems.
- Drop support for `--local` flag within `influx` CLI.
- Fix issue where undefined queries in cells result in error in dashboard.
- Add support for day and week time identifiers in the CLI for bucket and setup commands.
- Cache dashboard cell query results to use as a reference for cell configurations.
- Validate `host-url` for `influx config create` and `influx config set` commands.
- Fix `influx` CLI flags to accurately depict flags for all commands.

---

## v2.0.0-beta.12 {date="2020-06-12"}

### Features

- Add option for Cloud users to use the `influx` CLI to interact with a Cloud instance. For more information, see how to [download and install the influx CLI](/influxdb/v2/get-started/) and then learn more about how the [influx - InfluxDB command line interface](/influxdb/v2/reference/cli/influx/) works.
- Consolidate `influx apply` commands under templates. Remove some nesting of the `influx` CLI commands.
- Make all `influx apply` applications stateful through stacks.
- Add ability to export a stack's existing resource state using `influx export`.
- Update `influx apply` commands with improved usage and examples in long form.
- Update `influx` CLI to include the `-version` command and return the User-Agent header.
- Add `RedirectTo` functionality to ensure Cloud users are redirected to the page that they were trying access after logging into Cloud.
- Maintain sort order on a dashboard after navigating away.
- Allow tasks to open in new tabs.

### Bug Fixes

- Support organization name and ID in DBRP operations.
- Prevent the CLI from failing when an unexpected flag is entered in the CLI.
- `influx delete` now respects the configuration settings.
- Store initialization for `pkger` enforced on reads.
- Backfill missing `fillColumns` field for histograms in `pkger`.
- Notify the user how to escape presentation mode when the feature is toggled.

### UI Improvements

- Display bucket ID in bucket list and enable 1-click copying.
- Update Tokens list to be consistent with other resource lists.
- Reduce the number of variables being hydrated when toggling variables.
- Redesign dashboard cell loading indicator to be more obvious.

---

## v2.0.0-beta.11 {date="2020-05-27"}

{{% warn %}}
The beta 11 version was **not released**. Changes below are included in the beta 12 release.
{{% /warn %}}

### Features

- Ability to set UTC time for a custom time range query.
- Ability to set a minimum or maximum value for the y-axis visualization setting (rather than requiring both).
- New `csv2lp` library for converting CSV (comma separated values) to InfluxDB line protocol.
- Add influxdb version to the InfluxDB v2 API `/health` endpoint.

### Bug Fixes

- Automatically adjust the drop-down list width to ensure the longest item in a list is visible.
- Fix bug in Graph + Single Stat visualizations to ensure `timeFormat` persists.
- Authorizer now exposes the full permission set. This adds the ability to derive which organizations the Authorizer has access to read or write to without using a User Request Management (URM) service.
- Fix issue causing variable selections to hydrate all variable values, decreasing the impact on network requests.
- Resolve scrollbar issues to ensure datasets are visible and scrollable.
- Check status now displays a warning if loading a large amount.

---

## v2.0.0-beta.10 {date="2020-05-07"}

### Features

- Add ability to delete a stack and all associated resources.
- Enforce DNS name compliance on the `metadata.name` field in all `pkger` resources.
- Add stateful `pkg` management with stacks.

### Bug Fixes

- Ensure `UpdateUser` cleans up the index when updating names.
- Ensure Checks can be set for zero values.

### UI Improvements

- Create buckets in the Data Explorer and Cell Editor.

---

## v2.0.0-beta.9 {date="2020-04-23"}

### Bug Fixes
- Add index for URM by user ID to improve lookup performance.
- Existing session expiration time is respected on session renewal.
- Make CLI respect environment variables and flags and extend support for config orgs to all commands.

### UI Improvements
- Update layout of alerts page to work on all screen sizes.
- Sort dashboards on Getting Started page by recently modified.
- Add single-color schemes for visualizations: Solid Red, Solid Blue, Solid Yellow, Solid Green, and Solid Purple.

---

## v2.0.0-beta.8 {date="2020-04-10"}

### Features
- Add `influx config` CLI command to switch back to previous activated configuration.
- Introduce new navigation menu.
- Add `-file` option to `influx query` and `influx task` CLI commands.
- Add support for command line options to limit memory for queries.

### Bug Fixes
- Fix card size and layout issues in dashboards index view.
- Fix check graph font and lines defaulting to black causing graph to be unreadable
- Fix text-wrapping display issue and popover sizing bug when adding labels to a resource.
- Respect the now-time of the compiled query if provided.
- Fix spacing between ticks.
- Fix typos in Flux functions list.

### UI Improvements
- Update layout of Alerts page to work on all screen sizes.
- Sort dashboards on Getting Started page by recently modified.

---

## v2.0.0-beta.7 {date="2020-03-27"}

### Features

- Add option to display dashboards in [light mode](/influxdb/v2/visualize-data/dashboards/control-dashboard/#toggle-dark-mode-and-light-mode).
- Add [shell `completion` commands](/influxdb/v2/reference/cli/influx/completion/) to the `influx` CLI.
  specified shell (`bash` or `zsh`).
- Make all `pkg` resources unique by `metadata.name` field.
- Ensure Telegraf configuration tokens aren't retrievable after creation. New tokens can be created after Telegraf has been setup.
- [Delete bucket by name](/influxdb/v2/admin/buckets/delete-bucket/#delete-a-bucket-by-name) using the `influx` CLI.
- Add helper module to write line protocol to specified URL, organization, and bucket.
- Add [`pkg stack`](/influxdb/v2/reference/cli/influx/stacks) for stateful package management.
- Add `--no-tasks` flag to `influxd` to disable scheduling of tasks.
- Add ability to output CLI output as JSON and hide table headers.
- Add an [easy way to switch configurations](/influxdb/v2/reference/cli/influx/config/#quickly-switch-between-configurations) using the `influx` CLI.

### Bug fixes

- Fix NodeJS logo display in Firefox.
- Fix Telegraf configuration bugs where system buckets were appearing in the Buckets list.
- Fix threshold check bug where checks could not be created when a field had a space in the name.
- Reuse slices built by iterator to reduce allocations.
- Updated duplicate check error message to be more explicit and actionable.

### UI improvements

- Redesign OSS Login page.
- Display graphic when a dashboard has no cells.

---

## v2.0.0-beta.6 {date="2020-03-12"}

### Features
- Clicking on bucket name takes user to Data Explorer with bucket selected.
- Extend pkger (InfluxDB Templates) dashboards with table view support.
- Allow for retention to be provided to `influx setup` command as a duration.
- Extend `influx pkg export all` capabilities to support filtering by label name and resource type.
- Added new login and sign-up screen for InfluxDB Cloud users that allows direct login from their region.
- Added new `influx config` CLI for managing multiple configurations.

### Bug Fixes
- Fixed issue where tasks were exported for notification rules.
- Fixed issue where tasks were not exported when exporting by organization ID.
- Fixed issue where tasks with imports in the query would break in pkger.
- Fixed issue where selecting an aggregate function in the script editor did not
  add the function to a new line.
- Fixed issue where creating a dashboard variable of type "map" piped the incorrect
  value when map variables were used in queries.
- Added missing usernames to `influx auth` CLI commands.
- Disabled group functionality for check query builder.
- Fixed cell configuration error that popped up when users created a dashboard
  and accessed the "Disk Usage" cell for the first time.
- Listing all the default variables in the Variable tab of the script editor.
- Fixed bug that prevented the interval status on the dashboard header from
  refreshing on selections.
- Updated table custom decimal feature for tables to update on focus.
- Fixed UI bug that set Telegraf config buttons off-center and resized config
  selections when filtering through the data.
- Fixed UI bug that caused dashboard cells to error when using `v.bucket` for the first time.
- Fixed appearance of client library logos in Safari.
- Fixed UI bug that prevented checks created with the query builder from updating.
- Fixed a bug that prevented dashboard cell queries from working properly when
  creating group queries using the query builder.

### UI Improvements
- Swap `billingURL` with `checkoutURL`.
- Move Cloud navigation to top of page instead of within left side navigation.
- Adjust aggregate window periods to use duration input with validation.

---

## v2.0.0-beta.5 {date="2020-02-27"}

### Features
- Update Flux to v0.61.0.
- Add secure flag to session cookie.
- Add optional secret value flag to `influx secret` command.

### Bug Fixes
- Sort dashboards on homepage alphabetically.
- Tokens page now sorts by status.
- Set the default value of tags in a check.
- Fix sort by variable type.
- Calculate correct stacked line cumulative when lines are different lengths.
- Resource cards are scrollable.
- Query Builder groups on column values, not tag values.
- Scatterplots render tooltips correctly.
- Remove pkger gauge chart requirement for color threshold type.
- Remove secret confirmation from `influx secret update`.

---

## v2.0.0-beta.4 {date="2020-02-14"}

### Features
- Added labels to buckets.
- Connect Monaco Editor to Flux LSP server.
- Update Flux to v0.59.6.

### Bug Fixes
- Revert bad indexing of `UserResourceMappings` and `Authorizations`.
- Prevent gauge visualization from becoming too small.

---

## v2.0.0-beta.3 {date="2020-02-11"}

### Features
- Extend `influx cli pkg command` with ability to take multiple files and directories.
- Extend `influx cli pkg command` with ability to take multiple URLs, files,
  directories, and stdin at the same time.
- `influx` CLI can manage secrets.

### Bug Fixes
- Fix notification rule renaming panics in UI.
- Fix the tooltip for stacked line graphs.
- Fixed false success notification for read-only users creating dashboards.
- Fix issue with pkger/http stack crashing on duplicate content type.

---

## v2.0.0-beta.2 {date="2020-01-24"}

### Features
- Change Influx packages to be CRD compliant.
- Allow trailing newline in credentials file and CLI integration.
- Add support for prefixed cursor search to ForwardCursor types.
- Add backup and restore.
- Introduce resource logger to tasks, buckets and organizations.

### Bug Fixes
- Check engine closed before collecting index metrics.
- Reject writes which use any of the reserved tag keys.

### UI Improvements
- Swap `billingURL` with `checkoutURL`.
- Move Cloud navigation to top of page instead of within left side navigation.
- Adjust aggregate window periods to use duration input with validation.

---

## v2.0.0-beta.1 {date="2020-01-08"}

### Features
- Add support for notification endpoints to `influx` templates and packages.
- Drop `id` prefix for secret key requirement for notification endpoints.
- Add support for check resource to `pkger` parser.
- Add support for check resource `pkger` dry run functionality
- Add support for check resource `pkger` apply functionality
- Add support for check resource `pkger` export functionality
- Add new `kv.ForwardCursor` interface.
- Add support for notification rule to `pkger` parser.
- Add support for notification rule `pkger` dry run functionality
- Add support for notification rule `pkger` apply functionality.
- Add support for notification rule `pkger` export functionality.
- Add support for tasks to `pkger` parser.
- Add support for tasks to `pkger` dry run functionality
- Add support for tasks to `pkger` apply functionality.
- Add support for tasks to `pkger` export functionality.
- Add `group()` to Query Builder.
- Add last run status to check and notification rules.
- Add last run status to tasks.
- Extend `pkger` apply functionality with ability to provide secrets outside of package.
- Add hide headers flag to `influx` CLI task find command.
- Manual overrides for readiness endpoint.
- Drop legacy inmem service implementation in favor of KV service with inmem dependency.
- Drop legacy bolt service implementation in favor of KV service with bolt dependency.
- While creating check, also display notification rules that would match check based on tag rules.
- Increase default bucket retention period to 30 days.
- Add toggle to table thresholds to allow users to choose between setting threshold colors to text or background.
- Add developer documentation.
- Capture User-Agent header as query source for logging purposes.

### Bug Fixes
- Ensure environment variables are applied consistently across command and fixes issue where `INFLUX_` environment variable prefix was not set globally.
- Remove default frontend sorting when flux queries specify sorting.
- Store canceled task runs in the correct bucket.
- Update `sortby` functionality for table frontend sorts to sort numbers correctly.
- Prevent potential infinite loop when finding tasks by organization.
- Retain user input when parsing invalid JSON during import.
- Fix test issues due to multiple flush/sign-ins being called in the same test suite.
- Update `influx` CLI to show only "see help" message, instead of the whole usage.
- Fix notification tag-matching rules and enable tests to verify.
- Extend y-axis when stacked graph is selected.
- Fix query reset bug that was resetting query in script editor whenever dates were changed.
- Fix table threshold bug defaulting set colors to the background.
- Time labels no longer squished to the left.
- Fix underlying issue with disappearing queries made in Advanced Mode.
- Prevent negative zero and allow zero to have decimal places.
- Limit data loader bucket selection to non system buckets.

### UI Improvements
- Add honeybadger reporting to create checks.

---

## v2.0.0-alpha.21 {date="2019-12-13"}

### Features
- Add stacked line layer option to graphs.
- Annotate log messages with trace ID, if available.
- Bucket create to accept an organization name flag.
- Add trace ID response header to query endpoint.

### Bug Fixes
- Allow table columns to be draggable in table settings.
- Light up the home page icon when active.
- Make numeric inputs first class citizens.
- Prompt users to make a dashboard when dashboards are empty.
- Remove name editing from query definition during threshold check creation.
- Wait until user stops dragging and releases marker before zooming in after threshold changes.
- Adds properties to each cell on `GET /dashboards/{dashboardID}`.
- Gracefully handle invalid user-supplied JSON.
- Fix crash when loading queries built using the query builder.
- Create cell view properties on dashboard creation.
- Update scrollbar style.
- Fixed table UI threshold colorization issue.
- Fixed windowPeriod issue that stemmed from Webpack rules.
- Added delete functionality to note cells so that they can be deleted
- Fix failure to create labels when creating Telegraf configs
- Fix crash when editing a Telegraf config.
- Updated start/end time functionality so that custom script time ranges overwrite dropdown selections.

---

## v2.0.0-alpha.20 {date="2019-11-20"}

### Features
- Add TLS insecure skip verify to influx CLI.
- Extend influx cli user create to allow for organization ID and user passwords to be set on user.
- Auto-populate organization IDs in the code samples.
- Expose bundle analysis tools for front end resources.
- Allow users to view just the output section of a Telegraf config.
- Allow users to see string data in single stat graph type.

### Bug Fixes
- Fix long startup when running `influx help`.
- Mock missing Flux dependencies when creating tasks.
- Ensure array cursor iterator stats accumulate all cursor stats.
- Hide Members section in Cloud environments.
- Change how cloud mode is enabled.
- Merge front end development environments.
- Refactor table state logic on the front end.
- Arrows in tables show data in ascending and descending order.
- Sort by retention rules now sorts by second.
- Horizontal scrollbar no longer covering data;
- Allow table columns to be draggable in table settings.
- Light up the home page icon when active.
- Make numeric inputs first-class citizens.
- Prompt users to make a dashboard when dashboards are empty.
- Remove name editing from query definition during threshold check creation.
- Wait until user stops dragging and releases marker before zooming in after threshold changes.

### UI Improvements
- Redesign cards and animations on Getting Started page.
- Allow users to filter with labels in Telegraf input search.

---

## v2.0.0-alpha.19 {date="2019-10-30"}

### Features
- Add shortcut for toggling comments and submitting in Script Editor.

### UI Improvements
- Redesign page headers to be more space-efficient.
- Add 403 handler that redirects back to the sign-in page on oats-generated routes.

### Bug Fixes
- Ensure users are created with an active status.
- Added missing string values for `CacheStatus` type.
- Disable saving for threshold check if no threshold selected.
- Query variable selector shows variable keys, not values.
- Create Label overlay disables the submit button and returns a UI error if name field is empty.
- Log error as info message on unauthorized API call attempts.
- Ensure `members` and `owners` endpoints lead to 404 when organization resource does not exist.
- Telegraf UI filter functionality shows results based on input name.
- Fix Telegraf UI sort functionality.
- Fix task UI sort functionality.
- Exiting a configuration of a dashboard cell properly renders the cell content.
- Newly created checks appear on the checklist.
- Changed task runs success status code from 200 to 201 to match Swagger documentation.
- Text areas have the correct height.

---

## v2.0.0-alpha.18 {date="2019-09-26"}

### Features
- Add jsonweb package for future JWT support.
- Added the JMeter Template dashboard.

### UI Improvements
- Display dashboards index as a grid.
- Add viewport scaling to html meta for responsive mobile scaling.
- Remove rename and delete functionality from system buckets.
-  Prevent new buckets from being named with the reserved `_` prefix.
- Prevent user from selecting system buckets when creating Scrapers, Telegraf configurations, read/write tokens, and when saving as a task.
- Limit values from draggable threshold handles to 2 decimal places.
- Redesign check builder UI to fill the screen and make more room for composing message templates.
- Move Tokens tab from Settings to Load Data page.
- Expose all Settings tabs in navigation menu.
- Added Stream and table functions to query builder.

### Bug Fixes
- Remove scrollbars blocking onboarding UI step.

---

## v2.0.0-alpha.17 {date="2019-08-14"}

### Features
- Optional gzip compression of the query CSV response.
- Add task types.
- When getting task runs from the API, runs will be returned in order of most recently scheduled first.

### Bug Fixes
- Fix authentication when updating a task with invalid org or bucket.
- Update the documentation link for Telegraf.
- Fix to surface errors properly as task notifications on create.
- Fix limiting of get runs for task.

---

## v2.0.0-alpha.16 {date="2019-07-25"}

### Bug Fixes
- Add link to documentation text in line protocol upload overlay.
- Fix issue in Authorization API, can't create auth for another user.
- Fix Influx CLI ignored user flag for auth creation.
- Fix the map example in the documentation.
- Ignore null/empty Flux rows which prevents a single stat/gauge crash.
- Fixes an issue where clicking on a dashboard name caused an incorrect redirect.
- Upgrade templates lib to 0.5.0.
- Upgrade giraffe lib to 0.16.1.
- Fix incorrect notification type for manually running a task.
- Fix an issue where canceled tasks did not resume.

---

## v2.0.0-alpha.15 {date="2019-07-11"}

### Features
- Add time zone support to UI.
- Added new storage inspection tool to verify TSM files.

### Bug Fixes
- Fix incorrect reporting of tasks as successful when errors occur during result iteration.

#### Known Issues
The version of Flux included in Alpha 14 introduced `null` support.
Most issues related to the `null` implementation have been fixed, but one known
issue remains--the `map()` function panics if the first record processed has a
`null` value.

---

## v2.0.0-alpha.14 {date="2019-06-28"}

### Features
- Add `influxd inspect verify-wal` tool.
- Move to [Flux 0.34.2](/flux/v0/release-notes/#v0342) -
  includes new string functions and initial multi-datasource support with `sql.from()`.
- Only click save once to save cell.
- Enable selecting more columns for line visualizations.

### UI Improvements
- Draw gauges correctly on HiDPI displays.
- Clamp gauge position to gauge domain.
- Improve display of error messages.
- Remove rendering bottleneck when streaming Flux responses.
- Prevent variable dropdown from clipping.

---

## v2.0.0-alpha.13 {date="2019-06-13"}

### Features
- Add static templates for system, Docker, Redis, Kubernetes.

---

## v2.0.0-alpha.12 {date="2019-06-13"}

### Features
- Enable formatting line graph y ticks with binary prefix.
- Add x and y column pickers to graph types.
- Add option to shade area below line graphs.

### Bug Fixes
- Fix performance regression in graph tooltips.

---

## v2.0.0-alpha.11 {date="2019-05-31"}

### Bug Fixes
- Correctly check if columnKeys include xColumn in heatmap.

---

## v2.0.0-alpha.10 {date="2019-05-30"}

### Features
- Add heatmap visualization type.
- Add scatterplot graph visualization type.
- Add description field to tasks.
- Add CLI arguments for configuring session length and renewal.
- Add smooth interpolation option to line graphs.

### Bug Fixes
- Removed hardcoded bucket for Getting Started with Flux dashboard.
- Ensure map type variables allow for selecting values.
- Generate more idiomatic Flux in query builder.
- Expand tab key presses to two spaces in the Flux editor.
- Prevent dragging of variable dropdowns when dragging a scrollbar inside the dropdown.
- Improve single stat computation.
- Fix crash when opening histogram settings with no data.

### UI Improvements
- Render checkboxes in query builder tag selection lists.
- Fix jumbled card text in Telegraf configuration wizard.
- Change scrapers in scrapers list to be resource cards.
- Export and download resource with formatted resource name with no spaces.

---

## v2.0.0-alpha.9 {date="2019-05-01"}

{{% warn %}}
**This will remove all tasks from your InfluxDB v2.0 instance.**

Before upgrading, [export all existing tasks](/influxdb/v2/process-data/manage-tasks/export-task/). After upgrading, [reimport your exported tasks](/influxdb/v2/process-data/manage-tasks/create-task/#import-a-task).
{{% /warn %}}

### Features
- Set autorefresh of dashboard to pause if absolute time range is selected.
- Switch task back end to a more modular and flexible system.
- Add org profile tab with ability to edit organization name.
- Add org name to dashboard page title.
- Add cautioning to bucket renaming.
- Add option to generate All Access token in tokens tab.
- Add option to generate read/write token in tokens tab.
- Add new Local Metrics Dashboard template that is created during Quick Start.

### Bug Fixes
- Fixed scroll clipping found in label editing flow.
- Prevent overlapping text and dot in time range dropdown.
- Updated link in notes cell to a more useful site.
- Show error message when adding line protocol.
- Update UI Flux function documentation.
- Update System template to support math with floats.
- Fix the `window` function documentation.
- Fix typo in the `range` Flux function example.
- Update the `systemTime` function to use `system.time`.

### UI Improvements
- Add general polish and empty states to Create Dashboard from Template overlay.

---

## v2.0.0-alpha.8 {date="2019-04-12"}

### Features
- Add the ability to edit token's description.
- Add the option to create a dashboard from a template.
- Add the ability to add labels on variables.
- Add switch organizations dropdown to home navigation menu item.
- Add create org to side nav.
- Add "Getting Started with Flux" template.
- Update to Flux v0.25.0.

### Bug Fixes
- Update shift to timeShift in Flux functions sidebar.

### UI Improvements
- Update cursor to grab when hovering draggable areas.
- Sync note editor text and preview scrolling.
- Add the ability to create a bucket when creating an organization.

---

## v2.0.0-alpha.7 {date="2019-03-28"}

### Features
- Insert Flux function near cursor in Flux Editor.
- Enable the use of variables in the Data Explorer and Cell Editor Overlay.
- Add a variable control bar to dashboards to select values for variables.
- Add ability to add variable to script from the side menu.
- Use time range for meta queries in Data Explorer and Cell Editor Overlay.
- Fix screen tearing bug in raw data view.
- Add copy to clipboard button to export overlays.
- Enable copying error messages to the clipboard from dashboard cells.
- Add the ability to update token's status in token list.
- Allow variables to be re-ordered within control bar on a dashboard.
- Add the ability to delete a template.
- Save user preference for variable control bar visibility and default to visible.
- Add the ability to clone a template.
- Add the ability to import a variable.

### Bug Fixes
- Fix mismatch in bucket row and header.
- Allows user to edit note on cell.
- Fix empty state styles in scrapers in org view.
- Fix bucket creation error when changing retention rules types.
- Fix task creation error when switching schedule types.
- Fix hidden horizontal scrollbars in flux raw data view.
- Fix screen tearing bug in raw data View.
- Fix routing loop.

### UI Improvements
- Move bucket selection in the query builder to the first card in the list.
- Ensure editor is automatically focused in Note Editor.
- Add ability to edit a template's name.

---

## v2.0.0-alpha.6 {date="2019-03-15"}

### Release Notes

{{% warn %}}
We have updated the way we do predefined dashboards to [include Templates](https://github.com/influxdata/influxdb/pull/12532)
in this release which will cause existing Organizations to not have a System
dashboard created when they build a new Telegraf configuration.
In order to get this functionality, remove your existing data and start from scratch.

_**This will remove all data from your InfluxDB v2.0 instance including time series data.**_

###### Linux and macOS
```sh
rm -f ~/.influxdbv2/influxd.bolt
```

Once completed, `v2.0.0-alpha.6` can be started.
{{% /warn %}}

### Features
- Add ability to import a dashboard.
- Add ability to import a dashboard from organization view.
- Add ability to export a dashboard and a task.
- Add `run` subcommand to `influxd` binary. This is also the default when no subcommand is specified.
- Add ability to save a query as a variable from the Data Explorer.
- Add System template on onboarding.

### Bug Fixes
- Stop scrollbars from covering text in Flux editor.

### UI Improvements
- Fine tune keyboard interactions for managing labels from a resource card.

---

## v2.0.0-alpha.5 {date="2019-03-08"}

{{% warn %}}
This release includes a breaking change to the format in which Time-Structured Merge Tree (TSM) and index data are stored on disk.
_**Existing local data will not be queryable after upgrading to this release.**_

Prior to installing this release, remove all storage-engine data from your local InfluxDB 2.x installation.
To remove only TSM and index data and preserve all other InfluxDB 2.x data (organizations, buckets, settings, etc),
run the following command.

###### Linux and macOS
```sh
rm -rf ~/.influxdbv2/engine
```

Once completed, InfluxDB v2.0.0-alpha.5 can be started.
{{% /warn %}}

### Features
- Add labels to cloned tasks.
- Add ability to filter resources by clicking a label.
- Add ability to add a member to org.
- Improve representation of TSM tagsets on disk.
- Add ability to remove a member from org.
- Update to Flux v0.21.4.

### Bug Fixes
- Prevent clipping of code snippets in Firefox.
- Prevent clipping of cell edit menus in dashboards.

### UI Improvements
- Make code snippet copy functionality easier to use.
- Always show live preview in note cell editor.
- Redesign scraper creation workflow.
- Show warning in Telegraf and scraper lists when user has no buckets.
- Streamline label addition, removal, and creation from the dashboards list.

---

## v2.0.0-alpha.4 {date="2019-02-21"}

### Features
- Add the ability to run a task manually from tasks page.
- Add the ability to select a custom time range in explorer and dashboard.
- Display the version information on the login page.
- Add the ability to update a variable's name and query.
- Add labels to cloned dashboard.
- Add ability filter resources by label name.
- Add ability to create or add labels to a resource from labels editor.
- Update to Flux v0.20.

### Bug Fixes
- Update the bucket retention policy to update the time in seconds.

### UI Improvements
- Update the preview in the label overlays to be shorter.
- Add notifications to scrapers page for created/deleted/updated scrapers.
- Add notifications to buckets page for created/deleted/updated buckets.
- Update the admin page to display error for password length.

---

## v2.0.0-alpha.3 {date="2019-02-15"}

### Features
- Add the ability to name a scraper target.
- Display scraper name as the first and only updatable column in scrapers list.
- Add the ability to view runs for a task.
- Display last completed run for tasks list.
- Add the ability to view the logs for a specific task run.

### Bug Fixes
- Update the inline edit for resource names to guard for empty strings.
- Prevent a new template dashboard from being created on every Telegraf config update.
- Fix overlapping buttons in Telegraf verify data step.

### UI Improvements
- Move the download Telegraf config button to view config overlay.
- Combine permissions for user by type.

---

## v2.0.0-alpha.2 {date="2019-02-07"}

### Features
- Add instructions button to view `$INFLUX_TOKEN` setup for Telegraf configs.
- Save the `$INFLUX_TOKEN` environmental variable in Telegraf configs.
- Update Tasks tab on Organizations page to look like Tasks Page.
- Add view button to view the Telegraf config toml.
- Add plugin information step to allow for config naming and configure one plugin at a time.
- Update Dashboards tab on Organizations page to look like Dashboards Page.

### Bug Fixes
- Update the System Telegraf Plugin bundle to include the Swap plugin.
- Revert behavior allowing users to create authorizations on behalf of another user.

### UI Improvements
- Change the wording for the plugin config form button to "Done."
- Change the wording for the Collectors configure step button to "Create and Verify."
- Standardize page loading spinner styles.
- Show checkbox on "Save As" button in Data Explorer.
- Make collectors plugins side bar visible in only the configure step.
- Swap retention policies on Create bucket page.

---

## v2.0.0-alpha.1 {date="2019-01-23"}

This is the initial alpha release of InfluxDB 2.0.
