---
title: Java client library for InfluxDB v3
list_title: Java
description: >
  The InfluxDB v3 `influxdb3-java` Java client library integrates with application code to write and query data stored in an InfluxDB Cloud Serverless bucket.
external_url: https://github.com/InfluxCommunity/influxdb3-java
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

The InfluxDB v3 [`influxdb3-java` Java client library](https://github.com/InfluxCommunity/influxdb3-java) integrates with Java application code
to write and query data stored in an {{% product-name %}} bucket.

The documentation for this client library is available on GitHub.

<a href="https://github.com/InfluxCommunity/influxdb3-java" target="_blank" class="btn github">InfluxDB v3 Java client library</a>

## Installation

### Maven

```xml
<dependency>
  <groupId>com.influxdb</groupId>
  <artifactId>influxdb3-java</artifactId>
  <version>RELEASE</version>
</dependency>
```

### Gradle

To use Gradle to install the client library in your project, add the following to your `build.gradle` dependencies:

```groovy
implementation group: 'com.influxdb', name: 'influxdb3-java', version: 'latest.release'
```

## Example: write and query data

The following example shows how to use `influxdb3-java` to write and query data stored in {{% product-name %}}:

```java
public class HelloInfluxDB {
  private static final String HOST_URL = "https://{{< influxdb/host >}}";
  private static final String DATABASE = "java"; // your bucket in InfluxDB Cloud Serverless
  private static final char[] API_TOKEN = "API_TOKEN".toCharArray(); // Avoid hard-coding API_TOKEN in production. It is present in the cloud portal.

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

  // Use the Point class to construct time series data.
  // Call client.writePoint to write the point as line protocol to your bucket.
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
}
```
## Run the program to write and query data

Build the project and then run the executable .jar file with this [JVM Flag](https://arrow.apache.org/docs/java/install.html). 
<br/><br/> 
**Example:**
```sh
  java --add-opens=java.base/java.nio=org.apache.arrow.memory.core,ALL-UNNAMED -jar target/PROJECT_NAME.jar
```
