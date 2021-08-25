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

Use **InfluxDB Cloud** sample datasets for quick and easy access to let you explore and familiarize yourself with InfluxDB Cloud. Sample data allows you to use InfluxDB Cloud's features without requiring you to have your own data. 

- [Add a sample data bucket](#add-a-sample-data-bucket)
- [Explore sample data](#explore-demo-data)
- [View demo sample dashboards](#view-demo-data-dashboards)

## Sample data sets

Choose from the following sample datasets:

- Air sensor sample data
  Explore, visualize, and monitor humidity, temperature, and carbon monoxide levels in the air.
- Bird migration sample data
  Explore, visualize, and monitor the latitude and longitude of bird migration patterns. 
- NOAA NDBC data
  Explore, visualize, and monitor NDBC's observations from their buoys. This data observes air temperature, wind speed, and more from specific locations. 
- NOAA water sample data
  Explore, visualize, and monitor temperature, water level, and more from specific locations. 
- USGS Earthquake data
  Explore, visualize, and monitor earthquake monitoring data. This data includes alerts, cdi, quarry blast, magnitide, and more. 

For more information, see our [sample data](/influxdb/cloud/reference/sample-data/). 

## Explore sample data
Use the [Data Explorer](/influxdb/cloud/visualize-data/explore-metrics/)
to query and visualize data in demo data buckets.

In the navigation menu on the left, click **Explore (Data Explorer)**.

{{< nav-icon "explore" >}}

## Add sample data

1. In the navigation menu on the left, click **Data (Load Data)** > **Buckets**.

    {{< nav-icon "data" >}}

2. Click **{{< icon "plus" >}} Create bucket**, and then name your bucket. The bucket will appear in your list of buckets.
3. View the [sample datasets document](/influxdb/cloud/reference/sample-data/#sample-datasets) and choose a sample data to query. 
4. Copy the `sample.data()` function listed underneath. 
5. Click **Explore** on the left navigation of InfluxDB Cloud and click **Script Editor**. 
6. Paste the `sample.data()` function. 
7. Click **Submit** to run the query. 

## View sample data dashboards
After adding a sample data bucket, view a dashboard specific to the sample dataset:

1. In the navigation menu on the left, click **Boards (Dashboards)**.

    {{< nav-icon "dashboards" >}}

2. Click the name of the dashboard that corresponds to your sample data bucket.
