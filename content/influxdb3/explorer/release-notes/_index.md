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

To upgrade, pull the latest Docker image:

```sh
docker pull influxdata/influxdb3-ui
```

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
