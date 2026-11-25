---
title: InfluxDB 3 Explorer release notes
description: >
  Changes and updates to InfluxDB 3 Explorer
menu:
  influxdb3_explorer:
    name: Release notes
weight: 250
related:
  - /influxdb3/explorer/
---

To upgrade, use the method you run Explorer with:

{{< expand-wrapper >}}
{{% expand "Integrated web UI (InfluxDB 3 Enterprise)" %}}
Explorer is built into InfluxDB 3 Enterprise 3.11 and later.
[Upgrade InfluxDB 3 Enterprise](/influxdb3/enterprise/admin/upgrade/)
and start it with `--mode all,webui`.
{{% /expand %}}
{{% expand "Standalone Docker image" %}}
Pull the latest image:

```sh
docker pull influxdata/influxdb3-ui
```
{{% /expand %}}
{{< /expand-wrapper >}}

## v1.11.2 {date="2026-10-27"}

#### Features

- **Cloud Serverless, Cloud Dedicated, and Clustered queries**: Explorer runs queries against InfluxDB Cloud Serverless, InfluxDB Cloud Dedicated, and InfluxDB Clustered over Arrow Flight.
- **Confirm Ask AI actions**: Ask AI asks you to confirm before it creates or deletes a database, creates a token, or writes data.
- **More sample data**: Generate the new Home Sensor, EU Wind, and Random Numbers sample datasets.
  After writing sample data, Explorer reports how many rows it wrote.
- **Anthropic model**: Use Claude Haiku 5.5 as the default model for the Anthropic AI provider.

#### Bug fixes

- **Upgrades**: Restore Query Tool tabs saved by Explorer 1.10.x and earlier, and update stock System Overview dashboards migrated from Explorer 1.10.x or earlier.
- **Sign-in and sessions**: Keep your session while InfluxDB is unreachable, tell an expired SSO sign-in apart from a rejected one, [explain a missing SSO button](/influxdb3/explorer/authentication/troubleshoot/#sign-in-with-sso-isnt-available), and return to the sign-in page when an SSO sign-in fails to start.
- **Queries**: Fix how the SQL time range is applied to subqueries, CTEs, joins, and last value cache queries; keep both values of same-named `JOIN` columns; and count every `GROUP BY time()` bucket in InfluxQL results.
- **Query Tool**: Complete column names after a lowercase `WHERE` and after `AND`/`OR`, quote cache columns and names picked from the schema, and show the reason a chart request or export failed.
- **Export**: Keep every column in CSV exports, and return a file with headers for an empty result.
- **Charts**: Show the latest value in Single Stat and Gauge charts, and read an aliased date-time column as time.
- **Dashboards**: Re-run cells only on refresh or when the cell changes, open dashboards with a cell that has no layout, and accept an uppercase `.JSON` extension on import.
- **Grafana**: Page through dashboard search, follow Grafana's time picker in exported SQL panels, and keep the sign-in session token out of Grafana.
- **Ask AI**: Sanitize HTML in answers, show every column of a query result, lock the message input until an AI provider is configured, and explain token limits and cut-off answers.
- **Plugins and triggers**: List every plugin version in the Plugin Library, install multi-file plugins into their own directory, validate cron triggers the way InfluxDB parses them, ask for confirmation before deleting a trigger or transformation, and require an admin token for the plugins API.
- **Transform Data**: Keep a stopped transformation stopped when it's edited, chain value operations on the same column, and find source tables beyond the first 64.
- **Import**: Write imported timestamps as nanoseconds, import All Time by default, report tables the destination refused, and size CSV parts to fit the InfluxDB 3 Enterprise request size limit.
- **Write data**: Give each Kafka subscription its own consumer group and each MQTT subscription its own client ID, and send the SASL mechanism shown in the Kafka form.
- **Databases and tables**: Refuse to delete the `_internal` database, reject a zero retention period, leave soft-deleted tables out of counts, and support database and table retention periods and Parquet export in InfluxDB 3 Cloud.
- **Tokens**: Add a copy button to the Token Created dialog, and mask plaintext tokens on the Setup page and in Ask AI.
- **System overview**: Count each Parquet file once, leave `_internal` out of Total Databases, and give the monitoring dashboard its own time range.
- **Command line builder**: Hide Enterprise-only flags on InfluxDB 3 Core, and build commands InfluxDB 3 accepts for MinIO, Google Cloud Storage, and Azure.
- **Standalone Docker image**: Accept `LOG_LEVEL` in any case, require a host in the InfluxDB address, and stop gracefully on `SIGTERM` and `SIGINT`.
- **Display**: Show dashboard dates, query history, and subscription errors in local time.
- **Security**: Update dependency versions.

## v1.11.1 {date="2026-10-13"}

#### Bug fixes

- **Write data**: Write large CSV and JSON imports in batches, and keep each column's type across batches.
- **Queries**: Insert the SQL time range in the right place, apply it to every part of a set operation, keep `OR` filters intact, and page InfluxQL results within the query's own `LIMIT` and `OFFSET`.
- **Dashboards**: Read and import custom time ranges, span the chart time axis over the dashboard time range, keep a cell's visualization through **Configure Query** and **Save**, and restore the language of InfluxQL cells saved without one.
- **Grafana**: Export and import native panels, time range, refresh, and layout; find the panel database anywhere in its description; and import relative ranges that match an Explorer preset.
- **Charts**: Explain why a chart has nothing to draw, and keep rotated axis labels inside the chart.
- **Ask AI**: Send each message to the AI provider once, stop showing the latest answer twice, send custom and admin AI instructions with chat requests, and show "API key is required" for an empty API key.
- **Standalone Docker image**: Stop trying to reach an unreachable server after 5 seconds, open the SQLite file named by `DATABASE_URL`, forward AI provider base URLs, and stop when Explorer's database can't be written or migrated.
- **Caches**: List a table's caches instead of failing.
- **Navigation**: Redirect `/writeData` and `/configure` to their first page, and hide caches and integrations in query mode.
- **Security**: Update dependency versions.

## v1.11.0 {date="2026-09-30"}

#### Features

- **Password sign-in**: [Sign in with a username and password](/influxdb3/explorer/authentication/#sign-in-with-a-username-and-password) when connected to an InfluxDB 3 Enterprise server that uses [user authentication](/influxdb3/enterprise/admin/security/manage-users/).
  On first run, [create the administrator account](/influxdb3/explorer/authentication/set-up-first-user/) and save the operator token.
- **Single sign-on**: [Sign in through an OpenID Connect (OIDC) provider](/influxdb3/explorer/authentication/#sign-in-with-sso).
- **Role-based access**: Explorer shows the pages and actions your [role](/influxdb3/explorer/manage-users/roles/) allows.
  After upgrading, [choose whether to keep your existing dashboards and saved queries](/influxdb3/explorer/install/upgrade/#bring-your-earlier-work-across); stored keys and tokens are not carried over.
- **Manage Users**: Add users with password, SSO, or both; assign roles; require a password reset; and delete users from the new [**Manage Users**](/influxdb3/explorer/manage-users/) page.
  [Change your own password](/influxdb3/explorer/manage-users/account/#change-your-password) from the account menu.
- **Security navigation section**: Find [**Manage Tokens**](/influxdb3/explorer/manage-tokens/) and [**Manage Users**](/influxdb3/explorer/manage-users/) under a new **Security** section in the navigation.
- **New visualization types**: Visualize query results as Area, Single Stat, Gauge, Pie, Scatter, and Ranking charts in the Data Explorer and in dashboard cells.
- **EXPLAIN in SQL**: Run `EXPLAIN` and `EXPLAIN ANALYZE` statements in the SQL editor to view query plans.
- **Flux to SQL feedback**: Rate a conversion and add an optional comment.

#### Bug fixes

- **Query mode**: Enforce read-only access on the server. In query mode, admin API endpoints now refuse requests instead of only hiding the admin pages.
- **Security**: Stop sending the InfluxDB token to plugin registry URLs, refuse registry fetches to internal addresses, and update dependency versions.
- **SQL**: Fix `SELECT *` over CTEs and subqueries without a time column failing, and show the reason a query was rejected instead of "Something went wrong".
- **Data Explorer**: Keep the Export button visible and disable it when there is nothing to export, and stop paging through results from adding history entries and re-fetching chart data.
- **Transform Data**: Fix Rename Table and Filter Data transformations that deployed but never wrote data, and show an error status when a trigger's latest run fails.
- **Downsample**: Fix jobs with minute-level intervals writing one row per series instead of one row per interval.
- **Plugins**: Fix deploys failing on InfluxDB 3.12 when a plugin has no Python dependencies, show why an install failed in the deploy dialog, and stop reporting successful package installs as errors.
- **Plugins**: Show the plugin's response status and body in Run Now, including failures, and export trigger logs as plain text.
- **Plugins**: Hide the `_internal` database from deploy dialogs, fix the copied CLI install command, display plugin names as provided by the registry, and make the Signal Generator plugin available for InfluxDB 3 Cloud servers.
- **Connections**: Accept database-scoped tokens when adding an InfluxDB 3 Enterprise server, and report a refused token instead of showing empty states.
- **Connections**: Explain an untrusted TLS certificate instead of reporting the server as unreachable, honor `DEFAULT_INFLUX_DATABASE`, and fix the Enterprise start command in the Configure Servers onboarding steps.
- **System overview**: Fix status colors and labels in the query log, fix the query history failing on Enterprise while a query is running, and fix the request count that showed the number of metric series.
- **Query history**: Fix search returning no results for terms containing an underscore.
- **Command line builder**: Show the product name instead of a number in the start command hint.
- **Caches**: Fix the empty-state message on the Distinct Value Caches tab.
- **Version display**: Show the correct release version in the sidebar.
- **Layout**: Fix page header button sizing and dashboard list spacing.

## v1.10.1 {date="2026-08-03"}

#### Bug fixes

- **Upgrades**: Restore dashboards that disappeared after upgrading from v1.9.0 with a pre-configured default server.
- **Charts**: Plot the full SQL query result instead of only the rows on the current table page.
- **SQL**: Fix `SHOW` and `DESCRIBE` statements failing in the Data Explorer.
- **Query history**: Preserve the query language so saved InfluxQL queries load in the InfluxQL editor.
- **Databases**: Keep deleted databases hidden in database selectors unless you choose to show them.
- **Dashboards**: Restore vertical scrolling on dashboard pages.
- **Plugins**: Show a clear message when the Processing Engine isn't enabled, and fix the heading of the Add Registry dialog.
- **Write data**: Improve error messages for CSV and JSON imports.
- **Security**: Update dependency versions.

## v1.10.0 {date="2026-07-29"}

#### Features

- **Plugin registries**: The Plugin Library now loads plugins from the InfluxData plugin registry, and you can add other registries by name and index URL to browse and install plugins from additional sources.
  Plugin cards show logos, New and Beta tags, and the required InfluxDB version, and each plugin page includes a copyable CLI install command.
- **Server setup guide**: The Configure Servers empty state walks you through connecting your first server, with copyable CLI commands for finding the server URL and creating an admin token.
- **Configure AI in place**: Configure a missing AI provider from a dialog without leaving the current page.
- **Stock Portfolio Tracker**: Generate live sample data with the new Stock Portfolio Tracker plugin.
- **Faster page loads**: Admin pages and the query page load on demand.

#### Bug fixes

- **Queries**: Loading a saved InfluxQL query opens the InfluxQL tab.
- **Charts**: Fit the time axis to the selected time range instead of the data extent.

## v1.9.0 {date="2026-06-22"}

#### Features

- **Flux to SQL converter (beta)**: Convert Flux queries to SQL with an AI-assisted converter in a side-by-side Flux and SQL panel.
- **InfluxQL support**: Query data with InfluxQL in the Data Explorer and dashboards. Save and load queries as InfluxQL.
- **InfluxQL visualizations**: Render line and bar charts from InfluxQL results with per-tag series grouping.
- **SQL formatting**: Format SQL queries in the query editor for improved readability.
- **Query error history**: Review a history of query errors in the query tool.
- **New Live sample data simulators**: Generate continuous live sample data with new bird data and signal generator simulators, plus shape-based sample data generation.
- **Search**: Search across databases, server configurations, and tokens.
- **Plugin logs**: Filter plugin trigger logs in an improved log viewer.
- **Run plugins on demand**: Run plugins on demand with a new **Run now** button.
- **Improved Database selector**: Find databases faster with an autocomplete database selector across the application.
- **Core upgrade path**: See upgrade guidance when you reach InfluxDB 3 Core limits.

#### Bug fixes

- **Charts**: Classify boolean columns as group dimensions and treat the legacy `_measurement` column as series metadata.
- **Server switching**: Debounce server switching and prevent a race condition when switching active servers.
- **AI provider**: Require a valid API key when switching AI providers, with a clearer error message when it's missing.
- **Query tool**: Improve the query toolbar, layout, and responsive sizing of the input and result panels.

## v1.8.0 {date="2026-04-29"}

#### Features

- **Streaming data subscriptions (beta)**: Stream data into Explorer from MQTT, Kafka, and AMQP sources with field mapping, message format configuration, and contextual help for each provider.
- **Line protocol preview**: Get a live schema preview and inline parse-error surfacing while writing line protocol, so problems show up before you submit.
- **Query history and saved queries**: Browse query history with query metadata, then save, manage, and re-run named queries from the query tool.
- **Interactive sample data**: Browse a redesigned sample data page with dataset descriptions, line protocol preview, and schema mapping.
- **Custom sample data with AI**: Generate custom sample datasets from a natural-language prompt to quickly write familiar sample data into a database.
- **Live sample data plugins**: Configure and run processing engine plugins that continuously generate live sample data, with editable trigger arguments and advanced options.
- **Retention period management**: Set, update, or clear retention periods on both databases and individual tables. Duration fields accept flexible humantime values.
- **Write-to-Explore navigation**: Jump directly from a successful write to the Data Explorer to immediately query the data.

#### Bug fixes

- **Line protocol writes**: Improve handling of write size limits with clearer error messages.
- **Triggers**: Fix trigger name resolution and trigger-to-plugin mapping in the plugins UI.
- **Errors**: Improve error handling and output clearer messages for failed InfluxDB requests.
- **System databases**: Restore visibility of the `_internal` database in the Data Explorer, Tables page, and Tokens page.
- **Timestamps**: Support ISO-8601 timestamp strings during value serialization.
- **Query tool**: Fix the query tool redirect after switching server configurations.

## v1.7.0 {date="2026-04-14"}

#### Breaking changes

- **Container user change**: The Docker container now runs as non-root user `influxui` (uid 1500) instead of root for improved security.
- **Upgrade action**: See [Install and run InfluxDB 3 Explorer with Docker](/influxdb3/explorer/install/docker/#set-file-permissions-for-upgrades)
  for upgrade file permission steps.

#### Features

- **Transform Data**: Rename tables (measurements), rename columns, transform values (such as unit conversions), and filter rows from a dedicated Transform Data page with dry-run testing.
- **Downsample**: Define and manage downsampling rules to reduce data resolution over time.
- **Import from InfluxDB**: Import data from an existing InfluxDB v1, v2, or v3 instance with target selection, dry-run preview, and import monitoring.
- **Table management page**: Create, manage, and delete tables in a dedicated Table Management page.
- **Database management actions**: Manage databases from a new actions menu on a restyled Manage Databases page.
- **Line protocol validation**: Get clearer, inline validation when writing data with line protocol.
- **TLS certificate management**: Generate and renew short-lived TLS certificates for IP-based deployments.
- **Storage type display**: View the configured storage type for your InfluxDB instance in the metrics UI.
- **Non-root container**: The container now runs as a non-root user (uid 1500) for improved security.

#### Bug fixes

- **Databases**: Fix navigation when database names contain slashes; fix database selector width.
- **Code snippets**: Add sticky headers and rename the "View code" button for clarity.
- **Ask AI**: Fix serialization for renamed Anthropic provider fields.
- **Deleted databases**: Auto-show deleted items when a deleted database is selected.

## v1.6.3 {date="2026-02-19"}

#### Features

- **Show deleted databases**: Toggle visibility of deleted databases in the database list and data explorer.
- **Upgrade information for Core users**: View Enterprise upgrade details directly in Explorer.
- **AI model updates**: Updated AI model support for latest Anthropic models.

#### Bug fixes

- **SQL**: Fix handling of table names containing dashes and improve quoted identifier validation.
- **SQL**: Improve validation for forbidden SQL keywords in queries.
- **Charts**: Fix date display in the DataChart component.
- **Schema**: Fix schema columns mapping.
- **Security**: Update dependency versions (axios, qs, react-router, lodash-es).

## v1.6.2 {date="2026-01-14"}

#### Bug fixes

- **Ask AI**: Fix Ask AI service proxy routing over the InfluxData endpoint.

## v1.6.1 {date="2026-01-09"}

#### Bug fixes

- **Charts**: Fix date display in the chart component.
- **Forms**: Fix validation logic for form inputs.

## v1.6.0 {date="2025-12-18"}

_Released alongside [InfluxDB 3.8](/influxdb3/core/release-notes/#v380)._

#### Features

- **Ask AI custom instructions**: Teach Ask AI your naming conventions, specify which measurements or tags matter most, and define how you want results formatted.
  Custom instructions persist across sessions, users, and shared environments.
- **Improved line protocol experience**: Clearer validation and more helpful feedback when writing data using line protocol.

#### Bug fixes

- **Plugins**: Fix plugin trigger error state not clearing after a successful run.
- **Charts**: Reduce unnecessary chart re-renders for improved performance.
- **Data import**: Fix error message for file limit to clarify upgrade options.

## v1.5.2 {date="2025-12-10"}

Maintenance release with internal improvements.

## v1.5.1 {date="2025-12-03"}

#### Features

- **Timestamp precision detection**: Automatically detect timestamp precision when writing data.
- **Updated charting library**: Replace Recharts with ECharts for improved chart rendering and feature parity.

#### Bug fixes

- **Dashboards**: Fix dashboard display issues.
- **Write API**: Fix timestamp precision handling in write requests.

## v1.5.0 {date="2025-11-20"}

_Released alongside [InfluxDB 3.7](/influxdb3/core/release-notes/#v370)._

#### Features

- **One-click system monitoring**: Enable monitoring with a single action to begin collecting host-level metrics.
  A built-in dashboard tracks system metrics alongside database activity over time.
- **System overview dashboard**: View memory pressure, query performance, and write performance metrics in a single dashboard to understand how your system performs under load.

#### Bug fixes

- **Monitoring**: Fix error handling in instant monitoring setup.
- **Monitoring**: Fix monitoring SQL queries to use correct identifier quoting.

## v1.4.0 {date="2025-10-31"}

_Released alongside [InfluxDB 3.6](/influxdb3/core/release-notes/#v360)._

#### Features

- **Ask AI (beta)**: Query your data conversationally without writing SQL—for example,
  "show CPU usage by region over the last hour."
  Ask AI can also handle operational tasks such as database creation, token generation, and configuration adjustments.
- **Dashboard import and export**: Share dashboards between environments or move them between Explorer and Grafana using compatible JSON files.
- **TLS and CA certificate support**: Configure custom CA certificates and skip verification for self-signed certificates.

#### Bug fixes

- **SQL**: Fix handling of capitalized table and column names.
- **Caching**: Improve empty state handling in cache creation dialogs.
- **Grafana**: Fix Grafana refresh interval parsing.
- **Dashboards**: Fix dashboard cell rendering and data updates.

## v1.3.1 {date="2025-10-21"}

Update dependency versions.

## v1.3.0 {date="2025-09-30"}

_Released alongside [InfluxDB 3.5](/influxdb3/core/release-notes/#v350)._

#### Features

- **Dashboards**: Save and organize queries in dashboards with auto-refresh, custom time ranges, and resizable cells.
  Navigate between the data explorer and dashboards to build queries and save results.
- **Last Value Cache and Distinct Value Cache querying**: Run ad hoc queries against built-in caches from the data explorer for instant results.
- **License information**: View license details for your InfluxDB instance.
- **Server configuration editing**: Edit server configuration settings directly from Explorer.

#### Bug fixes

- **Databases**: Fix database layout and request handling.
- **Caching**: Fix cache query formatting and error handling.

## v1.2.1 {date="2025-09-03"}

#### Bug fixes

- **Permissions**: Restrict access to integrations, caches, and plugins in query mode.
- **Performance**: Fix performance issues.

## v1.2.0 {date="2025-08-27"}

_Released alongside [InfluxDB 3.4](/influxdb3/core/release-notes/#v340)._

#### Features

- **Cache management UI**: Create and manage Last Value Caches and Distinct Value Caches through the Explorer UI under **Configure > Caches**.
- **Parquet export**: Export query results as Parquet files.
- **Grafana data source setup**: Configure InfluxDB 3 as a Grafana data source directly from Explorer.
- **System overview improvements**: Add a refetch button and full-length query tooltips to system overview query tables.

#### Bug fixes

- **SQL**: Fix SQL query ordering to sort results in ascending order by time.
- **Data types**: Improve data type serialization for InfluxDB field types.
- **Navigation**: Fix navigation logic.

## v1.1.1 {date="2025-08-07"}

#### Bug fixes

- **Plugins**: Fix plugin and trigger card layout and icon display.
- **Plugins**: Fix trigger error status display.
- **Plugins**: Fix trigger logs dialog title.
- **Permissions**: Fix permission table cell alignment.
- **Performance**: Improve request handling performance.

## v1.1.0 {date="2025-07-30"}

_Released alongside [InfluxDB 3.3](/influxdb3/core/release-notes/#v330)._

#### Features

- **Plugin management**: Discover plugins from the Plugin Library and install them in seconds.
  Inspect output logs, edit plugin arguments, and manage triggers for both library plugins and custom plugins.
  Requires InfluxDB 3 Core or Enterprise 3.3 or later.
- **System health overview**: View a high-level dashboard of your entire system covering memory pressure, query performance, and write performance metrics.
- **AI provider settings**: Configure multiple AI providers (such as OpenAI) with API key management.

#### Bug fixes

- **Charts**: Fix date range selector.
- **Schema**: Fix schema viewer display.
- **Line protocol**: Improve line protocol conversion.
- **Data export**: Fix system table data export.

## v1.0.3 {date="2025-07-03"}

#### Bug fixes

- **Schema**: Fix schema viewer display.

## v1.0.2 {date="2025-07-03"}

#### Bug fixes

- **Performance**: Fix browser caching issues with module federation assets.

## v1.0.1 {date="2025-07-02"}

#### Bug fixes

- **Dependencies**: Fix dependency compatibility issues.

## v1.0.0 {date="2025-06-30"}

_Released alongside [InfluxDB 3.2](/influxdb3/core/release-notes/#v320). This is the initial general availability (GA) release of InfluxDB 3 Explorer._

InfluxDB 3 Explorer is a web-based UI for working with InfluxDB 3 Core and Enterprise. It provides a single interface for querying, visualizing, and managing your time series data.

#### Features

- **SQL editor**: Write and run SQL queries with autocomplete, and view results as tables or charts.
- **Database management**: Create and delete databases with point-and-click controls.
- **Token management**: Create, view, and revoke API tokens including resource-scoped tokens.
- **Data visualization**: View query results as interactive line charts with number formatting and customizable axes.
- **Data import**: Import data from CSV and JSON files, or write line protocol directly.
- **Grafana integration**: Export connection strings and configure Grafana data sources.
- **OpenAI integration**: Use natural language to generate SQL queries based on your schema.
- **Adaptive onboarding**: Optional onboarding experience that adjusts based on your experience level, with built-in sample datasets.
- **Deployment flexibility**: Run as a standalone Docker container in admin mode (full functionality) or query mode (read-only access).
