[Apache Arrow Flight SQL for Java](https://arrow.apache.org/docs/java/reference/org/apache/arrow/flight/sql/package-summary.html) integrates with Java applications to query and retrieve data from Flight database servers using RPC and SQL.

> [!Note]
> #### Use InfluxDB 3 client libraries
> 
> Use the [`influxdb3-java` Java client library](/influxdb3/version/reference/client-libraries/v3/java/) for integrating InfluxDB 3 with your Java application code.
> 
> [InfluxDB 3 client libraries](/influxdb3/version/reference/client-libraries/v3/) wrap Apache Arrow Flight clients
> and provide convenient methods for [writing](/influxdb3/version/write-data/api-client-libraries/), [querying](/influxdb3/version/query-data/execute-queries/), and processing data stored in {{% product-name %}}.
> Client libraries can query using SQL or InfluxQL.

<!-- TOC -->

- [Get started using the Java Flight SQL client to query InfluxDB](#get-started-using-the-java-flight-sql-client-to-query-influxdb)
  - [Set up InfluxDB](#set-up-influxdb)
  - [Install prerequisites](#install-prerequisites)
  - [Create the FlightQuery class](#create-the-flightquery-class)
  - [Create a query client](#create-a-query-client)
  - [Execute a query](#execute-a-query)
  - [Retrieve and process Arrow data](#retrieve-and-process-arrow-data)
  - [Run the application](#run-the-application)
- [Troubleshoot Arrow Flight requests](#troubleshoot-arrow-flight-requests)

## Get started using the Java Flight SQL client to query InfluxDB

Write a Java class for a Flight SQL client that connects to {{% product-name %}},
executes an SQL query, and retrieves data stored in an {{% product-name %}} database.

The example uses the [Apache Arrow Java implementation (`org.apache.arrow`)](https://arrow.apache.org/docs/java/index.html) for interacting with Flight database servers like InfluxDB 3.

- **`org.apache.arrow`**: Provides classes and methods for integrating Java applications with Apache Arrow data and protocols.
- **`org.apache.arrow.flight.sql`**: Provides classes and methods for
interacting with Flight database servers using Arrow Flight RPC and Flight SQL.

1. [Set up InfluxDB](#set-up-influxdb)
2. [Install prerequisites](#install-prerequisites)
3. [Create the FlightQuery class](#create-the-flightquery-class)
4. [Create a query client](#create-a-query-client)
5. [Execute a query](#execute-a-query)
6. [Retrieve and process Arrow data](#retrieve-and-process-arrow-data)

To clone or download the example application that you can run with Docker, see the [InfluxCommunity/ArrowFlightClient_Query_Examples repository](https://github.com/InfluxCommunity/ArrowFlightClient_Query_Examples) on GitHub.

### Set up InfluxDB

To configure the application for querying {{% product-name %}}, you'll need the following InfluxDB resources:

- {{% product-name %}} **database**
- {{% product-name %}} **database token** with _read_ permission to the database

If you don't already have a database token and a database, see how to [set up InfluxDB](/influxdb3/version/get-started/setup/).
If you don't already have data to query, see how to
[write data](/influxdb3/version/get-started/write/) to a database.

### Install prerequisites

The following uses Docker and Maven to build and run the Java application and avoid platform-specific dependency problems.

The example `Dockerfile` installs compatible versions of Maven
and Java JDK in the Docker container, and then runs the Maven commands to download dependencies and compile the application.

Follow the instructions to download and install Docker for your system:

- **macOS**: [Install Docker for macOS](https://docs.docker.com/desktop/install/mac-install/)
- **Linux**: [Install Docker for Linux](https://docs.docker.com/desktop/install/linux-install/)

{{< expand-wrapper >}}
{{% expand "View the Dockerfile" %}}

```dockerfile
# Use the official Maven image as the base image
FROM maven:3.8.3-openjdk-11 AS build

# Set the working directory
WORKDIR /app

# Copy the pom.xml file into the container
COPY pom.xml .

# Download and cache dependencies
RUN mvn dependency:go-offline

# Copy the rest of the source code into the container
COPY src/ ./src/

# Compile the source code and copy dependencies
RUN mvn compile dependency:copy-dependencies

# Use the official OpenJDK image as the runtime base image
FROM openjdk:11-jre-slim

# Set the working directory
WORKDIR /app

# Copy the compiled classes and dependencies from the build stage
COPY --from=build /app/target/classes ./classes
COPY --from=build /app/target/dependency ./dependency

# Set ARGs for --build-arg options passed in the build command
ARG DATABASE_FIELD
ARG DATABASE_NAME
ARG HOST
ARG TOKEN

# Set run-time ENVs from ARGs
ENV DATABASE_FIELD=${DATABASE_FIELD}
ENV DATABASE_NAME=${DATABASE_NAME}
ENV HOST=${HOST}
ENV TOKEN=${TOKEN}

# Set the entrypoint to run your Java application
ENTRYPOINT ["java", "-cp", "classes:dependency/*", "com.influxdb.examples.FlightExamples"]
```
{{% /expand %}}

{{% expand "View the Maven pom.xml" %}}

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.influxdb</groupId>
  <artifactId>examples</artifactId>
  <version>1.0-SNAPSHOT</version>

  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.2.0</version>
        <configuration>
          <archive>
            <manifest>
              <addClasspath>true</addClasspath>
              <classpathPrefix>lib/</classpathPrefix>
              <mainClass>com.influxdb.examples.FlightExamples</mainClass>
            </manifest>
          </archive>
        </configuration>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-help-plugin</artifactId>
        <version>3.2.0</version>
      </plugin>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>3.4.1</version>
        <executions>
          <execution>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <shadedArtifactAttached>true</shadedArtifactAttached>
            </configuration>
          </execution>
        </executions>
        <configuration>
          <minimizeJar>false</minimizeJar>
          <filters>
            <filter>
              <artifact>*:*</artifact>
              <excludes>
                <exclude>META-INF/*.SF</exclude>
                <exclude>META-INF/*.DSA</exclude>
                <exclude>META-INF/*.RSA</exclude>
              </excludes>
            </filter>
          </filters>
        </configuration>
      </plugin>
    </plugins>
  </build>

  <properties>
    <maven.compiler.source>1.8</maven.compiler.source>
    <maven.compiler.target>1.8</maven.compiler.target>
  </properties>

  <dependencies>
    <dependency>
      <groupId>org.apache.arrow</groupId>
      <artifactId>flight-sql</artifactId>
      <version>11.0.0</version>
    </dependency>
    <dependency>
      <groupId>io.netty</groupId>
      <artifactId>netty-all</artifactId>
      <version>4.1.74.Final</version>
    </dependency>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-simple</artifactId>
      <version>1.7.30</version>
    </dependency>
  </dependencies>

</project>
```
{{% /expand %}}
{{< /expand-wrapper >}}

### Create the FlightQuery class

{{< expand-wrapper >}}
{{% expand "View FlightQuery.java" %}}

```java
package com.influxdb.examples;

import org.apache.arrow.flight.auth2.BearerCredentialWriter;
import org.apache.arrow.flight.CallHeaders;
import org.apache.arrow.flight.CallStatus;
import org.apache.arrow.flight.grpc.CredentialCallOption;
import org.apache.arrow.flight.Location;
import org.apache.arrow.flight.FlightClient;
import org.apache.arrow.flight.FlightClientMiddleware;
import org.apache.arrow.flight.FlightInfo;
import org.apache.arrow.flight.FlightStream;
import org.apache.arrow.flight.sql.FlightSqlClient;
import org.apache.arrow.flight.Ticket;
import org.apache.arrow.memory.BufferAllocator;
import org.apache.arrow.memory.RootAllocator;
import org.apache.arrow.vector.VectorSchemaRoot;

public class FlightQuery {

    /* Get server credentials from environment variables */
    public static final String DATABASE_NAME = System.getenv("DATABASE_NAME");
    public static final String HOST = System.getenv("HOST");
    public static final String TOKEN = System.getenv("TOKEN");

    public static void main() {

        System.out.println("Query InfluxDB with the Java Flight SQL Client");

        // Create an interceptor that injects header metadata (database name) in every request.
        FlightClientMiddleware.Factory f = info -> new FlightClientMiddleware() {
            @Override
            public void onBeforeSendingHeaders(CallHeaders outgoingHeaders) {
                outgoingHeaders.insert("database", DATABASE_NAME);
            }

            @Override
            public void onHeadersReceived(CallHeaders incomingHeaders) {

            }

            @Override
            public void onCallCompleted(CallStatus status) {

            }
        };

        // Create a gRPC+TLS channel URI with HOST and port 443.
        Location location = Location.forGrpcTls(HOST, 443);

        // Set the allowed memory.
        BufferAllocator allocator = new RootAllocator(Long.MAX_VALUE);

        // Create a client with the allocator and gRPC channel.
        FlightClient client = FlightClient.builder(allocator, location)
                .intercept(f)
                .build();
        System.out.println("client" + client);

        FlightSqlClient sqlClient = new FlightSqlClient(client);
        System.out.println("sqlClient: " + sqlClient);

        // Define the SQL query to execute.
        String query = "SELECT * FROM home";
        
        /*  Construct a bearer credential using TOKEN.
            Construct a credentials option using the bearer credential.
        */
        CredentialCallOption auth = new CredentialCallOption(new BearerCredentialWriter(TOKEN));

        /*  Execute the query.
            If successful, execute returns a FlightInfo object that contains metadata
            and an endpoints list.
            Each endpoint contains the following:
                - A list of addresses where you can retrieve the data.
                - A `ticket` value that identifies the data to retrieve.
        */
        FlightInfo flightInfo = sqlClient.execute(query, auth);

        // Extract the Flight ticket from the response.
        Ticket ticket = flightInfo.getEndpoints().get(0).getTicket();
        
        // Pass the ticket to request the Arrow stream data from the endpoint.
        final FlightStream stream = sqlClient.getStream(ticket, auth);

        // Process all the Arrow stream data.
        while (stream.next()) {
            try {
                // Get the current vector data from the stream.
                final VectorSchemaRoot root = stream.getRoot();
                System.out.println(root.contentToTSVString());
            } catch (Exception e) {
                // Handle exceptions.
                System.out.println("Error executing FlightSqlClient: " + e.getMessage());
            }
        }
        try {
            // Close the stream and release resources.
            stream.close();
        } catch (Exception e) {
            // Handle exceptions.
            System.out.println("Error closing stream: " + e.getMessage());
        }

        try {
            // Close the client
            sqlClient.close();
        } catch (Exception e) {
            // Handle exceptions.
            System.out.println("Error closing client: " + e.getMessage());
        }
    }
}
```

{{% /expand %}}
{{< /expand-wrapper >}}

1. In your `<PROJECT_ROOT>/src/main/java` directory, create the `com/influxdb/examples` subdirectories for the `com.influxdb.examples` package.
2. In the `examples` directory from the preceding step, create the `FlightQuery.java` class file.
    You should have the following directory structure:
    <!-- Can't make filesystem-diagram shortcode indent properly -->
    ```
    PROJECT_ROOT
    └──src
       └──main
          └──java
             └──com
                └──influxdb
                   └──examples
                      └──FlightQuery.java
    ```
        
3. In `FlightQuery.java`:

    1. Add the package name:
        
        ```java
        package com.influxdb.examples;
        ```
    
    2. Add `import` statements for the following packages. You'll use classes and methods
       from these packages in the remaining steps:
    
        - `org.apache.arrow.flight.auth2.BearerCredentialWriter`
        - `org.apache.arrow.flight.CallHeaders`
        - `org.apache.arrow.flight.CallStatus`
        - `org.apache.arrow.flight.grpc.CredentialCallOption`
        - `org.apache.arrow.flight.Location`
        - `org.apache.arrow.flight.FlightClient`
        - `org.apache.arrow.flight.FlightClientMiddleware`
        - `org.apache.arrow.flight.FlightInfo`
        - `org.apache.arrow.flight.FlightStream`
        - `org.apache.arrow.flight.sql.FlightSqlClient`
        - `org.apache.arrow.flight.Ticket`
        - `org.apache.arrow.memory.BufferAllocator`
        - `org.apache.arrow.memory.RootAllocator`
        - `org.apache.arrow.vector.VectorSchemaRoot`

    3. Create a `FlightQuery` class.
    4. In the `FlightQuery` class:

        1. Define constants for server credentials.
            - `DATABASE_NAME`
            - `HOST`
            - `TOKEN`
            
            _The example `Dockerfile` defines environment variables for 
            these credentials._

        2. Create a `main()` method.
        
### Create a query client

In the `FlightQuery.main()` method, do the following to create an SQL client that can connect to `HOST` and `DATABASE_NAME`:

1. Construct a _gRPC+TLS_ channel URI with `HOST` and port `443` for communicating with a [gRPC server over TLS](https://grpc.io/docs/guides/auth/#with-server-authentication-ssltls-4).
2. Instantiate `FlightClientMiddleware` and define an event callback
    that inserts the following Flight request metadata header property:

    ```json
    "database": "DATABASE_NAME"
    ```

3. Instantiate a `BufferAllocator` that sets the memory allowed for the client.
4. Create a `FlightClient` with the allocator and gRPC channel.
5. Instantiate a `FlightSqlClient` that wraps the `FlightClient` instance.
    
### Execute a query

In the `FlightQuery.main` method:

1. Instantiate a `CredentialCallOption` with `TOKEN` as a _bearer_ credential.
    The result is a credential object that you'll pass in each request to the server.
2. Define a string that contains the SQL query to execute--for example:

    ```java
    String query = "SELECT * FROM home";
    ```

3. Call the `FlightSqlClient.execute` method with the SQL query and the `CredentialCallOption`.
4. If successful, the `FlightSqlClient.execute` method responds with a `FlightInfo` object that contains metadata and an `endpoints: [...]` list.
   Each endpoint contains the following:

    - A list of addresses where you can retrieve the data.
    - A `ticket` value that identifies the data to retrieve.
5. Extract the ticket from the response.

### Retrieve and process Arrow data

In the `FlightQuery.main()` method, do the following to retrieve the data stream described in the `FlightInfo` response:

1. Call the `FlightSqlClient.getStream` method with the _ticket_ and the `CredentialCallOption` to fetch the [Arrow stream](https://arrow.apache.org/docs/format/CStreamInterface.html).
2. Call the `FlightStream.getRoot` method to get the current vector data from the stream.
3. Process the data and handle exceptions. The example converts the vector data into tab-separated values and prints the result to `System.out`.

    For more examples using Java to work with Arrow data, see the [Apache Arrow Java Cookbook](https://arrow.apache.org/cookbook/java/).
    
4. Finally, close the stream and client.

### Run the application

Follow these steps to build and run the application using Docker:

1. Copy the `Dockerfile` and `pom.xml` to your project root directory.
2. Open a terminal in your project root directory.
3. In your terminal, run the `docker build` command and pass `--build-arg` flags for the server credentials:
   
    - **`DATABASE_NAME`**: your [{{% product-name %}} database](/influxdb3/version/admin/databases/)
    - **`HOST`**: your {{% product-name %}} hostname (URL without the "https://")
    - **`TOKEN`**: your [{{% product-name %}} database token](/influxdb3/version/get-started/setup/) with _read_ permission to the database

    <!--pytest.mark.skip-->

    ```sh
    docker build \
    --build-arg DATABASE_NAME=INFLUX_DATABASE \
    --build-arg HOST={{% influxdb/host %}}\
    --build-arg TOKEN=INFLUX_TOKEN \
    -t javaflight .
    ```

    The command builds a Docker image named `javaflight`.

4. To run the application in a new Docker container, enter the following command:
    
    <!--pytest.mark.skip-->

    ```sh
    docker run javaflight
    ```

    The output is the query data in TSV-format.

## Troubleshoot Arrow Flight requests

For the list of Arrow Flight error response codes, see the [Arrow Flight RPC documentation](https://arrow.apache.org/docs/format/Flight.html#error-handling).

