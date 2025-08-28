---
title: Manage Distinct Value Caches with InfluxDB 3 Explorer
list_title: Manage Distinct Value Caches
description: >
  Use InfluxDB 3 Explorer to manage Distinct Value Caches in an InfluxDB 3
  instance or cluster.
menu:
  influxdb3_explorer:
    name: Distinct Value Caches
    parent: Manage caches
weight: 102
related:
  - /influxdb3/enterprise/admin/distinct-value-cache/, Manage the Distinct Value Cache in InfluxDB 3 Enterprise
  - /influxdb3/core/admin/distinct-value-cache/, Manage the Distinct Value Cache in InfluxDB 3 Core
---

Use InfluxDB 3 Explorer to manage Distinct Value Caches (DVCs) in an InfluxDB 3
instance or cluster. To navigate to the **Distinct Value Cache management page**:

1. In the left navigation bar, select **Configure** > **Caches**.
2. Select the **Distinct Value Caches** tab.

- [View Distinct Value Caches](#view-distinct-value-caches)
- [Create a Distinct Value Cache](#create-a-distinct-value-cache)
- [Query a Distinct Value Cache](#query-a-distinct-value-cache)
- [Delete a Distinct Value Cache](#delete-a-distinct-value-cache)

## View Distinct Value Caches

To view DVCs associated with a database, navigate to the
**Distinct Value Cache management page** and select the database from the
**Select Database** dropdown menu. The page lists all DVCs associated with the
selected database.

## Create a Distinct Value Cache

On the **Distinct Value Cache management page**:

1.  Click **+ Create Cache**.
2.  Provide the following:

    - **Cache name**: A unique name for the cache.
    - **Database**: The database the cache is associated with.
    - **Table**: The target table for the cache. As data is written to the table,
      it populates the cache.
      _You must select a database before you can select a table._
    - **Column names**: Select columns to cache distinct values from.
      These are typically InfluxDB tags, but you can also use fields.
      combinations to cache. Once this limit is exceeded, InfluxDB drops the oldest cached
      distinct values.
    - **Max Age**: Specify the maximum age of cached values as a duration in
      [humantime](https://docs.rs/humantime/latest/humantime/fn.parse_duration.html)
      form. The default is `24h`.

      > [!Note]
      > Higher cardinality (more distinct values) in a DVC increases memory usage.

3.  Click **Create**.

## Query a Distinct Value Cache

Use the `distinct_cache` SQL function to query a DVC. For more information, see
[Query a Distinct Value Cache](/influxdb3/enterprise/admin/distinct-value-cache/query/).

## Delete a Distinct Value Cache

On the **Distinct Value Cache management page**:

1.  Select the database associated with the cache you want to delete from the
    **Select Database** dropdown menu.
2.  In the **Active Caches** table, click the {{% icon "trash" %}} icon next to
    the cache you want to delete.