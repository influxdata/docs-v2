# Plan: Document v1.12.3

## Source

- **Project**: influxdb-v1.12.3
- **Branch**: `worktree-influxdb-v1.12.3`

## Objective

OSS and Enterprise v1.12.3 release is partially documented.
OSS is already released.
Enterprise will become GA tomorrow (2026-03-31) pending No-/Go decision.

Enterprise documentation is not yet published (pending decision).

The following items need to be documented.
Here are the **9 open issues** from Devan Benz (`@devanbenz`) in `influxdata/docs-v2`. All are related to InfluxDB v1 (Enterprise/OSS 1.12.3):

### Milestone: v1.12.3 (release:pending)

| #                                                          | Title                                                 | Scope      | Source PR                                                           |
| ---------------------------------------------------------- | ----------------------------------------------------- | ---------- | ------------------------------------------------------------------- |
| [#6851](https://github.com/influxdata/docs-v2/issues/6851) | Smarter data node selection for backups               | Enterprise | [plutonium#4406](https://github.com/influxdata/plutonium/pull/4406) |
| [#6846](https://github.com/influxdata/docs-v2/issues/6846) | `influxd-ctl backup` validates `-from` node exists    | Enterprise | [plutonium#4228](https://github.com/influxdata/plutonium/pull/4228) |
| [#6845](https://github.com/influxdata/docs-v2/issues/6845) | New `-e` flag on `influxd-ctl show-shards`            | Enterprise | [plutonium#4306](https://github.com/influxdata/plutonium/pull/4306) |
| [#6844](https://github.com/influxdata/docs-v2/issues/6844) | New `rpc-resettable-*-timeout` cluster config options | Enterprise | [plutonium#4433](https://github.com/influxdata/plutonium/pull/4433) |
| [#6843](https://github.com/influxdata/docs-v2/issues/6843) | New `-timeout` global flag for `influxd-ctl`          | Enterprise | [plutonium#4342](https://github.com/influxdata/plutonium/pull/4342) |
| [#6842](https://github.com/influxdata/docs-v2/issues/6842) | New `influx-meta cleanup-shards` command              | Enterprise | [plutonium#4345](https://github.com/influxdata/plutonium/pull/4345) |
| [#6839](https://github.com/influxdata/docs-v2/issues/6839) | CQ diagnostics in `/debug/vars`                       | Both       | [influxdb#26874](https://github.com/influxdata/influxdb/pull/26874) |
| [#6838](https://github.com/influxdata/docs-v2/issues/6838) | Running config in `/debug/vars`                       | Both       | [influxdb#26624](https://github.com/influxdata/influxdb/pull/26624) |
| [#6837](https://github.com/influxdata/docs-v2/issues/6837) | New `time_format` query parameter for HTTP API        | Both       | [influxdb#26596](https://github.com/influxdata/influxdb/pull/26596) |
| [#6805](https://github.com/influxdata/docs-v2/issues/6805) | SHOW QUERIES displays user                            | Both       | [plutonium#4379](https://github.com/influxdata/plutonium/pull/4379) |
| [#6803](https://github.com/influxdata/docs-v2/issues/6803) | Reload log level on SIGHUP                            | Enterprise | [plutonium#4237](https://github.com/influxdata/plutonium/pull/4237) |
| [#6802](https://github.com/influxdata/docs-v2/issues/6802) | Per-user query response bytes statistic               | Both       | [influxdb#27188](https://github.com/influxdata/influxdb/pull/27188) |

### Outstanding issue (partially covered by #6950):

| #                                                          | Title                                   | Scope      | Source PR                                                           |
| ---------------------------------------------------------- | --------------------------------------- | ---------- | ------------------------------------------------------------------- |
| [#6713](https://github.com/influxdata/docs-v2/issues/6713) | `influxd-ctl backup` gzip/bufsize flags | Enterprise | [plutonium#4375](https://github.com/influxdata/plutonium/pull/4375) |

All milestone issues are labeled `release:pending`. #6713 is assigned to Devan — 3 of 5 flags already in PR #6950; `-bufsize` and `-cpuprofile` remain.

## Existing PRs

| PR                                                                    | Status               | Covers                                                                                                                                                                       |
| --------------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#6945](https://github.com/influxdata/docs-v2/pull/6945) (OSS)        | **Merged**           | Release notes, config opts (`https-insecure-certificate`, `advanced-expiration`), FUTURE/PAST LIMIT fix, version bump                                                        |
| [#6950](https://github.com/influxdata/docs-v2/pull/6950) (Enterprise) | **Open, pending GA** | Same as OSS + 3 backup compression flags (`gzipCompressionLevel`, `gzipBlockCount`, `gzipBlockSize`), version bump. Already reviewed — merges as-is when Enterprise goes GA. |

## Work streams

Three deliverables, in order:

1. **Source analysis** — Run `derive` tool from `influxdata/docs-tooling` to extract implementation details for all 9 issues (especially `influx-meta cleanup-shards` and new flags/config options)
   `influx-meta` command definition from source: <https://github.com/influxdata/plutonium/blob/d5e4c142764e5617c1b137b7dd6b18cf4bb62811/cmd/influx-meta/cmd/root.go#L39>
2. **New Enterprise follow-up PR** — All 9 issues' Enterprise-side docs (6 Enterprise-only + Enterprise side of 3 shared features). Opens after #6950 merges.
3. **New OSS PR** — The 3 shared features' OSS-side docs (`time_format`, CQ diagnostics, config in `/debug/vars`)

## Tasks

### 0. Source analysis (prerequisite)

- [x] Run `derive` on source code for all 9 issues
- [x] Determine `influx-meta` binary structure — existing binary, 9 subcommands. Source PR: <https://github.com/influxdata/plutonium/pull/4345>
- [x] Identify remaining `influxd-ctl backup` flags from #6713 not yet in #6950 → `-bufsize` and `-cpuprofile`
- [x] ⚠️ #6844 resolved — fields renamed to `rpc-resettable-read-timeout`/`rpc-resettable-write-timeout` in PR #4433/#4434
- [x] \#6851 analyzed — new `-staleness-threshold` flag, zero-byte skip, recency sorting
- [x] \#6805 analyzed — `user` column added as last column in SHOW QUERIES (both OSS and Enterprise)
- [x] \#6803 analyzed — SIGHUP reloads log level + TLS + entitlements + anti-entropy (Enterprise only)
- [x] \#6802 analyzed — `userquerybytes` stat with `user` tag, opt-in via `user-query-bytes-enabled` config

### 1. Enterprise follow-up PR

#### Enterprise `tools/influxd-ctl/` updates

- [ ] `_index.md` — Add `-timeout` global flag (#6843)
- [ ] `backup.md` — Add `-from` node validation behavior (#6846)
- [ ] `backup.md` — Add smarter data node selection / staleness threshold flag (#6851)
- [ ] `backup.md` — Add remaining gzip flags from #6713 not covered by #6950
- [ ] `show-shards.md` — Add `-e` flag for expired shards (#6845)

#### Enterprise `administration/configure/` updates

- [ ] `config-data-nodes.md` — Add `rpc-resettable-read-timeout` and `rpc-resettable-write-timeout` to `[cluster]` section (#6844)
- [ ] Document SIGHUP log level reload behavior (#6803)

#### New Enterprise page

- [ ] `influx-meta cleanup-shards` (#6842) — page location TBD after `derive` analysis

#### Enterprise `tools/api.md` updates (shared features, Enterprise side)

- [ ] Add `time_format` query parameter to `/query` endpoint docs (#6837)
- [ ] Add `cq` key documentation to `/debug/vars` section (#6839)
- [ ] Add `config` key documentation to `/debug/vars` section (#6838)
- [ ] Add per-user query response bytes to `/debug/vars` and `SHOW STATS` docs (#6802)

#### Enterprise query language updates

- [ ] Document `user` column in `SHOW QUERIES` output (#6805)

#### Enterprise release notes

- [ ] Update `release-notes.md` to cover features from all issues

### 2. OSS PR

#### OSS `tools/api.md` updates (shared features, OSS side)

- [ ] Add `time_format` query parameter to `/query` endpoint docs (#6837)
- [ ] Add `cq` key documentation to `/debug/vars` section (#6839)
- [ ] Add `config` key documentation to `/debug/vars` section (#6838)
- [ ] Add per-user query response bytes to `/debug/vars` and `SHOW STATS` docs (#6802)

#### OSS query language updates

- [ ] Document `user` column in `SHOW QUERIES` output (#6805)

#### OSS release notes

- [ ] Update `release-notes.md` if shared features aren't already listed

## Key file paths

| File                                                                           | Issues                            |
| ------------------------------------------------------------------------------ | --------------------------------- |
| `content/enterprise_influxdb/v1/tools/influxd-ctl/_index.md`                   | #6843                             |
| `content/enterprise_influxdb/v1/tools/influxd-ctl/backup.md`                   | #6846, #6851, #6713               |
| `content/enterprise_influxdb/v1/tools/influxd-ctl/show-shards.md`              | #6845                             |
| `content/enterprise_influxdb/v1/administration/configure/config-data-nodes.md` | #6844, #6803                      |
| `content/enterprise_influxdb/v1/tools/api.md`                                  | #6837, #6838, #6839, #6802        |
| `content/enterprise_influxdb/v1/query_language/` (TBD)                         | #6805                             |
| `content/enterprise_influxdb/v1/about-the-project/release-notes.md`            | all                               |
| `content/influxdb/v1/tools/api.md`                                             | #6837, #6838, #6839, #6802        |
| `content/influxdb/v1/query_language/` (TBD)                                    | #6805                             |
| `content/influxdb/v1/about_the_project/release-notes.md`                       | #6837, #6838, #6839, #6802, #6805 |
| TBD (new page for `influx-meta cleanup-shards`)                                | #6842                             |

## Source Analysis Results

Each issue below includes the docs-v2 issue description, the source PR, and corroboration against the v1.12.3 source code.

***

### #6846 — `influxd-ctl backup` validates `-from` node exists

**Docs issue**: `influxd-ctl backup` now validates that the data node specified with `-from` exists in the cluster before starting the backup. Previously, specifying a non-existent node could lead to confusing errors. Now the command fails immediately with: `data node "<addr>" does not exist`. Enterprise 1.12.3+.

**Source PR**: [plutonium#4228](https://github.com/influxdata/plutonium/pull/4228) (cherry-picked as [#4319](https://github.com/influxdata/plutonium/pull/4319), merged 2025-09-30)
Files: `cmd/influxd-ctl/backup/command.go`, `cmd/integration_backup_test.go`

**Corroboration**: ✅ Confirmed in `cmd/influxd-ctl/backup/command.go:610-621`. The `Init()` method iterates `cmd.nodes` checking `node.TCPHost == cmd.ca.Addr`. Error format matches: `fmt.Errorf("data node %q does not exist", cmd.ca.Addr)`.

**Additional context**: PR [#4406](https://github.com/influxdata/plutonium/pull/4406) ("smarter data node selection", cherry-picked as #4412, merged 2026-02-17) builds on this — it adds fallback logic when the `-from` node doesn't own the shard, preferring other owners sorted by recency.

***

### #6845 — New `-e` flag on `influxd-ctl show-shards`

**Docs issue**: A new `-e` flag has been added to `influxd-ctl show-shards`. By default, expired shards are filtered out. When `-e` is passed, expired shards are included. Example: `influxd-ctl show-shards -e`. Enterprise 1.12.3+.

**Source PR**: [plutonium#4306](https://github.com/influxdata/plutonium/pull/4306) (cherry-picked as [#4338](https://github.com/influxdata/plutonium/pull/4338), merged 2025-10-06)
Files: `cmd/influxd-ctl/show/shards.go`, `meta/control/client.go`, `meta/control/client_internal_test.go`

**Corroboration**: ✅ Confirmed in `cmd/influxd-ctl/show/shards.go:46`:

```go
fs.BoolVar(&showExpiredShards, "e", false, "includes expired shards in display")
```

Passed to `c.ShowShards(verbose, metadataConsistency, showExpiredShards)` at line 58.

***

### #6844 — New cluster config timeout options ⚠️ RENAMED

**Docs issue**: Two new `[cluster]` config options: `storage-read-timeout` (default `"15m"`) and `storage-write-timeout` (default `"15m"`). Read/write inactivity timeouts for Storage API RPC operations. Resettable on each operation. Clamped to `shard-reader-timeout`/`shard-writer-timeout` when non-zero. Set to `"0"` to disable. Enterprise 1.12.3+.

**Source PRs**:

1. [plutonium#4398](https://github.com/influxdata/plutonium/pull/4398) (cherry-picked as [#4411](https://github.com/influxdata/plutonium/pull/4411), merged 2026-02-12): Added `StorageReadTimeout`/`StorageWriteTimeout` with TOML keys `storage-read-timeout`/`storage-write-timeout` and clamping via `NormalizeStorageTimeouts()`.
   Files: `cluster/config.go`, `cluster/service.go`, `cluster/shard_mapper.go`, `cluster/storage_timeout_test.go`, `cmd/influxd/run/server.go`, `etc/config.sample.toml`
   Context: Fixed yamux stream pile-up during flux queries across nodes ([EAR#6292](https://github.com/influxdata/EAR/issues/6292)).
2. [plutonium#4433](https://github.com/influxdata/plutonium/pull/4433) (cherry-picked as [#4434](https://github.com/influxdata/plutonium/pull/4434), merged 2026-03-02): **Renamed** `storage-*-timeout` → `rpc-resettable-*-timeout`, removed clamping, broadened scope from Storage API to all incoming RPC connections.
   Source issue: [plutonium#4418](https://github.com/influxdata/plutonium/issues/4418)

**Corroboration**: ⚠️ Issue description is **stale** — names and behavior changed after filing.

**Actual TOML config keys in v1.12.3:**

| Config key                     | Type     | Default | Section     | Description                                                                                           |
| ------------------------------ | -------- | ------- | ----------- | ----------------------------------------------------------------------------------------------------- |
| `rpc-resettable-read-timeout`  | duration | `"15m"` | `[cluster]` | Read inactivity timeout for incoming RPC connections. Resets on each read. Set to `"0"` to disable.   |
| `rpc-resettable-write-timeout` | duration | `"15m"` | `[cluster]` | Write inactivity timeout for incoming RPC connections. Resets on each write. Set to `"0"` to disable. |

**Discrepancies from issue description**:

1. Names changed: `storage-read-timeout` → `rpc-resettable-read-timeout`, `storage-write-timeout` → `rpc-resettable-write-timeout`
2. Clamping removed: no longer clamped to `shard-reader-timeout`/`shard-writer-timeout`
3. Scope broadened: applies to all incoming RPC connections, not just Storage API

Source: `cluster/config.go:55-63`, `etc/config.sample.toml`

***

### #6843 — New `-timeout` global flag for `influxd-ctl`

**Docs issue**: A new `-timeout <duration>` global flag for `influxd-ctl`. Overrides the default 10-second timeout for all operations. Example: `influxd-ctl -timeout 30s show-shards`. Enterprise 1.12.3+.

**Source PR**: [plutonium#4342](https://github.com/influxdata/plutonium/pull/4342) (cherry-picked as [#4393](https://github.com/influxdata/plutonium/pull/4393), merged 2026-01-02)
Files: `cmd/influxd-ctl/config/config.go`, `cmd/influxd-ctl/main.go`, `cmd/influxd-ctl/show/node_test.go`, `cmd/integration_restore_test.go`, `cmd/integration_timeout_test.go`, `cmd/testhelper/integration.go`, `meta/control/client.go`

**Corroboration**: ✅ Confirmed in `cmd/influxd-ctl/main.go:101`:

```go
flag.DurationVar(&cmdConfig.Timeout, "timeout", 10*time.Second, "Override default timeout of 10s")
```

Global flag defined before subcommand parsing. Stored in `cmdConfig.Timeout` and passed to all subcommands.

***

### #6842 — New `influx-meta cleanup-shards` command

**Docs issue**: A new `influx-meta cleanup-shards` command to clean up shards and shard groups in the metadata of a live cluster. Removes shards with no owners, removes empty shard groups, displays summary for confirmation, fails safely if metadata is modified while running. Enterprise 1.12.3+.

**Source PR**: [plutonium#4345](https://github.com/influxdata/plutonium/pull/4345) (merged 2025-10-24)
Files: `cmd/influx-meta/cmd/cleanupshards.go`, `cmd/influx-meta/cmd/cleanupshards_test.go`, `cmd/influx-meta/cmd/mockgen/cleanupshards_mock.go`

**Corroboration**: ✅ All four behaviors from the issue confirmed in source:

1. Shards with no owners removed: `slices.DeleteFunc()` filtering on owner count (`cleanupshards.go:170-234`)
2. Empty shard groups removed: after orphan shard removal, groups with no shards are removed
3. Summary displayed: tab-separated table with ID, Database, RP, Shard Group, Start, End
4. Safe failure: `VerifyClusterDataUnchanged()` checks metadata twice using `google/go-cmp` deep comparison

**`influx-meta` binary context**: Existing binary at `cmd/influx-meta/` with 9 subcommands:
`import`, `export`, `make-node-passive`, `convert`, `cleanup-shards`, `renumber-shard-groups`, `set-shard-group`, `fix-shard-owners`, `make-node-active`

Root description: "Export and edit meta data in a live InfluxDB 1.x cluster. Use with GREAT caution."

**Global flags** (inherited by all subcommands):

| Flag       | Type   | Default                   | Description               |
| ---------- | ------ | ------------------------- | ------------------------- |
| `--host`   | string | `localhost:8091`          | address:port of meta node |
| `--config` | string | `$HOME/.influx-meta.yaml` | config file path          |

**Prerequisites** (from source code comments): No concurrent metadata-modifying operations (disable anti-entropy, stop influxd-ctl ops). Check shard end times with `SHOW SHARDS` — ensure no shards within 30 min of end time.

**Page structure decision**: `influx-meta` currently has **no documentation pages**. Need new page(s) — at minimum `content/enterprise_influxdb/v1/tools/influx-meta/cleanup-shards.md`.

***

### #6839 — CQ diagnostics in `/debug/vars`

**Docs issue**: `/debug/vars` now includes CQ diagnostic information under a `"cq"` key. Aids monitoring and troubleshooting CQ execution. OSS and Enterprise 1.12.3+.

**Source PR**: [influxdb#26874](https://github.com/influxdata/influxdb/pull/26874) (merged 2025-10-03)
Files: `cmd/influxd/run/server.go`, `monitor/service.go`, `monitor/service_test.go`, `services/continuous_querier/service.go`, `services/httpd/handler.go`

**Corroboration**: ✅ Confirmed. The PR body shows the exact output format:

```json
"cq": {
  "queryFail": 0,
  "queryOk": 2
}
```

**Clarification**: The issue says "diagnostics" but the implementation uses the **statistics** interface, not `Diagnostics()` (which returns empty — `service.go:175-177`). The CQ `Statistics()` method (`service.go:162-171`) returns a `models.Statistic` with name `"cq"` containing `queryOk` and `queryFail` counters. These are rendered under the statistics section of `/debug/vars`.

The distinction matters for docs: this data appears in the statistics section of the response, not the diagnostics section. The keys are `queryOk` (camelCase) and `queryFail` (camelCase).

***

### #6838 — Running configuration in `/debug/vars`

**Docs issue**: `/debug/vars` now includes a `"config"` key containing the running server configuration. Useful for remote diagnostics without direct config file access. `toml.Size` → integers (bytes); `toml.Duration` → human-readable duration strings. OSS and Enterprise 1.12.3+.

**Source PR**: [influxdb#26624](https://github.com/influxdata/influxdb/pull/26624) (merged 2025-08-20)
Files: `cmd/influxd/run/server.go`, `monitor/service.go`, `monitor/service_test.go`, `services/httpd/handler.go`, `tsdb/config.go`

**Corroboration**: ✅ Confirmed. The PR body shows the exact output structure:

```json
"config": {
  "aggressive-points-per-block": 10000,
  "cache-max-memory-size": 1073741824,
  "cache-snapshot-memory-size": 26214400,
  "cache-snapshot-write-cold-duration": "10m0s",
  "compact-full-write-cold-duration": "4h0m0s",
  "compact-throughput": 50331648,
  "compact-throughput-burst": 50331648,
  "dir": "/home/foo/.influxdb/data",
  "max-concurrent-compactions": 0,
  "max-index-log-file-size": 1048576,
  "max-series-per-database": 1000000,
  "max-values-per-tag": 100000,
  "series-file-max-concurrent-compactions": 0,
  "series-id-set-cache-size": 100,
  "strict-error-handling": false,
  "wal-dir": "/home/foo/.influxdb/wal",
  "wal-fsync-delay": "0s"
}
```

Registered via `m.RegisterDiagnosticsClient("config", m.TSDBConfig)` in `monitor/service.go:164-165`. Type conversions in `services/httpd/handler.go:2701-2723`.

**Note for Enterprise**: The Enterprise `[cluster]` config also exposes its fields via its own `Diagnostics()` method (`cluster/config.go:138-159`), including `dial-timeout`, `pool-max-idle-streams`, `shard-reader-timeout`, `rpc-resettable-*-timeout`, `cluster-tracing`, etc.

***

### #6837 — New `time_format` query parameter

**Docs issue**: A new `time_format` query parameter on `/query`. Accepted values: `rfc3339`, `epoch` (default: `epoch`). `rfc3339` returns timestamps as RFC3339Nano strings. `epoch` preserves existing behavior with precision parameter. Invalid values return `400 Bad Request`. OSS and Enterprise 1.12.3+.

**Source PR**: [influxdb#26596](https://github.com/influxdata/influxdb/pull/26596) (merged 2025-07-10)
Files: `services/httpd/handler.go`, `services/httpd/handler_test.go`

**Corroboration**: ✅ All four points from the issue confirmed:

1. Accepted values: `rfc3339`, `epoch` — `handler.go:635-638` defines `timeFormats := []string{"rfc3339", "epoch"}`
2. Default: `epoch` — `handler.go:641`: `if timeFormat == "" { timeFormat = "epoch" }`
3. RFC3339Nano output: `handler.go:809-812` calls `convertToTimeFormat(r, time.RFC3339Nano)`
4. 400 on invalid: `handler.go:643-644`: `"Time format must be one of the following: rfc3339,epoch"`

**Additional detail from source**: When `time_format=epoch`, the existing `epoch` precision parameter (`u`, `ms`, `s`, `m`, `h`) continues to work via `convertToEpoch(r, epoch)` at line 807-808.

Endpoints: `GET /query` (line 200), `POST /query` (line 204).

***

### #6713 — Document `influxd-ctl backup` changes

**Docs issue**: Document new flags for `influxd-ctl backup`: `gzipCompressionLevel`, `cpuprofile`, `bufsize`, `gzipBlockCount`, `gzipBlockSize`. Include performance characteristics for `gzipCompressionLevel`. Assigned to @devanbenz.

**Source PR**: [plutonium#4375](https://github.com/influxdata/plutonium/pull/4375) (cherry-picked as [#4400](https://github.com/influxdata/plutonium/pull/4400), merged 2026-01-07)
Files: `cluster/config.go`, `cluster/service.go`, `cmd/influxd-ctl/backup/command.go`, `etc/config.sample.toml`

**Corroboration**: ✅ All 5 flags confirmed in `cmd/influxd-ctl/backup/command.go:170-180`:

| Flag                    | Type   | Default                 | Description                                                | In #6950?      |
| ----------------------- | ------ | ----------------------- | ---------------------------------------------------------- | -------------- |
| `-gzipCompressionLevel` | string | `"default"`             | Compression level: `default`, `full`, `speedy`, `none`     | ✅ Yes          |
| `-gzipBlockCount`       | int    | `runtime.GOMAXPROCS(0)` | Concurrent compression blocks. Recommended: 1-2x CPU cores | ✅ Yes          |
| `-gzipBlockSize`        | int    | `1048576` (1 MB)        | Block size for gzip. Recommended: >1 MB for performance    | ✅ Yes          |
| `-bufsize`              | uint64 | `1048576` (1 MB)        | Buffer size for writing gzip files                         | ❌ Not in #6950 |
| `-cpuprofile`           | string | `""`                    | Write CPU profile to file                                  | ❌ Not in #6950 |

Validation: `gzipBlockSize > 0`, `gzipBlockCount > 0` (`command.go:245-251`).

***

### #6851 — Smarter data node selection for backups

**Docs issue**: When backing up a shard, skip copies with zero bytes and select the most recently written copy first. Keep trying shard copies from owning nodes until success or no more copies available. New `-staleness-threshold` flag: during incremental backups, skip shards whose last write time is within this duration from the last backup. Defaults to `cache-snapshot-write-cold-duration` (currently 10 minutes). Enterprise 1.12.3+.

**Source PR**: [plutonium#4406](https://github.com/influxdata/plutonium/pull/4406) (cherry-picked as #4412, merged 2026-02-17)
Files: `cmd/influxd-ctl/backup/command.go`, `cmd/influxd-ctl/backup/command_test.go`, `cmd/integration_backup_test.go`

**Corroboration**: ✅ Confirmed in `cmd/influxd-ctl/backup/command.go`:

New flag (line 181):

```go
fs.DurationVar(&ca.StalenessThreshold, "staleness-threshold", DefaultStalenessThreshold,
  "For incremental backups, shards within this duration of the existing backup are considered current and skipped.")
```

| Flag                   | Type     | Default                                            | Description                                                                               |
| ---------------------- | -------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `-staleness-threshold` | duration | `tsdb.DefaultCacheSnapshotWriteColdDuration` (10m) | For incremental backups, skip shards modified within this duration of the existing backup |

Validation: must be non-negative (line 253).

Behavior details from source:

1. **Zero-byte filtering** (line 914): `slices.DeleteFunc(allSources, func(si SourceInfo) bool { return si.Size == 0 })` — copies with zero bytes are skipped
2. **Recency sorting** (line 948): sources sorted by `Modified` time descending — most recently written copy tried first
3. **Staleness check** (line 928/972-984): `IsShardBackupCurrent()` returns true when the backup time + staleness threshold is after the shard's modification time AND the backup is at least as large as the shard
4. **Fallback** (line 935): if the most recent copy is current, stale copies (modified before backup time) are filtered, and remaining copies are tried in recency order

***

### #6805 — SHOW QUERIES displays user

**Docs issue**: The user is now printed for each query shown with `SHOW QUERIES`. Assists organizations sharing a single InfluxDB instance to attribute queries for performance analysis or debugging. OSS and Enterprise 1.12.3+.

**Source PR**: [plutonium#4379](https://github.com/influxdata/plutonium/pull/4379) (merged 2025-11-20)
Files: `cluster/statement_executor.go`, `cmd/integration_show_queries_test.go`, `rpc/rpc.go`
Related OSS PRs: [influxdb#26980](https://github.com/influxdata/influxdb/issues/26980)

**Corroboration**: ✅ Confirmed in both repos.

**OSS columns** (`query/task_manager.go:34`):

```
qid | query | database | duration | status | user
```

**Enterprise columns** (`cluster/statement_executor.go:93`):

```
qid | node_id | tcp_host | query | database | duration | status | user
```

The `user` column is the **last column** in both. Enterprise adds `node_id` and `tcp_host` columns (positions 2 and 3) compared to OSS.

The user value comes from `q.User` in the query info. For unauthenticated queries, this will be an empty string.

**Note**: Enterprise's implementation in `cluster/statement_executor.go` fans out `ShowQueriesRequest` RPCs to all data nodes and aggregates results. The `User` field is propagated through `rpc/rpc.go`.

***

### #6803 — Reload log level on SIGHUP

**Docs issue**: The log level can now be changed without stopping the node by sending SIGHUP. Very helpful for debugging without rebooting data nodes. **Enterprise only**, not OSS.

**Source PR**: [plutonium#4237](https://github.com/influxdata/plutonium/pull/4237) (merged 2025-05-06)
Files: `cmd/influxd/run/command.go`, `cmd/influxd/run/command_test.go`, `cmd/influxd/run/config.go`, `cmd/influxd/run/config_test.go`

**Corroboration**: ✅ Confirmed Enterprise-only. No SIGHUP handling in OSS `cmd/influxd/run/`.

**SIGHUP handler** (`cmd/influxd/run/command.go:213-246`):

1. Listens for `syscall.SIGHUP` via `signal.Notify`
2. Reloads the full config from the config file path
3. Reloads TLS managers (certificates)
4. Reloads entitlements (license)
5. Reloads anti-entropy service (closes and re-opens)
6. **Dynamically changes log level**: `config.Logging.Level.SetLevel(reloadedConfig.Logging.Level.Level())`

**Workflow**: Edit the config file's `[logging]` section to change `level`, then send `SIGHUP` to the data node process:

```bash
kill -SIGHUP <pid>
```

Log message on receipt: `"Received SIGHUP.  Attempting to reload licence information and anti-entropy configuration."`
Log message on level change: `"configured logger"` with `format` and `level` fields.

**What is reloaded on SIGHUP** (beyond log level):

- TLS certificates (cluster inter-node TLS)
- Entitlements/license
- Anti-entropy service configuration

***

### #6802 — Per-user query response bytes statistic

**Docs issue**: Admins can now see how many bytes each user has queried. Available in `/debug/vars`, `SHOW STATS`, and `_internal` database. OSS and Enterprise 1.12.3+.

**Source PR**: [influxdb#27188](https://github.com/influxdata/influxdb/pull/27188) (merged 2026-02-06)
Files: `services/httpd/config.go`, `services/httpd/handler.go`, `services/httpd/handler_test.go`, `services/httpd/service.go`, `pkg/data/gensyncmap/gensyncmap.go`

**Corroboration**: ✅ Confirmed in `services/httpd/`:

**Configuration** (`config.go:68`):

| Config key                 | Type | Default | Env var                                  | Section  |
| -------------------------- | ---- | ------- | ---------------------------------------- | -------- |
| `user-query-bytes-enabled` | bool | `false` | `INFLUXDB_HTTP_USER_QUERY_BYTES_ENABLED` | `[http]` |

**Statistics structure** (`handler.go:484-498`, `service.go:51-56`):

- Measurement name: `userquerybytes`
- Tag: `user` (tag key from `StatUserTagKey = "user"`)
- Tag value for unauthenticated: `(anonymous)` (from `StatAnonymousUser`)
- Field: `userQueryRespBytes` (from `statUserQueryRespBytes`)
- Additional inherited tags: `bind` (HTTP bind address)

**Example output** (from PR):

```
> SHOW STATS FOR 'userquerybytes'
name: userquerybytes
tags: bind=:8086, user=FRED
userQueryRespBytes
------------------
9009874
```

**`_internal` database schema**:

```
> SELECT * FROM userquerybytes
name: userquerybytes
time                bind  hostname    user userQueryRespBytes
----                ----  --------    ---- ------------------
1770405340000000000 :8086 myhost      FRED 476
```

**Visibility in `/debug/vars`**: Only appears when `user-query-bytes-enabled` is true AND at least one user has made a query. Admin-only when `pprof-auth-enabled` is true.

***

## PR #6950 link check fixes

PR link check found 28 broken fragment links (first run) + 13 additional (second run). All resolved.

### Fixed (in this branch, first pass)

| Broken link | Fix | File |
|---|---|---|
| `config-data-nodes/#https-insecure-certificate` | Added `#### https-insecure-certificate` heading to `[cluster]` section | `config-data-nodes.md` |
| `config-data-nodes/#https-insecure-certificate-1` | Added `#### https-insecure-certificate` heading to `[http]` section (Hugo generates `-1` suffix) | `config-data-nodes.md` |
| `config-data-nodes/#advanced-expiration` | Added `#### advanced-expiration` heading to `[tls]` section | `config-data-nodes.md` |
| `backup/#backup-compression` | Added `-gzipBlockCount`, `-gzipBlockSize`, `-gzipCompressionLevel` to flags table; changed release notes link to `backup/#flags` | `backup.md`, `release-notes.md` |

### Fixed (second pass — CI run #23826485679)

| Broken link | Fix | File |
|---|---|---|
| `github.com/influxdb/influxdb/issues/4275` (404) | Wrong GitHub org: `influxdb` → `influxdata` | `manage-database.md` (enterprise + OSS) |
| `wiki.mozilla.org/...#Modern_compatibility` (fragment gone) | Removed `#Modern_compatibility` fragment | `config.md` (OSS) |
| `config-data-nodes/#pprof-enabled-1` | Only one `pprof-enabled` heading exists → `#pprof-enabled` | `release-notes.md` |
| `authentication_and_authorization/#authenticate-requests` | Old page is now an alias → rewrote to `configure/security/authentication/` | `query_language/_index.md` |
| `authentication_and_authorization/#user-types-and-privileges` | → `manage/users-and-permissions/authorization-influxql/#non-admin-users` | `query_language/_index.md` |
| `authentication_and_authorization/#user-management-commands` | → `manage/users-and-permissions/authorization-influxql/#user-management-commands` | `query_language/_index.md` |
| `backup-and-restore/#example` | Heading is "Example: export and import..." → `#example-export-and-import-for-disaster-recovery` | `backup-and-restore.md` |
| `backup-and-restore/#perform-a-metastore-only-backup` | Heading says "metadata" not "metastore" → `#perform-a-metadata-only-backup` | `backup-and-restore.md` |
| `backup-and-restore/#restore-from-a-full-backup` | Heading is "Restore from a `-full` backup" → `#restore-from-a--full-backup` | `backup-and-restore.md` |
| `replacing-nodes/#replace-a-data-node-in-an-influxdb-enterprise-cluster` | Heading uses plural "nodes" → `#replace-data-nodes-in-an-influxdb-enterprise-cluster` | `replacing-nodes.md` |
| `replacing-nodes/#31-kill-the-meta-process-on-the-leader-node` | Heading `3.1 -` produced triple-hyphen slug; changed heading to `3.1.` format | `replacing-nodes.md` |
| `replacing-nodes/#32-remove-and-replace-the-old-leader-node` | Same: `3.2 -` → `3.2.` format | `replacing-nodes.md` |
| `replacing-nodes/#2-1-provision-a-new-meta-node` | Hugo removes `.` without hyphen → `#21-provision-a-new-meta-node` | `replacing-nodes.md` |

### Also fixed (pre-existing broken links, all resolved)

#### ~~Old path `/administration/configuration/` (should be `/configure/config-data-nodes/`)~~ FIXED

Source: `release-notes.md` (old release entries) — paths updated to `/configure/config-data-nodes/`.

#### ~~Old path `/administration/config-data-nodes` (missing `/configure/`)~~ FIXED

All occurrences in `upgrading.md`, `replacing-nodes.md`, `config-meta-nodes.md` updated to `/configure/config-data-nodes/` with correct fragments.

#### ~~Old path `/administration/config-meta-nodes` + default value suffix~~ FIXED

`influxd-ctl/_index.md` updated to `configure/config-meta-nodes/#auth-enabled`.

#### ~~Fragment includes default value~~ FIXED

- `release-notes.md`: `#termination-query-log` → `#termination-query-log--false`; `#max-values-per-tag-100000` → `#max-values-per-tag`

#### ~~Self-reference `#meta-internal-shared-secret` in config-meta-nodes.md~~ FIXED

Changed to `#internal-shared-secret` (2 occurrences).

#### ~~Missing/wrong headings in spec.md~~ FIXED

- Removed ToC entry for non-existent `#query-engine-internals`
- `#execution-time` → `#execution_time`; `#planning-time` → `#planning_time`
- `#understanding-iterators` / `#understanding-cursors` → replaced with links to existing `#iterator-type` / `#cursor-type` sections

#### ~~Redirected/wrong paths~~ FIXED

- `authentication_and_authorization/#set-up-authentication` → `configure/security/authentication/#enable-authentication` (in `tools/api.md`, `query_language/_index.md`)
- `query_management/#list-currently-running-queries-with-show-queries` → added `influxql_query_management/` to path (in `spec.md`)
- `influxql_query_management.md`: fixed `coordinator` link text → `[cluster]`, path → `configure/config-data-nodes/#cluster`

#### ~~Glossary and misc~~ FIXED

- `glossary/#replication-factor` → `#replication-factor-rf` in 10 enterprise files (OSS refs left as-is — correct there)
- `backup-and-restore/#restore` → `#restore-utility` in `migration.md`
- Mozilla wiki `#Modern_compatibility` fragment removed from external link in `config-data-nodes.md`

## Notes

- The OSS and Enterprise `api.md` files are independent (no shared `source` frontmatter) — each needs separate edits.
- PR #6950 is already reviewed. Do not add new content to it.
- Enterprise inherits OSS HTTP handler code (including `time_format`, `/debug/vars` stats, `userquerybytes`) via go.mod replace directive (`influxdb v1.12.3-rc.0.0.20260227181538-f3d5cb68ab25`).
- Issue #6844: Fields were renamed post-issue-filing. Document as `rpc-resettable-read-timeout` / `rpc-resettable-write-timeout` (the actual TOML keys in v1.12.3). Clamping was also removed.
- `influx-meta` binary currently has **no documentation pages**. Decide whether to create just the `cleanup-shards` page or document the full binary.
- `-cpuprofile` flag on backup is a debugging/profiling tool — consider whether it belongs in user-facing docs or just `-bufsize`.
- \#6803 SIGHUP reload is Enterprise-only — also reloads TLS certs, entitlements, and anti-entropy, not just log level.
- \#6802 `userquerybytes` is off by default — requires explicit opt-in via config or env var.
- \#6805 SHOW QUERIES `user` column: Enterprise output has 8 columns (includes `node_id`, `tcp_host`); OSS has 6 columns.

## Cleanup

- [ ] Close [DAR#628](https://github.com/influxdata/DAR/issues/628) — "docs(v1): document undocumented v1.12.3 features". All 6 features listed there (`time_format`, dynamic logging, `/debug/vars` config, `/debug/vars` cq, TLS cert reload on SIGHUP, user query bytes) are covered by issues in this plan (#6837, #6803, #6838, #6839, #6803, #6802).

<!-- Research, decisions, blockers -->
