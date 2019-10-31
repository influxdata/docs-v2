---
title: Delete data
list_title: Delete data
description: >
  Delete data in the InfluxDB UI.
menu:
  v2_0:
    name: Delete data
    parent: Write data
weight: 104
---

## Delete data in the InfluxDB UI

You can only delete data from buckets you've created. You cannot delete data from system buckets.?? Is this true? It doesn't show delete data by filter next to them but they do appear in the dropdown menu

### Delete data from buckets

1. Click **Load Data** in the navigation bar.

    {{< nav-icon "load data" >}}

2. Select **Buckets**.
3. Next to the bucket with data you want to delete, click **Delete Data by Filter**.
4. In the **Delete Data** window that appears:
  - Select a **Target Bucket** to delete data from.
  - Enter a **Time Range** to search.
  - Click **+ Add Filter** to filter by tag key and value pair.
  - Operator other than equals?
  - Check the box next to **I understand that this cannot be undone**.
5. Click **Confirm Delete** to delete the selected data.

### Delete data from the Data Explorer

1. Click the **Data Explorer** icon in the sidebar.

    {{< nav-icon "data-explorer" >}}

2. Click **Delete Data** in the top navigation bar.
3. In the **Delete Data** window that appears:
  - Select a **Target Bucket** to delete data from.
  - Enter a **Time Range** to search.
  - Click **+ Add Filter** to filter by tag key and value pair.
  - Operator other than equals?
  - Check the box next to **I understand that this cannot be undone**.
4. Click **Confirm Delete** to delete the selected data.

## Delete data using the influx CLI

## Delete data using the API
