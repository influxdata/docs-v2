Use tools and libraries to query data stored in an {{< product-name >}} database.

InfluxDB client libraries and Flight clients can use the Flight+gRPC protocol to
query with SQL or InfluxQL and retrieve data in the
[Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
HTTP clients can use the InfluxDB v1 `/query` REST API to query with InfluxQL
and retrieve data in JSON format.

Learn how to connect to InfluxDB and query your data using the following tools:

{{< children readmore=true hr=true hlevel="h2" >}}
