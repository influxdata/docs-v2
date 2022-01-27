---
title: Query sample data
description: >
  Explore InfluxDB Cloud with our sample data buckets.
menu:
  influxdb_cloud:
    name: Query with sample data
    parent: Execute queries
weight: 10
---

Use **InfluxDB Cloud** sample datasets to quickly access data that lets you explore and familiarize yourself with InfluxDB Cloud without requiring you to have to write your own data.

- [Choose sample data](#choose-sample-data)
- [Explore sample data](#explore-sample-data)
- [Create sample data dashboards](#create-sample-data-dashboards)

{{% note %}}
#### Network bandwidth

Each execution of `sample.data()` downloads the specified dataset from **Amazon S3**.
If using [InfluxDB Cloud](/influxdb/cloud/) or a hosted InfluxDB OSS instance,
you may see additional network bandwidth costs when using this function.
Approximate sample dataset sizes are listed for each [sample dataset](/influxdb/cloud/reference/sample-data/#sample-datasets) and in the output of [`sample.list()`](/influxdb/v2.0/reference/flux/stdlib/influxdb-sample/list/).
{{% /note %}}

## Choose sample data

1. Choose from the following sample datasets:
   - **Air sensor sample data**: Explore, visualize, and monitor humidity, temperature, and carbon monoxide levels in the air.
   - **Bird migration sample data**: Explore, visualize, and monitor the latitude and longitude of bird migration patterns.
   - **NOAA NDBC sample data**: Explore, visualize, and monitor NDBC's observations from their buoys. This data observes air temperature, wind speed, and more from specific locations.
   - **NOAA water sample data**: Explore, visualize, and monitor temperature, water level, pH, and quality from specific locations.
   - **USGS Earthquake data**: Explore, visualize, and monitor earthquake monitoring data. This data includes alerts, cdi, quarry blast, magnitude, and more.  
2. Do one of the following to download sample data:
   - [Add sample data with community template](#add-sample-data-with-community-templates)
   - [Add sample data using the InfluxDB UI](#add-sample-data)

### Add sample data with community template

1. In the navigation menu on the left, select **Settings** > **Templates**.

    {{< nav-icon "settings" >}}

2. Paste the Sample Data community temple URL in **resource manifest file** field:

2. Paste the [Sample Data community template URL](https://github.com/influxdata/community-templates/blob/master/sample-data/sample-data.yml) in the **resource manifest file** field and click the **{{< caps >}}Lookup Template{{< /caps >}}** button.

#### Sample Data community template URL

```
    https://github.com/influxdata/community-templates/blob/master/sample-data/sample-data.yml
```

## Explore sample data

Use the [Data Explorer](/influxdb/cloud/visualize-data/explore-metrics/)
to query and visualize data in sample data buckets.

In the navigation menu on the left, click **Data Explorer**.

{{< nav-icon "explore" >}}

### Add sample data

1. In the navigation menu on the left, click **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **{{< icon "plus" >}} Create bucket**, and then name your bucket. The bucket will appear in your list of buckets.
3. View the [sample datasets document](/influxdb/cloud/reference/sample-data/#sample-datasets) and choose a sample data to query.
4. Copy the `sample.data()` function listed underneath.
5. Click **Explore** on the left navigation of InfluxDB Cloud and click your bucket, and then click **Script Editor**.
6. Paste the `sample.data()` function.
7. Click **Submit** to run the query.

For more information about querying in the Script Editor, see how to [Query data with Flux and the Data Explorer](/influxdb/cloud/query-data/execute-queries/data-explorer/#query-data-with-flux-and-the-data-explorer).

## Create sample data dashboards

After adding a sample data bucket, create a dashboard specific to the sample dataset:

1. Click **Boards (Dashboards)** in the navigation menu on the left.

    {{< nav-icon "dashboards" >}}

2. Click **Create Dashboard > New Dashboard**, and name the dashboard after your bucket.
3. Click **Add Cell**, and select your sample data bucket.
4. Click **Script Editor**.
5. Copy and paste the `sample.data()` function into the script editor.
6. Click **Submit** to run the query.
6. Define the variables of your sample data.
