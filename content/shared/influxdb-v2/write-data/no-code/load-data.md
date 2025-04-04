
Load data from the following sources in the InfluxDB user interface (UI):

- [CSV or line protocol file](#load-csv-or-line-protocol-in-ui)
- [Line protocol](#load-data-using-line-protocol)
- [Client libraries](#load-data-from-a-client-library-in-the-ui)
- [Telegraf plugins](#load-data-from-a-telegraf-plugin-in-the-ui)

### Load CSV or line protocol in UI

Load CSV or line protocol data by uploading a file or pasting the data manually into the UI.

1. In the navigation menu on the left, click **Load Data** > **Sources**.

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

1.  In the navigation menu on the left, click **Load Data** > **Sources**.

    {{< nav-icon "data" >}}

2. Do one of the following:
   - Enter a specific client library to search for in the **Search data writing methods** field.
   - Scroll down to browse available client libraries.
3. Click the client library to load data from.
4. Under **Code Sample Options**, you'll see a list of your InfluxDB [tokens](/influxdb/version/reference/glossary/#token) and [buckets](/influxdb/version/reference/glossary/#bucket). Select both an API token and a bucket to write your data to. The selected API token and bucket are automatically added to scripts on the page that you can use to initialize a client and write data.
5. Click the **Copy to Clipboard** buttons under a script to easily paste the script into your terminal or save the script to reuse for automation.
6. Run the scripts on the page to do the following as needed:
   - Install the package, libraries, or client
   - Write data
   - Execute a Flux query

### Load data from a Telegraf plugin in the UI

1. In the navigation menu on the left, click **Load Data** > **Sources**.

   {{< nav-icon "data" >}}

2. Do one of the following:
   - Enter a specific Telegraf plugin to search for in the **Search data writing methods** field.
   - Scroll down to **Telegraf Plugins** and browse available input plugins.
3. Click the plugin to load data from. The plugin details page opens.
4. Select one of the options from the **Use this plugin** dropdown:
   - **Create a new configuration**: Enter a configuration name and select an output bucket, and then click **Continue Configuring**.
   - **Add to an existing configuration**: Select an existing Telegraf configuration to add this plugin to, and then click **Add to Existing Config**.
5. Provide a **Telegraf Configuration Name** and an optional **Telegraf Configuration Description**.
6. Adjust configuration settings as needed.
   The configuration includes settings for the [InfluxDB v2 output plugin](/telegraf/v1/plugins/#output-influxdb_v2) to write to your bucket.
   To find configuration settings for a specific plugin, see [Telegraf plugins](/telegraf/latest/plugins/).
7. Click **Save and Test**. Your input plugin configuration is appended to the default agent settings and the InfluxDB output plugin configuration.
8.  The **Test Your Configuration** page provides instructions for how to start
   Telegraf using the generated configuration.
   _See [Start Telegraf](/influxdb/cloud/write-data/no-code/use-telegraf/auto-config/#start-telegraf) below for detailed information about what each step does._
9.  Once Telegraf is running, click **Listen for Data** to confirm Telegraf is successfully sending data to InfluxDB.
   Once confirmed, a **Connection Found!** message appears.
10. Click **Finish**.
    Your Telegraf configuration name and the associated bucket name appear in the list of Telegraf configurations.
11. To view or edit the configuration, click the configuration name.
12. To view default settings used to write data to InfluxDB, click **InfluxDB Output Plugin**.
