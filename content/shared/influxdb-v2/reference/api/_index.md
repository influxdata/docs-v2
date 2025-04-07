
The InfluxDB HTTP API provides a programmatic interface for interactions such as writing and querying data, and managing resources in {{% product-name %}}.

Access the InfluxDB HTTP API using the `/api/v2/` endpoint or InfluxDB v1 endpoints
for {{% product-name %}}

## InfluxDB v2 API documentation

<a class="btn" href="/influxdb/version/api/">InfluxDB {{< current-version >}} API</a>

{{% show-in "v2" %}}

#### View InfluxDB API documentation locally

InfluxDB API documentation is built into the `influxd` service and represents
the API specific to your version of InfluxDB.
To view the API documentation locally, [start InfluxDB](/influxdb/version/get-started/#start-influxdb)
and visit the `/docs` endpoint in a browser ([localhost:8086/docs](http://localhost:8086/docs)).

{{% /show-in %}}

## InfluxDB v1 Compatibility API reference documentation

<a class="btn" href="/influxdb/version/api/v1-compatibility/">InfluxDB v1 API for {{% product-name %}}</a>

The InfluxDB HTTP API includes InfluxDB v1 compatibility endpoints
that work with InfluxDB 1.x client libraries and third-party integrations like
[Grafana](https://grafana.com) and others.
