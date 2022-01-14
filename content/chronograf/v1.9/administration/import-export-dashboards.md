---
title: Import and export Chronograf dashboards
description: Share dashboard JSON files between Chronograf instances, or add dashboards as resources to include in a deployment. 
menu:
  chronograf_1_9:
    weight: 120
    parent: Administration
---

Chronograf makes it easy to recreate robust dashboards without having to manually configure them from the ground up. Import and export dashboards between instances, or add dashboards as resources to include in a deployment.

- [Export a dashboard](#export-a-dashboard)  
- [Load a dashboard as a resource](#load-a-dashboard-as-a-resource)
- [Import a dashboard](#import-a-dashboard)  
- [Required user roles](#required-user-roles)  

## Required user roles

All users can export a dashboard. To import a dashboard, a user must have an Admin or Editor role.

| Task vs Role     | Admin | Editor | Viewer |
|------------------|:-----:|:------:|:------:|
| Export Dashboard | ✅    | ✅     | ✅     |
| Import Dashboard | ✅    | ✅     | ❌     |

## Export a dashboard

1. On the Dashboards page, hover over the dashboard you want to export, and then click the **Export**
   button on the right.

      <img src="/img/chronograf/1-6-dashboard-export.png" alt="Exporting a Chronograf dashboard" style="width:100%;max-width:912px"/>

      This downloads a JSON file containing dashboard information including template variables, cells and cell information such as the query, cell-sizing, color scheme, visualization type, etc.

    > No time series data is exported with a dashboard.
    > Exports include only dashboard-related information as mentioned above.

## Load a dashboard as a resource

Automatically load the dashboard as a resource (useful for adding a dashboard to a deployment).

1. Rename the dashboard `.json` extension to `.dashboard`.
2. Use the [`resources-path` configuration option](/chronograf/v1.9/administration/config-options/#--resources-path) to save the dashboard in the `/resources` directory (by default, `/usr/share/chronograf/resources`).

## Import a dashboard

1. On your Dashboards page, click the **Import Dashboard** button.
2. Either drag and drop or select the JSON export file to import.
3. Click the **Upload Dashboard** button.

The newly imported dashboard is included in your list of dashboards.

![Importing a Chronograf dashboard](/img/chronograf/1-6-dashboard-import.gif)

### Reconcile unmatched sources

If the data sources defined in the imported dashboard file do not match any of your local sources,
reconcile each of the unmatched sources during the import process, and then click **Done**.

![Reconcile unmatched sources](/img/chronograf/1-6-dashboard-import-reconcile.png)
