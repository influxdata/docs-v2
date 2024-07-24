---
title: Write data with no-code third-party technologies
weight: 103
description: >
  Write data to InfluxDB using third-party technologies that do not require coding.
menu:
  influxdb_v2:
    name: Third-party technologies
    parent: No-code solutions
---

Write data to InfluxDB by configuring third-party technologies that don't require coding.

## Prerequisites 

- Authentication credentials for your InfluxDB instance: your InfluxDB host URL,
  [organization](/influxdb/v2/admin/organizations/),
  [bucket](/influxdb/v2/admin/buckets/), and an [API token](/influxdb/v2/admin/tokens/)
  with write permission on the bucket.

  To setup InfluxDB and create credentials, follow the
  [Get started](/influxdb/v2/get-started/) guide.

- Access to one of the third-party tools listed in this guide.

You can configure the following third-party tools to send line protocol data
directly to InfluxDB without writing code:

{{% note %}}
Many third-party integrations are community contributions.
If there's an integration missing from the list below, please [open a docs issue](https://github.com/influxdata/docs-v2/issues/new/choose) to let us know.
{{% /note %}}

- [Vector 0.9 or later](#configure-vector)

- [Apache NiFi 1.8 or later](#configure-apache-nifi)

- [OpenHAB 3.0 or later](#configure-openhab)

- [Apache JMeter 5.2 or later](#configure-apache-jmeter)

- [Apache Pulsar](#configure-apache-pulsar)

- [FluentD 1.x or later](#configure-fluentd)


## Configure Vector

> Vector is a lightweight and ultra-fast tool for building observability pipelines.
>
> {{% cite %}}-- [Vector documentation](https://vector.dev/docs/){{% /cite %}}

Configure Vector to write metrics and log events to an InfluxDB instance.

1. Configure your [InfluxDB authentication credentials](#prerequisites) for Vector to write to your bucket.
   - View example configurations:
     - [InfluxDB metrics sink configuration](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#configuration)
     - [InfluxDB logs sink configuration](https://vector.dev/docs/reference/configuration/sinks/influxdb_logs/#example-configurations)
   - Use the following Vector configuration fields for InfluxDB v2 credentials:
     - [`endpoint`](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#endpoint):
       the URL (including scheme, host, and port) for your InfluxDB instance
     - [`org`](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#org):
       the name of your InfluxDB organization 
     - [`bucket`](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#bucket):
       the name of the bucket to write data to
     - [`token`](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#token):
       an API token with write permission on the specified bucket

3. Configure the data that you want Vector to write to InfluxDB.
   - View [examples of metrics events and configurations](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#examples).
   - View [Telemetry log metrics](https://vector.dev/docs/reference/configuration/sinks/influxdb_logs/#telemetry).

4. For more detail, see the **How it works** sections:
   - [InfluxDB metrics sink–-How it works](https://vector.dev/docs/reference/configuration/sinks/influxdb_metrics/#how-it-works)
   - [InfluxDB logs sink–-How it works](https://vector.dev/docs/reference/configuration/sinks/influxdb_logs/#how-it-works)

## Configure Apache NiFi

> [Apache NiFi](https://nifi.apache.org/documentation/v1/) is a software project from the Apache Software Foundation designed to automate the flow of data between software systems.
>
> {{% cite %}}-- [Wikipedia](https://en.wikipedia.org/wiki/Apache_NiFi){{% /cite %}} 

The InfluxDB processors for Apache NiFi lets you write NiFi Record structured
data into InfluxDB v2.

See
_[InfluxDB Processors for Apache NiFi](https://github.com/influxdata/nifi-influxdb-bundle#influxdb-processors-for-apache-nifi)_
on GitHub for details.

## Configure OpenHAB

> The open Home Automation Bus (openHAB, pronounced ˈəʊpənˈhæb) is an open source, technology agnostic home automation platform
>
> {{% cite %}}-- [openHAB documentation](https://www.openhab.org/docs/){{% /cite %}}

> [The InfluxDB Persistence add-on] service allows you to persist and query states using the [InfluxDB] time series database.
>
> {{% cite %}}-- [openHAB InfluxDB persistence add-on](https://github.com/openhab/openhab-addons/tree/main/bundles/org.openhab.persistence.influxdb){{% /cite %}} 
 
See
_[InfluxDB Persistence add-on](https://github.com/openhab/openhab-addons/tree/master/bundles/org.openhab.persistence.influxdb)_
on GitHub for details.

## Configure Apache JMeter

> [Apache JMeter](https://jmeter.apache.org/) is an Apache project that can be used as a load testing tool for
> analyzing and measuring the performance of a variety of services, with a focus
> on web applications.
>
> {{% cite %}}-- [Wikipedia](https://en.wikipedia.org/wiki/Apache_JMeter){{% /cite %}} 

1. Create a [Backend Listener](https://jmeter.apache.org/usermanual/component_reference.html#Backend_Listener) using the _**InfluxDBBackendListenerClient**_ implementation.
2. In the **Backend Listener implementation** field, enter:
    ```text
    org.apache.jmeter.visualizers.backend.influxdb.influxdbBackendListenerClient
    ```
3. Under **Parameters**, specify the following:
   - **influxdbMetricsSender**:
      ```text
      org.apache.jmeter.visualizers.backend.influxdb.HttpMetricsSender
      ```
   - **influxdbUrl**: _(include the bucket and org you created in InfluxDB)_
      ```text
      http://localhost:8086/api/v2/write?org=my-org&bucket=jmeter
      ```
   - **application**: `InfluxDB2`
   - **influxdbToken**: _your InfluxDB API token with write permission on the
     specified bucket_
   - Include additional parameters as needed.
1. Click **Add** to add the _**InfluxDBBackendListenerClient**_ implementation.

## Configure Apache Pulsar

> Apache Pulsar is an open source, distributed messaging and streaming platform
> built for the cloud.
>
> The InfluxDB sink connector pulls messages from Pulsar topics and persists the
messages to InfluxDB.
>
> {{% cite %}}-- [Apache Pulsar](https://pulsar.apache.org/){{% /cite %}} 

See _[InfluxDB sink connector](https://pulsar.apache.org/docs/en/io-influxdb-sink/)_
for details.

## Configure FluentD

> [Fluentd](https://www.fluentd.org/) is a cross-platform open-source data
> collection software project.
>
> {{% cite %}}-- [Wikipedia](https://en.wikipedia.org/wiki/Fluentd){{% /cite %}}

See _[influxdb-plugin-fluent](https://github.com/influxdata/influxdb-plugin-fluent)_
on GitHub for details.
