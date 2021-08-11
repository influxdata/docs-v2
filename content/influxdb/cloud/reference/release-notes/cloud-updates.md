---
title: InfluxDB Cloud updates
description: Important changes and what's new in each InfluxDB Cloud update.
weight: 101
menu:
  influxdb_cloud_ref:
    parent: Release notes
    name: InfluxDB Cloud updates
aliases:
  - /cloud/about/release-notes
  - /influxdb/cloud/reference/release-notes/influxdb-cloud
---

InfluxDB Cloud updates occur frequently. Find a compilation of recent updates below.
To find information about the latest Flux updates in InfluxDB Cloud, see [Flux release notes](/influxdb/cloud/reference/release-notes/flux/).

## August 2021 

- Add support for [explicit bucket schemas](/influxdb/cloud/organizations/buckets/bucket-schema/), which lets you enforce explicit schemas for each InfluxDB measurement, including column names, tags, fields, and data types.
- Add ability to convert [notebook cells into raw Flux script](influxdb/cloud/notebooks/create-notebook/#view-and-edit-flux-script-in-a-cell). Now you can view and edit the code. 

## July 2021 

- Add new [Asia Pacific (Australia) region](https://ap-southeast-2-1.aws.cloud2.influxdata.com).
- Redesign the View Raw Data table in Data Explorer. Group keys and data types are now easily identifiable underneath column headings. 
- Dashboard improvements: 
   - Add ability to add an [annotation to a specific time range](/influxdb/cloud/visualize-data/annotations/). 
   - Add ability to [automatically refresh dashboard](/influxdb/cloud/visualize-data/dashboards/control-dashboard/#automatically-refresh-dashboard).  
   - Add new static legend to Graph and Band Plot visualizations. 

## May 2021

- Add new [Cloud 2 Usage Dashboard template](https://github.com/influxdata/community-templates/tree/master/usage_dashboard) to monitor your Cloud usage data, including rate limiting events. For more detail on Cloud data usage and rate limiting events, see how to [view InfluxDB Cloud data usage](/influxdb/cloud/account-management/data-usage/). For more detail on how to install and customize this template, see [InfluxDB templates in InfluxDB Cloud](/influxdb/cloud/influxdb-templates/cloud/).

- Add support for [using annotations](/influxdb/cloud/visualize-data/annotations/) in your dashboards.
- Add new [map visualization](/influxdb/cloud/visualize-data/visualization-types/map/) to display geo-temporal data.

## April 2021

- Add new [GCP Europe West (Belgium) region](/influxdb/cloud/reference/regions/#google-cloud-platform-gcp).
- Add [mosaic visualization](/influxdb/cloud/visualize-data/visualization-types/mosaic/). Use this visualization to display state changes in your time series data.
- Add [notebooks](/influxdb/cloud/notebooks/). Use notebooks to build and share ways to explore, visualize, and process your time series data. Learn how notebooks can help you [downsample](/influxdb/cloud/notebooks/downsample/) and [normalize](/influxdb/cloud/notebooks/clean-data/) your time series data.

## January 2021

- [New AWS and Microsoft regions](#aws-and-microsoft-regions)
- [Microsoft social sign-on](#microsoft-social-sign-on)
- [InfluxDB community templates](#influxdb-community-templates)
- [Load Data updates](#load-data-updates)
- [Visualization updates](#visualization-updates)
- [CLI updates](#cli-updates)
- [API updates](#api-updates)
- [Task updates](#task-updates)
- [Telegraf plugins in UI](#telegraf-plugins-in-ui)
- [Performance improvements](#performance-improvements)

### AWS and Microsoft regions

- Add support for Microsoft Azure and new AWS regions:
  - [Microsoft Azure](/influxdb/cloud/reference/regions/#microsoft-azure):
     - West Europe (Amsterdam) region
     - East US (Virginia) region
  - [AWS](/influxdb/cloud/reference/regions/#amazon-web-services-aws):
     - US East (Virginia) region

### Microsoft social sign-on

- Add [Microsoft (Windows Live) social sign-on](https://cloud2.influxdata.com/signup). Use your Windows Live credentials to easily sign in to your InfluxDB Cloud account.
### InfluxDB community templates

- Access any [InfluxDB community template](https://github.com/influxdata/community-templates#templates) directly in the Cloud user interface (UI). For more details, see how to [install and customize a template in the UI](/influxdb/cloud/influxdb-templates/cloud/).

- Use the new [InfluxDB 2 Operational Monitoring community template](https://github.com/influxdata/community-templates/tree/master/influxdb2_operational_monitoring) to monitor InfluxDB OSS 2.0.

### Load Data updates

  - Redesign the Load Data page to increase discovery and ease of use. Now, you can [load data from sources directly in the InfluxDB user interface](/influxdb/cloud/write-data/load-data/).
  - Add support for new data sources:
    - InfluxDB v2 Listener
    - NSD
    - OPC-UA
    - Windows Event Log

### Visualization updates

  - Add new [Band Plot visualization](/influxdb/v2.0/visualize-data/visualization-types/band/).
  - Add the `legendColorizeRows` property to toggle the color on and off in the legend.

### CLI updates

- Usability improvements to `influx` CLI:
  - Add option to print raw query results in [`influx query`](/influxdb/cloud/reference/cli/influx/query/).
  - Add ability to export resources by name using [`influx export`](/influxdb/cloud/reference/cli/influx/export/).
  - Add new processing options and enhancements to [`influx write`](/influxdb/cloud/reference/cli/influx/write/).
  - Add `--active-config` flag to [`influx`](/influxdb/cloud/reference/cli/influx/) commands to set the configuration for a single command.
  - Add `max-line-length` flag to the [`influx write`](/influxdb/cloud/reference/cli/influx/write/) command to address "token too long" errors for large inputs.
  - Add `--force` flag to the [`influx stacks rm`](/influxdb/cloud/reference/cli/influx/stacks/remove/) command, which lets you remove a stack without the confirmation prompt.
  - Allow password to be specified as a CLI option in [`influx v1 auth create`](/influxdb/cloud/reference/cli/influx/v1/auth/create/#flags).
  - Allow password to be specified as a CLI option in [`influx v1 auth set-password`](/influxdb/cloud/reference/cli/influx/v1/auth/set-password/).
  - Improve ID-related error messages for [`influx v1 dbrp`] commands.

### API updates

- [List all buckets](/influxdb/cloud/api/#operation/GetBuckets) in the API now supports the `after` parameter as an alternative to `offset`.
- Add the `v1/authorization` package to support authorizing requests to the InfluxDB 1.x API.

### Task updates

- Record the last success and failure run times in tasks.
- Inject the task option `latestSuccessTime` in Flux Extern.

### Telegraf plugins in UI

- Update Telegraf plugins list in UI to include Beat, Intel PowerStats, and Rienmann.

### Performance improvements

- Promote schema and fill query optimizations to default behavior.

## 2020-9-25

### Install and customize InfluxDB community templates in the Cloud UI

Install and customize any [InfluxDB community template](https://github.com/influxdata/community-templates#templates) directly in the Cloud user interface (UI). For more details, see how to [install and customize a template in the UI](/influxdb/cloud/influxdb-templates/cloud/).

## 2020-09-02

### Pricing updates and Azure region

- Update [pricing vectors](/influxdb/cloud/account-management/pricing-plans/#pricing-vectors) to determine pricing by the total data out and query count.

- Add [Microsoft Azure support](/influxdb/cloud/reference/regions/#microsoft-azure) for the `eastus` and `westeurope` regions. Each region has a unique InfluxDB Cloud URL and API endpoint.

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
