---
title: InfluxDB Cloud release notes
description: Important changes and notes introduced in each InfluxDB Cloud 2.0 update.
weight: 101
menu:
  v2_0_cloud:
    parent: About InfluxDB Cloud
    name: Release notes
---

## 2019-05-06 – _Public Beta_

### Features
- **InfluxDB 2.0 alpha-9** –
  _See the [alpha-9 release notes](/v2.0/reference/release-notes/#v2-0-0-alpha-9-2019-05-01) for details._
- JavaScript and Go client libraries.

### Bug fixes
- Users can delete themselves from their Cloud 2.0 account.
- Free tier users bucket retention is unlimited and should be set to 72 hours.
- Retention period for buckets in free tier can be changed by users.

---

## 2019-05-02

### Bug fixes

- Usage statistics on the Usage page show correct values.
- Existing tasks with duration specified in nanoseconds no longer need to be resubmitted.
- Removed the additional user that showed up as an owner under the Cloud 2.0 organization.
- Cloud users can use CLI tools to interact with their Cloud tenant.

---

## 2019-04-05

### Features
- **InfluxDB 2.0 alpha-7** –
  _See the [alpha-7 release notes](/v2.0/reference/release-notes/#v2-0-0-alpha-7-2019-03-28) for details._

### Bug Fixes

- Logout works in InfluxDB Cloud 2.0 UI.
- Single sign-on works between https://cloud2.influxdata.com and https://us-west-2-1.aws.cloud2.influxdata.com.
- Able to copy error message from UI.
- Able to change a task from every to cron.
- Able to create a new bucket when switching between periodically and never (retention options).
