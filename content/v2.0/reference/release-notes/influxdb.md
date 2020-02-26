---
title: InfluxDB v2.0 release notes
description: Important changes and and what's new in each version of InfluxDB.
menu:
  v2_0_ref:
    name: InfluxDB
    parent: Release notes
weight: 101
---

## v2.0.0-beta.5 [2020-02-26]

### Features
- Update Flux to v0.61.0.
- Add secure flag to session cookie.

### Bug Fixes
- Sort dashboards on homepage alphabetically.
- Tokens page now sorts by status.
- Set the default value of tags in a check.
- Fix sort by variable type.
- Calculate correct stacked line cumulative when lines are different lengths.
- Resource cards are scrollable.
- Query Builder groups on column values, not tag values.
- Scatterplots render tooltips correctly.


## v2.0.0-beta.4 [2020-02-14]

### Features
- Added labels to buckets.
- Connect Monaco Editor to Flux LSP server.
- Update Flux to v0.59.6.

### Bug Fixes
- Revert bad indexing of `UserResourceMappings` and `Authorizations`.
- Prevent gauge visualization from becoming too small.

---

## v2.0.0-beta.3 [2020-02-11]

### Features
- Extend `influx cli pkg command` with ability to take multiple files and directories.
- Extend `influx cli pkg command` with ability to take multiple URLs, files,
  directories, and stdin at the same time.
- `influx` CLI can manage secrets.

### Bug Fixes
- Fix notification rule renaming panics in UI.
- Fix the tooltip for stacked line graphs.
- Fixed false success notification for read-only users creating dashboards.
- Fix issue with pkger/http stack crashing on duplicate content type.

---

## v2.0.0-beta.2 [2020-01-24]

### Features
- Change Influx packages to be CRD compliant.
- Allow trailing newline in credentials file and CLI integration.
- Add support for prefixed cursor search to ForwardCursor types.
- Add backup and restore.
- Introduce resource logger to tasks, buckets and organizations.

### Bug Fixes
- Check engine closed before collecting index metrics.
- Reject writes which use any of the reserved tag keys.

### UI Improvements
- Swap `billingURL` with `checkoutURL`.
- Move Cloud navigation to top of page instead of within left side navigation.
- Adjust aggregate window periods to use duration input with validation.

---

## v2.0.0-beta.1 [2020-01-08]

### Features
- Add support for notification endpoints to `influx` templates and packages.
- Drop `id` prefix for secret key requirement for notification endpoints.
- Add support for check resource to `pkger` parser.
- Add support for check resource `pkger` dry run functionality
- Add support for check resource `pkger` apply functionality
- Add support for check resource `pkger` export functionality
- Add new `kv.ForwardCursor` interface.
- Add support for notification rule to `pkger` parser.
- Add support for notification rule `pkger` dry run functionality
- Add support for notification rule `pkger` apply functionality.
- Add support for notification rule `pkger` export functionality.
- Add support for tasks to `pkger` parser.
- Add support for tasks to `pkger` dry run functionality
- Add support for tasks to `pkger` apply functionality.
- Add support for tasks to `pkger` export functionality.
- Add `group()` to Query Builder.
- Add last run status to check and notification rules.
- Add last run status to tasks.
- Extend `pkger` apply functionality with ability to provide secrets outside of package.
- Add hide headers flag to `influx` CLI task find command.
- Manual overrides for readiness endpoint.
- Drop legacy inmem service implementation in favor of KV service with inmem dependency.
- Drop legacy bolt service implementation in favor of KV service with bolt dependency.
- While creating check, also display notification rules that would match check based on tag rules.
- Increase default bucket retention period to 30 days.
- Add toggle to table thresholds to allow users to choose between setting threshold colors to text or background.
- Add developer documentation.
- Capture User-Agent header as query source for logging purposes.

### Bug Fixes
- Ensure environment variables are applied consistently across command and fixes issue where `INFLUX_` environment variable prefix was not set globally.
- Remove default frontend sorting when flux queries specify sorting.
- Store canceled task runs in the correct bucket.
- Update `sortby` functionality for table frontend sorts to sort numbers correctly.
- Prevent potential infinite loop when finding tasks by organization.
- Retain user input when parsing invalid JSON during import.
- Fix test issues due to multiple flush/sign-ins being called in the same test suite.
- Update `influx` CLI to show only "see help" message, instead of the whole usage.
- Fix notification tag-matching rules and enable tests to verify.
- Extend y-axis when stacked graph is selected.
- Fix query reset bug that was resetting query in script editor whenever dates were changed.
- Fix table threshold bug defaulting set colors to the background.
- Time labels no longer squished to the left.
- Fix underlying issue with disappearing queries made in Advanced Mode.
- Prevent negative zero and allow zero to have decimal places.
- Limit data loader bucket selection to non system buckets.

### UI Improvements
- Add honeybadger reporting to create checks.

---

## v2.0.0-alpha.21 [2019-12-13]

### Features
- Add stacked line layer option to graphs.
- Annotate log messages with trace ID, if available.
- Bucket create to accept an organization name flag.
- Add trace ID response header to query endpoint.

### Bug Fixes
- Allow table columns to be draggable in table settings.
- Light up the home page icon when active.
- Make numeric inputs first class citizens.
- Prompt users to make a dashboard when dashboards are empty.
- Remove name editing from query definition during threshold check creation.
- Wait until user stops dragging and releases marker before zooming in after threshold changes.
- Adds properties to each cell on `GET /dashboards/{dashboardID}`.
- Gracefully handle invalid user-supplied JSON.
- Fix crash when loading queries built using the query builder.
- Create cell view properties on dashboard creation.
- Update scrollbar style.
- Fixed table UI threshold colorization issue.
- Fixed windowPeriod issue that stemmed from Webpack rules.
16175: Added delete functionality to note cells so that they can be deleted
- Fix failure to create labels when creating Telegraf configs
- Fix crash when editing a Telegraf config.
- Updated start/end time functionality so that custom script time ranges overwrite dropdown selections.

---

## v2.0.0-alpha.20 [2019-11-20]

### Features
- Add TLS insecure skip verify to influx CLI.
- Extend influx cli user create to allow for organization ID and user passwords to be set on user.
- Auto-populate organization IDs in the code samples.
- Expose bundle analysis tools for front end resources.
- Allow users to view just the output section of a Telegraf config.
- Allow users to see string data in single stat graph type.

### Bug Fixes
- Fix long startup when running `influx help`.
- Mock missing Flux dependencies when creating tasks.
- Ensure array cursor iterator stats accumulate all cursor stats.
- Hide Members section in Cloud environments.
- Change how cloud mode is enabled.
- Merge front end development environments.
- Refactor table state logic on the front end.
- Arrows in tables show data in ascending and descending order.
- Sort by retention rules now sorts by second.
- Horizontal scrollbar no longer covering data;
- Allow table columns to be draggable in table settings.
- Light up the home page icon when active.
- Make numeric inputs first-class citizens.
- Prompt users to make a dashboard when dashboards are empty.
- Remove name editing from query definition during threshold check creation.
- Wait until user stops dragging and releases marker before zooming in after threshold changes.

### UI Improvements
- Redesign cards and animations on Getting Started page.
- Allow users to filter with labels in Telegraf input search.

---

## v2.0.0-alpha.19 [2019-10-30]

### Features
- Add shortcut for toggling comments and submitting in Script Editor.

### UI Improvements
- Redesign page headers to be more space-efficient.
- Add 403 handler that redirects back to the sign-in page on oats-generated routes.

### Bug Fixes
- Ensure users are created with an active status.
- Added missing string values for `CacheStatus` type.
- Disable saving for threshold check if no threshold selected.
- Query variable selector shows variable keys, not values.
- Create Label overlay disables the submit button and returns a UI error if name field is empty.
- Log error as info message on unauthorized API call attempts.
- Ensure `members` and `owners` endpoints lead to 404 when organization resource does not exist.
- Telegraf UI filter functionality shows results based on input name.
- Fix Telegraf UI sort functionality.
- Fix task UI sort functionality.
- Exiting a configuration of a dashboard cell properly renders the cell content.
- Newly created checks appear on the checklist.
- Changed task runs success status code from 200 to 201 to match Swagger documentation.
- Text areas have the correct height.

---

## v2.0.0-alpha.18 [2019-09-26]

### Features
- Add jsonweb package for future JWT support.
- Added the JMeter Template dashboard.

### UI Improvements
- Display dashboards index as a grid.
- Add viewport scaling to html meta for responsive mobile scaling.
- Remove rename and delete functionality from system buckets.
-  Prevent new buckets from being named with the reserved `_` prefix.
- Prevent user from selecting system buckets when creating Scrapers, Telegraf configurations, read/write tokens, and when saving as a task.
- Limit values from draggable threshold handles to 2 decimal places.
- Redesign check builder UI to fill the screen and make more room for composing message templates.
- Move Tokens tab from Settings to Load Data page.
- Expose all Settings tabs in navigation menu.
- Added Stream and table functions to query builder.

### Bug Fixes
- Remove scrollbars blocking onboarding UI step.

---

## v2.0.0-alpha.17 [2019-08-14]

### Features
- Optional gzip compression of the query CSV response.
- Add task types.
- When getting task runs from the API, runs will be returned in order of most recently scheduled first.

### Bug Fixes
- Fix authentication when updating a task with invalid org or bucket.
- Update the documentation link for Telegraf.
- Fix to surface errors properly as task notifications on create.
- Fix limiting of get runs for task.

---

## v2.0.0-alpha.16 [2019-07-25]

### Bug Fixes
- Add link to documentation text in line protocol upload overlay.
- Fix issue in Authorization API, can't create auth for another user.
- Fix Influx CLI ignored user flag for auth creation.
- Fix the map example in the documentation.
- Ignore null/empty Flux rows which prevents a single stat/gauge crash.
- Fixes an issue where clicking on a dashboard name caused an incorrect redirect.
- Upgrade templates lib to 0.5.0.
- Upgrade giraffe lib to 0.16.1.
- Fix incorrect notification type for manually running a task.
- Fix an issue where canceled tasks did not resume.

---

## v2.0.0-alpha.15 [2019-07-11]

### Features
- Add time zone support to UI.
- Added new storage inspection tool to verify TSM files.

### Bug Fixes
- Fix incorrect reporting of tasks as successful when errors occur during result iteration.

#### Known Issues
The version of Flux included in Alpha 14 introduced `null` support.
Most issues related to the `null` implementation have been fixed, but one known issue remains –
The `map()` function panics if the first record processed has a `null` value.

---

## v2.0.0-alpha.14 [2019-06-28]

### Features
- Add `influxd inspect verify-wal` tool.
- Move to [Flux 0.34.2](/v2.0/reference/release-notes/flux/#v0-34-2-2019-06-27) -
  includes new string functions and initial multi-datasource support with `sql.from()`.
- Only click save once to save cell.
- Enable selecting more columns for line visualizations.

### UI Improvements
- Draw gauges correctly on HiDPI displays.
- Clamp gauge position to gauge domain.
- Improve display of error messages.
- Remove rendering bottleneck when streaming Flux responses.
- Prevent variable dropdown from clipping.

---

## v2.0.0-alpha.13 [2019-06-13]

### Features
- Add static templates for system, Docker, Redis, Kubernetes.

---

## v2.0.0-alpha.12 [2019-06-13]

### Features
- Enable formatting line graph y ticks with binary prefix.
- Add x and y column pickers to graph types.
- Add option to shade area below line graphs.

### Bug Fixes
- Fix performance regression in graph tooltips.

---

## v2.0.0-alpha.11 [2019-05-31]

### Bug Fixes
- Correctly check if columnKeys include xColumn in heatmap.

---

## v2.0.0-alpha.10 [2019-05-30]

### Features
- Add heatmap visualization type.
- Add scatterplot graph visualization type.
- Add description field to tasks.
- Add CLI arguments for configuring session length and renewal.
- Add smooth interpolation option to line graphs.

### Bug Fixes
- Removed hardcoded bucket for Getting Started with Flux dashboard.
- Ensure map type variables allow for selecting values.
- Generate more idiomatic Flux in query builder.
- Expand tab key presses to two spaces in the Flux editor.
- Prevent dragging of variable dropdowns when dragging a scrollbar inside the dropdown.
- Improve single stat computation.
- Fix crash when opening histogram settings with no data.

### UI Improvements
- Render checkboxes in query builder tag selection lists.
- Fix jumbled card text in Telegraf configuration wizard.
- Change scrapers in scrapers list to be resource cards.
- Export and download resource with formatted resource name with no spaces.

---

## v2.0.0-alpha.9 [2019-05-01]

{{% warn %}}
**This will remove all tasks from your InfluxDB v2.0 instance.**

Before upgrading, [export all existing tasks](/v2.0/process-data/manage-tasks/export-task/). After upgrading, [reimport your exported tasks](/v2.0/process-data/manage-tasks/create-task/#import-a-task).
{{% /warn %}}

### Features
- Set autorefresh of dashboard to pause if absolute time range is selected.
- Switch task back end to a more modular and flexible system.
- Add org profile tab with ability to edit organization name.
- Add org name to dashboard page title.
- Add cautioning to bucket renaming.
- Add option to generate all access token in tokens tab.
- Add option to generate read/write token in tokens tab.
- Add new Local Metrics Dashboard template that is created during Quick Start.

### Bug Fixes
- Fixed scroll clipping found in label editing flow.
- Prevent overlapping text and dot in time range dropdown.
- Updated link in notes cell to a more useful site.
- Show error message when adding line protocol.
- Update UI Flux function documentation.
- Update System template to support math with floats.
- Fix the `window` function documentation.
- Fix typo in the `range` Flux function example.
- Update the `systemTime` function to use `system.time`.

### UI Improvements
- Add general polish and empty states to Create Dashboard from Template overlay.

---

## v2.0.0-alpha.8 [2019-04-12]

### Features
- Add the ability to edit token's description.
- Add the option to create a dashboard from a template.
- Add the ability to add labels on variables.
- Add switch organizations dropdown to home navigation menu item.
- Add create org to side nav.
- Add "Getting Started with Flux" template.
- Update to Flux v0.25.0.

### Bug Fixes
- Update shift to timeShift in Flux functions sidebar.

### UI Improvements
- Update cursor to grab when hovering draggable areas.
- Sync note editor text and preview scrolling.
- Add the ability to create a bucket when creating an organization.

---

## v2.0.0-alpha.7 [2019-03-28]

### Features
- Insert Flux function near cursor in Flux Editor.
- Enable the use of variables in the Data Explorer and Cell Editor Overlay.
- Add a variable control bar to dashboards to select values for variables.
- Add ability to add variable to script from the side menu.
- Use time range for meta queries in Data Explorer and Cell Editor Overlay.
- Fix screen tearing bug in raw data view.
- Add copy to clipboard button to export overlays.
- Enable copying error messages to the clipboard from dashboard cells.
- Add the ability to update token's status in token list.
- Allow variables to be re-ordered within control bar on a dashboard.
- Add the ability to delete a template.
- Save user preference for variable control bar visibility and default to visible.
- Add the ability to clone a template.
- Add the ability to import a variable.

### Bug Fixes
- Fix mismatch in bucket row and header.
- Allows user to edit note on cell.
- Fix empty state styles in scrapers in org view.
- Fix bucket creation error when changing retention rules types.
- Fix task creation error when switching schedule types.
- Fix hidden horizontal scrollbars in flux raw data view.
- Fix screen tearing bug in raw data View.
- Fix routing loop.

### UI Improvements
- Move bucket selection in the query builder to the first card in the list.
- Ensure editor is automatically focused in Note Editor.
- Add ability to edit a template's name.

---

## v2.0.0-alpha.6 [2019-03-15]

### Release Notes

{{% warn %}}
We have updated the way we do predefined dashboards to [include Templates](https://github.com/influxdata/influxdb/pull/12532)
in this release which will cause existing Organizations to not have a System
dashboard created when they build a new Telegraf configuration.
In order to get this functionality, remove your existing data and start from scratch.

_**This will remove all data from your InfluxDB v2.0 instance including time series data.**_

###### Linux and macOS
```sh
rm ~/.influxdbv2/influxd.bolt
```

Once completed, `v2.0.0-alpha.6` can be started.
{{% /warn %}}

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

---

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

---

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

---

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

---

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

---

## v2.0.0-alpha.1 [2019-01-23]

This is the initial alpha release of InfluxDB 2.0.
