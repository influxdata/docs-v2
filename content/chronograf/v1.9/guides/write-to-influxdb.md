---
title: Write data to InfluxDB
description:
  Use Chronograf to write data to InfluxDB. Upload line protocol into the UI, use the
  InfluxQL `INTO` clause, or use the Flux `to()` function to write data back to InfluxDB.
menu:
  chronograf_1_9:
    name: Write data to InfluxDB
    parent: Guides
weight: 140
---

Use Chronograf to write data to InfluxDB. 
Choose from the following methods:

- [Upload line protocol through the Chronograf UI](#upload-line-protocol-through-the-chronograf-ui)
- [Use the InfluxQL `INTO` clause in a query](#use-the-influxql-into-clause-in-a-query)
- [Use the Flux `to()` function in a query](#use-the-flux-to-function-in-a-query)

## Upload line protocol through the Chronograf UI

1.  Select **{{< icon "data-explorer" "v2" >}} Explore** in the left navigation bar.
2.  Click **Write Data** in the top right corner of the Data Explorer.

    {{< img-hd src="/img/chronograf/1-9-write-data.png" alt="Write data to InfluxDB with Chronograf" />}}

3.  Select the **database** _(if an InfluxQL data source is selected)_ or
    **database and retention policy** _(if a Flux data source is selected)_ to write to.

    {{< img-hd src="/img/chronograf/1-9-write-db-rp.png" alt="Select database and retention policy to write to" />}}

4.  Select one of the following methods for uploading [line protocol](/{{< latest "influxdb" "v1" >}}/write_protocols/line_protocol_tutorial/):
    
    - **Upload File**: Upload a file containing line protocol to write to InfluxDB.
        Either drag and drop a file into the file uploader or click to use your
        operating systems file selector and choose a file to upload.
    - **Manual Entry**: Manually enter line protocol to write to InfluxDB.

5.  Select the timestamp precision of your line protocol.
    Chronograf supports the following units:

    - `s` (seconds)
    - `ms` (milliseconds)
    - `u` (microseconds)
    - `ns` (nanoseconds)

    {{< img-hd src="/img/chronograf/1-9-write-precision.png" alt="Select write precision in Chronograf" />}}

5.  Click **Write**.

## Use the InfluxQL `INTO` clause in a query
To write data back to InfluxDB with an InfluxQL query, include the
[`INTO` clause](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-into-clause)
in your query:

1.  Select **{{< icon "data-explorer" "v2" >}} Explore** in the left navigation bar.
2.  Select **InfluxQL** as your data source type.
3.  Write an InfluxQL query that includes the `INTO` clause. Specify the database,
    retention policy, and measurement to write to. For example:

    ```sql
    SELECT *
    INTO "mydb"."autogen"."example-measurement"
    FROM "example-db"."example-rp"."example-measurement"
    GROUP BY *
    ```

4. Click **Submit Query**.

{{% note %}}
#### Use InfluxQL to write to InfluxDB 2.x or InfluxDB Cloud
To use InfluxQL to write to an **InfluxDB 2.x** or **InfluxDB Cloud** instance,
[configure database and retention policy mappings](/{{< latest "influxdb" >}}/upgrade/v1-to-v2/manual-upgrade/#create-dbrp-mappings)
and ensure the current [InfluxDB connection](/chronograf/v1.9/administration/creating-connections/#manage-influxdb-connections-using-the-chronograf-ui)
includes the appropriate connection credentials.
{{% /note %}}

## Use the Flux `to()` function in a query
To write data back to InfluxDB with an InfluxQL query, include the
[`INTO` clause](/{{< latest "influxdb" "v1" >}}/query_language/explore-data/#the-into-clause)
in your query:

1.  Select **{{< icon "data-explorer" "v2" >}} Explore** in the left navigation bar.
2.  Select **Flux** as your data source type.

    {{% note %}}
To query InfluxDB with Flux, [enable Flux](/{{< latest "influxdb" "v1" >}}/flux/installation/)
in your InfluxDB configuration.
    {{% /note %}}

3.  Write an Flux query that includes the `to()` function.
    Provide the database and retention policy to write to.
    Use the `db-name/rp-name` syntax:    

    ```js
    from(bucket: "example-db/example-rp")
      |> range(start: -30d)
      |> filter(fn: (r) => r._measurement == "example-measurement")
      |> to(bucket: "mydb/autogen")
    ```

4. Click **Run Script**.
