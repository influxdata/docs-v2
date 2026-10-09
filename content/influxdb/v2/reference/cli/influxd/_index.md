---
title: influxd - InfluxDB service
description: The `influxd` service starts and runs all the processes necessary for InfluxDB to function.
influxdb/v2/tags: [influxd, cli]
menu:
  influxdb_v2:
    name: influxd
    parent: Command line tools
weight: 102
related:
  - /influxdb/v2/reference/config-options/
products: [oss]
---

The `influxd` daemon starts and runs all the processes necessary for InfluxDB to function.

## Usage

```
influxd [flags]
influxd [command]
```

{{% note %}}
For information about other available InfluxDB configuration methods, see
[InfluxDB configuration options](/influxdb/v2/reference/config-options/).
{{% /note %}}

## Commands

| Command                                                            | Description                                                  |
| :----------------------------------------------------------------- | :----------------------------------------------------------- |
| [downgrade](/influxdb/v2/reference/cli/influxd/downgrade/)       | Downgrade metadata schema to match an older release          |
| help                                                               | Output help information for `influxd`                        |
| [inspect](/influxdb/v2/reference/cli/influxd/inspect/)           | Inspect on-disk database data                                |
| [print-config](/influxdb/v2/reference/cli/influxd/print-config/) | (**Deprecated**) Print full influxd configuration for the current environment |
| [recovery](/influxdb/v2/reference/cli/influxd/recovery/)         | Recover operator access to InfluxDB                          |
| [run](/influxdb/v2/reference/cli/influxd/run/)                   | Start the influxd server _**(default)**_                     |
| [upgrade](/influxdb/v2/reference/cli/influxd/upgrade/)           | Upgrade a 1.x version of InfluxDB to {{< current-version >}} |
| [version](/influxdb/v2/reference/cli/influxd/version/)           | Output the current version of InfluxDB                       |

## Flags

<!-- Influxd flags are maintained in data/influxd_flags.yml -->
{{< cli/influxd-flags >}}

## Exit codes

_Available in InfluxDB OSS v2.10 and later._

When the `influxd` server fails to start, its exit code tells you whether restarting can help.
The codes follow the BSD `sysexits.h` convention.

| Code | Name             | Meaning                                                                                                                                                   | Restart helps?                        |
| ---: | :--------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------ |
|    0 | `EX_OK`          | Startup and shutdown succeeded, including a shutdown requested by a signal.                                                                              | —                                     |
|    1 | —                | An error with no category. Subcommands such as `inspect`, `upgrade`, and `recovery` report all failures with this code.                                  | Unknown                               |
|   64 | `EX_USAGE`       | The command line is wrong: an unknown flag, a flag value that can't be parsed, or an unexpected argument.                                                | No                                    |
|   65 | `EX_DATAERR`     | The data on disk isn't readable by this version--for example, InfluxDB 1.x `_series` or `index` directories under `--engine-path`.                        | No                                    |
|   66 | `EX_NOINPUT`     | A path doesn't exist or is the wrong type--for example, `--engine-path` points to a file, or a parent directory is missing.                              | No                                    |
|   69 | `EX_UNAVAILABLE` | A required resource is in use: the `--http-bind-address` port, an existing `--pid-file`, or a dependency that refused the connection.                    | Only after the conflict clears        |
|   70 | `EX_SOFTWARE`    | Startup failed without an operating system cause. Read the error and the log.                                                                            | No                                    |
|   71 | `EX_OSERR`       | The operating system ran out of file descriptors or memory.                                                                                              | After you raise the limits            |
|   73 | `EX_CANTCREAT`   | A file can't be created or extended: the disk is full, a quota is exhausted, or the file system is read-only.                                            | After you free space or make the file system writable |
|   74 | `EX_IOERR`       | An I/O error occurred while reading or writing, usually from hardware or a failing file system.                                                          | No                                    |
|   75 | `EX_TEMPFAIL`    | An operation didn't finish: a dependency timed out, `SIGINT` interrupted startup, or shutdown exceeded its time limit.                                   | Yes                                   |
|   77 | `EX_NOPERM`      | Permission was denied on a data directory, PID file, TLS certificate, or privileged port.                                                                | No                                    |
|   78 | `EX_CONFIG`      | A configuration value is wrong--for example, 1.x keys in a 2.x configuration file, a configuration file that can't be parsed, or an invalid option value. | No                                    |

To retrieve the startup error from the `/health` and `/ready` endpoints before `influxd` exits,
set [`startup-error-linger`](/influxdb/v2/reference/config-options/#startup-error-linger).

### Prevent restart loops with systemd

If `influxd` exits with a code that a restart can't fix, systemd restarts it into the same failure.
To stop restarting on those codes, add `RestartPreventExitStatus` to the `influxd` service unit:

```ini
[Service]
Restart=on-failure
RestartPreventExitStatus=64 65 66 70 74 77 78
```
