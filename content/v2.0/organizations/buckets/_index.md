---
title: Manage buckets in InfluxDB
description: placeholder
menu:
  v2_0:
    name: Manage buckets
    parent: Manage organizations
    weight: 1
---

**To manage an organization's buckets**:

A bucket is a named location where data is stored that has a retention policy. It’s similar to an InfluxDB v1.x “database,” but is a combination of both a database and a retention policy. Each bucket can only have one retention policy.


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
