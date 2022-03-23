---
title: Migrate data from InfluxDB OSS to other InfluxDB instances
description: >
  Migrate data from an InfluxDB OSS bucket to another InfluxDB OSS or InfluxDB
  Cloud bucket.
menu:
  influxdb_2_1:
    name: Migrate data from OSS
    parent: Migrate data
weight: 106
---

To migrate data from an InfluxDB OSS bucket to another InfluxDB OSS or InfluxDB
Cloud bucket:

1. [Find the ID of the bucket](/influxdb/v2.1/organizations/buckets/view-buckets/)
   that contains data you want to migrate.
2.  Use the `influxd inspect export-lp` command to export data in a bucket as
    [line protocol](/influxdb/v2.1/reference/syntax/line-protocol/).
    Provide the following:

    - **bucket ID**: ({{< req >}}) ID of the bucket to migrate.
    - **engine path**: ({{< req >}}) Path to the TSM storage files on disk.
      The default engine path [depends on your operating system](/influxdb/v2.1/reference/internals/file-system-layout/#file-system-layout),
      but can also be customized with the
      [`engine-path` configuration option](/influxdb/v2.1/reference/config-options/#engine-path).
    - **output path**: ({{< req >}}) File path to output line protocol to.
    - **start time**: Earliest time to export.
    - **end time**: Latest time to export.
    - **measurement**: Export a specific measurement. By default, the command
      exports all measurements.
    - **compression**: ({{< req text="Recommended" color="magenta" >}})
      Use Gzip compression to compress the output line protocol file.

    ```sh
    influxd inspect export-lp \
      --bucket-id 12ab34cd56ef \
      --engine-path ~/.influxdbv2/engine \
      --output-path path/to/export.lp
      --start 2022-01-01T00:00:00Z \
      --end 2022-01-31T23:59:59Z \
      --compress
    ```

    {{% cloud %}}
#### InfluxDB Cloud write limits
- InfluxDB Cloud write limits per five minutes free plan (5 MB), PAYG (3 GB)
- InfluxDB Cloud global limit: 250 MB (uncompressed) batch size
    {{% /cloud %}}

3.  Write the exported line protocol to your InfluxDB Cloud or InfluxDB OSS instance.
    
    Use one of the following methods:

    - Import line protocol in the **InfluxDB UI**:
        - [InfluxDB Cloud](/influxdb/cloud/write-data/no-code/load-data/#load-csv-or-line-protocol-in-ui)
        - [InfluxDB OSS {{< current-version >}}](/influxdb/v2.1/write-data/no-code/load-data/#load-csv-or-line-protocol-in-ui)
    - [Bulk ingest data (InfluxDB Cloud)](/influxdb/cloud/write-data/bulk-ingest-cloud/)
    - 