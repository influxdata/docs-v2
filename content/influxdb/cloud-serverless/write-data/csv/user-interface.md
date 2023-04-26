---
title: Use the InfluxDB UI to write CSV data
description: >
  Use the InfluxDB user interface (UI) to write CSV data to InfluxDB.
menu:
  influxdb_cloud_serverless:
    name: Use the InfluxDB UI
    identifier: write-csv-ui
    parent: Write CSV data
weight: 202
related:
  - /influxdb/cloud-serverless/reference/syntax/annotated-csv/
---

Use the InfluxDB user interface (UI) to write CSV data to InfluxDB.

1.  In the navigation menu on the left, click **Load Data** > **Sources**.

    {{< nav-icon "data" >}}

2.  Under **File Upload**, select **Upload a CSV**.
    Verify your CSV file follows the supported
    [annotated CSV](/influxdb/cloud-serverless/reference/syntax/annotated-csv/) syntax.
  
3.  Select the bucket to write to.
4.  Do one of the following:

    - To upload file, drag and drop your file onto the UI.
    - To enter data manually, select the **Enter Manually** tab and then paste
      your annotated CSV data.

5. Click **Write Data**.
