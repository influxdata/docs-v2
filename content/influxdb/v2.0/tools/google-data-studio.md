---
title: Use the Google Data Studio connector
description: >
  The [InfluxDB Google Data Studio connector](https://datastudio.google.com/u/0/datasources/create?connectorId=AKfycbwhJChhmMypQvNlihgRJMAhCb8gaM3ii9oUNWlW_Cp2PbJSfqeHfPyjNVp15iy9ltCs)
  lets you create reports and dashboards in Google Data Studio with data from
  InfluxDB Cloud or InfluxDB OSS 2.0.
menu:
  influxdb_2_0:
    parent: Tools & integrations
weight: 104
influxdb/v2.0/tags: [google]
---

The [InfluxDB Google Data Studio connector](https://datastudio.google.com/u/0/datasources/create?connectorId=AKfycbwhJChhmMypQvNlihgRJMAhCb8gaM3ii9oUNWlW_Cp2PbJSfqeHfPyjNVp15iy9ltCs) lets you create reports and dashboards in Google Data Studio with data from **InfluxDB Cloud** or **InfluxDB OSS 2.0**. The connector supports one measurement per organization.

### Add the InfluxDB Connector to Data Studio

1. Add the [InfluxDB Connector data source](https://datastudio.google.com/u/0/datasources/create?connectorId=AKfycbwhJChhmMypQvNlihgRJMAhCb8gaM3ii9oUNWlW_Cp2PbJSfqeHfPyjNVp15iy9ltCs).
2. Enter the following connection details:
  - `InfluxDB URL`: Your [InfluxDB URL](/influxdb/v2.0/reference/urls/).
  - `Token`: Your [authentication token](/influxdb/v2.0/security/tokens/create-token/) with permission to read from the bucket you're using.
  - `Organization`: Your [organization name](/influxdb/v2.0/organizations/view-orgs).
  - `Bucket`: Your [bucket name](/influxdb/v2.0/organizations/buckets/view-buckets/). This is auto-populated when you enter the fields above.
  - `Measurement`: The [measurement](/influxdb/v2.0/reference/glossary/#measurement) to connect to.
3. Click **Connect**.

### Create a report of InfluxDB data in Data Studio

1. Once you're connected, a list of fields available from your measurement, including the [tag set](/influxdb/v2.0/reference/glossary/#tag-set), [field set](/influxdb/v2.0/reference/glossary/#field-set), and [timestamp](/influxdb/v2.0/reference/glossary/#timestamp) appear. Review the list of fields and [edit as needed](https://support.google.com/datastudio/answer/7000529?hl=en&ref_topic=6370331).
2. Click **CREATE REPORT** to [create the report](https://support.google.com/datastudio/topic/6369007?hl=en&ref_topic=6291037).
3. Customize the [visualization in your report](https://support.google.com/datastudio/?hl=en#topic=6291037).

### Example use case with COVID-19 data

For an example of how to use this connector, see a [COVID-19 report powered by InfluxDB](https://github.com/influxdata/influxdb-gds-connector/tree/master/examples).
