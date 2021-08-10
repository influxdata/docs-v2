---
title: Write data with no-code third-party technologies
weight: 103
description: >
  Write data to InfluxDB using third-party technologies that do not require coding.
menu:
  influxdb_2_0:
    name: Third-party technologies
    parent: No-code solutions
---


A number of third-party technologies can be configured to send line protocol directly to InfluxDB.

If you're using any of the following technologies, check out the handy links below to configure these technologies to write data to InfluxDB (**no additional software to download or install**):

- (Write metrics and log events only) [Vector 0.9 or later](#configure-vector)

- [Apache NiFi 1.8 or later](#configure-apache-nifi)

- [OpenHAB 3.0 or later](#configure-openhab)

- [Apache JMeter 5.2 or later](#configure-apache-jmeter)

- [FluentD 1.x or later](#configure-fluentd)

#### Configure Vector

1. View the **Vector documentation**:
  - For write metrics, [InfluxDB Metrics Sink](https://vector.dev/docs/reference/sinks/influxdb_metrics/)
  - For log events, [InfluxDB Logs Sink](https://vector.dev/docs/reference/sinks/influxdb_logs/)
2. Under **Configuration**, click **v2** to view configuration settings.
3. Scroll down to **How It Works** for more detail:
  - [InfluxDB Metrics Sink – How It Works ](https://vector.dev/docs/reference/sinks/influxdb_metrics/#how-it-works)
  - [InfluxDB Logs Sink – How It Works](https://vector.dev/docs/reference/sinks/influxdb_logs/#how-it-works)

#### Configure Apache NiFi

See the _[InfluxDB Processors for Apache NiFi Readme](https://github.com/influxdata/nifi-influxdb-bundle#influxdb-processors-for-apache-nifi)_ for details.

#### Configure OpenHAB

See the _[InfluxDB Persistence Readme](https://github.com/openhab/openhab-addons/tree/master/bundles/org.openhab.persistence.influxdb)_ for details.

#### Configure Apache JMeter

<!-- after doc updates are made, we can simplify to: See the _[Apache JMeter User's Manual - JMeter configuration](https://jmeter.apache.org/usermanual/realtime-results.html#jmeter-configuration)_ for details. -->

To configure Apache JMeter, complete the following steps in InfluxDB and JMeter.

##### In InfluxDB

1. [Find the name of your organization](/influxdb/v2.0/organizations/view-orgs/) (needed to create a bucket and token).
2. [Create a bucket using the influx CLI](/influxdb/v2.0/organizations/buckets/create-bucket/#create-a-bucket-using-the-influx-cli) and name it `jmeter`.
3. [Create a token](/influxdb/v2.0/security/tokens/create-token/).

##### In JMeter

1. Create a [Backend Listener](https://jmeter.apache.org/usermanual/component_reference.html#Backend_Listener) using the _**InfluxDBBackendListenerClient**_ implementation.
2. In the **Backend Listener implementation** field, enter:
    ```
    org.apache.jmeter.visualizers.backend.influxdb.influxdbBackendListenerClient
    ```
3. Under **Parameters**, specify the following:
   - **influxdbMetricsSender**:
      ```
      org.apache.jmeter.visualizers.backend.influxdb.HttpMetricsSender
      ```
   - **influxdbUrl**: _(include the bucket and org you created in InfluxDB)_
      ```
      http://localhost:8086/api/v2/write?org=my-org&bucket=jmeter
      ```
   - **application**: `InfluxDB2`
   - **influxdbToken**: _your InfluxDB API token_
   - Include additional parameters as needed.
4. Click **Add** to add the _**InfluxDBBackendListenerClient**_ implementation.

#### Configure FluentD

See the _[influxdb-plugin-fluent Readme](https://github.com/influxdata/influxdb-plugin-fluent)_ for details.
