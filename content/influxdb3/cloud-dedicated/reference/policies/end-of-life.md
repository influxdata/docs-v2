---
title: Product and feature end-of-life procedures
description: >
  InfluxData adheres to the following process for any End-of-Life (EOL) of
  products and features.
menu:
  influxdb3_cloud_dedicated:
    parent: Policies & procedures
    name: End-of-life procedures
weight: 201
---

InfluxData adheres to the following process for any End-of-Life (EOL) of
products and features.

1.  **Email Notices**: InfluxData provides at least six months notice of the
    change in service via the following communication methods:

    - Email notifications are sent to all users and billing contacts
      associated with the account.
    - Emails are sent as "Service Notification" emails that customers and
      users cannot opt out of. Service Notifications are limited to critical
      service changes or updates and come from a support or formal alert alias.
    - Initial email notifications are followed by at least two additional reminders.
      For longer notice periods (one year or more), reminders are sent at
      least quarterly. As the date approaches, additional reminders are sent.
      Any new accounts established after the date of the first email notification
      that are impacted by the service shutdown are included in the subsequent
      reminders. 

2.  **Non-Email Notification**: Notifications and reminders are added to the
    following areas:

    - In-app notification for InfluxDB products that include a user interface
      (UI) that users must read or acknowledge in order to proceed in the app. 
    - For annual accounts or accounts billing more than $500 USD per month, an
      additional personal outreach is attempted by a Sales Team Member or
      Technical Support Team member.
    - [docs.influxdata.com](https://docs.influxdata.com) notification informing
      visitors of the upcoming end-of-life. The notification remains from the
      date of the first email through the end-of-life date. 
    - Reminders published in the InfluxDB Community Slack channel starting on the
      day of the initial email and the day before the event.

3.  **Fail-Safe Controls**: Because the above communication methods may not be
    100% effective, InfluxData implements the following fail-safe controls to
    allow for a "scream test" with the ability to notify customers via an outage
    and wait to see who responds before shutting down the service or feature
    and before deleting any data. At least 30 days before the scheduled service
    removal, InfluxData temporarily disables the service (in a fully
    reversible manner) for up to 24 hours so that all users relying on the
    service should be able to detect the service loss and get assistance.
    After 24 hours, the service is returned to normal operation.
    Depending on the results of the first "scream test", InfluxData may perform
    additional scream tests.

    - As soon as the first "scream test" is started, a banner is added to the
      top of the [status.influxdata.com](https://status.influxdata.com) page
      advising users about the service removal. This banner stays in place until
      the service is fully removed.
    - _Feature Flagging_: For reversible actions and other changes that can be
      feature flagged, InfluxData adds a feature flag, which enables flexibility
      to turn off the service for everyone, but still allow it for individual
      accounts in case of emergency.
    - _System Backup_: Back up the system at the point in time of execution of
      the end-of-life, including data and configuration when appropriate.
    - _Export Capability_: For any end-of-life event that would cause customer
      data to be deleted, an export capability exists to give the customer a
      reasonable method of exporting their data.
    - _Waiting Period_: There is at least a 30-day waiting period from disablement
      of service before the service is actually removed. This allows 30 days
      for customers and users to report a service outage and notify them if they
      were not aware of the end-of-life.

4.  **Data Recovery**: If a customer contacts us within the 30-day waiting period,
    InfluxData restores the service when possible, or provides backups of data
    if a restore of the service is not possible.

5.  **Data Retention**: Data retention in InfluxDB Cloud is described in
    InfluxData’s [Data retention documentation](/influxdb3/cloud-dedicated/reference/internals/data-retention/)
    and SOC-2 Statement.