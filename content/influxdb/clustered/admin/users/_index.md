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
See [Step 6: Deploy an InfluxDB cluster](/influxdb/clustered/install/deploy) for details on how to apply `myinfluxdb.yml`.
Once the `myinfluxdb.yml` has been applied, it will take a couple minutes for the updates to roll out.
When complete, any new users will have been added and any removed users will have been deleted.
