---
title: influx query
description: >
  The `influx query` command and `/api/v2/query` API endpoint don't work with InfluxDB Cloud Serverless.
  Use [SQL](/influxdb3/cloud-serverless/query-data/sql/execute-queries/) or [InfluxQL](/influxdb3/cloud-serverless/query-data/influxql/) to query an InfluxDB Cloud Serverless bucket.
menu:
  influxdb3_cloud_serverless:
    name: influx query
    parent: influx
weight: 101
influxdb3/cloud-serverless/tags: [query]
related:
  - /influxdb3/cloud-serverless/query-data/
  - /influxdb3/cloud-serverless/query-data/sql/execute-queries/
  - /influxdb3/cloud-serverless/query-data/influxql/execute-queries/
  - /influxdb3/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
  - /influxdb3/cloud-serverless/reference/cli/influx/#provide-required-authentication-credentials, influx CLI—Provide required authentication credentials
metadata: [influx CLI 2.0.0+]
updated_in: CLI v2.0.5
prepend: |
  > [!Warning]
  > #### Command not supported
  > 
  > The `influx query` command and the InfluxDB `/api/v2/query` API endpoint it uses
  > don't work with {{% product-name %}}.
  > 
  > Use [SQL](/influxdb3/cloud-serverless/query-data/sql/execute-queries/) or [InfluxQL](/influxdb3/cloud-serverless/query-data/influxql/execute-queries/) tools to query a {{% product-name %}} bucket.
---
