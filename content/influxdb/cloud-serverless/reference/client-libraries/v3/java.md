---
title: Java client library for InfluxDB v3
list_title: Java
description: >
  The InfluxDB v3 `influxdb3-java` Java client library integrates with application code to write and query data stored in an InfluxDB Cloud Serverless bucket.
menu:
  influxdb_cloud_serverless:
    name: Java
    parent: v3 client libraries
    identifier: influxdb3-java
influxdb/cloud-serverless/tags: [Flight client, Java, gRPC, SQL, Flight SQL, client libraries]
weight: 201
aliases:
  - /cloud-serverless/query-data/sql/execute-queries/java/
---

The InfluxDB v3 [`influxdb3-java` Java client library](https://github.com/InfluxCommunity/influxdb3-java) integrates
with Java application code to write and query data stored in an {{% product-name %}}
bucket.

InfluxDB client libraries provide configurable batch writing of data to {{% product-name %}}.
Client libraries can be used to construct line protocol data, transform data from other formats
to line protocol, and batch write line protocol data to InfluxDB HTTP APIs.

InfluxDB v3 client libraries can query {{% product-name %}} using SQL or InfluxQL.
The `influxdb3-java` Java client library wraps the Apache Arrow `org.apache.arrow.flight.FlightClient`
in a convenient InfluxDB v3 interface for executing SQL and InfluxQL queries, requesting
server metadata, and retrieving data from {{% product-name %}} using the Flight protocol with gRPC.

- [Installation](#installation)
  - [Using Maven](#using-maven)
  - [Using Gradle](#using-gradle)
- [Importing the client](#importing-the-client)
- [API reference](#api-reference)
- [Classes](#classes)
- [InfluxDBClient interface](#influxdbclient-interface)
  - [Initialize with credential parameters](#initialize-with-credential-parameters)
  - [InfluxDBClient instance methods](#influxdbclient-instance-methods)
  - [InfluxDBClient.writePoint](#influxdbclientwritepoint)
  - [InfluxDBClient.query](#influxdbclientquery)


#### Example: write and query data

The following example shows how to use `influxdb3-java` to write and query data stored in {{% product-name %}}.

```java
package com.influxdata.demo;

import com.influxdb.v3.client.InfluxDBClient;
import com.influxdb.v3.client.Point;
import com.influxdb.v3.client.query.QueryOptions;
import com.influxdb.v3.client.query.QueryType;

import java.time.Instant;
import java.util.stream.Stream;

public class HelloInfluxDB {
  private static final String HOST_URL = "https://{{< influxdb/host >}}"; // your Cloud Serverless region URL
  private static final String DATABASE = "java"; // your Cloud Serverless bucket
  private static final char[] API_TOKEN = System.getenv("API_TOKEN"); // your local environment variable that stores your API Token

  // Create a client instance that writes and queries data in your bucket.
  public static void main(String[] args) {
    // Instantiate the client with your InfluxDB credentials
    try (InfluxDBClient client = InfluxDBClient.getInstance(HOST_URL, API_TOKEN, DATABASE)) {
      writeData(client);
      queryData(client);
    }
    catch (Exception e) {
      System.err.println("An error occurred while connecting to InfluxDB Cloud Serverless!");
      e.printStackTrace();
    }
  }

  // Use the Point class to construct time series data.
  private static void writeData(InfluxDBClient client) {
    Point point = Point.measurement("temperature")
                       .setTag("location", "London")
                       .setField("value", 30.01)
                       .setTimestamp(Instant.now().minusSeconds(10));
    try {
      client.writePoint(point);
      System.out.println("Data is written to the bucket.");
    }
    catch (Exception e) {
      System.err.println("Failed to write data to the bucket.");
      e.printStackTrace();
    }
  }

  // Use SQL to query the most recent 10 measurements
  private static void queryData(InfluxDBClient client) {
    System.out.printf("--------------------------------------------------------%n");
    System.out.printf("| %-8s | %-8s | %-30s |%n", "location", "value", "time");
    System.out.printf("--------------------------------------------------------%n");

    String sql = "select time,location,value from temperature order by time desc limit 10";
    try (Stream<Object[]> stream = client.query(sql)) {
      stream.forEach(row -> System.out.printf("| %-8s | %-8s | %-30s |%n", row[1], row[2], row[0]));
    }
    catch (Exception e) {
      System.err.println("Failed to query data from the bucket.");
      e.printStackTrace();
    }
  }
}
```

{{% cite %}}Source: [suyashcjoshi/SimpleJavaInfluxDB](https://github.com/suyashcjoshi/SimpleJavaInfluxDB/) on GitHub{{% /cite %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: your {{% product-name %}} [bucket](/influxdb/cloud-serverless/admin/buckets/)
- {{% code-placeholder-key %}}`API_TOKEN`{{% /code-placeholder-key %}}: a local environment variable that stores your [token](/influxdb/cloud-serverless/admin/tokens/)--the token must have read and write permission to the specified bucket.

### Run the example to write and query data

1. Build an executable JAR for the project--for example, using Maven:
   
   <!--pytest.mark.skip-->

   ```bash
   mvn package
   ```
   
2. In your terminal, run the `java` command to write and query data in your bucket:

   <!--pytest.mark.skip-->

   ```bash
   java \
   --add-opens=java.base/java.nio=org.apache.arrow.memory.core,ALL-UNNAMED \
   -jar target/PROJECT_NAME.jar
   ```

   Include the following in your command:

   - [`--add-opens=java.base/java.nio=org.apache.arrow.memory.core,ALL-UNNAMED`](https://arrow.apache.org/docs/java/install.html#id3): with Java version 9 or later and Apache Arrow version 16 or later, exposes JDK internals for Arrow.
   For more options, see the [Apache Arrow Java install documentation](https://arrow.apache.org/docs/java/install.html).
   - `-jar target/PROJECT_NAME.jar`: your `.jar` file to run.

The output is the newly written data from your {{< product-name >}} bucket.

## Installation

Include `com.influxdb.influxdb3-java` in your project dependencies.

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Maven pom.xml](#)
[Gradle dependency script](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```xml
<dependency>
  <groupId>com.influxdb</groupId>
  <artifactId>influxdb3-java</artifactId>
  <version>RELEASE</version>
</dependency>
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
<!--pytest.mark.skip-->
```groovy
dependencies {

   implementation group: 'com.influxdb', name: 'influxdb3-java', version: 'latest.release'

}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

## Importing the client

The `influxdb3-java` client library package provides
`com.influxdb.v3.client` classes for constructing, writing, and querying data
stored in {{< product-name >}}.

## API reference

- [Interface InfluxDBClient](#interface-influxdbclient)
  - [Initialize with credential parameters](#initialize-with-credential-parameters)
  - [InfluxDBClient instance methods](#influxdbclient-instance-methods)
  - [InfluxDBClient.writePoint](#influxdbclientwritepoint)
  - [InfluxDBClient.query](#influxdbclientquery)


## InfluxDBClient interface

`InfluxDBClient` provides an interface for interacting with InfluxDB APIs for writing and querying data.

The `InfluxDBClient.getInstance` constructor initializes and returns a client instance with the following:

- A _write client_ configured for writing to the database.
- An Arrow _Flight client_ configured for querying the database.

To initialize a client, call `getInstance` and pass your credentials as one of
the following types:

- [parameters](#initialize-with-credential-parameters)
- a [`ClientConfig`](https://github.com/InfluxCommunity/influxdb3-java/blob/main/src/main/java/com/influxdb/v3/client/config/ClientConfig.java)
- a database connection string--for example:
  
  ```java
  "https://{{< influxdb/host >}}"
  + "?token=API_TOKEN&amp;database=DATABASE_NAME"
  ```

### Initialize with credential parameters

```java
static InfluxDBClient getInstance(@Nonnull final String host,
                           @Nullable final char[] token,
                           @Nullable final String database)
```

- **`host`** (string): The host URL of the InfluxDB instance.
- **`database`** (string): The bucket to use for writing and querying.
- **`token`** (string): An API token with read/write permissions.

#### Example: initialize with credential parameters

```java
package com.influxdata.demo;

import com.influxdb.v3.client.InfluxDBClient;
import com.influxdb.v3.client.Point;
import com.influxdb.v3.client.query.QueryOptions;
import com.influxdb.v3.client.query.QueryType;

import java.time.Instant;
import java.util.stream.Stream;

public class HelloInfluxDB {
  private static final String HOST_URL = "https://{{< influxdb/host >}}";
  private static final String DATABASE = "DATABASE_NAME"; // your Cloud Serverless bucket
  private static final char[] API_TOKEN = System.getenv("API_TOKEN"); // an environment variable for your Cloud Serverless API Token
  // Create a client instance, and then write and query data in InfluxDB Cloud Serverless.
  public static void main(String[] args) {
    try (InfluxDBClient client = InfluxDBClient.getInstance(HOST_URL, API_TOKEN, DATABASE)) {
      writeData(client);
      queryData(client);
    }
    catch (Exception e) {
      System.err.println("An error occurred while connecting with the serverless InfluxDB!");
      e.printStackTrace();
    }
  }
}
```

#### Default tags

- _Optional_: To include default
  [tags](/influxdb/cloud-serverless/reference/glossary/#tag) in all written data,
  pass a `Map` of tag keys and values.

  ```java
  InfluxDBClient getInstance(@Nonnull final String host,
                                        @Nullable final char[] token,
                                        @Nullable final String database,
                                        @Nullable Map<String, String> defaultTags)
  ```

### InfluxDBClient instance methods

#### InfluxDBClient.writePoint

1. Use the `com.influxdb.v3.client.Point` class to create time series data.
2. Call the `client.writePoint()` method to write points as line protocol in your
   bucket.

```java
  // Use the Point class to construct time series data.
  // Call client.writePoint to write the point in your bucket.
  private static void writeData(InfluxDBClient client) {
    Point point = Point.measurement("temperature")
                       .setTag("location", "London")
                       .setField("value", 30.01)
                       .setTimestamp(Instant.now().minusSeconds(10));
    try {
      client.writePoint(point);
      System.out.println("Data written to the bucket.");
    }
    catch (Exception e) {
      System.err.println("Failed to write data to the bucket.");
      e.printStackTrace();
    }
  }
```

#### InfluxDBClient.query

To query data and process the results:

1. Call `client.query()` and provide your SQL query as a string.
2. Use the result stream's built-in iterator to process row data. 

```java
  // Query the latest 10 measurements using SQL
  private static void queryData(InfluxDBClient client) {
    System.out.printf("--------------------------------------------------------%n");
    System.out.printf("| %-8s | %-8s | %-30s |%n", "location", "value", "time");
    System.out.printf("--------------------------------------------------------%n");

    String sql = "select time,location,value from temperature order by time desc limit 10";
    try (Stream<Object[]> stream = client.query(sql)) {
      stream.forEach(row -> System.out.printf("| %-8s | %-8s | %-30s |%n", row[1], row[2], row[0]));
    }
    catch (Exception e) {
      System.err.println("Failed to query data from the bucket.");
      e.printStackTrace();
    }
  }
```

<a class="btn" href="https://github.com/InfluxCommunity/influxdb3-java/" target="\_blank">View the InfluxDB v3 Java client library</a>