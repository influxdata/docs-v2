
Use the [`influx query` command](/influxdb/version/reference/cli/influx/query) to query data in InfluxDB using Flux.
Pass Flux queries to the command as either a file or via stdin.

###### Run a query from a file

```bash
influx query --file /path/to/query.flux
```

###### Pass raw Flux via stdin pipe

```bash
influx query - # Return to open the pipe

data = from(bucket: "example-bucket") |> range(start: -10m) # ...
# Linux & macOS: <ctrl-d> to close the pipe and submit the command
# Windows: <enter>, then <ctrl-d>, then <enter> to close the pipe and submit the command
```

{{% note %}}
#### Remove unnecessary columns in large datasets
When using the `influx query` command to query and download large datasets,
drop columns such as `_start` and `_stop` to optimize the download file size.

```js
// ...
    |> drop(columns: ["_start", "_stop"])
```
{{% /note %}}
