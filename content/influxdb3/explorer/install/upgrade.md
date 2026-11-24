---
title: Upgrade InfluxDB 3 Explorer
seotitle: Upgrade InfluxDB 3 Explorer
description: >
  Upgrade InfluxDB 3 Explorer without losing dashboards or saved queries:
  what changes when you upgrade to v1.12, how to roll back, and how to bring
  earlier work onto a signed-in account after upgrading to v1.11.
menu:
  influxdb3_explorer:
    name: Upgrade Explorer
    parent: Install Explorer
weight: 2
metadata: [Explorer v1.11+]
related:
  - /influxdb3/explorer/authentication/
  - /influxdb3/enterprise/admin/explorer-ui/#migrate-data-from-the-311-ui, Migrate data from the 3.11 UI
---

Upgrading {{% product-name %}} keeps your dashboards, saved queries, query
history, and connections.
For what changes in v1.12, see [Upgrade to v1.12](#upgrade-to-v112).
The rest of this page covers upgrading to v1.11, which added
[user authentication](/influxdb3/explorer/authentication/).

- [Upgrade to v1.12](#upgrade-to-v112)
- [Roll back to v1.11](#roll-back-to-v111)
- [Before you upgrade](#before-you-upgrade)
- [What happens to existing data](#what-happens-to-existing-data)
- [Bring your earlier work across](#bring-your-earlier-work-across)
- [Re-enter saved keys](#re-enter-saved-keys)
- [Resolve "Explorer's data belongs to another deployment"](#resolve-explorers-data-belongs-to-another-deployment)
- [Servers that don't require sign-in](#servers-that-dont-require-sign-in)

For the integrated Explorer UI in InfluxDB 3 Enterprise, see
[Migrate data from the 3.11 UI](/influxdb3/enterprise/admin/explorer-ui/#migrate-data-from-the-311-ui)
in the InfluxDB 3 Enterprise documentation.

## Upgrade to v1.12 {metadata="v1.12+"}

- **Docker**: run `influxdata/influxdb3-ui:1.12.0` with the same `/db` volume
  and `SESSION_SECRET_KEY`. See [Before you upgrade](#before-you-upgrade).
- **Integrated Explorer UI**:
  [upgrade InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/upgrade/) to
  3.12.3, which includes Explorer v1.12.0.
  Enterprise 3.12.0–3.12.2 include v1.11.0, so this also applies the v1.11.1
  and v1.11.2 changes.

Your dashboards, queries, and history carry over unchanged.
What changes:

- **Stored chart results are cleared.**
  Earlier versions saved every chart's last result so **Export** could return
  it.
  v1.12 saves only the query and reruns it on **Export**, so exports show
  current data.
  Each time v1.12 starts, it clears old stored results and compacts its
  database.
  On the integrated Explorer UI, this frees space in Explorer's 16 MiB
  database, which could fill up in earlier versions.
- **The Data Explorer layout resets** to the default the first time.
- **Grafana files** exported from v1.12 lose their cell databases if imported
  into an earlier Explorer.
- **Forecasting lives in InfluxDB.** If you
  [turn it on](/influxdb3/explorer/visualize-data/forecast/), the plugin and
  its triggers stay on the server, even if you roll Explorer back.

## Roll back to v1.11 {metadata="v1.12+"}

You can roll back to v1.11.2 (Docker) or to the Explorer v1.11.0 in Enterprise
3.12.2 and earlier.
The earlier version shows everything from before v1.12, with these limits:

- Histogram, Heatmap, Candlestick, and State timeline cells show as Line
  charts.
- v1.12 settings (chart options, rows, notes, versions, a cell's own time) and
  **Recently deleted** are hidden.
- Dashboard forecasts keep running; disable their triggers in
  [Manage Plugins](/influxdb3/explorer/manage-plugins/) if needed.
- Run a chart again before you export it.

When you upgrade to v1.12 again, everything comes back.
Avoid editing cells that use the new chart types while on v1.11.

## Before you upgrade

If you run the [Explorer Docker container](/influxdb3/explorer/install/docker/):

- **Keep the same `SESSION_SECRET_KEY`.**
  Explorer uses the session secret to recognize each browser and match it to
  the work saved from that browser before the upgrade.
  If the session secret changes, or if you didn't set one, Explorer can't
  match a browser to its earlier work.
  See [Environment variables](/influxdb3/explorer/install/docker/#environment-variables).
- **Keep the mounted `/db` directory.**
  See [Persist data across restarts](/influxdb3/explorer/install/docker/#persist-data-across-restarts).
- **Check file ownership** if you upgrade from v1.6 or earlier.
  See [Set file permissions for upgrades](/influxdb3/explorer/install/docker/#set-file-permissions-for-upgrades).

## What happens to existing data

When Explorer v1.11 or later starts for the first time, it copies the existing
data to a backup inside its database before it changes the database for user
accounts.
Earlier work stays in that backup until a browser brings it across.

## Bring your earlier work across

The first time someone signs in from a browser that used Explorer before the
upgrade, Explorer displays **Bring your earlier work across?**
The dialog lists what the browser holds, such as dashboards, saved queries,
query history, and connections.

- Click **Bring it across** to move the work onto your account.
  Explorer then displays **Your earlier work is here**.
- Click **Leave it** to keep your account empty.

Nothing is deleted either way, and Explorer asks only once in each browser.

If some dashboards were built against a different server than the one you
signed in to, the dialog says so.
Those dashboards keep their cells and queries, but the queries might name
databases that don't exist on the current server.

## Re-enter saved keys

Explorer never brings saved keys and tokens across.
After you bring your work across, re-enter the keys that the dialog lists:

| Key                      | Where to enter it                   |
| :----------------------- | :---------------------------------- |
| AI API key               | **Configure** > **Integrations**    |
| Grafana API token        | **Configure** > **Integrations**    |
| Database token           | **Configure** > **Servers**         |
| Object store credentials | **Configure** > **CL Builder**      |

When the server requires sign-in, Explorer connects with each user's own
credentials, so users don't need a database token to query the server they
signed in to.

## Resolve "Explorer's data belongs to another deployment"

If Explorer's stored data was created on a different InfluxDB 3 cluster than
the one it's connected to now, Explorer displays
**Explorer's data belongs to another deployment** instead of the **Sign in**
page.
Nobody can sign in until a user with the **Admin** role decides what happens
to the data.

If the current cluster doesn't have any users yet, Explorer opens the setup
page instead, and creating the first user there resets the data without
asking.
For a restored cluster whose user IDs identify the same people, create the
first user with the `influxdb3` CLI to keep the data.
See [Set up the first user](/influxdb3/explorer/authentication/set-up-first-user/).

> [!Warning]
> #### Reset deletes every user's Explorer data
>
> **Reset the data** deletes the query history, dashboards, connections,
> AI and Grafana settings, and chat history of every user.
> You can't undo a reset.

To resolve the deployment mismatch:

1.  Select one of the following:

    - **Keep the data**: the current cluster was restored from the previous
      one, and its user IDs identify the same people.
    - **Reset the data**: this is a different cluster.
      Explorer starts empty for everyone.

2.  Enter the **Username** and **Password** of a user with the **Admin** role.
3.  Click **Continue**.
    If you selected **Reset the data**, click **Reset data** to confirm.

The decision requires a username and password.
A server that signs users in only through an identity provider can't complete
it in Explorer.

## Servers that don't require sign-in

If the InfluxDB 3 server doesn't require sign-in, Explorer restores each
browser's earlier work automatically and doesn't display
**Bring your earlier work across?**
