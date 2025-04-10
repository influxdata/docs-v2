---
title: Java Flight SQL package
description: The Java Flight SQL client integrates with Java applications to query and retrieve data from Flight database servers using RPC and SQL.
menu:
  influxdb3_enterprise:
    name: Java Flight SQL
    parent: Arrow Flight clients
    identifier: java-flightsql-client
influxdb3/enterprise/tags: [Flight client, Java, gRPC, SQL, Flight SQL]
weight: 201
related:
  - /influxdb3/enterprise/reference/client-libraries/v3/java/
aliases:
  - /influxdb3/enterprise/reference/client-libraries/flight-sql/java-flightsql/
list_code_example: |
    ```java
    public class Query {
        public static void main(String[] args) {       
            String query = "SELECT * FROM home";
            Location location = Location.forGrpcTls(HOST, 443);

            CredentialCallOption auth = new CredentialCallOption(new BearerCredentialWriter(TOKEN));
            BufferAllocator allocator = new RootAllocator(Long.MAX_VALUE);

            FlightClientMiddleware.Factory f = info -> new FlightClientMiddleware() {
                @Override
                public void onBeforeSendingHeaders(CallHeaders outgoingHeaders) {
                    outgoingHeaders.insert(DATABASE_FIELD, DATABASE_NAME);
                }
            };

            FlightClient client = FlightClient.builder(allocator, location)
                    .intercept(f)
                    .build();
            FlightSqlClient sqlClient = new FlightSqlClient(client);
            FlightInfo flightInfo = sqlClient.execute(query, auth);
        }
    }
    ```
source: /shared/influxdb-client-libraries-reference/flight/java-flightsql.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb-client-libraries-reference/flight/java-flightsql.md
-->