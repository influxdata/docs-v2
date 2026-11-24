---
title: Import and export dashboards
seotitle: Import and export InfluxDB 3 Explorer dashboards and Grafana dashboards
description: >
  Export InfluxDB 3 Explorer dashboards as Grafana dashboard JSON, import
  Explorer and Grafana dashboard files, map databases between instances, and
  inspect a dashboard as JSON.
menu:
  influxdb3_explorer:
    name: Import and export
    parent: Dashboards
weight: 104
related:
  - /influxdb3/explorer/dashboards/
  - /influxdb3/enterprise/visualize-data/grafana/, Use Grafana to visualize data
---

{{% product-name %}} exports dashboards as Grafana dashboard JSON, which both
Explorer and Grafana can import.
Use it to back up a dashboard, copy it to another Explorer, or move it to or
from Grafana.

- [Export a dashboard](#export-a-dashboard)
- [Import a dashboard](#import-a-dashboard)
- [What carries over](#what-carries-over)
- [Send a query to Grafana](#send-a-query-to-grafana)
- [Limitations](#limitations)

## Export a dashboard

1.  In the dashboard menu, select **Export…**.
2.  To import the file into another Explorer or connection, turn on
    **Share with another instance**.
    The file then asks for a database at import instead of naming one.
3.  Click **Export**.

If some settings can't be represented in Grafana, Explorer lists them.

## Import a dashboard

1.  On the **Dashboards** page, click **Import**, and select one or more JSON
    files.
2.  Choose **Create new**, or **Replace an existing dashboard** (one file).
    A replaced dashboard keeps its link, and its old state stays in
    [version history](/influxdb3/explorer/dashboards/versions/).
3.  If Explorer asks, choose a **Database** for each database in the file,
    and then click **Import**.

{{< img-hd src="/img/influxdb3/explorer-dashboard-import-mapping.png" alt="Import Dashboard dialog explaining that the file was exported to share with another instance, with one database input mapped to a database on this connection." />}}

## What carries over

- Supported queries, chart types, and options.
- The time range, auto-refresh, rows, shared cursor, and each cell's own time.
- Annotation sources. Hand-placed notes are kept in the file but don't show in
  Grafana.

When you import a Grafana dashboard, Explorer can use a Line chart for an
unsupported panel type if it recognizes a query target.
If Explorer can't convert the panel or recognize a query target, it skips the
panel.
Check the imported dashboard to see which panels Explorer imported and how they
appear.

Exported queries follow Grafana's time picker: Explorer adds
`$__timeFilter(time)` to SQL and `$timeFilter` to InfluxQL, and removes them
again on import.
To see exactly what an export writes, select **Inspect dashboard JSON** in the
dashboard menu.

## Send a query to Grafana

To send a Data Explorer query to Grafana, first go to
**Configure** > **Integrations**, enter your **Grafana URL/Endpoint** and a
**Grafana API Token** from a Grafana service account, and click
**Save Grafana Configuration**.
Then, in the Data Explorer, select **Export to Grafana** from **Export**.
Dashboard files don't need this.

## Limitations

- Files exported from v1.12 lose their cell databases when imported into
  Explorer v1.11 or earlier.
- InfluxQL queries with a subquery, several statements, `INTO`, or comments are
  exported unchanged and don't follow Grafana's time picker.
  Add `$timeFilter` to them in Grafana.
