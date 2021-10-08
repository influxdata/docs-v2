---
title: Load data from sources in the InfluxDB user interface (UI)
seotitle: Load data source in UI
list_title: Load data source in UI
weight: 101
description: >
  Load data from sources in the InfluxDB user interface (UI). Choose from popular client libraries (such as Python, Ruby, Scala, and more!) or load data with a Telegraf plugin (like MQTT Consumer, MySQL, File, and many more!).
menu:
  influxdb_2_0:
    name: Load data source in UI
    parent: Write data
---

Load data from the following sources in the InfluxDB user interface (UI):

- [CSV or line protocol file](#load-csv-or-line-protocol-in-ui)
- [Line protocol](#load-data-using-line-protocol)
- [Client libraries](#load-data-from-a-client-library-in-the-ui)
- [Telegraf plugins](#load-data-from-a-telegraf-plugin-in-the-ui)

### Load CSV or line protocol in UI

Load CSV or line protocol data by uploading a file or pasting the data manually into the UI.

1. In the navigation menu on the left, click **Data (Load Data)** > **Sources**.
    {{< nav-icon "data" >}}
2. Under **File Upload**, select the type of data to upload:
    - **Annotated CSV**. Verify your CSV file follows the supported [annotated CSV](/influxdb/cloud/reference/syntax/annotated-csv/) syntax.
    - **Line Protocol**. Verify your line protocol file adheres to the following conventions:  
       - Each line represents a data point.
        - Each data point requires a:  
          - [*measurement*](/influxdb/cloud/reference/syntax/line-protocol/#measurement)
          - [*field set*](/influxdb/cloud/reference/syntax/line-protocol/#field-set)
          - (Optional) [*tag set*](/influxdb/cloud/reference/syntax/line-protocol/#tag-set) 
          - [*timestamp*](/influxdb/cloud/reference/syntax/line-protocol/#timestamp)
         
          For more information, see supported [line protocol](/influxdb/cloud/reference/syntax/line-protocol/) syntax.

2. Select the bucket to write to.
4. Select the **Precision** in the dropdown menu. By default, the precision is set to nanoseconds.
5. Do one of the following:
   - To upload file, drag and drop your file onto the UI, and then click **Write Data**.
   - To enter data manually, select the **Enter Manually** tab, paste your data, and then click **Write Data**.

### Load data from a client library in the UI

1.  In the navigation menu on the left, click **Data (Load Data)** > **Sources**.
    {{< nav-icon "data" >}}
2. Do one of the following:
   - Enter a specific client library to search for in the **Search data writing methods** field.
   - Scroll down to browse available client libraries.
3. Click the client library to load data from.
4. Under **Code Sample Options**, you'll see a list of your InfluxDB [tokens](/influxdb/v2.0/reference/glossary/#token) and [buckets](/influxdb/v2.0/reference/glossary/#bucket). Select both an API token and a bucket to write your data to. The selected API token and bucket are automatically added to scripts on the page that you can use to initialize a client and write data.
5. Click the **Copy to Clipboard** buttons under a script to easily paste the script into your terminal or save the script to reuse for automation.
6. Run the scripts on the page to do the following as needed:
   - Install the package, libraries, or client
   - Write data
   - Execute a Flux query

### Load data from a Telegraf plugin in the UI

1. In the navigation menu on the left, click **Data (Load Data)** > **Sources**.
    {{< nav-icon "data" >}}
2. Do one of the following:
   - Enter a specific Telegraf plugin to search for in the **Search data writing methods** field.
   - Scroll down to browse available plugins.
3. Click the plugin to load data from.
4. [Install Telegraf](/telegraf/v1.15/introduction/installation/).
5. Copy the default configuration script in the UI, and then add the script to [Configure Telegraf](/telegraf/v1.15/introduction/getting-started/#configure-telegraf).
6. Adjust configuration settings as needed. To find configuration settings for a specific plugin, see [Telegraf plugins](/telegraf/v1.15/plugins/).
7. (Optional) To add the Telegraf configuration to InfluxDB, see [Telegraf configuration](/influxdb/v2.0/telegraf-configs/).
