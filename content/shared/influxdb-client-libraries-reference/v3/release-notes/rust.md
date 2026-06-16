<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

## v0.2.0 {date="2026-06-16"}

### Features

1. [#12](https://github.com/InfluxCommunity/influxdb3-rust/pull/12): Expand client configuration support for environment variables and connection strings.
   Add auth scheme and write option support.
   Preserve explicit ports and strip userinfo from normalized hosts.
   Remove the legacy `bucket` and `INFLUX_BUCKET` aliases in favor of `database` and `INFLUX_DATABASE`.
2. [#19](https://github.com/InfluxCommunity/influxdb3-rust/pull/19): Default writes to the V2 API endpoint. Add builder methods for write defaults.
   `no_sync` requires `use_v2_api=false` to write to the V3 API endpoint.
   `accept_partial` applies only when writes are sent to the V3 API endpoint and is ignored otherwise.

### Bug Fixes

1. [#13](https://github.com/InfluxCommunity/influxdb3-rust/pull/13): Improve Arrow query result type support.
   Unsupported Arrow types now produce `Error::UnsupportedArrowType` instead of `Null`.

### Dependencies

1. [#18](https://github.com/InfluxCommunity/influxdb3-rust/pull/18): Upgrade Arrow dependencies to version 58 and require Rust 1.89 or later.

## v0.1.0 {date="2026-06-08"}

Initial release.

### Features

- Async client for InfluxDB 3 Core and Enterprise over HTTP (writes) and Arrow
  Flight (queries).
- Write API: a builder accepting line-protocol strings, `Vec<Point>`, and (with
  the `polars` feature) a DataFrame. Options for timestamp precision, batching,
  in-flight concurrency, default tags, gzip, and WAL no-sync.
- Query API: SQL and InfluxQL, parameterised queries, row iteration, and
  streaming of results too large to hold in memory.
- Automatic retries with exponential backoff and full jitter for transient
  failures (transport errors, `429`, `5xx`), honouring `Retry-After`.
  Configurable per client or per request.
- Partial-write error reporting with per-line detail.
- Optional `polars` feature: DataFrame writes and query-to-DataFrame conversion.

### Notes

- Retries are enabled by default (`max_retries = 3`). Use `.no_retry()` or a
  custom `RetryConfig` to change this.
