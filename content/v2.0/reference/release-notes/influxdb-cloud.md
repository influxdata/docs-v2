---
title: InfluxDB Cloud release notes
description: Important changes and and what's new in each InfluxDB Cloud 2.0 update.
weight: 101
menu:
  v2_0_ref:
    parent: Release notes
    name: InfluxDB Cloud
aliases:
  - /cloud/about/release-notes
---

## 2019-09-10 _Monitoring & Alerts_

## Features
- **InfluxDB 2.0 alpha-17** –
  _See the [alpha-17 release notes](/v2.0/reference/release-notes/influxdb/#v2-0-0-alpha-17-2019-08-14) for details._
- Alerts and Notifications to Slack (Free Tier), PagerDuty and HTTP (Pay As You Go).
- Rate limiting on cardinality for Free Tier.
- Billing notifications.
- Pricing calculator.
- Improved Signup flow.

## 2019-07-23 _General Availability_

### Features

- **InfluxDB 2.0 alpha-15** –
  _See the [alpha-9 release notes](/v2.0/reference/release-notes/influxdb/#v2-0-0-alpha-15-2019-07-11) for details._
- Pay As You Go Pricing Plan.
- Adjusted Free Plan rate limits.
- Timezone selection in the user interface.

---

## 2019-05-06 _Public Beta_

### Features

- Add rate limiting for Free tier users.
- Add client libraries for Go and JS.

### Bug fixes

- Users cannot delete themselves from their Cloud 2.0 account.
- The bucket retention period for Free tier users is set to 72 hours.
- Free tier users cannot change a bucket's retention period.

---

## 2019-05-02

### Features

- **InfluxDB 2.0 alpha-9** –
  _See the [alpha-9 release notes](/v2.0/reference/release-notes/influxdb/#v2-0-0-alpha-9-2019-05-01) for details._

### Bug fixes

- Usage statistics on the Usage page show correct values.
- Existing tasks with duration specified in nanoseconds no longer need to be resubmitted.
- Removed the additional user that showed up as an owner under the Cloud 2.0 organization.
- Cloud users can use CLI tools to interact with their Cloud tenant.


---

## 2019-04-05

### Features

- **InfluxDB 2.0 alpha-7** –
  _See the [alpha-7 release notes](/v2.0/reference/release-notes/influxdb/#v2-0-0-alpha-7-2019-03-28) for details._

### Bug fixes

- Logout works in InfluxDB Cloud 2.0 UI.
- Single sign-on works between https://cloud2.influxdata.com and https://us-west-2-1.aws.cloud2.influxdata.com.
- Able to copy error message from UI.
- Able to change a task from every to cron.
- Able to create a new bucket when switching between periodically and never (retention options).
