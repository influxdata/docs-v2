<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

## v2.14.0 {date="2026-04-23"}

### BREAKING CHANGES

1. [#245](https://github.com/InfluxCommunity/influxdb3-go/pull/245): Adds `UseV2Api` write option and fixes partial writes support introduced in [#234](https://github.com/InfluxCommunity/influxdb3-go/pull/234).
   Users of InfluxDB Clustered version must set this option to `true` for writing.

### Features

1. [#227](https://github.com/InfluxCommunity/influxdb3-go/pull/227): Support custom tag order via `WithTagOrder` write option.
   See [Sort tags by priority](https://docs.influxdata.com/influxdb3/enterprise/write-data/best-practices/schema-design/#sort-tags-by-query-priority) for more.
   - Point and struct writes now use custom line protocol marshaling in this client; dependency on `github.com/influxdata/line-protocol/v2` will be dropped in a future release.
   - Direct use of `lineprotocol.Precision` is deprecated; prefer `influxdb3.Precision` constants.
2. [#234](https://github.com/InfluxCommunity/influxdb3-go/pull/234): Support partial writes via `AcceptPartial` write option.
   See [Partial writes](https://docs.influxdata.com/influxdb3/core/write-data/http-api/v3-write-lp/#partial-writes) for more.
3. [#238](https://github.com/InfluxCommunity/influxdb3-go/pull/238): Support `arrow.NULL` data type in query response iterator.

### Dependencies

1. [#249](https://github.com/InfluxCommunity/influxdb3-go/pull/249): Requires Go 1.25 or newer.

## v2.13.0 {date="2026-02-19"}

### Features

1. [#223](https://github.com/InfluxCommunity/influxdb3-go/pull/223): Support passing middleware functions to the Flight client.

## v2.12.0 {date="2026-01-08"}

### Features

1. [#209](https://github.com/InfluxCommunity/influxdb3-go/pull/209): Document the global nature of gRPC compression in
   README.md

### Bug Fixes

1. [#213](https://github.com/InfluxCommunity/influxdb3-go/pull/213): Fixed InfluxDB 3 Core/Enterprise write error deserialization.

### Dependencies

1. Minimum supported Go version is now 1.24 as required by `google.golang.org/grpc` v1.76.0 - see [grpc-go#8509](https://github.com/grpc/grpc-go/issues/8509)

## v2.11.0 {date="2025-11-18"}

### CI

1. [#195](https://github.com/InfluxCommunity/influxdb3-go/pull/195): Fix pipelines not downloading the correct go images.

### Features

1. [192](https://github.com/InfluxCommunity/influxdb3-go/pull/192): Add clearer timeout parameters.
   - The `ClientConfig` property `Timeout` is now deprecated.
   - In `ClientConfig` a new property `WriteTimeout` supersedes it.
   - In `ClientConfig` the new property `QueryTimeout` sets a default context deadline to be used with all queries.
   - New environment variables `INFLUXDB_WRITE_TIMEOUT` and `INFLUXDB_QUERY_TIMEOUT` are added.

### Bug Fixes

1. [#193](https://github.com/InfluxCommunity/influxdb3-go/pull/193): Use `influxdb3_test` package in the documentation examples to enforce public API usage.

## v2.10.0 {date="2025-09-15"}

### Features

1. [#189](https://github.com/InfluxCommunity/influxdb3-go/pull/189): Add transparent gRPC compression support.

### CI

1. [#180](https://github.com/InfluxCommunity/influxdb3-go/pull/180):
   - Add tests for arm64 CircleCI.
   - Add tests for go v1.24 and v1.25.

## v2.9.0 {date="2025-08-12"}

### Features

1. [#169](https://github.com/InfluxCommunity/influxdb3-go/pull/169): Support user-defined type converter function for writes points.
2. [#171](https://github.com/InfluxCommunity/influxdb3-go/pull/171): Add function to get InfluxDB version.
3. [#176](https://github.com/InfluxCommunity/influxdb3-go/pull/176): Add comment warning null when calling getMeasurement function.
4. [#174](https://github.com/InfluxCommunity/influxdb3-go/pull/174): Run integration tests against a locally started InfluxDB 3 Core server.

## v2.8.0 {date="2025-06-18"}

### Features

1. [#159](https://github.com/InfluxCommunity/influxdb3-go/pull/159): Support fast writes without waiting for WAL
   persistence:
   - New write option (`WriteOptions.NoSync`) added: `true` value means faster write but without the confirmation that
     the data was persisted. Default value: `false`.
   - **Supported by self-managed InfluxDB 3 Core and Enterprise servers only!**
   - Also configurable via connection string query parameter (`writeNoSync`).
   - Also configurable via environment variable (`INFLUX_WRITE_NO_SYNC`).
   - Long precision string values added from v3 HTTP API: `"nanosecond"`, `"microsecond"`, `"millisecond"`, `"second"` (
     in addition to the existing `"ns"`, `"us"`, `"ms"`, `"s"`).

### Bug Fixes

1. [#164](https://github.com/InfluxCommunity/influxdb3-go/pull/164): Updates
   - Go version to 1.23.9
   - `golang.org/x/net` to v0.38.0
2. [#166](https://github.com/InfluxCommunity/influxdb3-go/pull/166): Upgrades dependency `apache/arrow/go` to `apache/arrow-go` v18.

## v2.7.0 {date="2025-05-15"}

### Bug Fixes

1. [#158](https://github.com/InfluxCommunity/influxdb3-go/pull/158): Refactor Batcher and LPBatcher:
   - Fields and methods using `capacity` renamed to `initialCapacity`.
   - Log messages when buffer data is not being emitted are simplified.
   - `SetCapacity` methods on both structures are now deprecated.
   - `WithCapacity` and `WithBufferCapacity` options are now deprecated.

## v2.6.0 {date="2025-04-15"}

### Features

1. [#155](https://github.com/InfluxCommunity/influxdb3-go/pull/155): Batcher warnings when buffer data is not being automatically emitted changed to level `Debug` in slog.

## v2.5.0 {date="2025-04-10"}

### Features

1. [#146](https://github.com/InfluxCommunity/influxdb3-go/pull/146): Add error field to QueryIterator to hold first possible error encountered when retrieving records from the flight Reader.
1. [#147](https://github.com/InfluxCommunity/influxdb3-go/pull/147): Ability to pass `grpc.CallOption` functions to the underlying flight Client.
1. [#149](https://github.com/InfluxCommunity/influxdb3-go/pull/149): Add default configuration for the built-in HTTP
   client and expose new configurable parameters:
   - `Timeout` - The overall time limit for requests made by the Client. A negative value means no timeout. Default
     value: 10 seconds.
   - `IdleConnectionTimeout` - Maximum time an idle connection will remain idle before closing itself. A negative value
     means no timeout. Default value: 90 seconds.
   - `MaxIdleConnections`  - Maximum number of idle connections. It sets both `transport.MaxIdleConn` and
     `transport.MaxIdleConnsPerHost` to the same value. A negative value means no limit. Default value: 100.
1. [#154](https://github.com/InfluxCommunity/influxdb3-go/pull/154): Export functions `NewQueryIterator` and
   `NewPointValueIterator` to simplify testing.

## v2.4.0 {date="2025-03-26"}

### Features

1. [#141](https://github.com/InfluxCommunity/influxdb3-go/pull/141): Add proxy and custom SSL root certificate support.

## v2.3.0 {date="2025-02-20"}

### Features

1. [#131](https://github.com/InfluxCommunity/influxdb3-go/pull/131): Add new PointValueIterator based on google
   guidelines [Guidelines](https://github.com/googleapis/google-cloud-go/wiki/Iterator-Guidelines)

## v2.2.0 {date="2025-02-03"}

### Bug fixes

1. [#134](https://github.com/InfluxCommunity/influxdb3-go/pull/134): Reduce minimal Go version to 1.22, remove unnecessary toolchain constraints.

## v2.1.0 {date="2025-01-16"}

### Bug fixes

1. [#127](https://github.com/InfluxCommunity/influxdb3-go/pull/127): LPBatcher now returns first line of the internal buffer when the line length exceeds the batch size.

## v2.0.0 {date="2024-12-13"}

### Breaking Changes

:warning: **This is a breaking change release.**

> Previously, the Query API did not respect the metadata type for columns returned from InfluxDB v3. This release fixes this issue. As a result, the type of some columns may differ from previous versions. For example, the timestamp column will now be `time.Time` instead of `arrow.Timestamp`.

Update steps:

1. Update library: `go get github.com/InfluxCommunity/influxdb3-go/v2/influxdb3`
1. Update import path in Go files to `github.com/InfluxCommunity/influxdb3-go/v2/influxdb3`.

### Features

1. [#114](https://github.com/InfluxCommunity/influxdb3-go/pull/114): Query API respects metadata types for columns returned from InfluxDB v3.
   Tags are mapped as a "string", timestamp as "time.Time", and fields as their respective types:
   - iox::column_type::field::integer: => int64
   - iox::column_type::field::uinteger: => uint64
   - iox::column_type::field::float: => float64
   - iox::column_type::field::string: => string
   - iox::column_type::field::boolean: => bool

## v1.0.0 {date="2024-11-15"}

:warning: **The v1.0.0 release had a malformed module path regarding the [Go Module Requirements](https://go.dev/ref/mod#major-version-suffixes). For a Go Module project, you need to use version 2 of the client.**

### Breaking Changes

:warning: **This is a breaking change release.**

> Previously, the Query API did not respect the metadata type for columns returned from InfluxDB v3. This release fixes this issue. As a result, the type of some columns may differ from previous versions. For example, the timestamp column will now be `time.Time` instead of `arrow.Timestamp`.

### Features

1. [#114](https://github.com/InfluxCommunity/influxdb3-go/pull/114): Query API respects metadata types for columns returned from InfluxDB v3.
   Tags are mapped as a "string", timestamp as "time.Time", and fields as their respective types:
    - iox::column_type::field::integer: => int64
    - iox::column_type::field::uinteger: => uint64
    - iox::column_type::field::float: => float64
    - iox::column_type::field::string: => string
    - iox::column_type::field::boolean: => bool

## v0.14.0 {date="2024-11-11"}

### Features

1. [#112](https://github.com/InfluxCommunity/influxdb3-go/pull/112): Adds `LPBatcher` for lineprotocol batching following the model of the Point `Batcher`.

### Bug Fixes

1. [#113](https://github.com/InfluxCommunity/influxdb3-go/pull/113): Honor struct tags on WriteData, avoid panic for unexported fields

## v0.13.0 {date="2024-10-22"}

### Features

1. [#108](https://github.com/InfluxCommunity/influxdb3-go/pull/108): Allow Request.GetBody to be set when writing gzipped data to make calls more resilient.
1. [#111](https://github.com/InfluxCommunity/influxdb3-go/pull/111): Support tabs in tag values.

## v0.12.0 {date="2024-10-02"}

### Features

1. [#107](https://github.com/InfluxCommunity/influxdb3-go/pull/107): Add `Batcher` to simplify the process of writing data in batches.

## v0.11.0 {date="2024-09-27"}

### Bug Fixes

1. [#105](https://github.com/InfluxCommunity/influxdb3-go/pull/105): Support newlines in tag values.
1. [#106](https://github.com/InfluxCommunity/influxdb3-go/pull/106): Close `resp.Body` after HTTP error response is encountered.

## v0.10.0 {date="2024-09-13"}

### Features

1. [#100](https://github.com/InfluxCommunity/influxdb3-go/pull/100): Expose HTTP Response headers in `ServerError`

### Bug Fixes

1. [#94](https://github.com/InfluxCommunity/influxdb3-go/pull/94): Resource leak from unclosed `Response`
1. [#97](https://github.com/InfluxCommunity/influxdb3-go/pull/97): Style and performance improvements discovered by `golangci-lint`
1. [#98](https://github.com/InfluxCommunity/influxdb3-go/pull/98): Cloud Dedicated database creation ignores the name given by an argument

### CI

1. [#95](https://github.com/InfluxCommunity/influxdb3-go/pull/95): Add `golangci-lint` to CI

## v0.9.0 {date="2024-08-12"}

### Features

1. [#87](https://github.com/InfluxCommunity/influxdb3-go/pull/87): Add Cloud Dedicated database creation support
1. [#91](https://github.com/InfluxCommunity/influxdb3-go/pull/91): Add Edge (OSS) authentication support.

### Bug Fixes

1. [#89](https://github.com/InfluxCommunity/influxdb3-go/pull/89): InfluxDB Edge (OSS) error handling

## v0.8.0 {date="2024-06-24"}

### Features

1. [#85](https://github.com/InfluxCommunity/influxdb3-go/pull/85): Add standard `user-agent` header to gRPC requests.
1. [#86](https://github.com/InfluxCommunity/influxdb3-go/pull/86): Add Serverless bucket creation support

## v0.7.0 {date="2024-04-16"}

### Features

1. [#74](https://github.com/InfluxCommunity/influxdb3-go/pull/74): Use `log/slog` to print debug information instead of `fmt.Printf`
1. [#76](https://github.com/InfluxCommunity/influxdb3-go/pull/76): Add custom headers support for queries (gRPC requests)

### Bug Fixes

1. [#71](https://github.com/InfluxCommunity/influxdb3-go/pull/71): Rename `FlightSQL` constant to `SQL`

### Others

1. [#68](https://github.com/InfluxCommunity/influxdb3-go/pull/68): Upgrade Go version to 1.22.

## v0.6.0 {date="2024-03-01"}

### Features

1. [#56](https://github.com/InfluxCommunity/influxdb3-go/pull/56): Add support for named query parameters

### Bug Fixes

1. [#59](https://github.com/InfluxCommunity/influxdb3-go/pull/59): Export Default Tags from package

## v0.5.0 {date="2023-12-05"}

### Features

1. [#50](https://github.com/InfluxCommunity/influxdb3-go/pull/50): Default Tags for Writes

## v0.4.0 {date="2023-11-03"}

### Features

1. [#45](https://github.com/InfluxCommunity/influxdb3-go/pull/45): Add structured query support

### Docs

1. [#45](https://github.com/InfluxCommunity/influxdb3-go/pull/45): Add downsampling example

## v0.3.0 {date="2023-10-02"}

### Features

1. [#36](https://github.com/InfluxCommunity/influxdb3-go/pull/36): Add client creation from connection string
and environment variables.

### Bug Fixes

1. [#37](https://github.com/InfluxCommunity/influxdb3-go/pull/37): `runtime error` for iterating Arrow Record without rows

## v0.2.0 {date="2023-08-11"}

### Features

1. [#30](https://github.com/InfluxCommunity/influxdb3-go/pull/30): Add custom HTTP headers support

### Breaking Changes

1. [#31](https://github.com/InfluxCommunity/influxdb3-go/pull/31): Changed package to `influxdb3`.
Renamed config types and some options.

## v0.1.0 {date="2023-06-09"}

- initial release of new client version
- write using v2 api
- query using SQL
- query using influxQL
