---
title: InfluxDB v2.0 release notes
description:
menu:
  v2_0_ref:
    name: Release notes
    weight: 1
---

## v2.0.0-alpha.6 [2019-03-15]

### Release Notes

{{% warn %}}
We have updated the way we do predefined dashboards to [include Templates](https://github.com/influxdata/influxdb/pull/12532)
in this release which causes existing organizations to not have a System dashboard created when they build a new Telegraf configuration.
_**Remove your bolt db and go through initial setup process again.
This will delete your tokens, dashboards, tasks, and other non-time series data**_,
but will not impact you existing time series data.
Provide a new token to anything writing data into the system.

###### Linux and macOS
```sh
rm ~/.influxdbv2/influxd.bolt
```

Once completed, InfluxDB v2.0.0-alpha.5 can be started.
{{% /warn %}}

Once completed, `v2.0.0-alpha.6` can be started.

### Features
- Add ability to import a dashboard.
- Add ability to import a dashboard from organization view.
- Add ability to export a dashboard and a task.
- Add `run` subcommand to `influxd` binary. This is also the default when no subcommand is specified.
- Add ability to save a query as a variable from the Data Explorer.
- Add System template on onboarding.

### Bug Fixes
- Stop scrollbars from covering text in Flux editor.

### UI Improvements
- Fine tune keyboard interactions for managing labels from a resource card.


## v2.0.0-alpha.5 [2019-03-08]

{{% warn %}}
This release includes a breaking change to the format in which Time-Structured Merge Tree (TSM) and index data are stored on disk.
_**Existing local data will not be queryable after upgrading to this release.**_

Prior to installing this release, remove all storage-engine data from your local InfluxDB 2.x installation.
To remove only TSM and index data and preserve all other other InfluxDB 2.x data (organizations, buckets, settings, etc),
run the following command.

###### Linux and macOS
```sh
rm -r ~/.influxdbv2/engine
```

Once completed, InfluxDB v2.0.0-alpha.5 can be started.
{{% /warn %}}


### Features
- Add labels to cloned tasks.
- Add ability to filter resources by clicking a label.
- Add ability to add a member to org.
- Improve representation of TSM tagsets on disk.
- Add ability to remove a member from org.
- Update to Flux v0.21.4.

### Bug Fixes
- Prevent clipping of code snippets in Firefox.
- Prevent clipping of cell edit menus in dashboards.

### UI Improvements
- Make code snippet copy functionality easier to use.
- Always show live preview in note cell editor.
- Redesign scraper creation workflow.
- Show warning in Telegraf and scraper lists when user has no buckets.
- Streamline label addition, removal, and creation from the dashboards list.


## v2.0.0-alpha.4 [2019-02-21]

### Features
- Add the ability to run a task manually from tasks page.
- Add the ability to select a custom time range in explorer and dashboard.
- Display the version information on the login page.
- Add the ability to update a variable's name and query.
- Add labels to cloned dashboard.
- Add ability filter resources by label name.
- Add ability to create or add labels to a resource from labels editor.
- Update to Flux v0.20.

### Bug Fixes
- Update the bucket retention policy to update the time in seconds.

### UI Improvements
- Update the preview in the label overlays to be shorter.
- Add notifications to scrapers page for created/deleted/updated scrapers.
- Add notifications to buckets page for created/deleted/updated buckets.
- Update the admin page to display error for password length.

## v2.0.0-alpha.3 [2019-02-15]

### Features
- Add the ability to name a scraper target.
- Display scraper name as the first and only updatable column in scrapers list.
- Add the ability to view runs for a task.
- Display last completed run for tasks list.
- Add the ability to view the logs for a specific task run.

### Bug Fixes
- Update the inline edit for resource names to guard for empty strings.
- Prevent a new template dashboard from being created on every Telegraf config update.
- Fix overlapping buttons in Telegraf verify data step.

### UI Improvements
- Move the download Telegraf config button to view config overlay.
- Combine permissions for user by type.

## v2.0.0-alpha.2 [2019-02-07]

### Features
- Add instructions button to view `$INFLUX_TOKEN` setup for Telegraf configs.
- Save the `$INFLUX_TOKEN` environmental variable in Telegraf configs.
- Update Tasks tab on Organizations page to look like Tasks Page.
- Add view button to view the Telegraf config toml.
- Add plugin information step to allow for config naming and configure one plugin at a time.
- Update Dashboards tab on Organizations page to look like Dashboards Page.

### Bug Fixes
- Update the System Telegraf Plugin bundle to include the Swap plugin.
- Revert behavior allowing users to create authorizations on behalf of another user.

### UI Improvements
- Change the wording for the plugin config form button to "Done."
- Change the wording for the Collectors configure step button to "Create and Verify."
- Standardize page loading spinner styles.
- Show checkbox on "Save As" button in data explorer.
- Make collectors plugins side bar visible in only the configure step.
- Swap retention policies on Create bucket page.

## v2.0.0-alpha.1 [2019-01-23]

This is the initial alpha release of InfluxDB 2.0.
