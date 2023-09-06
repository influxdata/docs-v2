---
title: Manage queries in Chronograf
description: Manage queries using the Queries page in Chronograf.
menu:
  chronograf_v1:
    name: Manage Chronograf queries
    weight: 100
    parent: Administration
---

Chronograf lets you manage Flux and InfluxQL queries using the Queries page.  

### View queries

1. Open Chronograf in your web browser, and select **Admin {{< icon "crown" >}}**.
2. Click on **InfluxDB**. 
3. Click the **Queries** tab to go to the Queries Page.

The first column lists all the databases in your Influx instance and the queries running on that database appear in the Query column.  The Duration column depicts the duration of your query and the Status column shows the status of each query.  The refresh rate in the upper righthand corner can be set to a vareity of refresh rates using the dropdown menu.

### Kill a running query

1. Open Chronograf in your web browser and select **Admin {{< icon "crown" >}}** in the sidebar. 
2. Click on **InfluxDB**. 
3. Click the **Queries** tab to go to the Queries Page.  You will see a list of databases on the quereis running on them.  Locate the query you want to kill.
4. Got to the **Status** column.
5. Hover over **running**.  A red box with **Kill** will appear. 
6. Click on the **Kill** box and a **Confirm** box will appear. Click on **Confirm** to kill the query. 

### Download queries to a .csv file

1. Open Chronograf in your web browser, and select **Admin {{< icon "crown" >}}**. 
2. Click on **InfluxDB**. 
3. Click the **Queries** tab.
4. Click the **CSV** button in the upper-righthand corner.
5. The CSV file is downloaded to your Downlaods folder. 

