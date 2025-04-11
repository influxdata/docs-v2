## Client libraries for InfluxDB 3

InfluxDB 3 client libraries are language-specific packages that work with
and integrate with your application to write to and query data in {{% product-name %}}.
InfluxData and the user community maintain client libraries for developers who want to take advantage of:

- Idioms for InfluxDB requests, responses, and errors.
- Common patterns in a familiar programming language.
- Faster development and less boilerplate code.

InfluxDB client libraries provide configurable batch writing of data to InfluxDB HTTP APIs.
They can be used to construct line protocol data and transform data from other formats
to line protocol.

InfluxDB 3 client libraries can query InfluxDB 3 using the Flight protocol to
execute SQL and InfluxQL queries, request
database information, and retrieve data stored in {{% product-name %}}.

Additional features may vary among client libraries.

For specifics about a client library, see the library's GitHub repository.
InfluxDB 3 client libraries are part of the [Influx Community](https://github.com/InfluxCommunity).

{{< children depth="999" description="true" >}}
