---
title: Manage buckets in InfluxDB
description: >
  How to manage buckets in InfluxDB.
  A bucket is a named location where time series data is stored with a retention policy.
menu:
  v2_0:
    name: Manage buckets
    parent: Manage organizations
    weight: 1
---

A **bucket** is a named location where time series data is stored.
All buckets have a **retention policy**, a duration of time that each data point persists.
A bucket belongs to an organization.

**To manage an organization's buckets**:

1. Click the **Organizations** tab in the navigation bar.
2. Click on the name of an organization, then select the **Buckets** tab. All of the organization's buckets appear.
3. To create a bucket, click **+Create** in the upper right.
  * Enter a name for your bucket in the **Name** field.
  * In the **How often to clear data?** field:
    * Select **Never** to retain data forever.
    * Select **Periodically** to define a specific retention policy.
4. To update a bucket's name or retention policy, click the name of the bucket from the list.
5. Click **Update** to save.
6. ??Configure data sources tied to each bucket, delete bucket
