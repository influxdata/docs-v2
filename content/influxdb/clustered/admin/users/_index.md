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

To add or remove users, update the users list in `myinfluxdb.yml` file.
The users list is found at spec.package.spec.admin.users.
After updating the list, re-apply `myinfluxdb.yml`.
See [Step 6: Deploy an InfluxDB cluster](https://docs.google.com/document/d/1UCmGtZS_OQe-gYOd0ASi0E2wFM9t3MOGwfDhxR1wtgg/edit#heading=h.m40zb08bbum1) for details on how to apply `myinfluxdb.yml`.
Once the `myinfluxdb.yml` has been applied, it will take a couple minutes for the updates to roll out.
When complete, any new users will have been added and any removed users will have been deleted.
