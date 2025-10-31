Use the `/api/v3/write_lp` endpoint to write data to {{% product-name %}}.

This endpoint accepts the same [line protocol](/influxdb3/version/reference/line-protocol/)
syntax as previous versions of InfluxDB, and supports the following:

## Query parameters

- `?accept_partial=<BOOLEAN>`: Accept or reject partial writes (default is `true`).
- `?no_sync=<BOOLEAN>`: Control when writes are acknowledged:
  - `no_sync=true`: Acknowledges writes before WAL persistence completes.
  - `no_sync=false`: Acknowledges writes after WAL persistence completes (default).
- `?precision=<PRECISION>`: Specify the precision of the timestamp.
  By default, {{% product-name %}} uses the timestamp magnitude to auto-detect the precision (`auto`).
  To avoid any ambiguity, you can specify the precision of timestamps in your data.

  The {{< product-name >}} `/api/v3/write_lp` API endpoint supports the following timestamp precisions:

  - `auto` (automatic detection, default)
  - `nanosecond` (nanoseconds)
  - `microsecond` (microseconds)
  - `millisecond` (milliseconds)
  - `second` (seconds)

> [!Note]
> A bug currently prevents abbreviated precision values (`ns`, `n`, `us`, `u`, `ms`, `s`) from working with the `/api/v3/write_lp` endpoint. Use the full names (`nanosecond`, `microsecond`, `millisecond`, `second`) instead. Abbreviated values will be supported in a future release.

### Auto precision detection

When you use `precision=auto` (or omit the parameter), {{% product-name %}} automatically detects the timestamp precision based on the magnitude of the timestamp value:

- Timestamps < 5e9 → Second precision (multiplied by 1,000,000,000 to convert to nanoseconds)
- Timestamps < 5e12 → Millisecond precision (multiplied by 1,000,000)
- Timestamps < 5e15 → Microsecond precision (multiplied by 1,000)
- Larger timestamps → Nanosecond precision (no conversion needed)

### Precision examples

The following examples show how to write data with different timestamp precisions:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Auto (default)](#)
[Nanoseconds](#)
[Milliseconds](#)
[Seconds](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```bash
# Auto precision (default) - timestamp magnitude determines precision
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-raw "cpu,host=server1 usage=50.0 1708976567"
```

The timestamp `1708976567` is automatically detected as seconds.
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
# Explicit nanosecond precision
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=nanosecond" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-raw "cpu,host=server1 usage=50.0 1708976567000000000"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
# Millisecond precision
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=millisecond" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-raw "cpu,host=server1 usage=50.0 1708976567000"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```bash
# Second precision
curl "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=second" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-raw "cpu,host=server1 usage=50.0 1708976567"
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Request body

- Line protocol

{{<api-endpoint endpoint="/api/v3/write_lp?db=mydb&precision=nanosecond&accept_partial=true&no_sync=false" method="post" >}}

_The following example uses [cURL](https://curl.se/) to send a write request using
the {{< influxdb3/home-sample-link >}}, but you can use any HTTP client._

{{% influxdb/custom-timestamps %}}
```bash
curl -v "http://{{< influxdb/host >}}/api/v3/write_lp?db=sensors&precision=second" \
  --data-raw "home,room=Living\ Room temp=21.1,hum=35.9,co=0i 1735545600
home,room=Kitchen temp=21.0,hum=35.9,co=0i 1735545600
home,room=Living\ Room temp=21.4,hum=35.9,co=0i 1735549200
home,room=Kitchen temp=23.0,hum=36.2,co=0i 1735549200
home,room=Living\ Room temp=21.8,hum=36.0,co=0i 1735552800
home,room=Kitchen temp=22.7,hum=36.1,co=0i 1735552800
home,room=Living\ Room temp=22.2,hum=36.0,co=0i 1735556400
home,room=Kitchen temp=22.4,hum=36.0,co=0i 1735556400
home,room=Living\ Room temp=22.2,hum=35.9,co=0i 1735560000
home,room=Kitchen temp=22.5,hum=36.0,co=0i 1735560000
home,room=Living\ Room temp=22.4,hum=36.0,co=0i 1735563600
home,room=Kitchen temp=22.8,hum=36.5,co=1i 1735563600
home,room=Living\ Room temp=22.3,hum=36.1,co=0i 1735567200
home,room=Kitchen temp=22.8,hum=36.3,co=1i 1735567200
home,room=Living\ Room temp=22.3,hum=36.1,co=1i 1735570800
home,room=Kitchen temp=22.7,hum=36.2,co=3i 1735570800
home,room=Living\ Room temp=22.4,hum=36.0,co=4i 1735574400
home,room=Kitchen temp=22.4,hum=36.0,co=7i 1735574400
home,room=Living\ Room temp=22.6,hum=35.9,co=5i 1735578000
home,room=Kitchen temp=22.7,hum=36.0,co=9i 1735578000
home,room=Living\ Room temp=22.8,hum=36.2,co=9i 1735581600
home,room=Kitchen temp=23.3,hum=36.9,co=18i 1735581600
home,room=Living\ Room temp=22.5,hum=36.3,co=14i 1735585200
home,room=Kitchen temp=23.1,hum=36.6,co=22i 1735585200
home,room=Living\ Room temp=22.2,hum=36.4,co=17i 1735588800
home,room=Kitchen temp=22.7,hum=36.5,co=26i 1735588800"
```
{{% /influxdb/custom-timestamps %}}

- [Partial writes](#partial-writes)
  - [Accept partial writes](#accept-partial-writes)
  - [Do not accept partial writes](#do-not-accept-partial-writes)
- [Write responses](#write-responses)
  - [Use no_sync for immediate write responses](#use-no_sync-for-immediate-write-responses)

> [!Note]
> #### InfluxDB client libraries
>
> InfluxData provides supported InfluxDB 3 client libraries that you can
> integrate with your code to construct data as time series points, and then
> write them as line protocol to an {{% product-name %}} database.
> For more information, see how to [use InfluxDB client libraries to write data](/influxdb3/version/write-data/client-libraries/).

## Partial writes

The `/api/v3/write_lp` endpoint lets you accept or reject partial writes using
the `accept_partial` parameter. This parameter changes the behavior of the API
when the write request contains invalid line protocol or schema conflicts.

For example, the following line protocol contains two points, each using a
different datatype for the `temp` field, which causes a schema conflict:

```
home,room=Sunroom temp=96 1735545600
home,room=Sunroom temp="hi" 1735549200
```

### Accept partial writes

With `accept_partial=true` (default), InfluxDB:

- Accepts and writes line `1`
- Rejects line `2`
- Returns a `400 Bad Request` status code and the following response body:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "partial write of line protocol occurred",
  "data": [
    {
      "original_line": "home,room=Sunroom temp=hi 1735549200",
      "line_number": 2,
      "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
    }
  ]
}
```

### Do not accept partial writes

With `accept_partial=false`, InfluxDB:

- Rejects _all_ points in the batch
- Returns a `400 Bad Request` status code and the following response body:

```
< HTTP/1.1 400 Bad Request
...
{
  "error": "parsing failed for write_lp endpoint",
  "data": {
    "original_line": "home,room=Sunroom temp=hi 1735549200",
    "line_number": 2,
    "error_message": "invalid column type for column 'temp', expected iox::column_type::field::float, got iox::column_type::field::string"
  }
}
```

_For more information about the ingest path and data flow, see
[Data durability](/influxdb3/version/reference/internals/durability/)._

## Write responses

By default, {{% product-name %}} acknowledges writes after flushing the WAL file
to the Object store (occurring every second).
For high write throughput, you can send multiple concurrent write requests.

### Use no_sync for immediate write responses

To reduce the latency of writes, use the `no_sync` write option, which
acknowledges writes _before_ WAL persistence completes.
When `no_sync=true`, InfluxDB validates the data, writes the data to the WAL,
and then immediately responds to the client, without waiting for persistence to
the Object store.

> [!Tip]
> Using `no_sync=true` is best when prioritizing high-throughput writes over
> absolute durability. 

- Default behavior (`no_sync=false`): Waits for data to be written to the Object
  store before acknowledging the write. Reduces the risk of data loss, but
  increases the latency of the response.
- With `no_sync=true`: Reduces write latency, but increases the risk of data
  loss in case of a crash before WAL persistence. 

The following example immediately returns a response without waiting for WAL
persistence:

```bash
curl "http://localhost:8181/api/v3/write_lp?db=sensors&no_sync=true" \
  --data-raw "home,room=Sunroom temp=96"
```
