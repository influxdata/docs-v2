---
title: InfluxDB table structure
description: >
  InfluxDB uses a columnar system to structure tables.
weight: 103
menu:
  v2_0_ref:
    parent: Key concepts
    name: Table structure
v2.0/tags: [key concepts]
---

InfluxDB 2.0 uses the following columnar table structure to store data:

- **Annotation rows:** include the following rows: #group, #datatype, and #default.
- **Header row:** describes the data labels for each column in a row.
- **Data columns:** include the following columns: annotation, result, and table.
- **Data rows:** all rows that contain time series data. For details about the type of data stored in InfluxDB, see [InfluxDB data elements](/v2.0/reference/key-concepts/data-elements/).
- **Group keys** determine the contents of output tables in Flux by grouping records that share common values in specified columns. Learn more about [grouping your data with Flux](/v2.0/query-data/flux/group-data/).

For specifications on the InfluxDB 2.0 table structure, see [Tables](/v2.0/reference/syntax/annotated-csv/#tables).

**_Tip:_** To visualize your table structure in the InfluxDB user interface, click the **Data Explorer** icon
in the sidebar, create a query, click **Submit**, and then select **View Raw Data**.
