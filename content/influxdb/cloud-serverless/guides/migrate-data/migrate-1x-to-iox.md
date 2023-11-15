---
title: Migrate data from InfluxDB 1.x to InfluxDB Cloud Serverless
description: >
  To migrate data from a TSM-powered InfluxDB 1.x (OSS or Enterprise) to an
  InfluxDB Cloud Serverless organization, export the data as line protocol and
  write the exported data to an bucket in your InfluxDB Cloud Serverless organization.
menu:
  influxdb_cloud_serverless:
    name: Migrate from 1.x to Serverless
    parent: Migrate data
weight: 103
aliases:
  - /influxdb/cloud-serverless/write-data/migrate-data/migrate-1x-to-iox
---

To migrate data from an InfluxDB 1.x OSS or Enterprise instance to InfluxDB Cloud
Serverless powered by the v3 storage engine, export the data as line protocol and write
the exported data to a bucket in your InfluxDB Cloud Serverless organization.
Because full data migrations will likely exceed your organizations' limits and
adjustable quotas, migrate your data in batches.

{{% cloud %}}
All write requests are subject to your InfluxDB Cloud Serverless organization's
[rate limits and adjustable quotas](/influxdb/cloud-serverless/account-management/limits/).
{{% /cloud %}}

## Tools to use
The migration process uses the following tools:

- **`influx_inspect` utility**:  
  The [`influx_inspect` utility](/influxdb/v1/tools/influx_inspect/#export)
  is packaged with InfluxDB 1.x OSS and Enterprise.

- **InfluxDB 2.x `influx` CLI**:  
  The [2.x `influx` CLI](/influxdb/cloud-serverless/reference/cli/influx/) is packaged
  separately from InfluxDB OSS 2.x and InfluxDB Cloud Serverless.
  [Download and install the 2.x CLI](/influxdb/cloud-serverless/reference/cli/influx/).

- **InfluxDB Cloud user interface (UI)**:  
  Visit [cloud2.influxdata.com](https://cloud2.influxdata.com) to access the
  InfluxDB Cloud UI.

{{% note %}}
#### InfluxDB 1.x and 2.x CLIs are unique
If both the **InfluxDB 1.x and 2.x `influx` CLIs** are installed in your `$PATH`,
rename one of the the binaries to ensure you're executing commands with the
correct CLI.
{{% /note %}}

## Migrate data

1. **Export data from your InfluxDB 1.x instance as line protocol.**

    Use the **InfluxDB 1.x `influx_inspect export` utility** to export data as
    line protocol and store it in a file.
    Include the following:

    - ({{< req "Required" >}}) `-lponly` flag to export line protocol without InfluxQL DDL or DML.
    - ({{< req "Required" >}}) `-out` flag with a path to an output file.
      Default is `~/.influxdb/export`. _Any subsequent export commands without
      the output file defined will overwrite the existing export file._
    - `-compress` flag to use gzip to compress the output.
    - `-datadir` flag with the path to your InfluxDB 1.x `data` directory.
      Only required if the `data` directory is at a non-default location.
      For information about default locations, see
      [InfluxDB OSS 1.x file system layout](/influxdb/v1/concepts/file-system-layout/#file-system-layout)
      or [InfluxDB Enterprise 1.x file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout).
    - `-waldir` flag with the path to your InfluxDB 1.x `wal` directory.
      Only required if the `wal` directory is at a non-default location.
      For information about default locations, see
      [InfluxDB OSS 1.x file system layout](/influxdb/v1/concepts/file-system-layout/#file-system-layout)
      or [InfluxDB Enterprise 1.x file system layout](/enterprise_influxdb/v1/concepts/file-system-layout/#file-system-layout).
    - `-database` flag with a specific database name to export.
      By default, all databases are exported.
    - `-retention` flag with a specific retention policy to export.
      By default, all retention policies are exported.
    - `-start` flag with an RFC3339 timestamp that defines the earliest time to export.
      Default is `1677-09-20T16:27:54-07:44`.
    - `-end` flag with an RFC3339 timestamp that defines the latest time to export.
      Default is `2262-04-11T16:47:16-07:00`.

    {{% note %}}
We recommend exporting each database and retention policy combination separately
to easily write the exported data into corresponding InfluxDB {{< current-version >}}
buckets.
    {{% /note %}}

    ##### Export all data in a database and retention policy to a file
    ```sh
    influx_inspect export \
      -lponly \
      -database example-db \
      -retention example-rp \
      -out path/to/export-file.lp
    ```

    ##### View more export command examples:
    {{< expand-wrapper >}}
{{% expand "Export all data to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -out path/to/export-file.lp.gzip
```

{{% /expand %}}

{{% expand "Export all data to a compressed file" %}}

```sh
influx_inspect export \
  -lponly \
  -compress \
  -out path/to/export-file.lp.gzip
```

{{% /expand %}}

{{% expand "Export data within time bounds to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -start 2020-01-01T00:00:00Z \
  -end 2023-01-01T00:00:00Z \
  -out path/to/export-file.lp
```

{{% /expand %}}

{{% expand "Export a database and all its retention policies to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -database example-db \
  -out path/to/export-file.lp
```

{{% /expand %}}

{{% expand "Export a specific database and retention policy to a file" %}}

```sh
influx_inspect export \
  -lponly \
  -database example-db \
  -retention example-rp \
  -out path/to/export-file.lp
```

{{% /expand %}}

{{% expand "Export all data from _non-default_ `data` and `wal` directories" %}}

```sh
influx_inspect export \
  -lponly \
  -datadir path/to/influxdb/data/ \
  -waldir path/to/influxdb/wal/ \
  -out path/to/export-file.lp
```

{{% /expand %}}
    {{< /expand-wrapper >}}

2.  Create InfluxDB Cloud Serverless buckets for each InfluxDB 1.x database and retention policy combination.
    InfluxDB {{< current-version >}} combines InfluxDB 1.x databases and retention policies
    into buckets--named locations for time series data with specified retention periods.

    {{< expand-wrapper >}}
{{% expand "View example 1.x databases and retention policies as InfluxDB Cloud buckets" %}}
If you have the following InfluxDB 1.x data structure:

- example-db <span style="opacity:.5;">_(database)_</span>
  - autogen <span style="opacity:.5;">_(retention policy)_</span>
  - historical-1mo <span style="opacity:.5;">_(retention policy)_</span>
  - historical-6mo <span style="opacity:.5;">_(retention policy)_</span>
  - historical-1y <span style="opacity:.5;">_(retention policy)_</span>

You would create the following InfluxDB {{< current-version >}} buckets:

- example-db/autogen
- example-db/historical-1mo
- example-db/historical-6mo
- example-db/historical-1y

{{% /expand %}}
    {{< /expand-wrapper >}}

    Use the **InfluxDB 2.x `influx` CLI** or the **InfluxDB {{< current-version >}} user interface (UI)**
    to create a bucket.

    {{< tabs-wrapper >}}
{{% tabs %}}
[influx CLI](#)
[InfluxDB UI](#)
{{% /tabs %}}

{{% tab-content %}}
<!----------------------------- BEGIN CLI CONTENT ----------------------------->

Use the [`influx bucket create` command](/influxdb/cloud-serverless/reference/cli/influx/bucket/create/)
to create a new bucket.

**Provide the following**:

- [InfluxDB Cloud Serverless connection and authentication credentials](#)
- `-n, --name` flag with the bucket name.
- `-r, --retention` flag with the bucket's retention period duration.
  Supported retention periods depend on your InfluxDB Cloud Serverless plan.

```sh
influx bucket create \
  --name example-db/autogen \
  --retention 7d
```

<!------------------------------ END CLI CONTENT ------------------------------>
{{% /tab-content %}}
{{% tab-content %}}
<!------------------------------ BEGIN UI CONTENT ----------------------------->

1.  Go to [cloud2.influxdata.com](https://cloud2.influxdata.com) in a browser to
    log in and access the InfluxDB UI.

2.  Navigate to **Load Data** > **Buckets** using the left navigation bar.

{{< nav-icon "load data" >}}

3.  Click **+ {{< caps >}}Create bucket{{< /caps >}}**.
4.  Provide a bucket name (for example: `example-db/autogen`) and select a
    [retention period](/influxdb/cloud-serverless/reference/glossary/#retention-period).
    Supported retention periods depend on your InfluxDB Cloud Serverless plan.

5.  Click **{{< caps >}}Create{{< /caps >}}**.

<!------------------------------- END UI CONTENT ------------------------------>
{{% /tab-content %}}
    {{< /tabs-wrapper >}}

3.  **Write the exported line protocol to your InfluxDB Cloud Serverless organization.**

    Use the **InfluxDB 2.x CLI** to write data to InfluxDB Cloud Serverless.
    While you can use the `/api/v2/write` API endpoint to write data directly,
    the `influx write` command lets you define the rate at which data is written
    to avoid exceeding your organization's rate limits.

    Use the `influx write` command and include the following:

    - [InfluxDB Cloud Serverless connection and authentication credentials](#authentication-credentials)
    - `-b, --bucket` flag to identify the target bucket.
    - `-f, --file` flag with the path to the line protocol file to import.
    - `-rate-limit` flag with a rate limit that matches your InfluxDB Cloud
      organization's write rate limit.
    - `--compression` flag to identify the compression type of the import file.
      Options are `none` or `gzip`. Default is `none`.

    {{< cli/influx-creds-note >}}

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Uncompressed](#)
[Compressed](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
influx write \
  --bucket example-db/autogen \
  --file path/to/export-file.lp \
  --rate-limit "300 MB / 5 min"
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
influx write \
  --bucket example-db/autogen \
  --file path/to/export-file.lp.gzip \
  --rate-limit "300 MB / 5 min" \
  --compression gzip
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

    Repeat for each export file and target bucket.
