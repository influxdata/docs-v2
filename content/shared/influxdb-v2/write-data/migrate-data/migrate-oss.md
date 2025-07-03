
To migrate data from an InfluxDB OSS bucket to another InfluxDB OSS or InfluxDB
Cloud bucket, export your data as line protocol and write it to your other
InfluxDB bucket.

> [!Important]
>
> #### InfluxDB Cloud write limits
> If migrating data from InfluxDB OSS to InfluxDB Cloud, you are subject to your
> [InfluxDB Cloud organization's rate limits and adjustable quotas](/influxdb/cloud/account-management/limits/).
> Consider exporting your data in time-based batches to limit the file size
> of exported line protocol to match your InfluxDB Cloud organization's limits.

1.  [Find the InfluxDB OSS bucket ID](/influxdb/version/organizations/buckets/view-buckets/)
    that contains data you want to migrate.
2.  Use the `influxd inspect export-lp` command to export data in your bucket as
    [line protocol](/influxdb/version/reference/syntax/line-protocol/).
    Provide the following:

    - **bucket ID**: ({{< req >}}) ID of the bucket to migrate.
    - **engine path**: ({{< req >}}) Path to the TSM storage files on disk.
      The default engine path [depends on your operating system](/influxdb/version/reference/internals/file-system-layout/#file-system-layout),
      If using a [custom engine-path](/influxdb/version/reference/config-options/#engine-path)
      provide your custom path.
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

3.  Write the exported line protocol to your InfluxDB OSS or InfluxDB Cloud instance.
    
    Do any of the following:

    - Write line protocol in the **InfluxDB UI**:
        - [InfluxDB Cloud UI](/influxdb/cloud/write-data/no-code/load-data/#load-csv-or-line-protocol-in-ui)
        - [InfluxDB OSS {{< current-version >}} UI](/influxdb/version/write-data/no-code/load-data/#load-csv-or-line-protocol-in-ui)
    - [Write line protocol using the `influx write` command](/influxdb/version/reference/cli/influx/write/)
    - [Write line protocol using the InfluxDB API](/influxdb/version/write-data/developer-tools/api/)
    - [Bulk ingest data (InfluxDB Cloud)](/influxdb/cloud/write-data/bulk-ingest-cloud/)
