---
title: InfluxDB Enterprise 1.10 release notes
description: >
  Important changes and what's new in each version InfluxDB Enterprise.
menu:
  enterprise_influxdb_v1_ref:
    name: Release notes
    weight: 10
    parent: About the project
---

## 1.10 [2022-09-07]

### Features
- Add [/api/v2/buckets](/enterprise_influxdb/v1/tools/api/#apiv2buckets-http-endpoint) support for create, delete, list, retrieve, and update operations.
- Add [/api/v2/delete](/enterprise_influxdb/v1/tools/api/#apiv2delete-http-endpoint) support.
- Add  wildcard support for retention policies in `SHOW MEASUREMENTS`.
- Log slow queries even when query logging is not enabled.
- Add  `--start` and `--end` [backup options](/enterprise_influxdb/v1/administration/backup-and-restore/#backup-options) to specify the time to include in backup.
- Add Raft Status output to `inflxud-ctl show`.

#### Flux updates
- Add `preview()` to experimental package for limiting return rows and tables (as opposed to just rows with `limit()`).
- Add [date.scale()](/flux/v0.x/stdlib/date/scale/) to let users dynamically scale durations in dates.
- Add [OpenTracing](https://opentracing.io/docs/overview/spans/) spans to Flux transformations. Lets you monitor Flux scripts more precisely.
- Add `trace` option to Flux CLI.
- Rename `addDuration()` to [add](/flux/v0.x/stdlib/date/add/) and `subDuration()` to [sub](/flux/v0.x/stdlib/date/sub/),
and moved both of these functions from the experimental package to the date package.
- Add location support to [date.truncate()](/flux/v0.x/stdlib/date/truncate/).
- Vectorize arithmetic operators in [map()](/flux/v0.x/stdlib/universe/map/).
- Vectorize logical operations in `map()`.
- Enable `movingAverage()` and `cumulativeSum()` optimizations by default. 

### Bug fixes

#### Backup
- Fix backup estimation so it dynamically updates with known information as progress is made.
- Ability to create backup with passing only `-shard flag` when using the influxd-ctl backup command.

#### influx_inspect
- Ability to export multiple retetnion policies (RPs) on the same database.
- `verify` subcommand no longer appends /data to the `-dir` flag path parameter

#### Other
- Grow tag index buffer if needed. This avoids a panic in the rare case of exactly 100 tags in a record.
- Fix multiple results returned per timestamp for some nested `InfluxQL` queries.
- Sync index file before close to avoid a shard reload error on instance restart.
- Fix rare case of numMeasurements reporting as less than 0 in `/debug/vars`.
- Fix `influxd` config panic.
- Fix shard confusion when multiple sub-queries reference different retention policies.

### Maintenance updates
- Upgrade to [Flux 0.170.0](/flux/v0.x/release-notes/#v01700-2022-06-02).
- Upgrade to Go 1.18.3.  
- Fixes issue with OSXCross and Darwin builds. This results in the new minimum OSX version being MacOSX10.14/darwin18.

## 1.9.8 [2022-07-11]

### Features
- Expose passive node feature to influxd-ctl and the API.
- Throttle inter-node data replication, both incoming writes and hinted hand-off, when errors are encountered.
- Add new `hh_node` measurement to the `/debug/vars` monitoring telemetry. This tracks more accurately with the `max-size` configuration setting for hinted handoff in data nodes.

#### Flux updates
- Add [http requests package](/flux/v0/stdlib/experimental/http/requests/).
- Add [isType()](/flux/v0/stdlib/types/istype/) function.
- Add [display()](/flux/v0/stdlib/universe/display/) function.
- Enhancements to the following functions: [increase()](/flux/v0/stdlib/universe/increase/), [sort()](/flux/v0/stdlib/universe/sort/), [derivative()](/flux/v0/stdlib/universe/derivative/), [union()](/flux/v0/stdlib/universe/union/), [timeShift()](/flux/v0/stdlib/universe/timeshift/), vectorization to applicable functions such as [map()](/flux/v0/stdlib/universe/map/).
- Add TCP connection pooling to [mqtt.publish()](/flux/v0/stdlib/experimental/mqtt/publish/) function when called in a map() function.

### Bug fixes
- Fix race condition causing `influxd-ctl restore` command to fail.
- Fix issue where measurement cardinality dips below zero.
- Fix issue regarding RPC retries for non-RPC errors, which caused hinted handoff to build constantly.
- Correctly calculate hinted handoff queue size on disk to prevent unnecessary `queue is full` errors.

#### Error Messaging
- Resolve unprintable and invalid characters in error messaging, making errors pertaining to invalid line protocol easier to read.
- Improve error messaging for `max series per database exceeded`error.
- Improve influxd-ctl error messages when invalid JSON is received.
- Add detail to `error creating subscription` message.
- `DROP SHARD` now successfully ignores "shard not found" errors.

### Maintenance updates
- Upgrade to Go 1.17.11
- Update to [Flux v0.161.0](/flux/v0.x/release-notes/#v01610-2022-03-24).

## 1.9.7 [2022-05-26]

{{% warn %}}
An edge case regression was introduced into this version that may cause a constant build-up of hinted handoff if writes are rejected due to malformed requests. If you experience write errors and hinted hand-off growth, we recommend upgrading to 1.9.8 or the latest release.
{{% /warn %}}

### Features
- Expose passive node feature to influxd-ctl and the API.
- Throttle inter-node data replication, both incoming writes and hinted hand-off, when errors are encountered.

#### Flux updates
- Add [http requests package](/flux/v0/stdlib/experimental/http/requests/).
- Add [isType()](/flux/v0/stdlib/types/istype/) function.
- Add [display()](/flux/v0/stdlib/universe/display/) function.
- Enhancements to the following functions: [increase()](/flux/v0/stdlib/universe/increase/), [sort()](/flux/v0/stdlib/universe/sort/), [derivative()](/flux/v0/stdlib/universe/derivative/), [union()](/flux/v0/stdlib/universe/union/), [timeShift()](/flux/v0/stdlib/universe/timeshift/), vectorization to applicable functions such as [map()](/flux/v0/stdlib/universe/map/).
- Add TCP connection pooling to [mqtt.publish()](/flux/v0/stdlib/experimental/mqtt/publish/) function when called in a map() function.

### Bug fixes
- Fix race condition causing `influxd-ctl restore` command to fail.

#### Error Messaging
- Improve error messaging for `max series per database exceeded`error.
- Improve influxd-ctl error messages when invalid JSON is received.
- Add detail to `error creating subscription` message.
- `DROP SHARD` now successfully ignores "shard not found" errors.

### Maintenance updates
- Upgrade to Go 1.17.9
- Update to [Flux v0.161.0](/flux/v0.x/release-notes/#v01610-2022-03-24).

## 1.9.6 [2022-02-16]

{{% note %}} InfluxDB Enterprise offerings are no longer available on AWS, Azure, and GCP marketplaces. Please [contact Sales](https://www.influxdata.com/contact-sales/) to request an license key to [install InfluxDB Enterprise in your own environment](/enterprise_influxdb/v1/introduction/installation/).
{{% /note %}}

### Features

#### Backup enhancements

- **Revert damaged meta nodes to a previous state**: Add the `-meta-only-overwrite-force` option to [`influxd-ctl restore`](/enterprise_influxdb/v1/tools/influxd-ctl/#restore) to revert damaged meta nodes in an existing cluster to a previous state when restoring an InfluxDB Enterprise database.

- **Estimate the size of a backup** (full or incremental) and provide progress messages. Add `-estimate` option to [`influxd-ctl backup`](/enterprise_influxdb/v1/tools/influxd-ctl/#backup) to estimate the size of a backup (full or incremental) and provide progress messages. Prints the number of files to back up, the percentage of bytes transferred for each file (organized by shard), and the estimated time remaining to complete the backup.

#### Logging enhancements

- **Log active queries when a process is terminated**: Add the [`termination-query-log`](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#termination-query-log--false) configuration option. When set to `true` all running queries are printed to the log when a data node process receives a `SIGTERM` (for example, a Kubernetes process exceeds the container memory limit or the process is terminated).

- **Log details of HTTP calls to meta nodes**. When [`cluster-tracing`](/enterprise_influxdb/v1/administration/configure/config-meta-nodes/#cluster-tracing--false) is enabled, all API calls to meta nodes are now logged with details providing an audit trail including IP address of caller, specific API being invoked, action being invoked, and more.

### Maintenance updates

- Update to [Flux v0.140](/flux/v0.x/release-notes/#v01400-2021-11-22).
- Upgrade to Go 1.17.
- Upgrade `protobuf` library.

### Bug fixes

#### Data

-  Adjust shard start and end times to avoid overlaps in existing shards. This resolves issues with existing shards (truncated or not) that have a different shard duration than the current default.

#### Errors

- Fix panic when running `influxd config`.
- Ensure `influxd-ctl entropy` commands use the correct TLS settings.

#### Profiling

- Resolve issue to enable [mutex profiling](/enterprise_influxdb/v1/tools/api/#debugpprof-http-endpoint).

#### influxd-ctl updates

- Improve [`influxd-ctl join`](/enterprise_influxdb/v1/tools/influxd-ctl/#join) robustness and provide better error messages on failure.
- Add user friendly error message when accessing a TLS-enabled server without TLS enabled on client.

## v1.9.5 [2021-10-11]

{{% note %}}
InfluxDB Enterprise 1.9.4 was not released.
Changes below are included in InfluxDB Enterprise 1.9.5.
{{% /note %}}

### Features

#### New restore options
- Add the following options for [restoring](/enterprise_influxdb/v1/tools/influxd-ctl/#restore) InfluxDB Enterprise databases:
  - Restore data with a new retention policy into an existing database.
  - Override the duration of a retention policy while restoring.
  - Specify a destination shard when restoring a specific shard.
#### Operational enhancements
- Allow specification and filtering of [`SHOW TAG VALUES`](/enterprise_influxdb/v1/query_language/explore-schema/#show-tag-values) by retention policy.
- Add `memUsage` metrics to [`/debug/vars`](/enterprise_influxdb/v1/tools/api/#debugvars-http-endpoint) endpoint
  to measure memory usage in bytes across all subscriptions.
#### Performance enhancement
- Improve memory performance by making `compact-full-write-cold-duration` apply to both TSM files and the TSI index.
#### Maintenance updates 
- Update Protocol Buffers library versions.
- Update to Flux [0.131.0](/flux/v0.x/release-notes/#v01310-2021-09-20).

### Bug fixes
#### Data
- Fix issue with adjacent shards accidentally overlapping during `influx_tools import`.
- Prevent dropped writes with overlapping shards in certain edge cases.
- Prevent lost writes during hinted handoff when purging short queues.
- Sync series segment to disk after writing
#### Errors
- Return an error instead of panic when InfluxDB Enterprise tries to restore with OSS.
- Handle HTTPS errors during systemd service startup.
- Return correct number of unexecuted statements when multi-statement query fails.
- Fix crashes caused by TSM file corruption.
#### Flux
- Fix Flux panic that caused node to crash when querying empty pre-created shards.
- Fix Flux query problems with large datasets when replication factor is less than cluster size.
#### Logging
- Fix issue incorrectly reporting compaction queue of zero.
- Ensure correct JSON log formatting.
- Add logging for shard write errors.
- Avoid incorrect logging about "broken pipe" when entropy is detected.
#### Performance
- Limit field size to 1MB while parsing line protocol.
- Fix potential crash due to race between reading TSI index and TSI compaction.
- Delay hinted handoff writes (by less than one second) if `retry-rate-limit` is exceeded.
#### Security
- Require read authorization on a database to see continuous queries linked to that database.
- Fix incorrect TLS handling for `influxd-ctl entropy` commands.
- Use TLS for nested LDAP connections when TLS is enabled.

## v1.9.3 [2021-07-19]

### Features
- Add [configurable password hashing](/enterprise_influxdb/v1/administration/configure-password-hashing/) with `bcrypt` and `pbkdf2` support.
- Add retry with exponential back-off to anti-entropy repair.
- Add logging to compaction.
- Add [`total-buffer-bytes`](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#total-buffer-bytes) configuration parameter to subscriptions.
  This option is intended to help alleviate out-of-memory errors.
- Update to [Flux v0.120.1.](/influxdb/v2/reference/release-notes/flux/#v01201-2021-07-06)

### Bug fixes
- Improve heap memory usage when HH queue grows.
- Do not close connection twice in `DigestWithOptions`.
- Do not panic on cleaning up failed iterators.
- Rename ARM RPMs with `yum`-compatible names.
- Convert ARM arch names for RPMs during builds via Docker.
- Do not send non-UTF-8 characters to subscriptions.
- Error instead of panic for statement rewrite failure.
- Fix `SHOW SHARDS` showing expiration time for shard groups with no expiration.
- Change default limit for memory usage from 4GB to unlimited.
- Make `total-max-memory-bytes` and other flux controller configuration work correctly.
- Use a constant amount of RAM as hinted handoff grows, instead of growing RAM usage.

## v1.9.2 [2021-06-17]

The release of InfluxDB Enterprise 1.9 is different from previous InfluxDB Enterprise releases
in that there is no corresponding InfluxDB OSS release.
(InfluxDB 1.8.x will continue to receive maintenance updates.)

### Features
- Upgrade to Go 1.15.10.
- Support user-defined *node labels*.
  Node labels let you assign arbitrary key-value pairs to meta and data nodes in a cluster.
  For instance, an operator might want to label nodes with the availability zone in which they're located.
- Improve performance of `SHOW SERIES CARDINALITY` and `SHOW SERIES CARDINALITY from <measurement>` InfluxQL queries.
  These queries now return a `cardinality estimation` column header where before they returned `count`.
- Improve diagnostics for license problems.
  Add [license expiration date](/enterprise_influxdb/v1/features/clustering-features/#entitlements) to `debug/vars` metrics.
- Add improved [ingress metrics](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#ingress-metric-by-measurement-enabled) to track points written by measurement and by login.
  Allow for collection of statistics regarding points, values, and new series written per measurement and by login.
  This data is collected and exposed at the data node level.
  With these metrics you can, for example:
  aggregate the write requests across the entire cluster,
  monitor the growth of series within a measurement,
  and track what user credentials are being used to write data.
- Support authentication for Kapacitor via LDAP.
- Support for [configuring Flux query resource usage](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#flux-controller) (concurrency, memory, etc.).
- Upgrade to [Flux v0.113.0](/influxdb/v2/reference/release-notes/flux/#v01130-2021-04-21).
- Update Prometheus remote protocol to allow streamed reading.
- Improve performance of sorted merge iterator.
- Add arguments to Flux `to` function.
- Add meancount aggregation for WindowAggregate pushdown.
- Optimize series iteration in TSI.
- Add `WITH KEY` to `SHOW TAG KEYS`.

### Bug fixes
- `show databases` now checks read and write permissions.
- Anti-entropy: Update `tsm1.BlockCount()` call to match signature.
- Remove extraneous nil check from points writer.
- Ensure a newline is printed after a successful copy during [restoration](/enterprise_influxdb/v1/administration/backup-and-restore/).
- Make `entropy show` expiration times consistent with `show-shards`.
- Properly shutdown multiple HTTP servers.
- Allow CORS in v2 compatibility endpoints.
- Address staticcheck warnings SA4006, ST1006, S1039, and S1020.
- Fix Anti-Entropy looping endlessly with empty shard.
- Disable MergeFiltersRule until it is more stable.
- Fix data race and validation in cache ring.
- Return error on nonexistent shard ID.
- Add `User-Agent` to allowed CORS headers.
- Fix variables masked by a declaration.
- Fix key collisions when serializing `/debug/vars`.
- Fix temporary directory search bug.
- Grow tag index buffer if needed.
- Use native type for summation in new meancount iterator.
- Fix consistent error for missing shard.
- Properly read payload in `snapshotter`.
- Fix help text for `influx_inspect`.
- Allow `PATCH` in CORS.
- Fix `GROUP BY` returning multiple results per group in some circumstances.
- Add option to authenticate Prometheus remote read.
- Fix FGA enablement.
- Fix "snapshot in progress" error during backup.
- Fix cursor requests (`[start, stop]` instead of `[start, stop)`).
- Exclude stop time from array cursors.
- Fix Flux regression in buckets query.
- Fix redundant registration for Prometheus collector metrics.
- Re-add Flux CLI.
- Use non-nil `context.Context` value in client.
- Avoid rewriting `fields.idx` unnecessarily.

### Other changes

- Remove `influx_stress` tool (deprecated since version 1.2).
  Instead, use [`inch`](https://github.com/influxdata/inch) 
  or [`influx-stress`](https://github.com/influxdata/influx-stress) (not to be confused with `influx_stress`).

{{% note %}}
**Note:** InfluxDB Enterprise 1.9.0 and 1.9.1 were not released.
Bug fixes intended for 1.9.0 and 1.9.1 were rolled into InfluxDB Enterprise 1.9.2.
{{% /note %}}

## v1.8.6 [2021-05-21]

{{% warn %}}
**Fine-grained authorization security update.**
If using **InfluxDB Enterprise 1.8.5**, we strongly recommend upgrading to **InfluxDB Enterprise 1.8.6** immediately.
1.8.5 does not correctly enforce grants with specified permissions for users.
Versions prior to InfluxDB Enterprise 1.8.5 are not affected.
1.8.6 ensures that only users with sufficient permissions can read and write to a measurement.
{{% /warn %}}

### Features

- **Enhanced Anti-Entropy (AE) logging**: When the [debug logging level](/enterprise_influxdb/v1/administration/config-data-nodes/#logging-settings) is set (`level="debug"`) in the data node configuration, the Anti-Entropy service reports reasons a shard is not idle, including:
  - active Cache compactions
  - active Level (Zero, One, Two) compactions
  - active Full compactions
  - active TSM Optimization compactions
  - cache size is nonzero
  - shard is not fully compacted
- **Enhanced `copy-shard` logging**. Add information to log messages in `copy-shard` functions and additional error tests.

### Bug fixes

- Use the proper TLS configuration when a meta node makes an remote procedure call (RPC) to a data node. Addresses RPC call issues using the following influxd-ctl commands: `copy-shard` `copy-shard-status` `kill-copy-shard` `remove-shard`
- Previously, the Anti-Entropy service would loop trying to copy an empty shard to a data node missing that shard. Now, an empty shard is successfully created on a new node.
- Check for previously ignored errors in `DiffIterator.Next()`. Update to check before possible function exit and ensure handles are closed on error in digest diffs.

## v1.8.5 [2020-04-20]

The InfluxDB Enterprise v1.8.5 release builds on the InfluxDB OSS v1.8.5 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/#v185-2021-04-20).

### Bug fixes

- Resolve TSM backup "snapshot in progress" error.
- SHOW DATABASES now only shows databases that the user has either read or write access to
- `influxd_ctl entropy show` now shows shard expiry times consistent with `influxd_ctl show-shards`
- Add labels to the values returned in SHOW SHARDS output to clarify the node ID and TCP address.
- Always forward repairs to the next data node (even if the current data node does not have to take action for the repair).

## v1.8.4 [2020-02-08]

The InfluxDB Enterprise 1.8.4 release builds on the InfluxDB OSS 1.8.4 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/#v1-8-4-unreleased).

   > **Note:** InfluxDB Enterprise 1.8.3 was not released. Bug fixes intended for 1.8.3 were rolled into InfluxDB Enterprise 1.8.4.

### Features

#### Update your InfluxDB Enterprise license without restarting data nodes

Add the ability to [renew or update your license key or file](/enterprise_influxdb/v1/administration/renew-license/) without restarting data nodes.
### Bug fixes

- Wrap TCP mux–based HTTP server with a function that adds custom headers.
- Correct output for `influxd-ctl show shards`.
- Properly encode/decode `control.Shard.Err`.

## v1.8.2 [2020-08-24]

The InfluxDB Enterprise 1.8.2 release builds on the InfluxDB OSS 1.8.2 and 1.8.1 releases.
Due to a defect in InfluxDB OSS 1.8.1, InfluxDB Enterprise 1.8.1 was not released.
This release resolves the defect and includes the features and bug fixes listed below.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Features

#### Hinted handoff improvements

- Allow out-of-order writes. This change adds a configuration option `allow-out-of-order-writes` to the `[cluster]` section of the data node configuration file. This setting defaults to `false` to match the existing behavior. There are some important operational considerations to review before turning this on. But, the result is enabling this option reduces the time required to drain the hinted handoff queue and increase throughput during recovery. See [`allow-out-of-order-writes`](/enterprise_influxdb/v1/administration/config-data-nodes#allow-out-of-order-writes--false) for more detail.
- Make the number of pending writes configurable. This change adds a configuration option in the `[hinted-handoff]` section called `max-pending-writes`, which defaults to `1024`. See [max-pending-writes](/enterprise_influxdb/v1/administration/config-data-nodes#max-pending-writes-1024) for more detail.
- Update the hinted handoff queue to ensure various entries to segment files occur atomically. Prior to this change, entries were written to disk in three separate writes (len, data, offset). If the process stopped in the middle of any of those writes, the hinted handoff segment file was left in an invalid state.
- In certain scenarios, the hinted-handoff queue would fail to drain. Upon node startup, the queue segment files are now verified and truncated if any are corrupted. Some additional logging has been added when a node starts writing to the hinted handoff queue as well.

#### `influxd-ctl` CLI improvements

- Add a verbose flag to [`influxd-ctl show-shards`](/enterprise_influxdb/v1/administration/cluster-commands/#show-shards). This option provides more information about each shard owner, including the state (hot/cold), last modified date and time, and size on disk.

### Bug fixes

- Resolve a cluster read service issue that caused a panic. Previously, if no tags keys or values were read, the cluster read service returned a nil cursor. Now, an empty cursor is returned.
- LDAP configuration: `GroupSearchBaseDNs`, `SearchFilter`, `GroupMembershipSearchFilter`, and `GroupSearchFilter` values in the LDAP section of the configuration file are now all escaped.
- Eliminate orphaned, temporary directories when an error occurs during `processCreateShardSnapshotRequest()` and provide useful log information regarding the reason a temporary directory is created.

## v1.8 [2020-04-27]

The InfluxDB Enterprise 1.8 release builds on the InfluxDB OSS 1.8 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Features

#### **Back up meta data only**

- Add option to back up **meta data only** (users, roles, databases, continuous queries, and retention policies) using the new `-strategy` flag and `only meta` option: `influx ctl backup -strategy only meta </your-backup-directory>`.

    > **Note:** To restore a meta data backup, use the `restore -full` command and specify your backup manifest: `influxd-ctl restore -full </backup-directory/backup.manifest>`.

For more information, see [Perform a metastore only backup](/enterprise_influxdb/v1/administration/backup-and-restore/#perform-a-metastore-only-backup).

#### **Incremental and full backups**

- Add `incremental` and `full` backup options to the new `-strategy` flag in `influx ctl backup`:
  - `influx ctl backup -strategy incremental`
  - `influx ctl backup -strategy full`

For more information, see the [`influxd-ctl backup` syntax](/enterprise_influxdb/v1/administration/backup-and-restore/#syntax).

### Bug fixes

- Update the Anti-Entropy (AE) service to ignore expired shards.

## v1.7.10 [2020-02-07]

The InfluxDB Enterprise 1.7.10 release builds on the InfluxDB OSS 1.7.10 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Features
- Log when meta state file cannot be opened.

### Bugfixes
- Update `MaxShardGroupID` on meta update.
- Don't reassign shard ownership when removing a data node.

## v1.7.9 [2019-10-27]

The InfluxDB Enterprise 1.7.9 release builds on the InfluxDB OSS 1.7.9 release.
For details on changes incorporated from the InfluxDB OSS release, see
[InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Release notes
- This release is built using Go 1.12.10 which eliminates the
  [HTTP desync vulnerability](https://portswigger.net/research/http-desync-attacks-request-smuggling-reborn).

### Bug fixes
- Move `tsdb store open` to beginning of server initialization.
- Enable Meta client and Raft to use verified TLS.
- Fix RPC pool TLS configuration.
- Update example configuration file with new authorization options.

## 1.7.8 [2019-09-03]

{{% warn %}}
InfluxDB now rejects all non-UTF-8 characters.
To successfully write data to InfluxDB, use only UTF-8 characters in
database names, measurement names, tag sets, and field sets.
InfluxDB Enterprise customers can contact InfluxData support for more information.
{{% /warn %}}

The InfluxDB Enterprise 1.7.8 release builds on the InfluxDB OSS 1.7.8 release.
For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Bug fixes
- Clarified `influxd-ctl` error message when the Anti-Entropy (AE) service is disabled.
- Ensure invalid, non-UTF-8 data is removed from hinted handoff.
- Added error messages for `INFLUXDB_LOGGING_LEVEL` if misconfigured.
- Added logging when data nodes connect to meta service.

### Features
- The Flux Technical Preview has advanced to version [0.36.2](/flux/v0.36/).

## 1.7.7 [2019-07-12]

The InfluxDB Enterprise 1.7.7 release builds on the InfluxDB OSS 1.7.7 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Known issues

- The Flux Technical Preview was not advanced and remains at version 0.24.0. Next month's maintenance release will update the preview.
- After upgrading, customers have experienced an excessively large output additional lines due to a `Println` statement introduced in this release. For a possible workaround, see https://github.com/influxdata/influxdb/issues/14265#issuecomment-508875853.  Next month's maintenance release will address this issue.

### Features

- Adds TLS to RPC calls. If verifying certificates, uses the TLS setting in the configuration passed in with -config.

### Bug fixes

- Ensure retry-rate-limit configuration value is used for hinted handoff.
- Always forward AE repair to next node.
- Improve hinted handoff metrics.

## 1.7.6 [2019-05-07]

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.6 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Bug fixes

- Reverts v1.7.5 InfluxQL regressions that removed parentheses and resulted in operator precedence causing changing results in complex queries and regular expressions.

## 1.7.5 [2019-03-26]

{{% warn %}}

**If you are currently on this release, roll back to v1.7.4 until a fix is available.**

After upgrading to this release, some customers have experienced regressions,
including parentheses being removed resulting in operator precedence causing changing results
in complex queries and regular expressions.

Examples:

- Complex WHERE clauses with parentheses. For example, `WHERE d > 100 AND (c = 'foo' OR v = 'bar'`).
- Conditions not including parentheses caysubg operator precedence to return `(a AND b) OR c` instead of `a AND (b OR c)`

{{% /warn %}}

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.5 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Features

- Add `influx_tools` utility (for internal support use) to be part of the packaging.

### Bug fixes

- Anti-Entropy: fix `contains no .tsm files` error.
- `fix(cluster)`: account for nil result set when writing read response.

## 1.7.4 [2019-02-13]

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.4 release. For details on changes incorporated from the InfluxDB OSS release, see [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Bug fixes

- Use `systemd` for Amazon Linux 2.

## 1.7.3 [2019-01-11]

This InfluxDB Enterprise release builds on the InfluxDB OSS 1.7.3 release. For details on changes incorporated from the InfluxDB OSS release, see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Important update [2019-02-13]

If you have not installed this release, then install the 1.7.4 release.

**If you are currently running this release, then upgrade to the 1.7.4 release as soon as possible.**

- A critical defect in the InfluxDB 1.7.3 release was discovered and our engineering team fixed the issue in the 1.7.4 release. Out of high concern for your data and projects, upgrade to the 1.7.4 release as soon as possible.
  - **Critical defect:** Shards larger than 16GB are at high risk for data loss during full compaction. The full compaction process runs when a shard go "cold" – no new data is being written into the database during the time range specified by the shard.
  - **Post-mortem analysis:** InfluxData engineering is performing a post-mortem analysis to determine how this defect was introduced. Their discoveries will be shared in a blog post.

- A small percentage of customers experienced data node crashes with segmentation violation errors.  We fixed this issue in 1.7.4.

### Breaking changes
- Fix invalid UTF-8 bytes preventing shard opening. Treat fields and measurements as raw bytes.

### Features

#### Anti-entropy service disabled by default

Prior to v.1.7.3, the anti-entropy (AE) service was enabled by default. When shards create large digests with lots of time ranges (10s of thousands), some customers experienced significant performance issues, including CPU usage spikes. If your shards include a small number of time ranges (most have 1 to 10, some have up to several hundreds) and you can benefit from the AE service, then you can enable AE and watch to see if performance is significantly impacted.

- Add user authentication and authorization support for Flux HTTP requests.
- Add support for optionally logging Flux queries.
-	Add support for LDAP StartTLS.
-	Flux 0.7 support.
-	Implement TLS between data nodes.
-	Update to Flux 0.7.1.
-	Add optional TLS support to meta node Raft port.
-	Anti-Entropy: memoize `DistinctCount`, `min`, & `max` time.
-	Update influxdb dep for subquery auth update.

### Bug fixes

-	Update sample configuration.

## 1.6.6 [2019-02-28]
-------------------

This release only includes the InfluxDB OSS 1.6.6 changes (no Enterprise-specific changes).

## 1.6.5 [2019-01-10]

This release builds off of the InfluxDB OSS 1.6.0 through 1.6.5 releases. For details about changes incorporated from InfluxDB OSS releases, see [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

## 1.6.4 [2018-10-23]

This release builds off of the InfluxDB OSS 1.6.0 through 1.6.4 releases. For details about changes incorporated from InfluxDB OSS releases, see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Breaking changes

#### Require `internal-shared-secret` if meta auth enabled

If `[meta] auth-enabled` is set to `true`, the `[meta] internal-shared-secret` value must be set in the configuration.
If it is not set, an error will be logged and `influxd-meta` will not start.

* Previously, authentication could be enabled without setting an `internal-shared-secret`. The security risk was that an unset (empty) value could be used for the `internal-shared-secret`, seriously weakening the JWT authentication used for internode communication.

#### Review production installation configurations

The [Production Installation](/enterprise_influxdb/v1/introduction/installation/)
documentation has been updated to fix errors in configuration settings, including changing `shared-secret` to `internal-shared-secret` and adding missing steps for configuration settings of data nodes and meta nodes. All Enterprise users should review their current configurations to ensure that the configuration settings properly enable JWT authentication for internode communication.

The following summarizes the expected settings for proper configuration of JWT authentication for internode communication:

##### Data node configuration files (`influxdb.conf`)

**[http] section**

* `auth-enabled = true`
  - Enables authentication. Default value is false.

**[meta] section**

- `meta-auth-enabled = true`
  - Must match for meta nodes' `[meta] auth-enabled` settings.
- `meta-internal-shared-secret = "<long-pass-phrase>"`
  - Must be the same pass phrase on all meta nodes' `[meta] internal-shared-secret` settings.
  - Used by the internal API for JWT authentication. Default value is `""`.
  - A long pass phrase is recommended for stronger security.

##### Meta node configuration files (`meta-influxdb.conf`)

**[meta]** section

- `auth-enabled = true`
  - Enables authentication. Default value is `false` .
- `internal-shared-secret = "<long-pass-phrase>"`
  - Must same pass phrase on all data nodes' `[meta] meta-internal-shared-secret`
  settings.
  - Used by the internal API for JWT authentication. Default value is
`""`.
  - A long pass phrase is recommended for better security.

>**Note:** To provide encrypted internode communication, you must enable HTTPS. Although the JWT signature is encrypted, the the payload of a JWT token is encoded, but is not encrypted.

### Bug fixes

- Only map shards that are reported ready.
- Fix data race when shards are deleted and created concurrently.
- Reject `influxd-ctl update-data` from one existing host to another.
- Require `internal-shared-secret` if meta auth enabled.

## 1.6.2 [08-27-2018]

This release builds off of the InfluxDB OSS 1.6.0 through 1.6.2 releases. For details about changes incorporated from InfluxDB OSS releases, see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/).

### Features

- Update Go runtime to `1.10`.
- Provide configurable TLS security options.
- Add LDAP functionality for authorization and authentication.
- Anti-Entropy (AE): add ability to repair shards.
- Anti-Entropy (AE): improve swagger doc for `/status` endpoint.
- Include the query task status in the show queries output.

#### Bug fixes

- TSM files not closed when shard is deleted.
- Ensure shards are not queued to copy if a remote node is unavailable.
- Ensure the hinted handoff (hh) queue makes forward progress when segment errors occur.
- Add hinted handoff (hh) queue back pressure.

## 1.5.4 [2018-06-21]

This release builds off of the InfluxDB OSS 1.5.4 release. Please see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

## 1.5.3 [2018-05-25]

This release builds off of the InfluxDB OSS 1.5.3 release. Please see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

### Features

* Include the query task status in the show queries output.
* Add hh writeBlocked counter.

### Bug fixes

* Hinted-handoff: enforce max queue size per peer node.
* TSM files not closed when shard deleted.


## v1.5.2 [2018-04-12]

This release builds off of the InfluxDB OSS 1.5.2 release. Please see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

### Bug fixes

* Running backup snapshot with client's retryWithBackoff function.
* Ensure that conditions are encoded correctly even if the AST is not properly formed.

## v1.5.1 [2018-03-20]

This release builds off of the InfluxDB OSS 1.5.1 release. There are no Enterprise-specific changes.
Please see the [InfluxDB OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

## v1.5.0 [2018-03-06]

> ***Note:*** This release builds off of the 1.5 release of InfluxDB OSS. Please see the [InfluxDB OSS release
> notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the InfluxDB OSS release.

For highlights of the InfluxDB 1.5 release, see [What's new in InfluxDB 1.5](/influxdb/v1/about_the_project/whats_new/).

### Breaking changes

The default logging format has been changed. See [Logging and tracing in InfluxDB](/influxdb/v1/administration/logs/) for details.

### Features

* Add `LastModified` fields to shard RPC calls.
* As of OSS 1.5 backup/restore interoperability is confirmed.
* Make InfluxDB Enterprise use OSS digests.
* Move digest to its own package.
* Implement distributed cardinality estimation.
* Add logging configuration to the configuration files.
* Add AE `/repair` endpoint and update Swagger doc.
* Update logging calls to take advantage of structured logging.
* Use actual URL when logging anonymous stats start.
* Fix auth failures on backup/restore.
* Add support for passive nodes
* Implement explain plan for remote nodes.
* Add message pack format for query responses.
* Teach show tag values to respect FGA
* Address deadlock in meta server on 1.3.6
* Add time support to `SHOW TAG VALUES`
* Add distributed `SHOW TAG KEYS` with time support

### Bug fixes

* Fix errors occurring when policy or shard keys are missing from the manifest when limited is set to true.
* Fix spurious `rpc error: i/o deadline exceeded` errors.
* Elide `stream closed` error from logs and handle `io.EOF` as remote iterator interrupt.
* Discard remote iterators that label their type as unknown.
* Do not queue partial write errors to hinted handoff.
* Segfault in `digest.merge`
* Meta Node CPU pegged on idle cluster.
* Data race on `(meta.UserInfo).acl)`
* Fix wildcard when one shard has no data for a measurement with partial replication.
* Add `X-Influxdb-Build` to http response headers so users can identify if a response is from an InfluxDB OSS or InfluxDB Enterprise service.
* Ensure that permissions cannot be set on non-existent databases.
* Switch back to using `cluster-tracing` config option to enable meta HTTP request logging.
* `influxd-ctl restore -newdb` can't restore data.
* Close connection for remote iterators after EOF to avoid writer hanging indefinitely.
* Data race reading `Len()` in connection pool.
* Use InfluxData fork of `yamux`. This update reduces overall memory usage when streaming large amounts of data.
* Fix group by marshaling in the IteratorOptions.
* Meta service data race.
* Read for the interrupt signal from the stream before creating the iterators.
* Show retention policies requires the `createdatabase` permission
* Handle UTF files with a byte order mark when reading the configuration files.
* Remove the pidfile after the server has exited.
* Resend authentication credentials on redirect.
* Updated yamux resolves race condition when SYN is successfully sent and a write timeout occurs.
* Fix no license message.

## v1.3.9 [2018-01-19]

### Upgrading -- for users of the TSI preview

If you have been using the TSI preview with 1.3.6 or earlier 1.3.x releases, you will need to follow the upgrade steps to continue using the TSI preview.  Unfortunately, these steps cannot be executed while the cluster is operating --
so it will require downtime.

### Bugfixes

* Elide `stream closed` error from logs and handle `io.EOF` as remote iterator interrupt.
* Fix spurious `rpc error: i/o deadline exceeded` errors
* Discard remote iterators that label their type as unknown.
* Do not queue `partial write` errors to hinted handoff.

## v1.3.8 [2017-12-04]

### Upgrading -- for users of the TSI preview

If you have been using the TSI preview with 1.3.6 or earlier 1.3.x releases, you will need to follow the upgrade steps to continue using the TSI preview.  Unfortunately, these steps cannot be executed while the cluster is operating -- so it will require downtime.

### Bugfixes

- Updated `yamux` resolves race condition when SYN is successfully sent and a write timeout occurs.
- Resend authentication credentials on redirect.
- Fix wildcard when one shard has no data for a measurement with partial replication.
- Fix spurious `rpc error: i/o deadline exceeded` errors.

## v1.3.7 [2017-10-26]

### Upgrading -- for users of the TSI preview

The 1.3.7 release resolves a defect that created duplicate tag values in TSI indexes See Issues
[#8995](https://github.com/influxdata/influxdb/pull/8995), and [#8998](https://github.com/influxdata/influxdb/pull/8998).
However, upgrading to 1.3.7 cause compactions to fail, see [Issue #9025](https://github.com/influxdata/influxdb/issues/9025).
We will provide a utility that will allow TSI indexes to be rebuilt,
resolving the corruption possible in releases prior to 1.3.7. If you are using the TSI preview,
**you should not upgrade to 1.3.7 until this utility is available**.
We will update this release note with operational steps once the utility is available.

#### Bugfixes

 - Read for the interrupt signal from the stream before creating the iterators.
 - Address Deadlock issue in meta server on 1.3.6
 - Fix logger panic associated with anti-entropy service and manually removed shards.

## v1.3.6 [2017-09-28]

### Bugfixes

- Fix "group by" marshaling in the IteratorOptions.
- Address meta service data race condition.
- Fix race condition when writing points to remote nodes.
- Use InfluxData fork of yamux. This update reduces overall memory usage when streaming large amounts of data.
  Contributed back to the yamux project via: https://github.com/hashicorp/yamux/pull/50
- Address data race reading Len() in connection pool.

## v1.3.5 [2017-08-29]

This release builds off of the 1.3.5 release of OSS InfluxDB.
Please see the OSS [release notes](/influxdb/v1/about_the_project/releasenotes-changelog/#v1-3-5-2017-08-29) for more information about the OSS releases.

## v1.3.4 [2017-08-23]

This release builds off of the 1.3.4 release of OSS InfluxDB. Please see the [OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the OSS releases.

### Bugfixes

- Close connection for remote iterators after EOF to avoid writer hanging indefinitely

## v1.3.3 [2017-08-10]

This release builds off of the 1.3.3 release of OSS InfluxDB. Please see the [OSS release notes](/influxdb/v1/about_the_project/releasenotes-changelog/) for more information about the OSS releases.

### Bugfixes

- Connections are not closed when `CreateRemoteIterator` RPC returns no iterators, resolved memory leak

## v1.3.2 [2017-08-04]

### Bug fixes

- `influxd-ctl restore -newdb` unable to restore data.
- Improve performance of `SHOW TAG VALUES`.
- Show a subset of config settings in `SHOW DIAGNOSTICS`.
- Switch back to using cluster-tracing config option to enable meta HTTP request logging.
- Fix remove-data error.

## v1.3.1 [2017-07-20]

#### Bug fixes

- Show a subset of config settings in SHOW DIAGNOSTICS.
- Switch back to using cluster-tracing config option to enable meta HTTP request logging.
- Fix remove-data error.

## v1.3.0 [2017-06-21]

### Configuration Changes

#### `[cluster]` Section

* `max-remote-write-connections` is deprecated and can be removed.
* NEW: `pool-max-idle-streams` and `pool-max-idle-time` configure the RPC connection pool.
  See `config.sample.toml` for descriptions of these new options.

### Removals

The admin UI is removed and unusable in this release. The `[admin]` configuration section will be ignored.

#### Features

- Allow non-admin users to execute SHOW DATABASES
- Add default config path search for influxd-meta.
- Reduce cost of admin user check for clusters with large numbers of users.
- Store HH segments by node and shard
- Remove references to the admin console.
- Refactor RPC connection pool to multiplex multiple streams over single connection.
- Report RPC connection pool statistics.

#### Bug fixes

- Fix security escalation bug in subscription management.
- Certain permissions should not be allowed at the database context.
- Make the time in `influxd-ctl`'s `copy-shard-status` argument human readable.
- Fix `influxd-ctl remove-data -force`.
- Ensure replaced data node correctly joins meta cluster.
- Delay metadata restriction on restore.
- Writing points outside of retention policy does not return error
- Decrement internal database's replication factor when a node is removed.

## v1.2.5 [2017-05-16]

This release builds off of the 1.2.4 release of OSS InfluxDB.
Please see the OSS [release notes](/influxdb/v1/about_the_project/releasenotes-changelog/#v1-2-4-2017-05-08) for more information about the OSS releases.

#### Bug fixes

- Fix issue where the [`ALTER RETENTION POLICY` query](/influxdb/v1/query_language/database_management/#modify-retention-policies-with-alter-retention-policy) does not update the default retention policy.
- Hinted-handoff: remote write errors containing `partial write` are considered droppable.
- Fix the broken `influxd-ctl remove-data -force` command.
- Fix security escalation bug in subscription management.
- Prevent certain user permissions from having a database-specific scope.
- Reduce the cost of the admin user check for clusters with large numbers of users.
- Fix hinted-handoff remote write batching.

## v1.2.2 [2017-03-15]

This release builds off of the 1.2.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.2/CHANGELOG.md#v121-2017-03-08) for more information about the OSS release.

### Configuration Changes

The following configuration changes may need to changed before [upgrading](/enterprise_influxdb/v1/administration/upgrading/) to 1.2.2 from prior versions.

#### shard-writer-timeout

We've removed the data node's `shard-writer-timeout` configuration option from the `[cluster]` section.
As of version 1.2.2, the system sets `shard-writer-timeout` internally.
The configuration option can be removed from the [data node configuration file](/enterprise_influxdb/v1/administration/configuration/#data-node-configuration).

#### retention-autocreate

In versions 1.2.0 and 1.2.1, the `retention-autocreate` setting appears in both the meta node and data node configuration files.
To disable retention policy auto-creation, users on version 1.2.0 and 1.2.1 must set `retention-autocreate` to `false` in both the meta node and data node configuration files.

In version 1.2.2, we’ve removed the `retention-autocreate` setting from the data node configuration file.
As of version 1.2.2, users may remove `retention-autocreate` from the data node configuration file.
To disable retention policy auto-creation, set `retention-autocreate` to `false` in the meta node configuration file only.

This change only affects users who have disabled the `retention-autocreate` option and have installed version 1.2.0 or 1.2.1.

#### Bug fixes

##### Backup and Restore
<br>

- Prevent the `shard not found` error by making [backups](/enterprise_influxdb/v1/administration/backup-and-restore/#backup) skip empty shards
- Prevent the `shard not found` error by making [restore](/enterprise_influxdb/v1/administration/backup-and-restore/#restore) handle empty shards
- Ensure that restores from an incremental backup correctly handle file paths
- Allow incremental backups with restrictions (for example, they use the `-db` or `rp` flags) to be stores in the same directory
- Support restores on meta nodes that are not the raft leader

##### Hinted handoff
<br>

- Fix issue where dropped writes were not recorded when the [hinted handoff](/enterprise_influxdb/v1/concepts/clustering/#hinted-handoff) queue reached the maximum size
- Prevent the hinted handoff from becoming blocked if it encounters field type errors

##### Other
<br>

- Return partial results for the [`SHOW TAG VALUES` query](/influxdb/v1/query_language/schema_exploration/#show-tag-values) even if the cluster includes an unreachable data node
- Return partial results for the [`SHOW MEASUREMENTS` query](/influxdb/v1/query_language/schema_exploration/#show-measurements) even if the cluster includes an unreachable data node
- Prevent a panic when the system files to process points
- Ensure that cluster hostnames can be case insensitive
- Update the `retryCAS` code to wait for a newer snapshot before retrying
- Serialize access to the meta client and meta store to prevent raft log buildup
- Remove sysvinit package dependency for RPM packages
- Make the default retention policy creation an atomic process instead of a two-step process
- Prevent `influxd-ctl`'s [`join` argument](/enterprise_influxdb/v1/features/cluster-commands/#join) from completing a join when the command also specifies the help flag (`-h`)
- Fix the `influxd-ctl`'s [force removal](/enterprise_influxdb/v1/features/cluster-commands/#remove-meta) of meta nodes
- Update the meta node and data node sample configuration files

## v1.2.1 [2017-01-25]

#### Cluster-specific Bugfixes

- Fix panic: Slice bounds out of range
&emsp;Fix how the system removes expired shards.
- Remove misplaced newlines from cluster logs

## v1.2.0 [2017-01-24]

This release builds off of the 1.2.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.2/CHANGELOG.md#v120-2017-01-24) for more information about the OSS release.

### Upgrading

* The `retention-autocreate` configuration option has moved from the meta node configuration file to the [data node configuration file](/enterprise_influxdb/v1/administration/configuration/#retention-autocreate-true).
To disable the auto-creation of retention policies, set `retention-autocreate` to `false` in your data node configuration files.
* The previously deprecated `influxd-ctl force-leave` command has been removed. The replacement command to remove a meta node which is never coming back online is [`influxd-ctl remove-meta -force`](/enterprise_influxdb/v1/features/cluster-commands/).

#### Cluster-specific Features

- Improve the meta store: any meta store changes are done via a compare and swap
- Add support for [incremental backups](/enterprise_influxdb/v1/administration/backup-and-restore/)
- Automatically remove any deleted shard groups from the data store
- Uncomment the section headers in the default [configuration file](/enterprise_influxdb/v1/administration/configuration/)
- Add InfluxQL support for [subqueries](/influxdb/v1/query_language/data_exploration/#subqueries)

#### Cluster-specific Bugfixes

- Update dependencies with Godeps
- Fix a data race in meta client
- Ensure that the system removes the relevant [user permissions and roles](/enterprise_influxdb/v1/features/users/) when a database is dropped
- Fix a couple typos in demo [configuration file](/enterprise_influxdb/v1/administration/configuration/)
- Make optional the version protobuf field for the meta store
- Remove the override of GOMAXPROCS
- Remove an unused configuration option (`dir`) from the backend
- Fix a panic around processing remote writes
- Return an error if a remote write has a field conflict
- Drop points in the hinted handoff that (1) have field conflict errors (2) have [`max-values-per-tag`](/influxdb/v1/administration/config/#max-values-per-tag-100000) errors
- Remove the deprecated `influxd-ctl force-leave` command
- Fix issue where CQs would stop running if the first meta node in the cluster stops
- Fix logging in the meta httpd handler service
- Fix issue where subscriptions send duplicate data for [Continuous Query](/influxdb/v1/query_language/continuous_queries/) results
- Fix the output for `influxd-ctl show-shards`
- Send the correct RPC response for `ExecuteStatementRequestMessage`

## v1.1.5 [2017-04-28]

### Bug fixes

- Prevent certain user permissions from having a database-specific scope.
- Fix security escalation bug in subscription management.

## v1.1.3 [2017-02-27]

This release incorporates the changes in the 1.1.4 release of OSS InfluxDB.
Please see the OSS [changelog](https://github.com/influxdata/influxdb/blob/v1.1.4/CHANGELOG.md) for more information about the OSS release.

### Bug fixes

- Delay when a node listens for network connections until after all requisite services are running. This prevents queries to the cluster from failing unnecessarily.
- Allow users to set the `GOMAXPROCS` environment variable.

## v1.1.2 [internal]

This release was an internal release only.
It incorporates the changes in the 1.1.3 release of OSS InfluxDB.
Please see the OSS [changelog](https://github.com/influxdata/influxdb/blob/v1.1.3/CHANGELOG.md) for more information about the OSS release.

## v1.1.1 [2016-12-06]

This release builds off of the 1.1.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#v111-2016-12-06) for more information about the OSS release.

This release is built with Go (golang) 1.7.4.
It resolves a security vulnerability reported in Go (golang) version 1.7.3 which impacts all
users currently running on the macOS platform, powered by the Darwin operating system.

#### Cluster-specific bug fixes

- Fix hinted-handoff issue: Fix record size larger than max size
&emsp;If a Hinted Handoff write appended a block that was larger than the maximum file size, the queue would get stuck because       the maximum size was not updated. When reading the block back out during processing, the system would return an error         because the block size was larger than the file size -- which indicates a corrupted block.

## v1.1.0 [2016-11-14]

This release builds off of the 1.1.0 release of InfluxDB OSS.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#v110-2016-11-14) for more information about the OSS release.

### Upgrading

* The 1.1.0 release of OSS InfluxDB has some important [configuration changes](https://github.com/influxdata/influxdb/blob/1.1/CHANGELOG.md#configuration-changes) that may affect existing clusters.
* The `influxd-ctl join` command has been renamed to `influxd-ctl add-meta`.  If you have existing scripts that use `influxd-ctl join`, they will need to use `influxd-ctl add-meta` or be updated to use the new cluster setup command.

#### Cluster setup

The `influxd-ctl join` command has been changed to simplify cluster setups.  To join a node to a cluster, you can run `influxd-ctl join <meta:8091>`, and we will attempt to detect and add any meta or data node process running on the hosts automatically.  The previous `join` command exists as `add-meta` now.  If it's the first node of a cluster, the meta address argument is optional.

#### Logging

Switches to journald logging for on systemd systems. Logs are no longer sent to `/var/log/influxdb` on systemd systems.

#### Cluster-specific features

- Add a configuration option for setting gossiping frequency on data nodes
- Allow for detailed insight into the Hinted Handoff queue size by adding `queueBytes` to the hh\_processor statistics
- Add authentication to the meta service API
- Update Go (golang) dependencies: Fix Go Vet and update circle Go Vet command
- Simplify the process for joining nodes to a cluster
- Include the node's version number in the `influxd-ctl show` output
- Return and error if there are additional arguments after `influxd-ctl show`
&emsp;Fixes any confusion between the correct command for showing detailed shard information (`influxd-ctl show-shards`) and the incorrect command (`influxd-ctl show shards`)

#### Cluster-specific bug fixes

- Return an error if getting latest snapshot takes longer than 30 seconds
- Remove any expired shards from the `/show-shards` output
- Respect the [`pprof-enabled` configuration setting](/enterprise_influxdb/v1/administration/configuration/#pprof-enabled-true) and enable it by default on meta nodes
- Respect the [`pprof-enabled` configuration setting](/enterprise_influxdb/v1/administration/configuration/#pprof-enabled-true-1) on data nodes
- Use the data reference instead of `Clone()` during read-only operations for performance purposes
- Prevent the system from double-collecting cluster statistics
- Ensure that the Meta API redirects to the cluster leader when it gets the `ErrNotLeader` error
- Don't overwrite cluster users with existing OSS InfluxDB users when migrating an OSS instance into a cluster
- Fix a data race in the raft store
- Allow large segment files (> 10MB) in the Hinted Handoff
- Prevent `copy-shard` from retrying if the `copy-shard` command was killed
- Prevent a hanging `influxd-ctl add-data` command by making data nodes check for meta nodes before they join a cluster

## v1.0.4 [2016-10-19]

#### Cluster-specific bug fixes

- Respect the [Hinted Handoff settings](/enterprise_influxdb/v1/administration/configuration/#hinted-handoff) in the configuration file
- Fix expanding regular expressions when all shards do not exist on node that's handling the request

## v1.0.3 [2016-10-07]

#### Cluster-specific bug fixes

- Fix a panic in the Hinted Handoff: `lastModified`

## v1.0.2 [2016-10-06]

This release builds off of the 1.0.2 release of OSS InfluxDB.  Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v102-2016-10-05) for more information about the OSS release.

#### Cluster-specific bug fixes

- Prevent double read-lock in the meta client
- Fix a panic around a corrupt block in Hinted Handoff
- Fix  issue where `systemctl enable` would throw an error if the symlink already exists

## v1.0.1 [2016-09-28]

This release builds off of the 1.0.1 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v101-2016-09-26)
for more information about the OSS release.

#### Cluster-specific bug fixes

* Balance shards correctly with a restore
* Fix a panic in the Hinted Handoff: `runtime error: invalid memory address or nil pointer dereference`
* Ensure meta node redirects to leader when removing data node
* Fix a panic in the Hinted Handoff: `runtime error: makeslice: len out of range`
* Update the data node configuration file so that only the minimum configuration options are uncommented

## v1.0.0 [2016-09-07]

This release builds off of the 1.0.0 release of OSS InfluxDB.
Please see the OSS [release notes](https://github.com/influxdata/influxdb/blob/1.0/CHANGELOG.md#v100-2016-09-07) for more information about the OSS release.

Breaking Changes:

* The keywords `IF`, `EXISTS`, and `NOT` were removed for this release. This means you no longer need to specify `IF NOT EXISTS` for `DROP DATABASE` or `IF EXISTS` for `CREATE DATABASE`.  Using these keywords will return a query error.
* `max-series-per-database` was added with a default of 1M but can be disabled by setting it to `0`. Existing databases with series that exceed this limit will continue to load, but writes that would create new series will fail.

### Hinted handoff

A number of changes to hinted handoff are included in this release:

* Truncating only the corrupt block in a corrupted segment to minimize data loss
* Immediately queue writes in hinted handoff if there are still writes pending to prevent inconsistencies in shards
* Remove hinted handoff queues when data nodes are removed to eliminate manual cleanup tasks

### Performance

* `SHOW MEASUREMENTS` and `SHOW TAG VALUES` have been optimized to work better for multiple nodes and shards
* `DROP` and `DELETE` statements run in parallel and more efficiently and should not leave the system in an inconsistent state

### Security

The Cluster API used by `influxd-ctl` can not be protected with SSL certs.

### Cluster management

Data nodes that can no longer be restarted can now be forcefully removed from the cluster using `influxd-ctl remove-data -force <addr>`.  This should only be run if a grace removal is not possible.

Backup and restore has been updated to fix issues and refine existing capabilities.

#### Cluster-specific features

- Add the Users method to control client
- Add a `-force` option to the `influxd-ctl remove-data` command
- Disable the logging of `stats` service queries
- Optimize the `SHOW MEASUREMENTS` and `SHOW TAG VALUES` queries
- Update the Go (golang) package library dependencies
- Minimize the amount of data-loss in a corrupted Hinted Handoff file by truncating only the last corrupted segment instead of the entire file
- Log a write error when the Hinted Handoff queue is full for a node
- Remove Hinted Handoff queues on data nodes when the target data nodes are removed from the cluster
- Add unit testing around restore in the meta store
- Add full TLS support to the cluster API, including the use of self-signed certificates
- Improve backup/restore to allow for partial restores to a different cluster or to a database with a different database name
- Update the shard group creation logic to be balanced
- Keep raft log to a minimum to prevent replaying large raft logs on startup

#### Cluster-specific bug fixes

- Remove bad connections from the meta executor connection pool
- Fix a panic in the meta store
- Fix a panic caused when a shard group is not found
- Fix a corrupted Hinted Handoff
- Ensure that any imported OSS admin users have all privileges in the cluster
- Ensure that `max-select-series` is respected
- Handle the `peer already known` error
- Fix Hinted handoff panic around segment size check
- Drop Hinted Handoff writes if they contain field type inconsistencies

<br>
# Web Console

## DEPRECATED: Enterprise Web Console

The Enterprise Web Console has officially been deprecated and will be eliminated entirely by the end of 2017.
No additional features will be added and no additional bug fix releases are planned.

For browser-based access to InfluxDB Enterprise, [Chronograf](/chronograf/v1/introduction) is now the recommended tool to use.
