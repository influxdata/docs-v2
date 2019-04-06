---
title: InfluxDB Cloud release notes
description: Important changes and notes introduced in each InfluxDB Cloud 2 update.
weight: 101
menu:
  v2_0_cloud:
    parent: About InfluxDB Cloud
    name: Release notes
---

## v2.0 [2019-04-05]

### Features

* Insert Flux function near cursor in Flux Editor.
* Enable the use of variables in the Data Explorer and Cell Editor Overlay.
* Add a variable control bar to dashboards to select values for variables.
* Add ability to add variable to script from the side menu.
* Use time range for meta queries in Data Explorer and Cell Editor Overlay.
* Fix screen tearing bug in raw data view.
* Add copy to clipboard button to export overlays.
* Enable copying error messages to the clipboard from dashboard cells.
* Add the ability to update token's status in token list.
* Allow variables to be re-ordered within control bar on a dashboard.
* Add the ability to delete a template.
* Save user preference for variable control bar visibility and default to visible.
* Add the ability to clone a template
* Add the ability to import a variable.

### Bug Fixes

* Logout works in Cloud 2.0 UI.
* Single sign-on works between https://cloud2.influxdata.com and https://us-west-2- 1.aws.cloud2.influxdata.com.
* Able to copy error message from UI.
* Able to change a task from every to cron.
* Able to create a new bucket when switching between periodically and never (retention options).
* Fix mismatch in bucket row and header.
* Allows user to edit note on cell.
* Fix empty state styles in scrapers in org view.
* Fix bucket creation error when changing rentention rules types.
* Fix task creation error when switching schedule types.
* Fix hidden horizontal scrollbars in flux raw data view.
* Fix screen tearing bug in raw data View.
* Fix routing loop.

### UI Improvements
* Move bucket selection in the query builder to the first card in the list.
* Ensure editor is automatically focused in Note Editor.
* Add ability to edit a template's name.
