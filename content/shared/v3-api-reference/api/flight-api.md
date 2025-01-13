<!-- Allow shortcode -->
The Flight SQL and InfluxDB "native" Flight APIs provide programmatic query interfaces
to InfluxDB 3 that use the Flight+gRPC protocol to retrieve data in [Arrow in-memory format](https://arrow.apache.org/docs/format/Columnar.html).
InfluxDB 3 client libraries and third-party Flight clients integrate with your
application code and use Flight APIs to query data stored in an InfluxDB 3 database.

InfluxDB 3 client libraries use the InfluxDB native Flight API.
Third-party Flight clients, such as [Apache Arrow Python bindings](https://arrow.apache.org/docs/python/index.html) use
the Flight SQL.
