<!-- Generated from CHANGELOG.md. Edit upstream and re-sync; do not edit here. -->

## v1.9.0 {date="2026-04-23"}

### Features

1. [#360](https://github.com/InfluxCommunity/influxdb3-java/pull/360): Support passing interceptors to the Flight client.
1. [#363](https://github.com/InfluxCommunity/influxdb3-java/pull/363): Support custom tag order via `tagOrder` write option.
   See [Sort tags by priority](https://docs.influxdata.com/influxdb3/enterprise/write-data/best-practices/schema-design/#sort-tags-by-query-priority) for more.

## v1.8.0 {date="2026-02-19"}

### Features

1. [#352](https://github.com/InfluxCommunity/influxdb3-java/pull/352): Upgrade Arrow Flight client dependencies.

### Bug Fixes

1. [#351](https://github.com/InfluxCommunity/influxdb3-java/pull/351): Enterprise/Core structured errors handling.

### CI

1. [#313](https://github.com/InfluxCommunity/influxdb3-java/pull/313): Clarify JDK 25+ requirements.
1. [#340](https://github.com/InfluxCommunity/influxdb3-java/pull/340): Turn off deploy workflow for Nighly builds.

## v1.7.0 {date="2025-11-21"}

### Bug Fixes

1. [#317](https://github.com/InfluxCommunity/influxdb3-java/pull/317): Fix Arrow memory leak when stream close fails due to thread interrupts.
1. [#318](https://github.com/InfluxCommunity/influxdb3-java/pull/318): Explicit releasing of the VectorSchemaRoot.

## v1.6.0 {date="2025-11-14"}

### Features

1. [#306](https://github.com/InfluxCommunity/influxdb3-java/pull/306): Improve closing of Arrow `FlightStream`.

### Bug Fixes

1. [#310](https://github.com/InfluxCommunity/influxdb3-java/pull/310): Ensure `QueryOptions` objects are left unchanged within the `queryData` implementation.

## v1.5.0 {date="2025-10-22"}

### Features

1. [#289](https://github.com/InfluxCommunity/influxdb3-java/pull/289) Add the possibility to disable gRPC compression via the `disableGRPCCompression` parameter in the `ClientConfig`.

### CI

1. [#283](https://github.com/InfluxCommunity/influxdb3-java/pull/283) Fix pipeline not downloading the correct java images.

## v1.4.0 {date="2025-09-15"}

### Features

1. [#265](https://github.com/InfluxCommunity/influxdb3-java/pull/265) Add more precise timeout properties to `ClientConfig`.
   1. Current property `timeout` is deprecated, as it applies only to the Write API and can be confusing to some users.
   2. Two new properties are added, along with getters and similar setters in the `ClientConfig.Builder`.
      1. `writeTimeout` - a `java.time.Duration` that applies only to the Write API.
      2. `queryTimeout` - a `java.time.Duration` used to calculate deadlines when using the Query API.
   3. These properties can also be defined when creating a client using environment variables. Respectively:
      1. `INFLUX_WRITE_TIMEOUT` - a positive integer.  The time unit is in seconds.
      2. `INFLUX_QUERY_TIMEOUT` - a positive integer.  The time unit is in seconds.
   4. These properties can also be defined when creating a client using system properties. Respectively:
      1. `influx.writeTimeout` - a positive integer.  The time unit is in seconds.
      2. `influx.queryTimeout` - a positive integer.  The time unit is in seconds.

### CI

1. [#266](https://github.com/InfluxCommunity/influxdb3-java/pull/266) Add tests for arm64 CircleCI.

## v1.3.0 {date="2025-08-13"}

### Features

1. [#250](https://github.com/InfluxCommunity/influxdb3-java/pull/250) Upgrade Netty version to 4.2.3.Final.
2. [#251](https://github.com/InfluxCommunity/influxdb3-java/pull/251) Add comment warning null when calling getMeasurement function.
3. [#252](https://github.com/InfluxCommunity/influxdb3-java/pull/252) Run integration tests against a locally started InfluxDB 3 Core server.

### Documentation

1. [#253](https://github.com/InfluxCommunity/influxdb3-java/pull/253) New Durable example showing client reuse for better resource management.

## v1.2.0 {date="2025-06-26"}

### Features

1. [#209](https://github.com/InfluxCommunity/influxdb3-java/pull/209) Add query function returning row as map.
2. [#238](https://github.com/InfluxCommunity/influxdb3-java/pull/238): Support fast writes without waiting for WAL
   persistence:
   - New write option (`WriteOptions.noSync`) added: `true` value means faster write but without the confirmation that
     the data was persisted. Default value: `false`.
   - **Supported by self-managed InfluxDB 3 Core and Enterprise servers only!**
   - Also configurable via connection string query parameter (`writeNoSync`).
   - Also configurable via environment variable (`INFLUX_WRITE_NO_SYNC`).
   - Long precision string values added from v3 HTTP API: `"nanosecond"`, `"microsecond"`, `"millisecond"`,
     `"second"` (
     in addition to the existing `"ns"`, `"us"`, `"ms"`, `"s"`).
3. [#241](https://github.com/InfluxCommunity/influxdb3-java/pull/241): Some default options will be used from a getter.
4. [#243](https://github.com/InfluxCommunity/influxdb3-java/pull/243): Add function to get InfluxDB version.

### Bug Fixes

1. [#239](https://github.com/InfluxCommunity/influxdb3-java/pull/239): Use write options from `ClientConfig` in
   `InfluxDBClientImpl` write methods:

   ```java
   public void writeRecord(@Nullable final String record);
   public void writeRecords(@Nonnull final List<String> records);
   public void writePoint(@Nullable final Point point);
   public void writePoints(@Nonnull final List<Point> points);
   ```

## v1.1.0 {date="2025-05-22"}

### Features

1. [#229](https://github.com/InfluxCommunity/influxdb3-java/pull/229): Support proxy and custom ssl root certificates
2. [#232](https://github.com/InfluxCommunity/influxdb3-java/pull/232): Allow set rpc max message size through maxInboundMessageSize in ClientConfig
3. [#233](https://github.com/InfluxCommunity/influxdb3-java/pull/233): More detailed documentation about timestamp handling for query and write functions
4. [#236](https://github.com/InfluxCommunity/influxdb3-java/pull/236): Supports Java 21.

## v1.0.0 {date="2024-12-11"}

### Features

1. [#200](https://github.com/InfluxCommunity/influxdb3-java/pull/200): Respect iox::column_type::field metadata when
   mapping query results into values.
   - iox::column_type::field::integer: => Long
   - iox::column_type::field::uinteger: => Long
   - iox::column_type::field::float: => Double
   - iox::column_type::field::string: => String
   - iox::column_type::field::boolean: => Boolean

### Dependencies

1. [#202](https://github.com/InfluxCommunity/influxdb3-java/pull/202): Migrate from `flight-grpc` to `flight-core` package.

## v0.9.0 {date="2024-08-12"}

### Features

1. [#158](https://github.com/InfluxCommunity/influxdb3-java/pull/158): Add InfluxDB Edge (OSS) authentication support.
1. [#163](https://github.com/InfluxCommunity/influxdb3-java/pull/163): Introduces `InfluxDBApiHttpException` to facilitate write retries and error recovery.

### Bug Fixes

1. [#148](https://github.com/InfluxCommunity/influxdb3-java/pull/148): InfluxDB Edge (OSS) error handling
1. [#153](https://github.com/InfluxCommunity/influxdb3-java/pull/153): Parsing timestamp columns

## v0.8.0 {date="2024-06-24"}

### Features

1. [#144](https://github.com/InfluxCommunity/influxdb3-java/pull/133): user-agent header is updated for both REST and gRPC calls.

## v0.7.0 {date="2024-03-11"}

### Features

1. [#107](https://github.com/InfluxCommunity/influxdb3-java/pull/107): Custom headers are also supported for the query (gRPC request)

    ```java
    ClientConfig config = new ClientConfig.Builder()
        .host("https://us-east-1-1.aws.cloud2.influxdata.com")
        .token("my-token".toCharArray())
        .database("my-database")
        .headers(Map.of("X-Tracing-Id", "123"))
        .build();

    try (InfluxDBClient client = InfluxDBClient.getInstance(config)) {
        //
        // your code here
        //
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
    ```

1. [#108](https://github.com/InfluxCommunity/influxdb3-java/pull/108): Custom headers can be specified per request (query/write):

    ```java
    ClientConfig config = new ClientConfig.Builder()
        .host("https://us-east-1-1.aws.cloud2.influxdata.com")
        .token("my-token".toCharArray())
        .database("my-database")
        .build();

    try (InfluxDBClient client = InfluxDBClient.getInstance(config)) {
        //
        // Write with custom headers
        //
        WriteOptions writeOptions = new WriteOptions(
            Map.of("X-Tracing-Id", "852")
        );
        client.writeRecord("mem,tag=one value=1.0", writeOptions);

        //
        // Query with custom headers
        //
        QueryOptions queryOptions = new QueryOptions(
            Map.of("X-Tracing-Id", "852")
        );
        Stream<Object[]> rows = client.query("select * from cpu", queryOptions);

    } catch (Exception e) {
        throw new RuntimeException(e);
    }
    ```

## v0.6.0 {date="2024-03-01"}

### Features

1. [#94](https://github.com/InfluxCommunity/influxdb3-java/pull/94): Add support for named query parameters

## v0.5.1 {date="2024-02-01"}

Resync artifacts with Maven Central.

## v0.5.0 {date="2024-01-30"}

### Features

1. [#78](https://github.com/InfluxCommunity/influxdb3-java/pull/78): Default Tags can be used when writing points.

### Bug Fixes

1. [#77](https://github.com/InfluxCommunity/influxdb3-java/pull/77): Serialize InfluxDB response to `PointValues`

## v0.4.0 {date="2023-11-08"}

### Features

1. [#41](https://github.com/InfluxCommunity/influxdb3-java/pull/41): Add structured query support

## v0.3.1 {date="2023-10-17"}

### Bug Fixes

1. [#55](https://github.com/InfluxCommunity/influxdb3-java/pull/55): Iteration over more Arrow streams

## v0.3.0 {date="2023-10-02"}

### Features

1. [#40](https://github.com/InfluxCommunity/influxdb3-java/pull/40): Add client creation from connection string,
environment variables or system properties.

## v0.2.0 {date="2023-08-11"}

### Features

1. [#27](https://github.com/InfluxCommunity/influxdb3-java/pull/27): Add GZIP support
1. [#30](https://github.com/InfluxCommunity/influxdb3-java/pull/30): Add HTTP proxy and custom headers support

### Breaking Changes

1. [#31](https://github.com/InfluxCommunity/influxdb3-java/pull/31): Renamed config types and some options

## v0.1.0 {date="2023-06-08"}

- initial release of new client version
