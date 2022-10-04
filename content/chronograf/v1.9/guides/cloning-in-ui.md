---
title: Clone dashboards and cells
description: >
  Clone a dashboard or a cell and use the copy as a starting point to create new dashboard or cells.
menu:
  chronograf_1_9:
    weight: 70
    parent: Guides
---

This guide explains how to clone, or duplicate, a dashboard or a cell for use as starting points for creating dashboards or cells using the copy as a template.

## Clone dashboards

Dashboards in Chronograf can be cloned (or copied) to be used to create a dashboard based on the original. Rather than building a new dashboard from scratch, you can clone a dashboard and make changes to the dashboard copy.

### To clone a dashboard

On the **Dashboards** page, hover your cursor over the listing of the dashboard that you want to clone and click the **Clone** button that appears.

![Click the Clone button](/img/chronograf/1-6-clone-dashboard.png)

The cloned dashboard opens and displays the name of the original dashboard with `(clone)` after it.

![Cloned dashboard](/img/chronograf/1-6-clone-dashboard-clone.png)

You can now change the dashboard name and customize the dashboard.

## Clone cells

Cells in Chronograf dashboards can be cloned or copied to quickly create a cell copy that can be edited for another use.

### To clone a cell

1. On the dashboard cell that you want to make a copy of, click the **Clone** icon and then confirm by clicking **Clone Cell**.

    ![Click the Clone icon](/img/chronograf/1-6-clone-cell-click-button.png)

2. The cloned cell appears in the dashboard displaying the nameof the original cell with `(clone)` after it.

    ![Cloned cell](/img/chronograf/1-6-clone-cell-cell-copy.png)

    You can now change the cell name and customize the cell.

{{% note %}}
#### Cells can only be cloned to the current dashboard

Dashboard cells can only be clone to the current dashboard and can not be cloned to another dashboard.
To clone a cell to another dashboard:

1.  Hover over the cell you want to clone, click the **{{< icon "pencil" "v1" >}}**
    icon, and then select **Configure**.
2.  Copy the cell query.
3.  Open the dashboard you want to clone the cell to.
4.  Click **{{< icon "add-cell" "v2" >}} Add Cell** to create a new cell.
5.  Paste your copied query into the new cell.
6.  Duplicate all the visualizations settings from your cloned cell.
{{% /note %}}

