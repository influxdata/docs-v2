---
title: Manage Last Value Caches with InfluxDB 3 Explorer
list_title: Manage Last Value Caches
description: >
  Use InfluxDB 3 Explorer to manage Last Value Caches in an InfluxDB 3 instance
  or cluster.
menu:
  influxdb3_explorer:
    name: Last Value Caches
    parent: Manage caches
weight: 101
related:
  - /influxdb3/enterprise/admin/last-value-cache/, Manage the Last Value Cache in InfluxDB 3 Enterprise
  - /influxdb3/core/admin/last-value-cache/, Manage the Last Value Cache in InfluxDB 3 Core
---

Use InfluxDB 3 Explorer to manage Last Value Caches (LVCs) in an InfluxDB 3
instance or cluster. To navigate to the **Last Value Cache management page**, in
the left navigation bar, select **Configure** > **Caches**.

- [View Last Value Caches](#view-last-value-caches)
- [Create a Last Value Cache](#create-a-last-value-cache)
- [Query a Last Value Cache](#query-a-last-value-cache)
- [Delete a Last Value Cache](#delete-a-last-value-cache)

## View Last Value Caches

To view LVCs associated with a database, navigate to the
**Last Value Cache management page** and select the database from the
**Select Database** dropdown menu. The page lists all LVCs associated with the
selected database.

## Create a Last Value Cache

On the **Last Value Cache management page**:

1.  Click **+ Create Cache**.
2.  Provide the following:

    - **Cache name**: A unique name for the cache.
    - **Database**: The database the cache is associated with.
    - **Table**: The target table for the cache. As data is written to the table,
      it populates the cache.
      _You must select a database before you can select a table._
    - **Key columns**: Select string-typed column columns to use as the primary
      key for the cache. These are typically InfluxDB tags, but you can also use
      fields. Each unique combination of key column values represents a distinct
      series. LVCs cache N (count) values per series.
    - **Value columns**: Select columns to cache values for. These are
      typically InfluxDB fields, but can also be tags. If no columns are
      selected as value columns, all non-key columns are used as value columns
      (excluding `time`).
    - **Count**: Specify the number of recently written values to cache per series.

      > [!Note]
      > Higher cardinality (more unique series) in an LVC increases memory usage.
      > Be selective about key columns and the number of values to cache per
      > series to optimize performance.

3.  Click **Create**.

## Query a Last Value Cache

Use the **Data Explorer** to query a LVC:

1.  In the left navigation, select **Query Data** > **Data Explorer**.
2.  Select the database you want to query from the **Select database** dropdown menu.
3.  Click the <strong class="icon-chevron-down"></strong> icon next to the table
    associated with the LVC you want to query to expand the table.
    Tables with LVCs have a <span class="badge lvc">LVC</span> badge below the
    <strong class="icon-chevron-down"></strong> icon.
4.  Under the **Caches** section of the expanded table, LVCs are identified by
    the <span class="badge lvc">LVC</span> badge. Click the name of the LVC to
    generate a SQL query that queries everything from the LVC. You can
    also expand the LVC and select specific columns to query.
5.  Click **Run Query** to execute the query and return results from the cache.

## Delete a Last Value Cache

On the **Last Value Cache management page**:

1.  Select the database associated with the cache you want to delete from the
    **Select Database** dropdown menu.
2.  In the **Active Caches** table, click the {{% icon "trash" %}} icon next to
    the cache you want to delete.
