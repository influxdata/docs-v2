---
title: Create a variable
seotitle: Create a dashboard variable
description: Create dashboard variables in the Data Explorer, from the Organization page, or import a variable.
menu:
  influxdb_2_1:
    parent: Use and manage variables
weight: 201
influxdb/v2.1/tags: [variables]
---

Create dashboard variables in the Data Explorer, from the Settings section, or import a variable.
**Variable names must be unique.**

There are multiple variable types that provide different means of populating your list of variable values.
_For information about variable types, see [Variable types](/influxdb/v2.1/visualize-data/variables/variable-types/)._

{{% note %}}
##### Variable name restrictions
Variable names must begin with a letter or underscore (`_`).

The following names cannot be used as dashboard variables because they are reserved keywords in Flux:
`and`, `import`, `not`, `return`, `option`, `test`, `empty`, `in`, `or`, `package`, and `builtin`.
{{% /note %}}

## Create a variable in the Data Explorer

{{% note %}}
InfluxData recommends using the Data Explorer to create
[Query dashboard variables](/influxdb/v2.1/visualize-data/variables/variable-types/#query).
The [Table visualization type](/influxdb/v2.1/visualize-data/visualization-types/table/) and
**View Raw Data** option to provide human-readable query results.
{{% /note %}}

1. Click the **Data Explorer** icon in the sidebar.

    {{< nav-icon "data-explorer" >}}

2. Use the **Query Builder** or **Script Editor** to build a query.
3. Use the [Table visualization type](/influxdb/v2.1/visualize-data/visualization-types/table/)
   or enable the **View Raw Data** option to view human-readable query results.
4. Click **Save As** in the upper right.
5. In the window that appears, select **Variable**.
6. Enter a name for your variable in the **Name** field.
7. Click **Create**.

_For information about common Query variables, see [Common variable queries](/influxdb/v2.1/visualize-data/variables/common-variables/)._

## Create a variable in the Settings section

1. Click the **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2. Select the **Variables** tab.
3. Enter a name for your variable.
4. Select your variable type. For details on each type, see [Variable types](/influxdb/v2.1/visualize-data/variables/variable-types/).
5. Enter the appropriate variable information.
6. Click **Create**.

## Import a variable
InfluxDB lets you import variables exported from InfluxDB in JSON format.

1. Click the **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2.  Select the **Variables** tab.
3. Click the **{{< icon "plus" >}} Create Variable** drop-down menu and select **Import Variable**.
4. In the window that appears:
  - Select **Upload File** to drag and drop or select a file.
  - Select **Paste JSON** to paste in JSON.
6. Click **Import JSON as Variable**.
