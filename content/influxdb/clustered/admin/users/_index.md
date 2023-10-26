---
title: Manage InfluxDB Clustered users
description: >
  ...
menu:
  influxdb_clustered:
    name: Manage users
    parent: Administer InfluxDB Clustered
weight: 101
draft: true
---

To add or remove users, update the users list in the `myinfluxdb.yml` file.
The users list is found at spec.package.spec.admin.users.
After updating the list, re-apply `myinfluxdb.yml`.
To learn how to apply `myinfluxdb.yml`, see [Deploy an InfluxDB cluster](/influxdb/clustered/install/deploy).
After `myinfluxdb.yml` has been applied, updates take a couple of minutes to complete.
When the updates are finished, new users will have been added, and removed users will have been deleted.
