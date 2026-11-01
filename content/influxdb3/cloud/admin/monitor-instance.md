---
title: Monitor your instance
seotitle: Monitor your {{< product-name >}} instance in the Admin UI
description: >
  Use the instance Overview page in the {{< product-name >}} Admin UI to view
  instance details, size, CPU and memory metrics, ingest and query rates,
  storage, and object storage request usage.
menu:
  influxdb3_cloud:
    parent: Administer InfluxDB
    name: Monitor your instance
weight: 105
influxdb3/cloud/tags: [monitor, metrics, admin ui, usage, storage]
related:
  - /influxdb3/cloud/admin/databases/
  - /influxdb3/cloud/admin/tokens/
  - /influxdb3/cloud/admin/users/admin-ui/
  - /influxdb3/cloud/query-data/execute-queries/admin-ui/
---

Use the instance **Overview** page in the {{% product-name %}} Admin UI to
monitor the health, size, and usage of your instance.
The page shows instance details, the compute resources allocated to each
component, CPU and memory metrics, ingest and query rates, and storage and
object storage request history.

- [Open the Overview page](#open-the-overview-page)
- [View instance details](#view-instance-details)
- [View instance size](#view-instance-size)
- [View instance metrics](#view-instance-metrics)
- [View storage and usage](#view-storage-and-usage)
- [Backups](#backups)

## Open the Overview page

1.  Go to [console.influxdata.com](https://console.influxdata.com) and sign in.
2.  Select your instance.
3.  In the navigation, select **Overview**.

{{< img-hd src="/img/influxdb3/influxdb3-cloud-admin-ui-instance-overview.png" alt="The instance Overview page showing the Instance Details card with current-month usage and the Instance Size card" />}}

Users with the account **Admin**, **Member**, or **Auditor** role can view the
Overview page.
If you don't have access to an instance, ask an account **Admin** to
[update your roles](/influxdb3/cloud/admin/users/admin-ui/#user-roles-and-permissions).

## View instance details

The **Instance Details** card lists the following properties:

- **Name**: The instance name.
  To rename the instance, click the pencil icon next to the name, enter a new
  name, and then save it.
  Renaming an instance requires the account **Admin** role.
- **Status**: The instance state.
  The Admin UI displays one of the following:
  - **Starting**: The instance is starting up.
  - **Ready**: The instance is running.
  - **Pending deletion**: The instance is scheduled for deletion.
  - **Deleted**: The instance is deleted.
- **Category**: The instance category, such as **Contract** or **POC**.
- **Created On**: The date the instance was created.
- **Region**: The cloud provider region where the instance runs.
- **Availability Zones**: The availability zones that the instance uses.
- **Instance ID**: The unique identifier of the instance.
  Click the copy icon to copy it.
- **Instance URL**: The URL of the instance.
  Click the copy icon to copy it.
  Use this URL as the host when you
  [write](/influxdb3/cloud/write-data/) or
  [query](/influxdb3/cloud/query-data/) data.

If usage data is available for the instance, the card also shows a **Usage**
section with the following tiles for the current month:

- **Storage Used**: The amount of object storage that the instance uses.
- **Tier 1 API Requests (Current Month)**: The number of tier 1 object storage
  requests.
- **Tier 2 API Requests (Current Month)**: The number of tier 2 object storage
  requests.

A tile displays an em dash (—) when no value is available.

> [!Important]
> #### Tier 1 and tier 2 counts are object storage requests
>
> The **Tier 1 API Requests** and **Tier 2 API Requests** tiles, and the
> **API Calls** chart described in [View storage and usage](#view-storage-and-usage),
> count requests that your instance makes to the cloud provider's object
> storage service, such as Amazon S3 or Azure Blob Storage.
> They _don't_ count InfluxDB HTTP API calls, such as the write or query
> requests that your applications send to the instance.
> To monitor write and query request rates, use the
> [**Ingest Request Rate** and **Query Request Rate** charts](#view-instance-metrics).

## View instance size

The **Instance Size** card shows the total CPU allocated to the instance, in
vCPUs, and the CPU allocated to each component.
For a component that scales automatically, the card shows an **Auto** label
and the component's vCPU range, and the total is shown as a range.

The card lists the following components:

- **Ingest**: Processes line protocol submitted in write requests and persists
  time series data to object storage.
- **Query**: Handles query requests and returns query results.
- **Compaction**: Processes and compresses partitions to optimize storage, and
  updates the catalog with the locations of compacted data.

The card lists components that run scheduled tasks, such as the processing
engine, under **Additional components**.
Click **Additional components** to expand the list.
If the card can't retrieve component information, it displays
"Component information is currently unavailable."

The Instance Size card is read-only.
To change the size of your instance, [contact InfluxData support](https://support.influxdata.com).

## View instance metrics

The **Instance Metrics** panel charts CPU, memory, and request metrics for the
instance and for each component.

### Change the time range

By default, the charts show the last hour.
Use the time range menu in the upper right of the panel to change the range:

- Under **Quick ranges**, select **Last Minute**, **Last 5 Minutes**,
  **Last 30 Minutes**, **Last Hour**, **Last 12 Hours**, **Last Day**, or
  **Last Month**.
- Under **Absolute range**, enter **From** and **To** times.
  Metrics are available for the last 30 days.

To refresh the charts automatically, turn on **Live Updates**.
Live updates are available only for ranges of one hour or less.

### Chart reference

The panel groups charts by category.
CPU is measured in vCPUs, and memory is shown as a percentage of the memory
allocated.

| Group | Chart | Unit |
| :---- | :---- | :--- |
| Instance Totals | **CPU Usage** | vCPUs |
| Instance Totals | **Memory Usage** | Usage % |
| Ingest | **Ingest CPU** | vCPUs |
| Ingest | **Ingest Memory** | Usage % |
| Ingest | **Ingest Line Protocol Rate** | Lines/sec |
| Ingest | **Ingest Bytes Rate** | MB/s |
| Ingest | **Ingest Request Rate** | Requests/sec |
| Query | **Query CPU** | vCPUs |
| Query | **Query Memory** | Usage % |
| Query | **Query Request Rate** | Requests/sec |
| Compaction | **Compaction CPU** | vCPUs |
| Compaction | **Compaction Memory** | Usage % |

### Use the charts

Use the charts to understand how your workload uses the instance:

- **Instance Totals**: Compare **CPU Usage** with the total vCPUs on the
  [Instance Size card](#view-instance-size) to see how much headroom the
  instance has.
- **Ingest charts**: Track write volume.
  **Ingest Line Protocol Rate** shows lines written per second,
  **Ingest Bytes Rate** shows the volume of data written, and
  **Ingest Request Rate** shows the number of write requests per second.
  Use these charts to confirm that a change in your writers, such as a new
  Telegraf agent or a larger batch size, has the effect that you expect.
- **Query charts**: Track read load.
  **Query Request Rate** shows the number of query requests per second.
  Compare it with **Query CPU** and **Query Memory** to find periods when
  queries drive resource use.
- **Compaction charts**: Track background work that optimizes stored data.
  Brief increases in **Compaction CPU** after heavy writes are normal.
  If **Compaction CPU** or **Compaction Memory** stays high for a sustained
  period, compaction might not be keeping up with your write volume.
  Compare the chart with the ingest charts to see whether a rise in write
  volume matches the increase, and [contact InfluxData support](https://support.influxdata.com)
  if the usage doesn't return to normal.

## View storage and usage

The **Storage & Usage** section charts storage and object storage requests
over time.
Each chart has its own time range menu with the following options:
**1 Week**, **30 Days**, **60 Days**, **90 Days**, and **1 Year**.
The default is **30 Days**.

- **Total Instance File Size**: The total size of the data files that the
  instance stores.
- **API Calls**: A bar chart of object storage requests, with a series for
  **Tier 1** and a series for **Tier 2**.
  Turn on **Show Total** to add a series that combines both tiers.
  As described in [View instance details](#view-instance-details), these
  figures count object storage requests, not InfluxDB HTTP API calls.

## Backups

The Overview page also includes a **Backups** card for managing instance
backups.
