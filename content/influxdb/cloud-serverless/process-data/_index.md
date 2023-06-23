---
title: Process data stored in InfluxDB
description: >
  Learn how to process data stored in InfluxDB and perform tasks like modifying
  and storing modified data, applying advanced downsampling techniques, sending
  alerts, and more.
menu:
  influxdb_cloud_serverless:
    name: Process data
weight: 5
---

Learn how to process data stored in InfluxDB and perform tasks like modifying
and storing modified data, applying advanced downsampling techniques, sending
alerts, and more.

Data processing tasks all follow essentially the same workflow:

1.  Query time series data from InfluxDB into an external runtime.
2.  Process data using tools available in the external runtime.
3.  _(Optional)_ Write the processed data back to InfluxDB.

The following guides utilize [InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/)
to demonstrate how to process data.

{{< children >}}
