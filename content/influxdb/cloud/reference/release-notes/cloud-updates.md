---
title: InfluxDB Cloud monthly updates
description: Important changes and what's new in each InfluxDB Cloud update.
weight: 101
menu:
  influxdb_cloud_ref:
    parent: Release notes
    name: Monthly updates
aliases:
  - /cloud/about/release-notes
  - /influxdb/cloud/reference/release-notes/influxdb-cloud
---

InfluxDB Cloud updates occur frequently. Find a compilation of recent updates below.

## January 2021

- [New AWS and Microsoft regions](#aws-and-microsoft-regions)
- [Microsoft social sign-on](#microsoft-social-sign-on)
- [Flux updates](#flux-updates)
- [InfluxDB community templates](#influxdb-community-templates)
- [Load Data updates](#load-data-updates)
- [Visualization updates](#visualization-updates)
- [CLI updates](#cli-updates)
- [API updates](#api-updates)
- [Task updates](#task-updates)

### AWS and Microsoft regions

- Add support for the following new regions:

  - [AWS US East (Virginia) region](/influxdb/cloud/reference/regions/#amazon-web-services-aws)
  - [Microsoft Azure regions](/influxdb/cloud/reference/regions/#microsoft-azure)

### Microsoft social sign-on

- Add [Microsoft (Windows Live) social sign-on](https://cloud2.influxdata.com/signup). Use your Windows Live credentials to easily sign in to your InfluxDB Cloud account.

### Flux updates

- Update to [Flux v0.100.0](/influxdb/cloud/reference/release-notes/flux/#v0-100-0-2021-01-07).

### InfluxDB community templates

- Access any [InfluxDB community template](https://github.com/influxdata/community-templates#templates) directly in the Cloud user interface (UI). For more details, see how to [install and customize a template in the UI](/influxdb/cloud/influxdb-templates/cloud/).

- Use the new [InfluxDB 2 Operational Monitoring community template](https://github.com/influxdata/community-templates/tree/master/influxdb2_operational_monitoring) to monitor InfluxDB 2.0.

### Load Data updates

  - Redesign the Load Data page to increase discovery and ease of use. Now, you can [load data from sources directly in the InfluxDB user interface](/influxdb/cloud/write-data/load-data/).
  - Add support for new data sources:
    - InfluxDB v2 Listener
    - NSD
    - OPC-UA
    - Windows Event Log

### Visualization updates

  - Add new [Band Plot visualization](/influxdb/v2.0/visualize-data/visualization-types/band/).
  - Usability improvements to visualizations:
    - Add properties for storing your tick generation selections, including a `generateAxisTicks` property to turn this feature on and off.
    - Add the `legendColorizeRows` property to toggle the color on and off in the legend.

### CLI updates

- Usability improvements to `influx` CLI:
  - Add option to print raw query results in [`influx query`](/influxdb/cloud/reference/cli/influx/query/).
  - Add ability to export resources by name using [`influx export`](/influxdb/cloud/reference/cli/influx/export/).
  - Add new processing options and enhancements to [`influx write`](/influxdb/cloud/reference/cli/influx/write/).
  - Add `--active-config` flag to [`influx`](/influxdb/cloud/reference/cli/influx/) commands to set the configuration for a single command.
  - Add `max-line-length` flag to the [`influx write`](/influxdb/cloud/reference/cli/influx/write/) command to address "token too long" errors for large inputs.
  - Add `--force` flag to the [`influx stacks rm`](/influxdb/cloud/reference/cli/influx/stacks/remove/) command, which lets you remove a stack without the confirmation prompt.
  - Add `influxd` configuration options for storage options and InfluxQL coordinator tuning.
  - Allow password to be specified as a CLI option in [`influx v1 auth create`](/influxdb/cloud/reference/cli/influx/v1/auth/create/#flags).
  - Allow password to be specified as a CLI option in [`influx v1 auth set-password`](/influxdb/cloud/reference/cli/influx/v1/auth/set-password/).
  - Improve ID-related error messages for [`influx v1 dbrp`] commands.

### API updates

- [List all buckets](/influxdb/cloud/api/#operation/GetBuckets) in the API now supports the `after` parameter as an alternative to `offset`.
- Add the `v1/authorization` package to support authorizing requests to the InfluxDB 1.x API.

### Task updates

- Record the last success and failure run times in tasks.
- Inject the task option `latestSuccessTime` in Flux Extern.

## 2020-9-25

### Install and customize InfluxDB community templates in the Cloud UI

Install and customize any [InfluxDB community template](https://github.com/influxdata/community-templates#templates) directly in the Cloud user interface (UI). For more details, see how to [install and customize a template in the UI](/influxdb/cloud/influxdb-templates/cloud/).

## 2020-09-02

### Pricing updates and Azure region

- Update [pricing vectors](/influxdb/cloud/account-management/pricing-plans/#pricing-vectors) to determine pricing by the total data out and query count.

- Add [Microsoft Azure support](/influxdb/cloud/reference/regions/#microsoft-azure) for the `eastus` and `westeurope` regions. Each region has a unique InfluxDB Cloud URL and API endpoint.

### Flux updates

 - Add time-weighted average [`timeWeightedAvg()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/timeweightedavg/).
 - Update [`integral()` function](/influxdb/cloud/reference/flux/stdlib/built-in/transformations/aggregates/integral/) with linear interpolation.
 - Add [Flux query profiler](/influxdb/cloud/reference/flux/stdlib/profiler/#use-the-query-profiler) to output query statistics that help you better understand query performance.
 - Add [`tasks.lastSuccess()` function](/influxdb/cloud/reference/flux/stdlib/influxdb-tasks/lastsuccess/) to retrieve the time of the last successful run of an InfluxDB task.
 - Add the [`array.from` function](/influxdb/cloud/reference/flux/stdlib/experimental/array/from/) to build ad hoc tables in a Flux script.

### Bug fixes

 - Resolve issues in checks and notifications.

## 2019-09-10 _Monitoring & Alerts_

## Features
- **InfluxDB OSS 2.0 alpha-17** –
  _See the [alpha-17 release notes](/influxdb/v2%2E0/reference/release-notes/influxdb/#v200-alpha17-2019-08-14) for details._
- Alerts and Notifications to Slack (Free Plan), PagerDuty and HTTP (Usage-based Plan).
- Rate limiting on cardinality for Free Plan.
- Billing notifications.
- Pricing calculator.
- Improved Signup flow.

## 2019-07-23 _General Availability_

### Features

- **InfluxDB OSS 2.0 alpha-15** –
  _See the [alpha-9 release notes](/influxdb/v2%2E0/reference/release-notes/influxdb/#v200-alpha15-2019-07-11) for details._
- Usage-based Plan.
- Adjusted Free Plan rate limits.
- Timezone selection in the user interface.

---

## 2019-05-06 _Public Beta_

### Features

- Add rate limiting for Free Plan users.
- Add client libraries for Go and JS.

### Bug fixes

- Users cannot delete themselves from their Cloud account.
- The bucket retention period for Free Plan users is set to 72 hours.
- Free Plan users cannot change a bucket's retention period.

---

## 2019-05-02

### Features

- **InfluxDB OSS 2.0 alpha-9** –
  _See the [alpha-9 release notes](/influxdb/v2%2E0/reference/release-notes/influxdb/#v200-alpha9-2019-05-01) for details._

### Bug fixes

- Usage statistics on the Usage page show correct values.
- Existing tasks with duration specified in nanoseconds no longer need to be resubmitted.
- Removed the additional user that showed up as an owner under the Cloud organization.
- Cloud users can use CLI tools to interact with their Cloud tenant.


---

## 2019-04-05

### Features

- **InfluxDB OSS 2.0 alpha-7** –
  _See the [alpha-7 release notes](/influxdb/v2%2E0/reference/release-notes/influxdb/#v200-alpha7-2019-03-28) for details._

### Bug fixes

- Logout works in InfluxDB Cloud UI.
- Single sign-on works between https://cloud2.influxdata.com and https://us-west-2-1.aws.cloud2.influxdata.com.
- Able to copy error message from UI.
- Able to change a task from every to cron.
- Able to create a new bucket when switching between periodically and never (retention options).
