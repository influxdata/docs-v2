---
title: influx transpile
description: >
  The `influx transpile` command transpiles an InfluxQL query to Flux source code.
weight: 101
related:
  - /influxdb/v2.0/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb/v2.0/reference/cli/influx/#flag-patterns-and-conventions, influx CLI—Flag patterns and conventions
---

{{% warn %}}
### Removed in InfluxDB OSS 2.0.5
The `influx transpile` command was removed in **InfluxDB 2.0.5**.
[Use InfluxQL to query InfluxDB 2.0](/influxdb/v2.0/query-data/influxql/).
For information about manually converting InfluxQL queries to Flux, see:

- [Get started with Flux](/{{< latest "flux" >}}//get-started/)
- [Query data with Flux](/influxdb/v2.0/query-data/flux/)
- [Migrate continuous queries to Flux tasks](/influxdb/%762.0/upgrade/v1-to-v2/migrate-cqs/)
  <!-- Used the hex code in the link above to prevent v2.0 -> cloud replacement -->
{{% /warn %}}

The `influx transpile` command transpiles an InfluxQL query to Flux source code.
The transpiled query assumes the bucket name is `<database>/<retention policy>`
and includes absolute time ranges using the provided `--now` time.

## Usage
```
influx transpile [InfluxQL query] [flags]
```

{{% note %}}
The InfluxQL query must be valid and contain both a database and measurement.
See the [InfluxQL documentation](/{{< latest "influxdb" "v1" >}}/query_language/) for more information.
{{% /note %}}

## Flags
| Flag |          | Description                                                                |
|:---- |:---      |:-----------                                                                |
| `-h` | `--help` | Help for the `transpile` command                                           |
|      | `--now`  | RFC3339Nano timestamp to use as `now()` time (default is current UTC time) |

## Examples

{{< cli/influx-creds-note >}}

##### Transpile InfluxQL queries to Flux
```sh
## Transpile an InfluxQL query that specifies the database,
## retention policy, and measurement.
influx transpile 'SELECT example-field FROM db.rp.measurement'

## Transpile InfluxQL query using default retention policy
influx transpile 'SELECT example-field FROM db..measurement'
```
