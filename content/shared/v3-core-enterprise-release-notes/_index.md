> \[!Note]
>
> #### InfluxDB 3 Core and Enterprise relationship
>
> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.
> All updates to Core are automatically included in Enterprise.
> The Enterprise sections below only list updates exclusive to Enterprise.

## v3.11.4 {date="2026-09-04"}

### Core

#### Bug fixes

- **Overwrites in the write buffer resolved arbitrarily**: Writes that repeat a series key and timestamp within one write buffer chunk now resolve to the last acknowledged write, in query results and in the persisted Parquet file. Previously the duplicate rows tied on both deduplication sort keys and an unstable sort picked an arbitrary survivor, so a superseded version could win. An overwrite that arrives while a snapshot is persisting also now wins over the frozen rows it replaces.
- **Snapshot manifest skipped for an empty snapshot**: Every snapshot sequence number now lands a manifest, including a snapshot with nothing to persist. Previously the manifest was skipped, leaving a permanent hole in the sequence. Consumers that walk the sequence by exact key cannot tell a skipped snapshot from a manifest that failed to persist, so a single hole stalled Enterprise compaction on that node and blocked its read replicas.
- **Stale plugin source after re-enabling a trigger**: Stopping a trigger now drops its plugin from the worker's in-memory cache, so re-enabling it re-reads the code. Since v3.11.0 the cache was insert-only, so disabling and re-enabling a trigger resumed the cached copy and never contacted the plugin repository again, which is the documented way to pick up a new version of a `gh:` plugin.
- **Plugin source retained after a database was deleted**: Deleting a database now evicts its triggers' cached plugin source. Previously it stayed resident until the server restarted.
- **Processing engine Python updated to 3.13.15**: Picks up the security fixes in that release.
- Other bug fixes and performance improvements

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Startup phase logging**: The server logs the start and completion of each startup phase, so a node killed during startup shows which phase it was in.

#### Bug fixes

- **Privilege escalation through role assignment**: Creating, updating, and deleting a role, and assigning roles to a user, now require admin authorization. Previously a non-admin subject holding `User:Update`, or `User:Create` with roles in the request, could grant permissions beyond its own. This affects the [user authentication preview](/influxdb3/enterprise/admin/security/manage-users/), which is off by default (`--user-auth-type none`); deployments that have not enabled it are unaffected.
- **Out-of-memory clearing the WAL backlog during a storage engine upgrade**: The upgrade now snapshots during WAL replay whenever the buffer reaches a quarter of the query executor's memory pool, instead of buffering the whole backlog and persisting it in one pass. Each snapshot removes the WAL files it covers, so a restart resumes from the last one rather than replaying from the beginning.
- **Out-of-memory importing a large source during a storage engine upgrade**: Bulk import now admits a job by its estimated working set rather than its compressed size, runs a job larger than the compactor's input-size budget on its own, and refuses a source that cannot fit at all with an error naming the budget it would need. Previously an oversized source was retried until the node ran out of memory, with no attempt recorded.
- **File index left behind when a generation expires**: Retention now deletes a generation's detail object along with its Parquet files. Previously the detail, which holds the file index describing those files, was left unreferenced in object storage. On a table with high-cardinality index columns the detail is the larger of the two, so retention shrank the data and accumulated the indexes for the life of the cluster.
- **Compactor replans forever against a missing index file (upgraded storage engine)**: A run set whose index object is confirmed gone from object storage is now skipped after three failed reads on separate scheduler passes, so planning moves on to other work. Previously every planner that read the index failed, abandoned the plan, and recreated it on the next tick indefinitely. The skip list is in memory only: a restart clears it, and a repaired index is picked up again.
- **Empty snapshot manifests were never deleted**: Gen1 cleanup now deletes a consumed manifest that references no files. Previously it returned early on such a manifest without deleting it, and because cleanup retains the oldest entries in each batch, undeletable manifests could eventually fill every batch and starve cleanup.
- **Stale plugin source after a catalog restore**: Restoring a catalog now evicts the worker's cached plugin source, so restarted triggers re-read their code. Previously a trigger whose restored definition matched the cached one resumed the pre-restore source without contacting the plugin repository.
- **Spurious memory reservation warning at startup**: The warning threshold is now above the sum of the shipped percentage defaults, which come to 90 percent of detected memory. Previously a server running the default configuration warned about itself.
- Other bug fixes and performance improvements

## v3.10.6 {date="2026-09-04"}

### Core

#### Features

- **`--shutdown-timeout` graceful shutdown bound**: This new option (default `30s`) caps how long the server waits for active connections to drain during shutdown before forcibly closing them. Set it to `0s` to skip the drain.

#### Bug fixes

- **Crash loop migrating a catalog written by Core**: Catalog snapshots deserialize again when the node spec is missing from trigger, last value cache, and distinct value cache entries, defaulting to all nodes. Core never writes that field, so the unified deserializer rejected Core-written checkpoint files and the v2-to-v3 catalog migration crash-looped on upgrade.
- **Snapshot manifest skipped for an empty snapshot**: Every snapshot sequence number now lands a manifest, including a snapshot with nothing to persist. Previously the manifest was skipped, leaving a permanent hole in the sequence. Consumers that walk the sequence by exact key cannot tell a skipped snapshot from a manifest that failed to persist, so a single hole stalled Enterprise compaction on that node and blocked its read replicas.
- **Unnecessary node shutdown after a retried WAL write**: Each WAL file now carries a nonce in its object metadata, so a node recognizes its own write and shuts down only for a file written by another node. Previously, a conditional PUT that was applied but returned a 500 was retried, and the node read the resulting 412 as a second process holding the same `--node-id` and shut down, though the file was durable and correct.
- **Panic on oversized duration values**: Time arithmetic now saturates at the minimum or maximum representable timestamp instead of panicking when a duration is too large to represent. Previously, an oversized user-supplied duration produced a panic and could put the server into a startup panic loop.
- **Processing engine Python updated to 3.13.15**: Picks up the security fixes in that release.
- Other bug fixes and performance improvements

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Startup phase logging**: The server logs the start and completion of each startup phase, so a node killed during startup shows which phase it was in.

#### Bug fixes

- **Privilege escalation through role assignment**: Creating, updating, and deleting a role, and assigning roles to a user, now require admin authorization. Previously a non-admin subject holding `User:Update`, or `User:Create` with roles in the request, could grant permissions beyond its own. This affects the [user authentication preview](/influxdb3/enterprise/admin/security/manage-users/), which is off by default (`--without-user-auth true`); deployments that have not enabled it are unaffected.
- **File index left behind when a generation expires**: Retention now deletes a generation's detail object along with its Parquet files. Previously the detail, which holds the file index describing those files, was left unreferenced in object storage. On a table with high-cardinality index columns the detail is the larger of the two, so retention shrank the data and accumulated the indexes for the life of the cluster.
- **Slow compaction catch-up behind a lagging node**: The compactor now accumulates the rerun signal across every node in a cycle. Previously it kept only the last node's value, so a caught-up node could end the cycle after a single snapshot and leave a lagging node advancing one snapshot per check interval until restart.
- Other bug fixes and performance improvements

## v3.9.13 {date="2026-09-04"}

### Core

#### Bug fixes

- **Snapshot manifest skipped for an empty snapshot**: Every snapshot sequence number now lands a manifest, including a snapshot with nothing to persist. Previously the manifest was skipped, leaving a permanent hole in the sequence. Consumers that walk the sequence by exact key cannot tell a skipped snapshot from a manifest that failed to persist, so a single hole stalled Enterprise compaction on that node and blocked its read replicas.
- **Unnecessary node shutdown after a retried WAL write**: Each WAL file now carries a nonce in its object metadata, so a node recognizes its own write and shuts down only for a file written by another node. Previously, a conditional PUT that was applied but returned a 500 was retried, and the node read the resulting 412 as a second process holding the same `--node-id` and shut down, though the file was durable and correct.
- **Restarted downloads of large manifests and checkpoints at startup**: Snapshot manifest and checkpoint reads larger than 128 MiB are now fetched as 16 MiB ranged reads, so a slow or failed transfer retries one range. Previously, a single whole-object GET restarted a multi-gigabyte download from byte 0.
- **Panic on oversized duration values**: Time arithmetic now saturates at the minimum or maximum representable timestamp instead of panicking when a duration is too large to represent. Previously, an oversized user-supplied duration produced a panic and could put the server into a startup panic loop.
- **Processing engine Python updated to 3.13.15**: Picks up the security fixes in that release.
- Other bug fixes and performance improvements

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Startup phase logging**: The server logs the start and completion of each startup phase, so a node killed during startup shows which phase it was in.

#### Bug fixes

- **File index left behind when a generation expires**: Retention now deletes a generation's detail object along with its Parquet files. Previously the detail, which holds the file index describing those files, was left unreferenced in object storage. On a table with high-cardinality index columns the detail is the larger of the two, so retention shrank the data and accumulated the indexes for the life of the cluster.
- **Slow compaction catch-up behind a lagging node**: The compactor now accumulates the rerun signal across every node in a cycle. Previously it kept only the last node's value, so a caught-up node could end the cycle after a single snapshot and leave a lagging node advancing one snapshot per check interval until restart.
- Other bug fixes and performance improvements

## v3.11.3 {date="2026-08-28"}

### Core

No adjustments in this release.
Core remains on v3.11.2.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Read run-set indexes written by later releases**:
  The compactor now reads the v3 run-set index format that later releases write,
  so you can roll back to v3.11.3 from a release that writes v3 indexes without
  leaving unreadable indexes behind.

#### Bug fixes

- **Missing rows from an `OR` predicate against a [file index](/influxdb3/enterprise/admin/file-index/)**:
  File pruning now applies to an `OR` only when both sides resolve against the
  index, and otherwise falls back to scanning all files.
  Previously, when one side referenced a column that the index doesn't cover,
  the query kept only the files that matched the resolved side, so rows that
  matched only through the uncovered side were dropped from the results.
- **Deferred snapshot recovery makes no progress on a busy cluster**:
  The new
  [`--recover-deferred-snapshots-in-flight-limit`](/influxdb3/enterprise/reference/storage-engine-config-options/#deferred-snapshot-recovery)
  option raises the per-node in-flight snapshot limit that gates
  `--recover-deferred-snapshots`.
  The limit was previously fixed at three, so on a cluster whose ingest nodes
  snapshot faster than compaction completes batches, recovery never ran.
  The default is unchanged.
- Other bug fixes and performance improvements

## v3.11.2 {date="2026-08-20"}

### Core

#### Bug fixes

- **Rows missing from queries during snapshot persistence**: Each persist job now drops only the buffer chunk whose Parquet file it published. Previously, the first job of a snapshot to finish evicted every sibling chunk, so whole time ranges vanished from query results until their persist job finished.
- **Partial schema changes from a rejected line**: A line protocol line is now validated in full before the catalog is mutated, so a rejected line contributes nothing to it. Previously, with `accept_partial=true`, columns created earlier in the line were committed anyway, and a line rejected after its tags were processed merged them into the next valid line's series key.
- **Unnecessary node shutdown after a retried WAL write**: Each WAL file now carries a nonce in its object metadata, so a node recognizes its own write and shuts down only for a file written by another node. Previously, a conditional PUT that was applied but returned a 500 was retried, and the node read the resulting 412 as a second process holding the same `--node-id` and shut down, though the file was durable and correct.
- **Panic querying `system.parquet_files` for an unknown table**: Filtering on a `table_name` that is not a current table, or querying after its database is dropped, now returns zero rows. Previously, both panicked the request thread and returned a truncated HTTP 200.
- **Duplicate rows from a concurrent snapshot handoff**: Buffer chunks and persisted Parquet files are now read under a single lock. Previously, a read landing between the two saw a new Parquet file alongside the buffer chunks it was written from and returned those rows twice. Served queries masked this through deduplication, but paths that read record batches directly, such as the Processing Engine, did not.
- **Restarted downloads of large manifests and checkpoints at startup**: Snapshot manifest and checkpoint reads larger than 128 MiB are now fetched as 16 MiB ranged reads, so a slow or failed transfer retries one range. Previously, a single whole-object GET restarted a multi-gigabyte download from byte 0.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Retry storage engine upgrade**: The new `influxdb3 manage retry-upgrade-to-pacha-tree` command resets a [storage engine upgrade](/influxdb3/enterprise/reference/internals/storage-engine/#upgrade-from-parquet), so it resumes the next time the compactor node starts with `--upgrade-pacha-tree`. Sources whose table, database, or objects are gone become skips, and anything still readable returns to the queue. Nothing is deleted, so the command is safe to run again.

#### Bug fixes

- **Compaction falls behind on a large snapshot backlog**: Snapshot compaction now caps outstanding plans relative to the compactor's core count, batches snapshots in ingest-time order, and fetches each plan's gen0 files once per worker. Previously, a deep backlog could accumulate thousands of outstanding plans, recompact the same time windows once per node, and delay the first plan by over 12 minutes.
- **Compactor primacy livelock during a migration**: Primary lease reads and writes now bypass the process-wide object store concurrency limit. Previously, a migration's bulk import could starve lease renewal, so the holder repeatedly demoted at its 30-second lease TTL and reacquired, pinning the migration indefinitely while object storage itself was healthy.
- **Multi-window migration imports make no progress**: The migration baseline now clips each staged file's contribution to its window's time range, and migration imports the newest windows first. Previously, a file crossing a window boundary caused publish validation to refuse each consolidation, so the scheduler replanned the same work forever.
- **Migration fails on an unreadable source**: A source Parquet file confirmed missing, or whose table or database has been dropped, is now recorded as a skip instead of failing the whole upgrade, and `system.upgrade_parquet` reports it as `skipped_source_missing` or `skipped_table_dropped`. Only confirmed-missing sources are skipped, so a transient `NotFound` stays retryable and a grouped job still converts its readable companions.
- **Compaction and migration fail on stale gen1 references**: `leftover_gen1_files` references are now reconciled against the deletions that ingesters record in their snapshots, so a reference is dropped when its Parquet file is deleted regardless of retention configuration. Previously, references were pruned only against the current retention cutoff, so they accumulated indefinitely on a table with no retention period, and a storage engine upgrade then failed enumerating them.
- **`Internal error` querying a last value or distinct value cache**: A query node now registers caches that were created on another node during startup, regardless of the cache's node spec. Previously, a cache present in the catalog but missing from a node's in-memory provider failed every query against it with `last cache crate is invalid` until the node was restarted.
- **Duplicate rows from a replica snapshot handoff**: Each buffer on a node now has its chunks and Parquet files read under a single lock, and each replica advances the gen1 chunk order offset by its own chunk count. Previously, a snapshot handoff landing between the two read passes returned those rows twice, and on clusters with more than three replicas the old offset let local chunks reuse an order a replica had taken.
- **Slow compaction catch-up behind a lagging node**: The compactor now accumulates the rerun signal across every node in a cycle. Previously it kept only the last node's value, so a caught-up node could end the cycle after a single snapshot and leave a lagging node advancing one snapshot per check interval until restart.
- **Catalog checkpoint persistence failures for large payloads**: Catalog checkpoint and month-rollover writes now fall back to a multipart upload for oversized payloads. Previously, both used a single PUT, so a checkpoint merging a month of snapshots could exceed object storage's 5 GiB single-PUT limit and fail, silently losing the boot-time fast path.
- **Warning flood during startup snapshot restore**: `removed_files` entries whose target database or table is no longer present are now reported in one aggregated warning per restore. Previously, each miss logged its own warning, which buried real startup errors and slowed restore.
- Other bug fixes and performance improvements

#### Breaking changes

- **`--l1-hot-tail-target-size` is functional again**: The option (default `250mb`) caps live L1 tail rewrites during snapshot compaction, and a larger tail is handed to L1 consolidation to seal. It was previously accepted and ignored.
- **`--l1-consolidation-min-age` and `--row-delete-max-jobs-per-tick` are now ignored**: L1 consolidation has no age gate, and row-delete work shares the weighted delete slot. Both options are still accepted.
- **`--l1-consolidation-target-size` is now the established-L1 size boundary**: Consolidation consumes run sets at or below it, and promotion requires at least two L1 run sets larger than it. `--l1-consolidation-min-run-sets` and `--compactor-max-source-run-sets-per-promotion` now apply only to the legacy layout.
- **`--replica-snapshot-manifest-load-concurrency` applies to both storage engines**: It now bounds the boot-time snapshot manifest load on the Parquet engine as well as the upgraded engine. When unset, each engine derives its own default.
- **Compactor status log fields changed**: The `service_memory_*` fields are gone, and `pending_input_mb` is renamed to `charged_input_mb`.

## v3.11.1 {date="2026-08-06"}

### Core

#### Bug fixes

- **Panic on oversized duration values**: Time arithmetic now saturates at the minimum or maximum representable timestamp instead of panicking when a duration is too large to represent. Previously, an oversized user-supplied duration produced a panic and could put the server into a startup panic loop.
- **Duplicate admin token registration**: The catalog now rejects registering a token whose hashed value already exists. Previously, the server registered the duplicate under a new ID.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Remove migrated Parquet data after a storage engine upgrade**: The new `influxdb3 manage cleanup-parquet` command and `/api/v3/enterprise/upgrade/parquet_cleanup` API permanently delete the pre-upgrade Parquet data and compactor metadata from object storage after a [storage engine upgrade](/influxdb3/enterprise/reference/internals/storage-engine/#upgrade-from-parquet) completes. Use `--dry-run` to report what a cleanup would delete, and how much space it would reclaim, without deleting anything; `--wait` to poll until the cleanup completes; and `--status-only` to check the status of the current or most recent cleanup. The cleanup runs on the compactor node, resumes automatically after a restart, and reports progress in the new `system.upgrade_parquet_cleanup` system table. After a cleanup deletes data, [downgrading to Parquet](/influxdb3/enterprise/reference/internals/storage-engine/#downgrade-to-parquet) is no longer possible.

#### Bug fixes

- **Data missing from queries during a storage engine upgrade**: While a cluster migrates from Parquet to the upgraded storage engine, hybrid queries now serve the migrating node's own not-yet-compacted gen1 data, and data imported during the migration is queryable in all-in-one mode. Previously, on a single-node cluster, rows that the Parquet compactor had not yet folded into compacted data were missing from query results for the duration of the migration.
- **Compactor crash loop after primary re-election**: The catalog's subscription registry now reclaims a subscription slot whose receiver was dropped and skips closed subscribers when broadcasting updates, and compactor teardown now completes before the next term re-subscribes. Previously, a compactor primary re-election within one process could panic on the stale slot and crash-loop the node, and a lingering stale slot could fail an unrelated catalog update.
- **Compactor retention sweep stalls (upgraded storage engine)**: The retention sweep now checks each run set's key span in memory, and remembers negative results, instead of re-reading every run-set index from object storage on every scheduler tick. Previously, one table with a short retention period alongside a large historical dataset could freeze compaction dispatch, completion handling, and status reporting for hours while the sweep serially re-read every index.
- **Query node boot loop with a large snapshot backlog (upgraded storage engine)**: At startup, a query node now fetches peer snapshot manifests concurrently, bounded by `--replica-gen0-load-concurrency` (default `16`), and walks at most 10,000 manifests per node. If the cap is reached, the server logs an error noting that data in the skipped older snapshots stays unqueryable until compaction covers it. Previously, the walk fetched the entire backlog serially with no bound, so a large backlog behind a stalled compactor could run for hours, exhaust memory, and restart the node from zero in a permanent boot loop.
- **Incorrect query results from out-of-order series scans (upgraded storage engine)**: A window scan that advertises series-key ordering now always merge-sorts its inputs. Previously, files could be chained together out of order while the query plan claimed sorted output, and downstream sort-merge operations silently produced incorrect results.
- Other bug fixes and performance improvements

## v3.11.0 {date="2026-07-30"}

### Core

#### Features

- **Async trigger concurrency limit**: The new `--async-trigger-concurrency-limit`
  option caps the number of concurrent invocations for an asynchronous
  processing engine trigger. The default is unlimited.

- **Processing engine retry behavior for asynchronous triggers**: When
  `trigger_settings.run_async = true`, a failed trigger invocation now retries
  up to 5 times before being discarded. Previously, failed invocations retried
  indefinitely.

- **WAL triggers skip empty flushes**: A WAL trigger no longer runs when the
  WAL flush it would process is empty. Previously, the trigger ran on every
  flush, including empty ones.

- **Disabled trigger state persists across restarts**: When
  `trigger_settings.error_behavior = disable` disables a trigger, the disabled
  state now survives a server restart. Previously, a disabled trigger
  re-enabled itself on restart.

- **`--disable-package-management`**: Use this option to prevent the server
  from creating or modifying a Python virtual environment or invoking `pip`.
  Package-install API calls are rejected while it's set.

- **Virtual `event_time` column on `system.processing_engine_logs`**: Queries
  that reference the former `event_time` column continue to work after the
  column was renamed to `time`.

- **`--shutdown-timeout` graceful shutdown bound**: This new option (default
  `30s`) caps how long the server waits for active connections to drain during
  shutdown before forcibly closing them. Set it to `0s` to skip the drain.

#### Bug fixes

- **cgroup-aware resource sizing**: Containerized deployments now size
  memory-based defaults against the container's cgroup limits instead of the
  host machine's total resources.

#### Breaking changes


- **Size options require an explicit unit**: Options that accept a size value
  (for example, `--exec-mem-pool-size` and `--file-cache-size`) now reject a
  bare number. Append a unit suffix (`b`, `kb`, `mb`, `gb`, `tb`) or, where
  noted, a percentage (for example, `20%`). This avoids a silent change in
  meaning — historically, a bare number meant megabytes for some options and
  bytes for others.

- **Three memory and cache options renamed, with a deprecated alias**:
  `--exec-mem-pool-bytes` is now `--exec-mem-pool-size`,
  `--parquet-mem-cache-size` is now `--file-cache-size`, and
  `--force-snapshot-mem-threshold` is now `--force-snapshot-mem-size`
  (`--parquet-mem-cache-query-path-duration` is now `--file-cache-recency`,
  and `--disable-parquet-mem-cache` is now `--disable-file-cache`). The
  deprecated old names, and their environment variables, still work and
  still accept a bare number as megabytes — their pre-3.11 meaning — but log
  a startup deprecation warning.

- **`--max-http-request-size` keeps its name and its pre-3.11 meaning**: A
  bare number is still accepted as bytes, but now logs a startup warning.
  Prefer an explicit unit suffix, for example `10mb`.

- **`--query-log-size` renamed to `--query-log-max-entries`**, with the old
  name and its environment variable kept as a deprecated, backward-compatible
  alias.

- **Other options and environment variables renamed, with a deprecated
  alias**: legacy names still work and log a startup deprecation warning; if
  both the old and new name are set with different values, the new name
  wins.

  | Old | New |
  | :---- | :---- |
  | `--disable-parquet-mem-cache`, `--disable-data-file-cache` | `--disable-file-cache` |
  | `--wal-max-write-buffer-size` | `--wal-max-buffered-writes` |
  | `--wal-snapshot-size` | `--wal-files-per-snapshot` |
  | `INFLUXDB3_DB_DIR` | `INFLUXDB3_DATA_DIR` |
  | `INFLUXDB3_NODE_IDENTIFIER_PREFIX` | `INFLUXDB3_NODE_ID` |
  | `INFLUXDB3_NODE_IDENTIFIER_FROM_ENV` | `INFLUXDB3_NODE_ID_FROM_ENV` |
  | `INFLUXDB3_NUM_WAL_FILES_TO_KEEP` | `INFLUXDB3_SNAPSHOTTED_WAL_FILES_TO_KEEP` |
  | `INFLUXDB3_START_WITHOUT_AUTH` | `INFLUXDB3_WITHOUT_AUTH` |
  | `INFLUXDB3_TCP_LISTINER_FILE_PATH` (misspelling) | `INFLUXDB3_TCP_LISTENER_FILE_PATH` |
  | `INFLUXDB3_TELEMETRY_DISABLE_UPLOAD` | `INFLUXDB3_DISABLE_TELEMETRY_UPLOAD` |

  <!-- Internal engineering notes also listed `TOKIO_CONSOLE_*` →
  `INFLUXDB3_TOKIO_CONSOLE_*`, but that rename doesn't appear anywhere in
  the current config-options reference — confirm with engineering before
  adding it back. -->

  These renames apply to both Core and Enterprise. For the separate
  Enterprise-only `INFLUXDB3_ENTERPRISE_*` → `INFLUXDB3_*` environment
  variable renames, see Enterprise breaking changes below.

- **Duplicate tag keys are rejected at write time**: A point that repeats a
  tag key (for example, `m,t=a,t=a f=1i`) is now rejected with a clear error,
  the same way duplicate field keys are. <!-- NEEDS VERIFICATION: this fix
  already shipped in v3.9.8 / v3.10.3 below — confirm with engineering whether
  3.11 changes anything further here, or drop this bullet as a duplicate. -->

- **`/api/v2/write` returns 503 instead of 400 when the node is stopped**:
  Clients that key retry logic off the status code now correctly treat this
  response as retryable.

- **`--hard-delete-default-duration` is confirmed to have no effect**: This
  option has never affected hard-delete behavior in any release — the server
  always uses its built-in default duration. The option is still accepted so
  existing configurations keep starting, but the server now logs a startup
  warning recommending you remove it.

- **`--object-store-cache-endpoint` removed**: This option was parsed but
  consumed by dead code and never had an effect. The flag now fails to
  parse at startup, and the `INFLUXDB3_OBJECT_STORE_CACHE_ENDPOINT` /
  `OBJECT_STORE_CACHE_ENDPOINT` environment variables are ignored. Remove
  it from your configuration.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **The upgraded storage engine is now the default**: New clusters are
  created on the upgraded storage engine with no opt-in flag required. The
  engine is resolved from the catalog's persisted storage mode, not from a
  flag:
  - A brand new cluster is stamped for the upgraded storage engine at catalog
    creation. There's no user-facing opt-out.
  - An existing Parquet cluster keeps running Parquet after the binary
    upgrade. The persisted mode wins on load.
  - To migrate an existing Parquet cluster, pass `--upgrade-pacha-tree`
    (environment variable `INFLUXDB3_UPGRADE_PACHA_TREE`). This moves the
    catalog into a hybrid Parquet-and-upgraded-storage-engine mode and starts
    the migration. A catalog in the upgraded or migrating mode always runs
    the upgraded storage engine from then on.

  `--use-pacha-tree` still works and keeps its historical migration-starting
  semantics, but is deprecated and logs a warning at startup. Core remains
  Parquet-only.

- **Compaction throughput improvements (upgraded storage engine)**: Time-disjoint two-level
  compaction and overlapping-L1 leading-edge parallelism are now the default.
  Previously, all leading-edge ingest funneled through a single hot-tail L1
  run set. This capped leading-edge throughput at one in-flight compaction
  job.

  In 3.11, several concurrent L1 compaction jobs can serve the leading edge
  and any heavily-written range. This decouples ingest throughput from
  compactor reconciliation.

  New windows and shards use the time-disjoint layout. Existing checkpoints
  keep their recorded layout until you upgrade them.

- **Integrated Explorer**: The InfluxDB 3 Web UI (Explorer) now ships inside
  the Enterprise binary as a WebAssembly guest, hosted in-process behind a WASI
  sandbox. Enable it with `--mode all,webui`. The Web UI is **not** included in
  plain `--mode all`, and a session secret is mandatory when `webui` mode is
  enabled:

  ```shell
  mkdir -p ./plugins
  influxdb3 serve \
    --cluster-id cluster0 \
    --node-id node0 \
    --mode all,webui \
    --plugin-dir ./plugins \
    --webui-session-secret "$(openssl rand -base64 24)"
  ```

  You configure a connection to your local server (for example,
  `http://localhost:8181`), the same way you connect to a database server
  from the standalone Docker Explorer.
  <!-- NEEDS VERIFICATION: per user note, this connection setup lands with
  pending PRs still in progress as of this draft — confirm the exact steps
  and whether an operator token is required before publishing. --> It keeps
  a SQLite database that's automatically synchronized to object storage per
  cluster. AI chat is included and can point at any OpenAI-compatible
  endpoint with `--webui-openai-base-url`.

- **Thread defaults scale with your license on the upgraded storage engine**:
  On clusters running the upgraded storage engine (the default for new
  clusters), `--num-io-threads` and the DataFusion thread pool each default to
  your licensed core count, instead of the flat defaults used on
  Parquet-engine clusters. `--num-cores` validation runs after the server
  resolves the active storage engine, since the upgraded engine can license
  more cores than a Parquet-engine cluster does. A thread count set above the
  licensed core count is capped with a startup warning instead of rejected.

- **Incremental backups**: Backup is no longer full-only. Each incremental
  backup names a parent, and restoring an incremental walks the manifest chain
  to produce a full restore. Deleting an incremental also deletes every child
  that depends on it.

  ```shell
  influxdb3 create backup --name base --token $ADMIN_TOKEN
  influxdb3 create backup --name inc-1 --incremental --parent base --token $ADMIN_TOKEN
  influxdb3 create restore --backup inc-1 --token $ADMIN_TOKEN
  ```

- **Restore is now a point-in-time rollback**: Restore was previously
  additive. It's now destructive: it truncates the WAL above the backup's
  watermark so a restart doesn't replay and resurrect post-backup data.

- **In-place restore without a restart**: Restore can now apply to a running
  cluster. Supporting work includes gen0 buffer eviction, fencing peer writes
  on ingest-mode nodes during the restore, and evicting the query-node replica
  buffer so queriers stop serving the pre-restore view.

- **Query performance (upgraded storage engine)**: `PachaTreeWindowExec` and
  `PachaTreeBufferExec` are now the default plan shape, giving visibility
  through `EXPLAIN` and `EXPLAIN ANALYZE`. Field family pruning skips loading
  field families that filters guarantee can't affect the result. Scan
  predicate pushdown now extends across single-field-family scans, the union
  path, dedup and gap-leaf scans, and time predicates.

- **Bulk import: remote sources and concurrency**: `influxdb3 import upload`
  now accepts an object store URL as a source, in addition to a local
  directory, and a `--concurrency` option to control how many files import at
  once (default 8).

  ```shell
  influxdb3 import upload --database mydb --table events \
    s3://my-bucket/exports/ \
    --source-opt aws_region=us-west-2 \
    --concurrency 16
  ```

- **Five new system tables (upgraded storage engine)**: `system.pt_shards`,
  `system.pt_compaction_files`, `system.pt_storage_snapshots`,
  `system.pt_storage_checkpoints`, and `system.pt_storage_run_set_indexes`.
  `pt_ingest_wal` and `pt_ingest_files` gained `node_id` and `node_name`
  columns.

- **`--user-auth-type` replaces `--without-user-auth`**: Configure the user
  authentication preview with a comma-separated list of `basic` and/or
  `oauth`, or `none` (the default). `--without-user-auth` is deprecated and
  hidden, but still takes precedence when explicitly set.

- **Query group CLI commands (not yet operational)**: `influxdb3 create
  query_group`, `influxdb3 show query_groups`, `influxdb3 update
  query_group`, and `influxdb3 delete query_group` store query group
  definitions in the catalog, but the server doesn't yet use those
  definitions to affect query routing, data placement, or replication.
  Creating a query group currently has no effect on query node behavior.

#### Bug fixes

- **Bulk import data loss window (checkpoint v13)**: Import watermarks are now
  embedded in the checkpoint itself, preventing data loss during a crash
  window.

- **In-place restore stability**: Release-candidate validation found that live
  in-place restore could wedge queriers until restart, and that writing after
  a restore could trigger ID-recycling corruption. Both are fixed in this
  release.

#### Breaking changes

- **Upgraded storage engine options dropped the `pt-` prefix, with no
  aliases**: An old `--pt-*` flag now causes a startup error, and legacy
  `INFLUXDB3_PT_*` and `INFLUXDB3_ENTERPRISE_PT_*` environment variables are
  ignored — startup logs a warning for each one that's still set. Review any
  saved command line, systemd unit, Docker Compose file, Helm chart, or
  packaged conf file before upgrading.

  Any `--pt-*` option not listed below simply drops the `pt-` prefix, and its
  environment variable follows the same pattern (`INFLUXDB3_PT_SNAPSHOT_SIZE`
  becomes `INFLUXDB3_SNAPSHOT_SIZE`). The following options changed beyond
  dropping the `pt-` prefix:

  | Old name | New name |
  | :---- | :---- |
  | `--pt-max-columns` | `--max-total-columns` |
  | `--pt-gen0-max-bytes-per-file` | `--gen0-max-file-size` |
  | `--pt-wal-replica-queue-size` | `--wal-replica-queue-length` |
  | `--pt-wal-max-buffer-size` | `--wal-buffer-size` |

  Every remaining upgraded-storage-engine byte-size flag ending in `-bytes`
  now ends in `-size` (the L1 through L4 tail and target-file flags).

  A few `--pt-*` flags map onto flag names shared with the Parquet engine,
  rather than getting their own new name — `--pt-wal-flush-interval` is now
  `--wal-flush-interval`, `--pt-wal-replication-interval` is now
  `--replication-interval`, `--pt-file-cache-size` is now `--file-cache-size`,
  `--pt-file-cache-recency` is now `--file-cache-recency`, and
  `--pt-disable-data-file-cache` is now `--disable-file-cache`.
  `--file-cache-size` is a total budget shared across both engines: during a
  storage engine upgrade with hybrid query enabled, the budget splits 50/50
  between the two engine caches; otherwise the active engine gets the full
  budget.

  The upgraded storage engine's flags no longer require `--use-pacha-tree`:
  in 3.10.x a `--pt-*` flag without `--use-pacha-tree` was a parse error, but
  with the upgraded storage engine as the default that constraint is gone.

  For the complete old-to-new name table, see
  [Migrate from `pt-` option names](/influxdb3/enterprise/performance-preview/configure/#migrate-from-pt-option-names).

- **`INFLUXDB3_ENTERPRISE_*` environment variables become plain
  `INFLUXDB3_*`**: 35 Enterprise-specific environment variables dropped the
  `ENTERPRISE_` segment — for example, `INFLUXDB3_ENTERPRISE_CLUSTER_ID` is
  now `INFLUXDB3_CLUSTER_ID`, and `INFLUXDB3_ENTERPRISE_MODE` is now
  `INFLUXDB3_MODE`. The legacy `ENTERPRISE_` names remain supported as
  deprecated aliases; the server logs a deprecation warning at startup when
  it detects one, and if both names are set with different values, the new
  name wins.

- **`--wait-for-running-ingestor` renamed to `--wait-for-running-ingester`**
  (the old name was a misspelling). The old option, and its
  `INFLUXDB3_WAIT_FOR_RUNNING_INGESTOR` /
  `INFLUXDB3_ENTERPRISE_WAIT_FOR_RUNNING_INGESTOR` environment variables,
  remain as deprecated, backward-compatible aliases.

- **Metrics lost their per-database `db` label**: This breaks any dashboard or
  alert that groups by database. Affected series include
  `influxdb3_write_lines`, `influxdb3_write_lines_rejected`,
  `influxdb3_write_bytes`, `influxdb3_compactions`,
  `influxdb3_last_values_cache_query_duration`, and the upgraded-storage-engine
  `influxdb3_ingest_*` family (`lp_bytes_received`, `pre_snapshot_buffer_*`,
  `pre_wal_flush_buffer_*`, `write_concurrency`).

- **`influxdb3 stop node` waits by default**: Previously, the server marked
  the node stopping and returned immediately, but the CLI claimed the node
  "has been stopped." The CLI now polls until the node reads `stopped`.
  `--timeout` bounds the wait (default 5m), and `--no-wait` restores the old
  fire-and-forget behavior. On timeout, it prints the last observed state and
  recovery guidance, then exits non-zero.

- **Parquet-only catalog limits are inert on the upgraded storage engine**: If
  `--num-database-limit`, `--num-table-limit`, or
  `--num-total-columns-per-table-limit` is set on a cluster running the
  upgraded storage engine, startup now warns that they're ignored instead of
  hard-failing, since existing manifests carry them across the storage engine
  upgrade. Only the per-table column limit has an upgraded-engine counterpart
  (`--max-total-columns`).

- **Four inert Enterprise options removed**: `--database-split-level`,
  `--table-split-level`, `--max-compact-destination`, and
  `--pt-enable-row-deletes` were parsed but never read; they are removed.
  The flags now fail to parse at startup and their environment variables
  are ignored. Remove them from your configuration.

## v3.10.5 {date="2026-07-20"}

### Core

#### Bug fixes

- **Oversized buffer chunk persistence**: When a buffer chunk splits because a single string or tag column exceeds 2 GiB, each resulting chunk now persists to its own Parquet file. Previously, the split chunks all wrote to the same path.

### Enterprise

All Core updates are included in Enterprise.

## v3.9.11 {date="2026-07-20"}

### Core

#### Bug fixes

- **Oversized buffer chunk persistence**: When a buffer chunk splits because a single string or tag column exceeds 2 GiB, each resulting chunk now persists to its own Parquet file. Previously, the split chunks all wrote to the same path.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- Other bug fixes and performance improvements

## v3.10.4 {date="2026-07-14"}

<!-- Uncomment once Core v3.10.4 is released
### Core

Maintenance release: v3.10.4 Core includes only build and dependency updates—no user-facing changes.
-->

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Skip loading the compacted data file index**: The new `--compacted-data-skip-file-index` option (`INFLUXDB3_ENTERPRISE_COMPACTED_DATA_SKIP_FILE_INDEX` environment variable, default `false`) loads compacted data without materializing the file index, letting nodes start when the index has grown too large to fit in host memory. Queries remain correct, but will run slower in exchange for a lower memory footprint.

#### Bug fixes

- **Skipped gen1 files in recompaction plans**: Gen1 files pulled into a recompaction plan that was skipped for exceeding the file limit are now carried into later plans' leftover lists. Previously, when the recompaction loop produced multiple plans for one table in a single cycle, those files were dropped from the final persisted compaction detail; the files remained in object storage, but no query path would serve them.
- Other bug fixes and performance improvements

## v3.9.10 {date="2026-07-14"}

### Core

Maintenance release: v3.9.10 Core includes only build and dependency updates—no user-facing changes.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Skipped gen1 files in recompaction plans**: Gen1 files pulled into a recompaction plan that was skipped for exceeding the file limit are now carried into later plans' leftover lists. Previously, when the recompaction loop produced multiple plans for one table in a single cycle, those files were dropped from the final persisted compaction detail; the files remained in object storage, but no query path would serve them.
- Other bug fixes and performance improvements

## v3.9.9 {date="2026-07-08"}

### Core

#### Bug fixes

- **Object store errors at startup**: When the catalog checkpoint existence check fails at startup, the underlying object store error is now logged and included in the reported error. Previously, the process exited with an opaque status code and no indication of the cause.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Skip loading the compacted data file index**: The new `--compacted-data-skip-file-index` option (`INFLUXDB3_ENTERPRISE_COMPACTED_DATA_SKIP_FILE_INDEX` environment variable, default `false`) loads compacted data without materializing the file index, letting nodes start when the index has grown too large to fit in host memory. Queries remain correct, but will run slower in exchange for a lower memory footprint.

#### Bug fixes

- Other bug fixes and performance improvements

## v3.10.3 {date="2026-07-07"}

### Core

#### Bug fixes

- **Duplicate tag key rejection**: Writes that repeat a tag key (for example, `m,t=a,t=a f=1i`) are now rejected with a clear error, the same way duplicate field keys are rejected. Previously, a point with a repeated tag key was accepted into the WAL and later caused a panic during snapshotting that crash-looped the node on WAL replay.
- **Processing engine trigger cancellation**: Disabling or deleting a trigger now cancels its in-flight plugin run in Core, extending the Enterprise fix from v3.10.2. Previously, a synchronous scheduled trigger whose plugin run was still executing could block trigger `disable` and `delete --force` operations until the run finished.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Compacted data load concurrency limit**: The new `--compacted-data-load-concurrency-limit` option (`INFLUXDB3_ENTERPRISE_COMPACTED_DATA_LOAD_CONCURRENCY_LIMIT` environment variable, default `20`) bounds concurrent object store reads when a node loads compacted data at startup. Previously, nodes with large compaction indexes issued unbounded concurrent reads at startup, which could saturate the network, cause object store timeouts, and starve other subsystems of object store connections.

#### Bug fixes

- **Corrupt peer WAL and snapshot handling**: A durably corrupt WAL or snapshot file from a peer node is now logged, counted, and skipped so replication continues with later files. Previously, a corrupt peer WAL file stalled replication from that node—or prevented server startup—and a corrupt snapshot manifest silently halted snapshot replication from that peer. Transient errors, such as network failures, still retry as before.
- Other bug fixes and performance improvements

## v3.9.8 {date="2026-07-07"}

### Core

#### Bug fixes

- **Duplicate tag key rejection**: Writes that repeat a tag key (for example, `m,t=a,t=a f=1i`) are now rejected with a clear error, the same way duplicate field keys are rejected. Previously, a point with a repeated tag key was accepted into the WAL and later caused a panic during snapshotting that crash-looped the node on WAL replay.
- **Processing engine trigger cancellation**: Disabling or deleting a trigger now cancels its in-flight plugin run in Core, extending the Enterprise fix from v3.9.7. Previously, a synchronous scheduled trigger (the default, created without `--run-asynchronous`) whose plugin run was still executing could block trigger `disable`, `delete --force`, and database deletion until the run finished.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Compacted data load concurrency limit**: The new `--compacted-data-load-concurrency-limit` option (`INFLUXDB3_ENTERPRISE_COMPACTED_DATA_LOAD_CONCURRENCY_LIMIT` environment variable, default `20`) bounds concurrent object store reads when a node loads compacted data at startup. Previously, nodes with large compaction indexes issued unbounded concurrent reads at startup, which could saturate the network, cause object store timeouts, and starve other subsystems of object store connections.

#### Bug fixes

- Other bug fixes and performance improvements

## v3.10.2 {date="2026-06-30"}

### Core

Maintenance release: v3.10.2 Core includes only build and dependency updates—no user-facing changes.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Processing engine trigger cancellation**: Disabling or deleting a trigger now cancels its in-flight plugin run. Previously, a synchronous scheduled trigger whose plugin run was still executing could block trigger `disable` and `delete --force` operations until the run finished.
- Other bug fixes and performance improvements

## v3.9.7 {date="2026-06-30"}

### Core

Maintenance release: v3.9.7 Core includes only build and dependency updates—no user-facing changes.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Processing engine trigger cancellation**: Disabling or deleting a trigger now cancels its in-flight plugin run promptly. Previously, a synchronous scheduled trigger (the default, created without `--run-asynchronous`) whose plugin run was still executing could block trigger `disable`, `delete --force`, and even unrelated `create` operations until the run finished.
- Other bug fixes and performance improvements

## v3.10.1 {date="2026-06-25"}

### Core

#### Bug fixes

- **Snapshot manifest persistence**: Snapshot manifests are now persisted using multipart uploads, preventing errors when writing large manifests to object storage.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Compacted generation deduplication**: Overlapping compacted generations are now co-partitioned so the querier correctly deduplicates them.
- **Performance upgrade preview file access**: A canceled file fetch no longer cascades cancellation to other waiters with the storage engine upgrade (`--use-pacha-tree`).
- Other bug fixes and performance improvements

## v3.9.6 {date="2026-06-25"}

### Core

Maintenance release: v3.9.6 Core includes only build and dependency updates—no user-facing changes.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Compacted generation deduplication**: Overlapping compacted generations are now co-partitioned so the querier correctly deduplicates them.
- Other bug fixes and performance improvements

## v3.9.5 {date="2026-06-23"}

### Core

#### Bug fixes

- **Snapshot manifest persistence**: Snapshot manifests are now persisted using multipart uploads, preventing errors when writing large manifests to object storage.

### Enterprise

All Core updates are included in Enterprise.

## v3.10.0 {date="2026-06-17"}

> [!Important]
> #### Upgrading to InfluxDB 3.10 is a one-way migration
>
> The first time you start InfluxDB 3.10, it automatically upgrades the on-disk
> catalog format from v2 to v3. After migration, 3.9.x and older
> binaries are unable to read the new catalog, and fail to start on the same
> cluster data.
>
> Before upgrading, back up your current catalog. The paths depend on the version
> you're upgrading from:
>
> - **3.4.0 or later**: `{prefix}/catalog/v2/logs/` and `{prefix}/catalog/v2/snapshot`
> - **Before 3.4.0**: `{prefix}/catalogs/` and `{prefix}/_catalog_checkpoint`
>
> Restoring these objects is the only way to roll back to 3.9.x.
>
> On a cluster running 3.4.0 or later, `{prefix}/catalogs/` and
> `{prefix}/_catalog_checkpoint` may still be present as leftovers from an earlier
> catalog format. They aren't current and aren't a valid rollback source.
>
> {{% show-in "enterprise" %}}If your cluster uses the upgraded storage engine (the default for new clusters, or after running the storage engine upgrade with `--upgrade-pacha-tree`), data written in the new `.pt` file format is also unreadable by 3.9.x.{{% /show-in %}}

### Core

#### Features

- **Catalog format upgrade (catalog v2 → v3)**: InfluxDB 3.10 automatically migrates the on-disk catalog to v3 format on first startup. The v3 catalog uses a compact binary record format (~5–6x smaller than v2). Migration is automatic, idempotent, and crash-safe. **Back up your current catalog before upgrading — the migration is one-way and 3.9.x binaries cannot read a v3 catalog.** If you're upgrading from 3.4.0 or later, back up `{prefix}/catalog/v2/logs/` and `{prefix}/catalog/v2/snapshot`. If you're upgrading from a version before 3.4.0, back up `{prefix}/catalogs/` and `{prefix}/_catalog_checkpoint`.

- **`influxdb3 debug catalog` command**: Inspect catalog state offline directly from object storage — no running server required. Subcommands: `list`, `snapshot`, `sequence`. Available in both Core and Enterprise.

- **`--max-concurrent-queries` flag**: Limit the number of queries that run concurrently. The limit can also be updated at runtime via `POST /api/v3/configure/query_concurrency_limit`.

- **Processing engine: cross-database queries**: Plugins can now read data from any database using the optional `database=` keyword argument on `influxdb3_local.query()`.

- **Processing engine: trigger lockdown flags**: Two new serve flags restrict plugin behavior. `--restrict-plugin-triggers-to` limits triggers to one or more of `wal`, `schedule`, or `request`. `--plugin-dir-only` (Enterprise) blocks plugin installation from any source other than the configured plugin directory.

- **Observability: always-on heap profiling**: Heap profiling is now enabled at startup with negligible overhead (~<1% CPU). Access profiles at the existing pprof endpoint. To disable, set `MALLOC_CONF=prof:false` before starting the server.

- **Observability: per-request query traces**: Query tracing is now opt-in per request rather than enabled for all queries. This reduces trace volume for high-throughput deployments. See the monitoring documentation for how to enable tracing on individual requests.

- **Embedded Python updated to 3.13.14**: The Processing engine's embedded Python is updated to 3.13.14, which includes upstream security fixes.

#### Bug fixes

- **`/api/v2/write` returns 403 for unauthorized tokens**: A valid token that lacks write permission on the target database now receives `403 Forbidden` instead of `401 Unauthorized`. Update client-side retry logic if it differentiates on these status codes.

- **Line-protocol parse errors return 400**: Malformed line protocol sent to the v1 `/write` or v2 `/api/v2/write` endpoints now returns `400 Bad Request` instead of `500 Internal Server Error`.

- **Invalid queries return HTTP 4xx**: A syntactically invalid query now returns an appropriate 4xx response rather than a 5xx error.

- **Query log records `query_text` on terminal phases**: The query log now includes the `query_text` field for queries that have reached a terminal phase.

#### Breaking changes

- **Catalog format upgrade (catalog v2 → v3) is one-way**: The first startup of InfluxDB 3.10 migrates the catalog to v3. After migration, 3.9.x binaries cannot start against the same object store. Back up your current catalog before upgrading: `{prefix}/catalog/v2/logs/` and `{prefix}/catalog/v2/snapshot` if you're upgrading from 3.4.0 or later, or `{prefix}/catalogs/` and `{prefix}/_catalog_checkpoint` if you're upgrading from an earlier version.

- **`influxdb3 write` output changed**: The write command now prints a throughput report on success instead of printing `success`. Scripts that parse the previous output should use `--quiet` (`-q`) to suppress all output.

- **`/api/v2/write` returns 403 instead of 401**: See bug fixes above. Clients that treat 401 and 403 differently must be updated.

- **Line-protocol parse errors return 400 instead of 500**: See bug fixes above.

- **Heap profiling is always on**: The ~<1% CPU overhead is present by default. Opt out with `MALLOC_CONF=prof:false`.

- **Query traces are now per-request opt-in**: Observability pipelines that expect a trace for every query will see far fewer traces. Update your pipeline to request traces explicitly per query.

---

### Enterprise

All Core updates are included in Enterprise. The following updates are exclusive to Enterprise.

#### Features

- **Wide-tag support**: Tag IDs have been widened from u8 to u16. This raises the practical limit to thousands of tables and millions of columns per database. Available with the storage engine upgrade (`--use-pacha-tree`).

- **Row-level deletion**: Delete rows by time range and tag predicates using `influxdb3 delete rows` and `influxdb3 cancel row-delete`. Deletion is asynchronous — requests persist to object storage and the compactor applies them when rewriting run sets. Requires `--use-pacha-tree`. Monitor pending deletes with the `system.row_deletes` system table and 9 new `influxdb3_compactor_row_delete_*` metrics.

- **Runtime query-concurrency limit**: Adjust the maximum number of concurrent queries at runtime via the `/api/v3/configure/query_concurrency_limit` API — `GET` to read the current limit, `PUT` to set it, and `DELETE` to reset it to the startup default.

- **`GET /ready` endpoint**: Returns `200 OK` when the server can reach object storage, or `503 Service Unavailable` when it cannot. Use this endpoint for readiness probes in load balancers and orchestration systems.

- **Backup and restore**: Create and manage full backups of Enterprise data with `influxdb3 create backup`, `influxdb3 status backup`, `influxdb3 show backups`, `influxdb3 delete backup`, and `influxdb3 cancel backup`. Initiate restore operations with `influxdb3 create restore`, `influxdb3 status restore`, `influxdb3 show restores`, and `influxdb3 cancel restore`. Backup and restore require `--use-pacha-tree` and a compactor node with an admin token. `create backup` refuses to overwrite an existing backup. Only one restore runs at a time across the cluster. After a restore completes, restart the node(s) for the in-memory view to update. API: `POST|GET|DELETE /api/v3/enterprise/backup[/{name}]` and `/api/v3/enterprise/restore[/{id}]`.

- **Bulk import**: Import generic (non-IOx) Parquet files into Enterprise with `influxdb3 import upload`. Map Parquet columns to InfluxDB types (`i64`, `u64`, `f64`, `bool`, `string`, `time`, `tag`) using `--column` flags. Unmapped columns become fields. List in-progress and completed import jobs with `influxdb3 import list`. The target database and table must exist before importing.

- **User auth and RBAC preview**: Multi-user authentication is now available as a preview feature. It is off by default (`--without-user-auth true`). When enabled, users authenticate with username and password to receive JWTs. Optional OAuth/OIDC is supported. Three built-in roles are available: Admin, Auditor, and Member.

  New CLI commands: `influxdb3 auth login`, `influxdb3 auth logout` (removes local credentials; does not revoke the signed JWT), `influxdb3 auth reset-password`, `influxdb3 create user`, `influxdb3 show users`, `influxdb3 update user`, `influxdb3 update user-roles`, `influxdb3 delete user`, `influxdb3 user require-password-reset`.

  New API endpoints:
  - `POST /api/v3/configure/user` — configure the initial user and create the operator token (also used by `influxdb3 manage init-admin`)
  - `POST /api/v3/authorize` — authenticate and obtain tokens
  - `POST /api/v3/authorize/refresh` — refresh an access token using a refresh token
  - `POST /api/v3/authorize/reset-password` — reset password using current credentials
  - `GET /api/v3/users`, `POST /api/v3/users` — list or create users (Enterprise)
  - `GET /api/v3/users/{id}`, `PATCH /api/v3/users/{id}`, `DELETE /api/v3/users/{id}` — get, update, or delete a user
  - `POST /api/v3/users/{id}/require-password-reset` — force password reset on next login
  - `GET /api/v3/users/{id}/roles`, `PUT /api/v3/users/{id}/roles` — read or replace a user's roles
  - `GET /api/v3/roles` — list available roles
  - `GET /api/v3/auth/oauth/config` — discover OAuth configuration for device-code login

  New serve flags: `--without-user-auth`, `--jwt-key-id`, `--jwt-private-key`, `--jwt-issuer`, `--jwt-default-ttl-seconds`, `--oauth-issuer`, `--oauth-audience`, `--oauth-client-id`, `--oauth-scopes`, and `--rbac-authoring-disabled`.

  JWT keys must be PKCS#1 format (`openssl genrsa -traditional`). PKCS#8 format silently fails.

- **`influxdb3 manage` command group**: A new `manage` subcommand groups offline administrative operations: `influxdb3 manage init-admin`, `influxdb3 manage add-admin-token`, and `influxdb3 manage downgrade-to-parquet`. The `downgrade-to-parquet` command has moved from the top level to this group (the old spelling still works but prints a deprecation warning).

- **`influxdb3 remove node` command**: Remove a stopped node from the catalog. The compactor drains the node's data before removal completes.

- **Service-level logs**: Structured query and storage logging is now available for observability. Configure log output format and levels using new `serve` flags.

- **Processing engine: internode gRPC for plugin writes**: Plugin writes from non-ingester nodes now route over internode gRPC rather than HTTP. This improves reliability in multi-node clusters. Requires `--internode-bind-addr` and `--conn-info` pointing at the gRPC port.

- **Licensing: object-store portability**: Enterprise licenses are no longer bound to the object-store configuration (type, bucket, endpoint, region). Validation now enforces only JWT signature, expiry, and licensed core count. You can move to a different bucket or store with the same license. When moving to an empty store, copy `{cluster-id}/commercial_license` from the old store or restart with `--license-file`.

- **Observability: 36 new compactor metrics**: 36 new `influxdb3_compactor_*` Prometheus metrics are now emitted. The primary health signal is `influxdb3_compactor_snapshot_lag_seconds`. A new `influxdb3_compaction_sequence_number` gauge tracks Parquet engine lag.

- **`influxdb3 debug object-store-check` command**: Validate S3-compatible backend semantics before putting a store into production. Checks that the backend correctly implements the operations that InfluxDB relies on.

#### Bug fixes

- **Compaction stability**: Several compaction bugs are fixed, including: compaction incorrectly setting `ingest_time` (causing deduplication and row delete bugs), compactor deadlock and write amplification, stopped compactor nodes blocking storage engine upgrades, and compactor orphaning gen1 files.

- **Tag case preserved during storage engine upgrades**: Tag names now preserve their original case when upgrading from Parquet to the new storage engine.

- **Bulk import memory usage reduced**: Peak memory during multi-file bulk import operations is significantly reduced.

- **Last cache delete deadlock fixed**: Deleting a last-value cache entry no longer causes a deadlock.

- **Row delete: aborted requests no longer processed**: Row delete requests that were aborted are no longer picked up by the compactor.

- **Table and database soft-delete name collision fixed**: Deleting a table or database and recreating it with the same name now works correctly.

- **TLS CA flag cleanup**: The `serve` command no longer accepts `--tls-ca` — it was non-functional there. Client commands (such as `query` and `write`) still accept `--tls-ca` to trust a custom or self-signed CA, and the flag is now consistently bound to the `INFLUXDB3_TLS_CA` environment variable across commands that were previously missing the binding. The `cancel row-delete` command now also accepts TLS options.

#### Breaking changes

- **`influxdb3 row-delete` → `influxdb3 delete rows` and `influxdb3 cancel row-delete`**: The old `row-delete` top-level command is removed. Update scripts to use the new `delete rows` and `cancel row-delete` subcommands.

- **`--conn-info` must point to the internode gRPC port for plugin writes**: In multi-node deployments, `--conn-info` must now reference the internode gRPC port (not the HTTP port) for plugin writes to reach the ingester. Update your cluster configuration before upgrading.

- **PT compactor stale-job timeout changed from 5 minutes to 1 hour**: Compactor jobs that appear stuck take up to 1 hour to be retried (previously 5 minutes). This reduces false-positive preemption on slow storage backends.

- **`--help-full` removed**: The `--help-full` flag is no longer available. Update any scripts that invoke `influxdb3 --help-full`.

- **`--package-manager` flag deprecated**: The `uv` package manager has been removed. `pip` is always used for plugin package installation. The `--package-manager` flag still starts the server but prints a deprecation warning. Remove it from your startup configuration.

- **`--pt-partition-count` renamed to `--pt-shard-count`**: The flag has no alias. Update any startup scripts that pass `--pt-partition-count` before upgrading to 3.10.

- **System table columns renamed**: The following columns in storage engine system tables are renamed. Update any dashboards or queries that reference the old names:
  - `partition_id` → `shard_id`
  - `partition_start_time` → `shard_start_time`
---

### Known issues

- **Row delete ghost rows**: After a row delete reports as "completed," rows in the un-compacted ingest tail can survive and remain visible in queries. Workaround: re-issue the delete request after the affected data has been compacted and verify row counts.

- **`system.row_deletes` returns HTTP 500 for predicate-less `--all-time` deletes**: Querying the `system.row_deletes` system table after a delete issued with `--all-time` and no tag predicate may return HTTP 500. Workaround: use `GET /api/v3/row_delete_requests` instead.

- **Multi-shard data loss with `--use-pacha-tree`**: When the `--use-pacha-tree` storage engine is enabled, running with more than one shard (`--pt-shard-count > 1`) can cause data loss and a bootstrap deadlock. Workaround: keep `--pt-shard-count` at `1`.

- **Backup does not capture row-delete state**: Backup (beta) doesn't currently pick up row-delete state files in object storage, so row deletes may persist across a restore. 

- **Built-in roles grant narrower access than their descriptions suggest**: With the user authentication preview enabled, the Auditor and Member roles enforce less access than their role descriptions imply. Auditor users can list databases but cannot query data or read users or roles. Member users can read and write data but cannot list users or roles. Workaround: use an Admin-role user or an admin token for user and role management.

## v3.9.3 {date="2026-05-29"}

### Core

Maintenance release: v3.9.3 Core includes only build and dependency updates—no user-facing changes.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Query chunk deduplication**: Fixed an issue where the same file could reach the query path from both the compactor and the ingester, causing affected queries to abort.
- **Large file uploads during compaction**: Index files written during compaction now use adaptive uploads, preventing errors when writing large files to object storage.
- Other bug fixes and performance improvements

## v3.9.2 {date="2026-04-30"}

### Core

Maintenance release: v3.9.2 Core includes only build and dependency updates—no user-facing changes.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Bug fixes

- **Gen1 file deduplication in compactor**: Fixed an issue where stale snapshot markers after `CompactionSummary` recovery could leave duplicate gen1 file entries and cause recompaction to abort.
- **Empty series key handling**: Fixed compaction for tables with no tags (empty series key).
- **Catalog token hash lookup**: Fixed a case where a failed `add_token` insert could leave a stale entry in the token hash lookup map. The lookup is now only updated after the underlying repository insert succeeds.
- Other bug fixes and performance improvements

## v3.9.1 {date="2026-04-09"}

### Core

Maintenance release: v3.9.1 Core includes only build and dependency updates—no user-facing changes.
### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific updates:

#### Features

- **Configurable compactor snapshot loading**: The number of snapshots the Parquet compactor loads at startup is now externally configurable, making it easier to tune recovery behavior for large deployments.

#### Bug Fixes and Performance Improvements

- **Performance Improvements**: This release features faster multi-source query merges and improved retention scheduling with the new Performance Update Preview.

- **Bug Fixes**: New updates fix issues where duplicate rows could be returned, Gen0 pruning safety, invalid status codes, and more.

## v3.9.0 {date="2026-04-02"}

### Core

#### Features

- **DataFusion upgrade**: Upgraded the embedded DataFusion query engine for more
  efficient query execution.

- **Python runtime upgrade**: Updated the bundled Python runtime for processing
  engine plugins with the latest security and bug fixes.

- **Product identity in HTTP responses**: Metrics, HTTP response headers, and
  metadata now distinguish between Core and Enterprise builds.

- **Database lifecycle hardening**: Background resources such as processing
  engine triggers are now cleanly decommissioned when a database is removed.

#### Bug fixes

- Additional bug fixes and performance improvements.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific features and fixes:

#### Features

- **Performance upgrade preview (beta)**: Preview major storage layer upgrades
  with the `--use-pacha-tree` flag. Includes a new columnar file format
  (`.pt` files), automatic Parquet migration with hybrid query mode,
  column families for efficient wide-table I/O, and bounded compaction.
  See [Performance upgrade preview](/influxdb3/enterprise/performance-preview/).

  > [!Warning]
  > The performance upgrade preview is a beta feature for staging and test
  > environments only. Do not use for production workloads.

- **Bulk data export**: Export compacted data as Parquet files for use with
  external tools. Use the new `influxdb3 export` subcommands to list databases,
  tables, and compacted time windows, then export selected data.
  See [Export to Parquet](/influxdb3/enterprise/performance-preview/#export-to-parquet).

- **Automatic distinct value caching**: Enable automatic DVC creation for
  `SHOW TAG VALUES` queries and the `tag_values()` SQL function with
  `--pt-enable-auto-dvc`. Max cardinality and refresh intervals are configurable.

- **Downgrade from performance preview**: Use
  `influxdb3 downgrade-to-parquet` to revert from the performance preview back
  to standard Parquet storage. Only data that existed before the upgrade
  (original Parquet files) is preserved.
  See [Downgrade to Parquet](/influxdb3/enterprise/performance-preview/#downgrade-to-parquet).

- **Non-interactive delete confirmation**: Use the `--yes` (`-y`) flag with
  delete commands to skip interactive confirmation prompts in automated and
  headless environments.

- **1MB default string field limit**: The maximum string field size defaults to
  1MB (previously 64KB) to support v1 migration workloads. Writes exceeding 1MB
  are rejected with a validation error.

#### Bug fixes

- **Compaction stability**: Multiple fixes to compaction scheduling, priority
  handling, and resource management for improved stability in multi-node
  clusters.

- Additional bug fixes and performance improvements.

## v3.8.4 {date="2026-03-10"}

### Core

No adjustments in this release.
Core remains on v3.8.3.

### Enterprise

#### Security

-  **Read and write tokens can no longer delete databases**: Authorization now evaluates both the HTTP method and the request path. Previously, tokens with read or write access to a database could also issue delete requests.

#### Bug fixes

- **Stale compactor blocking startup**: Fixed an issue where stopped (stale) compactor entries in the catalog prevented new compactor nodes from starting. Enterprise now only considers currently running compactor nodes for conflict checks.

- **WAL replay**: Fixed an issue where combined-mode deployments silently ignored the `--wal-replay-concurrency-limit` flag and always used serial replay (concurrency of 1). The flag is now respected.

- Other bug fixes and performance improvements.

## v3.8.3 {date="2026-02-24"}

### Core

#### Bug fixes

- **WAL Buffer**: Fix an edge case that could potentially cause the WAL buffer to overflow


## v3.8.2 {date="2026-02-23"}

### Core

#### Features

- **TLS: Skip certificate verification in CLI subcommands**: Use the new `--tls-no-verify` flag with any CLI subcommand to skip TLS certificate verification when connecting to a server. Useful for testing environments with self-signed certificates.

- **Environment variable prefix standardization**: InfluxDB 3 specific environment variables use the `INFLUXDB3_` prefix for consistency. Legacy variable names continue to work (deprecated) for backward compatibility.

  > [!IMPORTANT]
  > `INFLUXDB3_LOG_FILTER` is currently ignored. To set the log filter, use `LOG_FILTER` or the `--log-filter` flag.

- **Parquet output format for `show` subcommands**: You can now save query results from the `show` subcommand directly to a Parquet file.

- **SQL: `tag_values()` table function**: Query distinct tag values using the new `tag_values()` SQL table function.

- **InfluxQL: `SHOW TAG VALUES` improvements**: In Enterprise deployments with auto-DVC enabled, `SHOW TAG VALUES` queries now use the Distinct Value Cache (DVC) automatically for improved performance. The `WHERE` clause is also now supported in `SHOW TAG VALUES` queries backed by the DVC, including compound predicates using `AND` and `OR`.

- **InfluxQL: `SHOW RETENTION POLICIES` returns duration**: The `duration` column in `SHOW RETENTION POLICIES` results now returns the configured retention period in InfluxDB v1-compatible format (for example, `168h0m0s`) instead of returning an empty value.

- **Ceph S3 backend support**: Use `--aws-s3-custom-backend ceph` with `influxdb3 serve` to connect to Ceph S3-compatible object storage. This enables ETag quote stripping required for conditional PUT operations with Ceph.

- **`_internal` database default retention**: The `_internal` system database now defaults to a 7-day retention period (previously infinite). Only admin tokens can modify retention on the `_internal` database.

- **Snapshot checkpointing for faster startup**: Use the new [`--checkpoint-interval`](/influxdb3/version/reference/config-options/#checkpoint-interval) serve option to periodically consolidate snapshots into monthly checkpoints. On startup, the server loads one to two checkpoints per calendar month instead of thousands of individual snapshots, reducing startup time for long-running servers.

#### Bug fixes

- **Sparse write handling for LVC, DVC, and Processing Engine**: Fixed incorrect behavior when processing sparse writes (writes that include only some fields from a table with multiple field families).

- **`influxdb3-launcher`: SSL certificate path on RHEL systems**: Fixed an issue where the `SSL_CERT_FILE` environment variable was not correctly set on affected RHEL-based
  systems when using the `influxdb3-launcher` script.
- Additional bug fixes and performance improvements.

### Enterprise

All Core updates are included in Enterprise.
Additional Enterprise-specific features and fixes:

#### Features

- **Data-only deletion for databases and tables**: Delete only the stored data from a database or table while preserving catalog entries, schema, and associated resources (tokens, triggers, caches, and processing engine configurations).

#### Bug fixes

- **Compaction stability**: Several fixes to compaction scheduling and processing to improve stability and correctness in multi-node clusters.

- **TableIndexCache initialization**: Fixed a concurrency bug that could cause incorrect behavior during `TableIndexCache` initialization.

- **Snapshot checkpointing**: Fixed an issue where snapshot checkpoint cleanup was not running as a background task.

## v3.8.0 {date="2025-12-18"}

### Core

#### Features

- **Linux Service Management**: Run InfluxDB 3 as a managed system service on Linux ([#27026](https://github.com/influxdata/influxdb/pull/27026)):
  - Use `influxdb3-launcher` script to initialize the service
  - Deploy with systemd on modern Linux distributions
  - Deploy with SysV init on legacy systems
  - Customize service behavior with configuration files

#### Bug fixes

- **CLI**: View only active databases and tables when running `SHOW RETENTION`
- **Database operations**: Receive an error when attempting to delete tables from an already-deleted database
- **Retention Policy**: Receive an error when attempting to modify retention settings on deleted databases

#### Security

- **Processing Engine**: Run processing engine plugins with Python 3.13.11, which includes security and bug fixes ([#27014](https://github.com/influxdata/influxdb/pull/27014))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Bug fixes

- **Table Limits**: Delete tables without affecting your table limit quota
- **Retention Policy**: Receive an error when attempting to modify retention settings on deleted tables

## v3.7.0 {date="2025-11-19"}

### Core

#### Features

- **HTTP API Enhancements**:
  - All HTTP responses now include a `cluster-uuid` header containing the catalog UUID, enabling clients to identify specific cluster instances programmatically
  - HTTP API now supports multi-member gzip payloads enabling batch operations
- **CLI Commands**:
  - The new `influxdb3 show retention` command displays effective retention periods for each table, showing whether retention is set at the database-level or table-level with human-readable formatting (for example, "7d", "24h")

#### Bug fixes

- **Authorization**: Fixed multi-database permission handling to properly authorize queries across multiple databases.

- **General Improvements**: Several key bug fixes and performance improvements.

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

- **General Improvements**: Several key bug fixes and performance improvements.

## v3.6.0 {date="2025-10-30"}

### Core

#### Features

- **Quick-Start Developer Experience**:
  - `influxdb3` now supports running without arguments for instant database startup, automatically generating IDs and storage flags values based on your system's setup.
- **Processing Engine**:
  - Plugins now support multiple files instead of single-file limitations.
  - When creating a trigger, you can upload a plugin directly from your local machine using the `--upload` flag.
  - Existing plugin files can now be updated at runtime without recreating triggers.
  - New `system.plugin_files` table and `show plugins` CLI command now provide visibility into all loaded plugin files.
  - Custom plugin repositories are now supported via `--plugin-repo` CLI flag.
  - Python package installation can now be disabled with `--package-manager disabled` for locked-down environments.
  - Plugin file path validation now prevents directory traversal attacks by blocking relative and absolute path patterns.

#### Bug fixes

- **Write API**: Fixed abbreviated precision values (`ns`, `ms`, `us`, `s`) to work correctly with the `/api/v3/write_lp` endpoint. Previously, only full precision names (`nanosecond`, `microsecond`, `millisecond`, `second`) worked.
- **Token management**: Token display now works correctly for hard-deleted databases

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Operational improvements

- **Storage engine**: improvements to the Docker-based license service development environment
- **Catalog consistency**: Node management fixes for catalog edge cases
- Other enhancements and performance improvements

## v3.5.0 {date="2025-09-30"}

### Core

#### Features

- **Custom Plugin Repository**:
  - Use the `--plugin-repo` option with `influxdb3 serve` to specify custom plugin repositories. This enables loading plugins from personal repos or disabling remote repo access.

#### Bug fixes

- **Database reliability**:
  - Table index updates now complete atomically before creating new indices, preventing race conditions that could corrupt database state ([#26838](https://github.com/influxdata/influxdb/pull/26838))
  - Delete operations are now idempotent, preventing errors during object store cleanup ([#26839](https://github.com/influxdata/influxdb/pull/26839))
- **Write path**:
  - Write operations to soft-deleted databases are now rejected, preventing data loss ([#26722](https://github.com/influxdata/influxdb/pull/26722))
- **Runtime stability**:
  - Fixed a compatibility issue that could cause deadlocks for concurrent operations ([#26804](https://github.com/influxdata/influxdb/pull/26804))
- Other bug fixes and performance improvements

#### Security & Misc

- Sensitive environment variable values are now hidden in CLI output and log messages ([#26837](https://github.com/influxdata/influxdb/pull/26837))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **Cache optimization**:
  - Last Value Cache (LVC) and Distinct Value Cache (DVC) now populate on creation and only on query nodes, reducing resource usage on ingest nodes.

#### Bug fixes

- **Object store reliability**:
  - Object store operations now use retryable mechanisms with better error handling

#### Operational improvements

- **Compaction optimizations**:
  - Compaction producer now waits 10 seconds before starting cycles, reducing resource contention during startup
  - Enhanced scheduling algorithms distribute compaction work more efficiently across available resources
- **System tables**:
  - System tables now provide consistent data across different node modes (ingest, query, compact), enabling better monitoring in multi-node deployments

## v3.4.2 {date="2025-09-11"}

### Core

#### Bug fixes

- **Database reliability**:
  - TableIndexCache initialization and ObjectStore improvements
  - Persister doesn't need a TableIndexCache

#### HTTP API changes

- **v2 write API**: Standardized `/api/v2/write` error response format to match other InfluxDB editions. Error responses now use the consistent format: `{"code": "<code>", "message": "<detailed message>"}` ([#26787](https://github.com/influxdata/influxdb/pull/26787))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **Storage engine**: Pass in root CA and disable TLS verify for object store
- **Support**: Add support for manually stopping a node

#### Bug fixes

- **Bug fix**: Generation detail path calculation panic
- **Database reliability**: Pass TableIndexCache through to PersistedFiles

#### Operational improvements

- **Compaction optimizations**:
  - Compaction cleaner now waits for 1 hour by default (previously 10 minutes)
  - Compaction producer now waits for 10 seconds before starting compaction cycle
- **Catalog synchronization**: Background catalog update is synchronized every 1 second (previously 10 seconds)
- **Logging improvements**: Added clear logging to indicate what sequence is persisted on producer side and what is consumed by the consumer side

## v3.4.1 {date="2025-08-28"}

### Core

#### Bug Fixes

- Upgrading from 3.3.0 to 3.4.x no longer causes possible catalog migration issues ([#26756](https://github.com/influxdata/influxdb/pull/26756))

## v3.4.0 {date="2025-08-27"}

### Core

#### Features

- **Token Provisioning**:
  - Generate admin tokens offline and use them when starting the database if tokens do not already exist.
    This is meant for automated deployments and containerized environments.
    ([#26734](https://github.com/influxdata/influxdb/pull/26734))
- **Azure Endpoint**:
  - Use the `--azure-endpoint` option with `influxdb3 serve` to specify the Azure Blob Storage endpoint for object store connections. ([#26687](https://github.com/influxdata/influxdb/pull/26687))
- **No\_Sync via CLI**:
  - Use the `--no-sync` option with `influxdb3 write` to skip waiting for WAL persistence on write and immediately return a response to the write request. ([#26703](https://github.com/influxdata/influxdb/pull/26703))

#### Bug Fixes

- Validate tag and field names when creating tables ([#26641](https://github.com/influxdata/influxdb/pull/26641))
- Using GROUP BY twice on the same column no longer causes incorrect data ([#26732](https://github.com/influxdata/influxdb/pull/26732))

#### Operational and security improvements

- Introduce a new `v2` catalog path structure:

  - `catalog/v2/logs/` directory for log files (instead of `catalogs/`)
  - `catalog/v2/snapshot` file for checkpoint/snapshot files (instead of `_catalog_checkpoint`)
- Reduce verbosity of the TableIndexCache log. ([#26709](https://github.com/influxdata/influxdb/pull/26709))
- WAL replay concurrency limit defaults to number of CPU cores, preventing possible OOMs. ([#26715](https://github.com/influxdata/influxdb/pull/26715))
- Remove unsafe signal\_handler code. ([#26685](https://github.com/influxdata/influxdb/pull/26685))
- Upgrade Python version to 3.13.7-20250818. ([#26686](https://github.com/influxdata/influxdb/pull/26686), [#26700](https://github.com/influxdata/influxdb/pull/26700))
- Tags with `/` in the name no longer break the primary key.

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **Token Provisioning**:
  - Generate *resource* and *admin* tokens offline and use them when starting the database.

- Select a home or trial license without using an interactive terminal.
  Use `--license-type` \[home | trial | commercial] option to the `influxdb3 serve` command to automate the selection of the license type.

#### Bug Fixes

- Don't initialize the Processing Engine when the specified `--mode` does not require it.
- Don't panic when `INFLUXDB3_PLUGIN_DIR` is set in containers without the Processing Engine enabled.

## v3.3.0 {date="2025-07-29"}

### Core

#### Features

- **Database management**:
  - Add `influxdb_schema` system table for database schema management ([#26640](https://github.com/influxdata/influxdb/pull/26640))
  - Add `system.processing_engine_trigger_arguments` table for trigger configuration management ([#26604](https://github.com/influxdata/influxdb/pull/26604))
  - Add write path logging to capture database name and client IP address for failed writes. The IP address is fetched from `x-forwarded-for` header if available, `x-real-ip` if available, or remote address as reported by TlsStream/AddrStream ([#26616](https://github.com/influxdata/influxdb/pull/26616))
- **Storage engine**: Introduce `TableIndexCache` for efficient automatic cleanup of expired gen1 Parquet files based on retention policies and hard deletes. Includes new background loop for applying data retention policies with configurable intervals and comprehensive purge operations for tables and retention period expired data ([#26636](https://github.com/influxdata/influxdb/pull/26636))
- **Authentication and security**: Add admin token recovery server that allows regenerating lost admin tokens without existing authentication. Includes new `--admin-token-recovery-http-bind` option for running recovery server on separate port, with automatic shutdown after successful token regeneration ([#26594](https://github.com/influxdata/influxdb/pull/26594))
- **Build process**: Allow passing git hash via environment variable in build process ([#26618](https://github.com/influxdata/influxdb/pull/26618))

#### Bug Fixes

- **Database reliability**:
  - Fix URL-encoded table name handling failures ([#26586](https://github.com/influxdata/influxdb/pull/26586))
  - Allow hard deletion of existing soft-deleted schema ([#26574](https://github.com/influxdata/influxdb/pull/26574))
- **Authentication**: Fix AWS S3 API error handling when tokens are expired ([#1013](https://github.com/influxdata/influxdb/pull/1013))
- **Query processing**: Set nanosecond precision as default for V1 query API CSV output ([#26577](https://github.com/influxdata/influxdb/pull/26577))
- **CLI reliability**:
  - Mark `--object-store` CLI argument as explicitly required ([#26575](https://github.com/influxdata/influxdb/pull/26575))
  - Add help text for the new update subcommand ([#26569](https://github.com/influxdata/influxdb/pull/26569))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management**:
  - Improve licensing suggestions for Core users
  - Update license information handling
- **Database management**:
  - Enhance `TableIndexCache` with advanced features beyond Core's basic cleanup: persistent snapshots, object store integration, merge operations for distributed environments, and recovery capabilities for multi-node clusters
  - Add `TableIndexSnapshot`, `TableIndex`, and `TableIndices` types for distributed table index management
- **Support**: Include contact information in trial error messages
- **Telemetry**: Send onboarding telemetry before licensing setup

#### Bug Fixes

- **Compaction stability**:
  - Fix compactor re-compaction issues on max generation data overwrite
  - Fix compactor to treat "all" mode as "ingest" mode
- **Database reliability**:
  - Add missing system tables to compact mode
- **Storage integrity**: Update Parquet file paths to use 20 digits of 0-padding
- **General fixes**:
  - Only load processing engine in correct server modes
  - Remove load generator alias clash

## v3.2.1 {date="2025-07-03"}

### Core

#### Features

- **Enhanced database lifecycle management**:
  - Allow updating the hard deletion date for already-deleted databases and tables, providing flexibility in managing data retention and compliance requirements
  - Include `hard_deletion_date` column in `_internal` system tables (`databases` and `tables`) for better visibility into data lifecycle and audit trails

#### Bug Fixes

- **CLI improvements**:
  - Added help text for the new `update` subcommand for database and table update features ([#26569](https://github.com/influxdata/influxdb/pull/26569))
  - `--object-store` and storage configuration parameters are required for the `serve` command ([#26575](https://github.com/influxdata/influxdb/pull/26575))
- **Query processing**: Fixed V1-compatible `/query` HTTP API endpoint to correctly default to nanosecond precision (`ns`) for CSV output, ensuring backward compatibility with InfluxDB 1.x clients and preventing data precision loss ([#26577](https://github.com/influxdata/influxdb/pull/26577))
- **Database reliability**: Fixed issue preventing hard deletion of soft-deleted databases and tables, enabling complete data removal for compliance and storage management needs ([#26574](https://github.com/influxdata/influxdb/pull/26574))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management improvements**: New `influxdb3 show license` command displays detailed license information including type, expiration date, and resource limits, making it easier to monitor license status and compliance

#### Bug Fixes

- **API stability**: Fixed HTTP API trigger specification to use the correct `"request:REQUEST_PATH"` syntax, ensuring proper request-based trigger configuration for processing engine workflows

## v3.2.0 {date="2025-06-25"}

**Core**: revision 1ca3168bee\
**Enterprise**: revision 1ca3168bee

### Core

#### Features

- **Hard delete for databases and tables**: Permanently delete databases and tables, enabling complete removal of data structures for compliance and storage management ([#26553](https://github.com/influxdata/influxdb/pull/26553))
- **AWS credentials auto-reload**: Support dynamic reloading of ephemeral AWS credentials from files, improving security and reliability when using AWS services ([#26537](https://github.com/influxdata/influxdb/pull/26537))
- **Database retention period support**: Add retention period support for databases via CLI commands (`create database` and `update database` commands) and HTTP APIs ([#26520](https://github.com/influxdata/influxdb/pull/26520)):
  - New CLI command: `update database --retention-period`
- **Configurable lookback duration**: Users can specify lookback duration for PersistedFiles buffer, providing better control over query performance ([#26528](https://github.com/influxdata/influxdb/pull/26528))
- **WAL replay concurrency control**: Add concurrency limits for WAL (Write-Ahead Log) replay to improve startup performance and resource management ([#26483](https://github.com/influxdata/influxdb/pull/26483))
- **Enhanced write path**: Separate write path executor with unbounded memory for improved write performance ([#26455](https://github.com/influxdata/influxdb/pull/26455))

#### Bug Fixes

- **WAL corruption handling**: Handle corrupt WAL files during replay without panic, improving data recovery and system resilience ([#26556](https://github.com/influxdata/influxdb/pull/26556))
- **Database naming validation**: Disallow underscores in database names when created via API to ensure consistency ([#26507](https://github.com/influxdata/influxdb/pull/26507))
- **Object store cleanup**: Automatic intermediate directory cleanup for file object store, preventing storage bloat ([#26480](https://github.com/influxdata/influxdb/pull/26480))

#### Additional Updates

- Track generation 1 duration in catalog for better performance monitoring ([#26508](https://github.com/influxdata/influxdb/pull/26508))
- Add retention period support to the catalog ([#26479](https://github.com/influxdata/influxdb/pull/26479))
- Update help text for improved user experience ([#26509](https://github.com/influxdata/influxdb/pull/26509))

### Enterprise

All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:

#### Features

- **License management improvements**:
  - New `influxdb3 show license` command to display current license information
- **Table-level retention period support**: Add retention period support for individual tables in addition to database-level retention, providing granular data lifecycle management
  - New CLI commands: `create table --retention-period` and `update table --retention-period`
  - Set or clear table-specific retention periods independent of database settings
- **Compaction improvements**:
  - Address compactor restart issues for better reliability
  - Track compacted generation durations in catalog for monitoring
  - Disable Parquet cache for ingest mode to optimize memory usage

#### Bug Fixes

- **Query optimization**: Correctly partition query chunks into generations for improved performance
- **Data integrity**: Don't delete generation 1 files as part of compaction process
- **License handling**: Trim whitespace from license file contents after reading to prevent validation issues

## v3.1.0 {date="2025-05-29"}

**Core**: revision `482dd8aac580c04f37e8713a8fffae89ae8bc264`

**Enterprise**: revision `2cb23cf32b67f9f0d0803e31b356813a1a151b00`

### Core

#### Token and Security Updates

- Named admin tokens can now be created, with configurable expirations
- `health`, `ping`, and `metrics` endpoints can now be opted out of authorization
- `Basic $TOKEN` is now supported for all APIs
- Additional info available when creating a new token
- Additional info available when starting InfuxDB using `--without-auth`

#### Additional Updates

- New catalog metrics available for count operations
- New object store metrics available for transfer latencies and transfer sizes
- New query duration metrics available for Last Value caches
- `/ping` API now contains versioning headers
- Other performance improvements

#### Fixes

- New tags are now backfilled with NULL instead of empty strings
- Bitcode deserialization error fixed
- Series key metadata not persisting to Parquet is now fixed
- Other general fixes and corrections

### Enterprise

#### Token and Security Updates

- Resource tokens now use resource names in `show tokens`
- Tokens can now be granted `CREATE` permission for creating databases

#### Additional Updates

- Last value caches reload on restart
- Distinct value caches reload on restart
- Other performance improvements
- Replaces remaining "INFLUXDB\_IOX" Dockerfile environment variables with the following:
  - `ENV INFLUXDB3_OBJECT_STORE=file`
  - `ENV INFLUXDB3_DB_DIR=/var/lib/influxdb3`

#### Fixes

- Improvements and fixes for license validations
- False positive fixed for catalog error on shutdown
- UX improvements for error and onboarding messages
- Other general fixes and corrections

## v3.0.3 {date="2025-05-16"}

**Core**: revision 384c457ef5f0d5ca4981b22855e411d8cac2688e

**Enterprise**: revision 34f4d28295132b9efafebf654e9f6decd1a13caf

### Core

#### Fixes

- Prevent operator token, `_admin`, from being deleted.

### Enterprise

#### Fixes

- Fix object store info digest that is output during onboarding.
- Fix issues with false positive catalog error on shutdown.
- Fix licensing validation issues.
- Other fixes and performance improvements.

## v3.0.2 {date="2025-05-01"}

**Core**: revision d80d6cd60049c7b266794a48c97b1b6438ac5da9

**Enterprise**: revision e9d7e03c2290d0c3e44d26e3eeb60aaf12099f29

### Core

#### Security updates

- Generate testing TLS certificates on the fly.
- Set the TLS CA via the INFLUXDB3\_TLS\_CA environment variable.
- Enforce a minimum TLS version for enhanced security.
- Allow CORS requests from browsers.

#### General updates

- Support the `--format json` option in the token creation output.
- Remove the Last Values Cache size limitation to improve performance and flexibility.
- Incorporate additional performance improvements.

#### Fixes

- Fix a counting bug in the distinct cache.
- Fix how the distinct cache handles rows with null values.
- Fix handling of `group by` tag columns that use escape quotes.
- Sort the IOx table schema consistently in the `SHOW TABLES` command.

### Enterprise

#### Updates

- Introduce a command and system table to list cluster nodes.
- Support multiple custom permission argument matches.
- Improve overall performance.

#### Fixes

- Initialize the object store only once.
- Prevent the Home license server from crashing on restart.
- Enforce the `--num-cores` thread allocation limit.

## v3.0.1 {date="2025-04-16"}

**Core**: revision d7c071e0c4959beebc7a1a433daf8916abd51214

**Enterprise**: revision 96e4aad870b44709e149160d523b4319ea91b54c

### Core

#### Updates

- TLS CA can now be set with an environment variable: `INFLUXDB3_TLS_CA`
- Other general performance improvements

#### Fixes

- The `--tags` argument is now optional for creating a table, and additionally now requires at least one tag *if* specified

### Enterprise

#### Updates

- Catalog limits for databases, tables, and columns are now configurable using `influxdb3 serve` options:
  - `--num-database-limit`
  - `--num-table-limit`
  - `--num-total-columns-per-table-limit`
- Improvements to licensing prompts for clarity
- Other general performance improvements

#### Fixes

- **Home** license thread count log errors

## v3.0.0 {date="2025-04-14"}

### Core

#### Breaking Changes

- **Parquet cache configuration**: Replaced `--parquet-mem-cache-size-mb` option with `--parquet-mem-cache-size`. The new option accepts values in megabytes (as an integer) or as a percentage of total available memory (for example, `20%`). The default value changed from `1000` MB to `20%` of total available memory. The environment variable `INFLUXDB3_PARQUET_MEM_CACHE_SIZE_MB` was replaced with `INFLUXDB3_PARQUET_MEM_CACHE_SIZE`. ([#26023](https://github.com/influxdata/influxdb/pull/26023))
- **Memory settings updates**:
  - Force snapshot memory threshold now defaults to `50%` of available memory
  - DataFusion execution memory pool now defaults to `20%` of available memory

#### General Updates

- Performance and reliability improvements.

### Enterprise

#### Token Support

- Authorization is now turned on by default.
- Token support for database level permissions are now available.
- Token support for system level queries are now available.

#### General Updates

- You can now use Commercial, Trial, and At-Home licenses.

## v3.0.0-0.beta.3 {date="2025-04-01"}

**Core**: revision f881c5844bec93a85242f26357a1ef3ebf419dd3

**Enterprise**: revision 6bef9e700a59c0973b0cefdc6baf11583933e262

### Core

#### General Improvements

- InfluxDB 3 now supports graceful shutdowns when sending the interrupt signal to the service.

#### Bug fixes

- Empty batches in JSON format results are now handled properly
- The Processing Engine now properly extracts data from DictionaryArrays

### Enterprise

##### Multi-node improvements

- Query nodes now automatically detect new ingest nodes

#### Bug fixes

- Several fixes for compaction planning and processing
- The Processing Engine now properly extracts data from DictionaryArrays

## v3.0.0-0.beta.2 {date="2025-03-24"}

**Core**: revision 033e1176d8c322b763b4aefb24686121b1b24f7c

**Enterprise**: revision e530fcd498c593cffec2b56d4f5194afc717d898

This update brings several backend performance improvements to both Core and Enterprise in preparation for additional new features over the next several weeks.

## v3.0.0-0.beta.1 {date="2025-03-17"}

### Core

#### Features

##### Query and storage enhancements

- New ability to stream response data for CSV and JSON queries, similar to how JSONL streaming works
- Parquet files are now cached on the query path, improving performance
- Query buffer is incrementally cleared when snapshotting, lowering memory spikes

##### Processing engine improvements

- New Trigger Types:
  - *Scheduled*: Run Python plugins on custom, time-defined basis
  - *Request*: Call Python plugins via HTTP requests
- New in-memory cache for storing data temporarily; cached data can be stored for a single trigger or across all triggers
- Integration with virtual environments and install packages:
  - Specify Python virtual environment via CLI or `VIRTUAL_ENV` variable
  - Install packages or a `requirements.txt`
- Python plugins are now implemented through triggers only. Simply create a trigger that references your Python plugin code file directly
- Snapshots are now persisted in parallel, improving performance by running jobs simultaneously, rather than sequentially
- Write to logs from within the Processing Engine

##### Database and CLI improvements

- You can now specify the precision on your timestamps for writes using the `--precision` flag. Includes nano/micro/milli/seconds (ns/us/ms/s)
- Added a new `show` system subcommand to display system tables with different options via SQL (default limit: 100)
- Clearer table creation error messages

##### Bug fixes

- If a database was created and the service was killed before any data was written, the database would not be retained
- A last cache with specific "value" columns could not be queried
- Running CTRL-C no longer stopped an InfluxDB process, due to a Python trigger
- A previous build had broken JSON queries for RecordBatches
- There was an issue with the distinct cache that caused panics

#### Parameter changes

For Core and Enterprise, there are parameter changes for simplicity:

| Old Parameter                | New Parameter |
| ---------------------------- | ------------- |
| `--writer-id`<br>`--host-id` | `--node-id`   |

### Enterprise features

#### Cluster management

- Nodes are now associated with *clusters*, simplifying compaction, read replication, and processing
- Node specs are now available for simpler management of cache creations

#### Mode types

- Set `ingest`, `query`, `compact`, and `process` individually per node

### Enterprise parameter changes

For Enterprise, additional parameters for the `serve` command have been consolidated for simplicity:

| Old Parameter                                       | New Parameter                        |
| --------------------------------------------------- | ------------------------------------ |
| `--read-from-node-ids`<br>`--compact-from-node-ids` | `--cluster-id`                       |
| `--run-compactions`<br>`--mode=compactor`           | `--mode=compact`<br>`--mode=compact` |

In addition to the above changes, `--cluster-id` is now a required parameter for all new instances.
