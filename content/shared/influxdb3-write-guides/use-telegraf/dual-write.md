
Use Telegraf to write your data simultaneously to multiple InfluxDB instances or clusters.
This method, known as "dual writing," is useful for backing up data
to a separate instance or for migrating from other versions of InfluxDB to
{{< product-name >}}.

The following example configures Telegraf for dual writing to {{% product-name %}} and an InfluxDB v2 OSS instance.
Specifically, it uses the following:

  - The [InfluxDB v3 output plugin](/telegraf/v1/output-plugins/influxdb_v3/)
    pointing to {{< product-name >}} and the
    [InfluxDB v2 output plugin](/telegraf/v1/output-plugins/influxdb_v2/)
    pointing to an InfluxDB v2 OSS instance.
  - Two different tokens: one for InfluxDB v2 OSS and one for {{< product-name >}}.
    Configure both tokens as environment variables and use string interpolation
    in your Telegraf configuration file to reference each environment variable.

## Sample configuration

```toml
# Include any other input, processor, or aggregator plugins that you want to
# include in your configuration.

# Send data to {{% product-name %}}
[[outputs.influxdb_v3]]
  ## The {{% product-name %}} URL
  urls = ["{{< influxdb/host-url >}}"]
  ## {{% product-name %}} authorization token
  token = "${INFLUX_TOKEN}"
  ## Destination database to write into
  database = "DATABASE_NAME"

# Send data to InfluxDB v2 OSS
[[outputs.influxdb_v2]]
  ## The InfluxDB v2 OSS URL
  urls = ["http://localhost:8086"]
  ## OSS token for authentication
  token = "${INFLUX_TOKEN_OSS}"
  ## Organization is the name of the organization you want to write to.
  organization = "ORG_NAME_OSS"
  ## Destination bucket to write to
  bucket = "BUCKET_NAME_OSS"
```

Telegraf lets you dual write data to any version of InfluxDB using the
[`influxdb` (v1)](/telegraf/v1/output-plugins/influxdb/),
[`influxdb_v2`](/telegraf/v1/output-plugins/influxdb_v2/), and
[`influxdb_v3`](/telegraf/v1/output-plugins/influxdb_v3/) output plugins.
A single Telegraf agent sends identical data sets to all target outputs.
You cannot filter data based on the output.

> [!Note]
> InfluxDB v1 does _not_ support the unsigned integer data type.
> You can only write unsigned integer field values to InfluxDB v2- and 3-based
> products.
