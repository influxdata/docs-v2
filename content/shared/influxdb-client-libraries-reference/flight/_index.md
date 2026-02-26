Flight RPC and Flight SQL clients are language-specific drivers that interact with databases using the Arrow in-memory format and the Flight RPC protocol.
Apache Arrow Flight RPC and Flight SQL protocols define APIs for servers and clients.

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> Use [InfluxDB 3 client libraries](/influxdb3/version/reference/client-libraries/v3/) for integrating InfluxDB 3 with your application code.
> Client libraries wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/version/write-data/client-libraries/), [querying](/influxdb3/version/query-data/execute-queries/client-libraries), and processing data stored in {{% product-name %}}.

**Flight RPC clients** can use SQL or InfluxQL to query data stored in an {{% product-name %}} database.
Using InfluxDB 3's IOx-specific Flight RPC protocol, clients send a single `DoGet()` request to authenticate, query, and retrieve data.

**Flight SQL clients** use the [Flight SQL protocol](https://arrow.apache.org/docs/format/FlightSql.html) for querying an SQL database server.
They can use SQL to query data stored in an {{% product-name %}} database, but they can't use InfuxQL.

> [!Important]
> #### Flight SQL requires HTTP/2
>
> Flight SQL uses gRPC, which requires **HTTP/2**.
> If you connect to {{% product-name %}} through a proxy (such as HAProxy, nginx, or a load balancer),
> verify that your proxy is configured to support HTTP/2.
> Without HTTP/2 support, Flight SQL connections will fail.

Clients are maintained by Apache Arrow projects or third-parties.
For specifics about a Flight client, see the client's GitHub repository.

{{< children >}}
