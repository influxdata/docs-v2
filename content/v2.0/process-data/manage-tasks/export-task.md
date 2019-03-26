---
title: Export a task
seotitle: Export an InfluxDB task
description: Export a data processing task from InfluxDB using the InfluxDB user interface.
menu:
  v2_0:
    name: Export a task
    parent: Manage tasks
weight: 205
---

InfluxDB allows you to export tasks from the InfluxDB user interface (UI).
Tasks are exported as downloadable JSON files.

To export a task:

## Delete a task in the InfluxDB UI
1. Click the **Tasks** icon in the left navigation menu.

    {{< nav-icon "tasks" >}}

2. In the list of tasks, hover over the task you would like to export and click
   the **{{< icon "gear" >}}** that appears.
3. Select **Export**.
4. There are multiple options for downloading or saving the task export file:
    - Click **Download JSON** to download the exported JSON file.
    - Click **Save as template** to save the export file as a task template.
    - Click **Copy to Clipboard** to copy the raw JSON content to your machine's clipboard.
