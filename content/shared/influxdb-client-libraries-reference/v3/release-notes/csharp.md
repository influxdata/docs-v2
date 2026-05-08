<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

## v1.8.0 {date="2026-04-23"}

### Features

1. [#227](https://github.com/InfluxCommunity/influxdb3-csharp/pull/227): Add example for write with interceptors.

## v1.7.0 {date="2026-02-19"}

### Features

1. [#220](https://github.com/InfluxCommunity/influxdb3-csharp/pull/220): Add InfluxDB 3 Core/Enterprise structured errors handling.

### CI

1. [#213](https://github.com/InfluxCommunity/influxdb3-csharp/pull/213): Turn off deploy workflow for Nighly builds.
1. [#219](https://github.com/InfluxCommunity/influxdb3-csharp/pull/219): Add support for .NET 10.0.

## v1.6.0 {date="2026-01-08"}

### Features

1. [#193](https://github.com/InfluxCommunity/influxdb3-csharp/pull/193): Add option to disable gRPC query response
   compression:
    - New query option (`QueryOptions.DisableGrpcCompression`) added: `true` value disables gRPC response compression.
      Default value: `false` (compression enabled).
    - Also configurable via connection string query parameter (`disableGrpcCompression`).
    - Also configurable via environment variable (`INFLUX_DISABLE_GRPC_COMPRESSION`).

## v1.5.0 {date="2025-11-18"}

### Features

1. [#175](https://github.com/InfluxCommunity/influxdb3-csharp/pull/175): Add QueryTimeout and WriteTimeout to ClientConfig.
1. [#179](https://github.com/InfluxCommunity/influxdb3-csharp/pull/179): Allows create ClientConfig from ClientConfig(string connectionString) and ClientConfig(IDictionary env)

### CI

1. [#181](https://github.com/InfluxCommunity/influxdb3-csharp/pull/181): Fix CI executors parameters.

## v1.4.0 {date="2025-09-15"}

### Features

1. [#174](https://github.com/InfluxCommunity/influxdb3-csharp/pull/174): Support passing HttpClient to InfluxDBClient.

### CI

1. [#170](https://github.com/InfluxCommunity/influxdb3-csharp/pull/170) Add tests for arm64 CircleCI.

## v1.3.0 {date="2025-08-12"}

### Features

1. [#164](https://github.com/InfluxCommunity/influxdb3-csharp/pull/164): Add function to get InfluxDB version.
1. [#168](https://github.com/InfluxCommunity/influxdb3-csharp/pull/168): Run integration tests against a locally started InfluxDB 3 Core server.

## v1.2.0 {date="2025-05-22"}

### Features

1. [#155](https://github.com/InfluxCommunity/influxdb3-csharp/pull/155): Allows setting grpc options.
1. [#157](https://github.com/InfluxCommunity/influxdb3-csharp/pull/157): Fix: always clone `DefaultOptions` to keep it
   immutable.
1. [#158](https://github.com/InfluxCommunity/influxdb3-csharp/pull/158): Support fast writes without waiting for WAL
   persistence:
    - New write option (`WriteOptions.NoSync`) added: `true` value means faster write but without the confirmation that
      the data was persisted. Default value: `false`.
    - **Supported by self-managed InfluxDB 3 Core and Enterprise servers only!**
    - Also configurable via connection string query parameter (`writeNoSync`).
    - Also configurable via environment variable (`INFLUX_WRITE_NO_SYNC`).
    - Long precision string values added from v3 HTTP API: `"nanosecond"`, `"microsecond"`, `"millisecond"`,
      `"second"` (
      in addition to the existing `"ns"`, `"us"`, `"ms"`, `"s"`).

## v1.1.0 {date="2025-03-26"}

### Features

1. [#153](https://github.com/InfluxCommunity/influxdb3-csharp/pull/153): Add custom SSL root certificate support.
   - New configuration items:
      - `SslRootsFilePath`
      - `DisableCertificateRevocationListCheck`
   - **Disclaimer:** Using custom SSL root certificate configurations is recommended for development and testing
     purposes
     only. For production deployments, ensure custom certificates are added to the operating system's trusted
     certificate store.

## v1.0.0 {date="2025-01-22"}

### Features

1. [#132](https://github.com/InfluxCommunity/influxdb3-csharp/pull/132): Respect iox::column_type::field metadata when
   mapping query results into values.
    - iox::column_type::field::integer: => Long
    - iox::column_type::field::uinteger: => Long
    - iox::column_type::field::float: => Double
    - iox::column_type::field::string: => String
    - iox::column_type::field::boolean: => Boolean

## v0.8.0 {date="2024-09-13"}

### Features

1.[#118](https://github.com/InfluxCommunity/influxdb3-csharp/pull/118): Simplify getting response headers and status code from `InfluxDBApiException`.  Includes example runnable through `Examples/General`.

## v0.7.0 {date="2024-08-12"}

### Migration Notice

- `InfluxDBClient` constructor with connection options has new option `authScheme` with `null` default value:

```diff
- public InfluxDBClient(string host, string token, string? organization = null, string? database = null);
+ public InfluxDBClient(string host, string token, string? organization = null, string? database = null, string? authScheme = null)
```

  This new option is used for Edge (OSS) authentication.

### Features

1. [#101](https://github.com/InfluxCommunity/influxdb3-csharp/pull/101): Add standard `user-agent` header to all calls.
1. [#111](https://github.com/InfluxCommunity/influxdb3-csharp/pull/111): Add InfluxDB Edge (OSS) authentication support.

### Bug Fixes

1. [#110](https://github.com/InfluxCommunity/influxdb3-csharp/pull/110): InfluxDB Edge (OSS) error handling.

## v0.6.0 {date="2024-04-16"}

### Features

1. [#90](https://github.com/InfluxCommunity/influxdb3-csharp/pull/90): Custom `HTTP/gRPC` headers can be specified globally by config or per request

## v0.5.0 {date="2024-03-01"}

### Features

1. [#71](https://github.com/InfluxCommunity/influxdb3-csharp/pull/71): Add support for named query parameters

### Others

1. [#80](https://github.com/InfluxCommunity/influxdb3-csharp/pull/80): Use net8.0 as a default target framework in Tests and Examples

## v0.4.0 {date="2023-12-08"}

### Features

1. [#66](https://github.com/InfluxCommunity/influxdb3-csharp/pull/66): Default Tags for Writes

## v0.3.0 {date="2023-10-02"}

### Features

1. [#36](https://github.com/InfluxCommunity/influxdb3-csharp/pull/46): Add client creation from connection string
and environment variables.
1. [#52](https://github.com/InfluxCommunity/influxdb3-csharp/pull/52): Add structured query support

### Docs

1. [#52](https://github.com/InfluxCommunity/influxdb3-csharp/pull/52): Add downsampling example

## v0.2.0 {date="2023-08-11"}

### Features

1. [#33](https://github.com/InfluxCommunity/influxdb3-csharp/pull/33): Add GZIP support
1. [#34](https://github.com/InfluxCommunity/influxdb3-csharp/pull/34): Add HTTP proxy and custom HTTP headers support

### Breaking Changes

1. [#35](https://github.com/InfluxCommunity/influxdb3-csharp/pull/35): Renamed config types and some options

## v0.1.0 {date="2023-06-09"}

- initial release of new client version
