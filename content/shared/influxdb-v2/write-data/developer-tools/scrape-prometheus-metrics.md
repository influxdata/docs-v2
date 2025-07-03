
Use [Telegraf](/telegraf/v1/){{% show-in "v2" %}}, [InfluxDB scrapers](/influxdb/version/write-data/no-code/scrape-data/),{{% /show-in %}}
or the [`prometheus.scrape` Flux function](/flux/v0/stdlib/experimental/prometheus/scrape/)
to scrape Prometheus-formatted metrics from an HTTP-accessible endpoint and store them in InfluxDB.

{{% show-in "v2" %}}

- [Use Telegraf](#use-telegraf)
- [Use an InfluxDB scraper](#use-an-influxdb-scraper)
- [Use prometheus.scrape()](#use-prometheusscrape)

{{% /show-in %}}
{{% show-in "cloud,cloud-serverless" %}}

- [Use Telegraf](#use-telegraf)
- [Use prometheus.scrape()](#use-prometheusscrape)

{{% /show-in %}}

## Use Telegraf
To use Telegraf to scrape Prometheus-formatted metrics from an HTTP-accessible
endpoint and write them to InfluxDB{{% show-in "cloud,cloud-serverless" %}} Cloud{{% /show-in %}}, follow these steps:

1. Add the [Prometheus input plugin](/telegraf/v1/plugins/#input-prometheus) to your Telegraf configuration file.
    1. Set the `urls` to scrape metrics from.
    2. Set the `metric_version` configuration option to specify which
      [metric parsing version](/influxdb/version/reference/prometheus-metrics/) to use
      _(version `2` is recommended)_.
2. Add the [InfluxDB v2 output plugin](/telegraf/v1/plugins/#output-influxdb_v2)
   to your Telegraf configuration file and configure it to write to
   InfluxDB{{% show-in "cloud,cloud-serverless" %}} Cloud{{% /show-in %}}.
  
##### Example telegraf.conf
```toml
# ...

## Collect Prometheus formatted metrics
[[inputs.prometheus]]
  urls = ["http://example.com/metrics"]
  metric_version = 2

## Write Prometheus formatted metrics to InfluxDB
[[outputs.influxdb_v2]]
  urls = ["http://localhost:8086"]
  token = "$INFLUX_TOKEN"
  organization = "example-org"
  bucket = "example-bucket"

# ...
```

{{% show-in "v2" %}}

## Use an InfluxDB scraper
InfluxDB scrapers automatically scrape Prometheus-formatted metrics from an 
HTTP-accessible endpoint at a regular interval.
For information about setting up an InfluxDB scraper, see
[Scrape data using InfluxDB scrapers](/influxdb/version/write-data/no-code/scrape-data/).

{{% /show-in %}}

## Use prometheus.scrape()
To use the [`prometheus.scrape()` Flux function](/flux/v0/stdlib/experimental/prometheus/scrape/)
to scrape Prometheus-formatted metrics from an HTTP-accessible endpoint and write
them to InfluxDB{{% show-in "cloud,cloud-serverless" %}} Cloud{{% /show-in %}}, do the following in your Flux script:

1. Import the [`experimental/prometheus` package](/flux/v0/stdlib/experimental/prometheus/).
2. Use `prometheus.scrape()` and provide the URL to scrape metrics from.
3. Use [`to()`](/flux/v0/stdlib/influxdata/influxdb/to/) and specify the  InfluxDB{{% show-in "cloud,cloud-serverless" %}} Cloud{{% /show-in %}} bucket to write
  the scraped metrics to.

##### Example Flux script
```js
import "experimental/prometheus"

prometheus.scrape(url: "http://example.com/metrics")
    |> to(bucket: "example-bucket")
```

4. (Optional) To scrape Prometheus metrics at regular intervals using Flux, add your Flux
scraping script as an [InfluxDB task](/influxdb/version/process-data/).

_For information about scraping Prometheus-formatted metrics with `prometheus.scrape()`,
see [Scrape Prometheus metrics with Flux](/flux/v0/prometheus/scrape-prometheus/)._
