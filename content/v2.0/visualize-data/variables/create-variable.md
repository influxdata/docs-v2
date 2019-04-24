---
title: Create a variable
seotitle: Create a dashboard variable
description: Create dashboard variables in the Data Explorer, from the Organization page, or import a variable.
menu:
  v2_0:
    parent: Use and manage variables
weight: 201
"v2.0/tags": [variables]
---

Create dashboard variables in the Data Explorer, from the Organization page, or import a variable.

_For information about variable types, see [Variable types](/v2.0/visualize-data/variables/variable-types/)._

### Create a variable in the Data Explorer

1. Click the **Data Explorer** icon in the sidebar.

    {{< nav-icon "data-explorer" >}}

2. Click **Script Editor** on the lower right.
3. Build the query for your variable using the [Table visualization type](/v2.0/visualize-data/visualization-types/#table) or enable the **View Raw Data** option.
4. Click **Save As** in the upper right.
5. In the window that appears, select **Variable**.
6. Enter a name for your variable in the **Name** field.
7. Click **Create**.

### Create a variable in the configuration page

1. Click the **Settings** icon in the navigation bar.

    {{< nav-icon "settings" >}}

2. Select the **Variables** tab.
3. Click **+Create Variable**.
4. Enter a name for your variable.
5. Enter your variable.
6. Click **Create**.

## Import a variable

1. Click the **Organizations** icon in the navigation bar.

    {{< nav-icon "orgs" >}}

2. Select an organization from the list.
3. Select the **Variables** tab.
4. Click the **+Create Variable** dropdown menu and select **Import Variable**.
3. In the window that appears:
  * Select **Upload File** to drag-and-drop or select a file.
  * Select **Paste JSON** to paste in JSON.
4. Select an organization from the **Destination Organization** dropdown.
5. Click **Import JSON as Variable**.
