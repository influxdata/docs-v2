---
title: Introduction to authorization in InfluxDB Enterprise v1
description: >
  Learn the basics of managing users and permissions in InfluxDB Enterprise v1.
menu:
  enterprise_influxdb_v1:
    name: Introduction to authorization
    parent: Manage users and permissions
weight: 30
related:
  - /enterprise_influxdb/v1/guides/fine-grained-authorization/
  - /chronograf/v1/administration/managing-influxdb-users/
---

Authorization in InfluxDB Enterprise refers to managing user permissions.
To secure and manage access to an InfluxDB Enterprise cluster,
first [configure authentication](/enterprise_influxdb/v1/administration/configure/security/authentication/).
You can then manage users and permissions as necessary.

This page is meant to help new users choose the best method
for managing permissions in InfluxDB Enterprise.

## Permissions in InfluxDB Enterprise

InfluxDB Enterprise has an [expanded set of 16 permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/permissions/#permissions).
These permissions allow for
controlling read and write access to data for all databases and for individual databases,
as well as permitting certain cluster-management actions like creating or deleting resources.

InfluxDB 1.x OSS only supports database-level privileges: `READ` and `WRITE`.
A third permission, `ALL`, grants admin privileges.
These three permissions exist in InfluxDB Enterprise as well.
They can _only be granted by using InfluxQL_.

## Manage user authorization

Choose one of the following methods manage authorizations in InfluxDB Enterprise:

- using [InfluxQL](#manage-read-and-write-privileges-with-influxql)
  {{% note %}}
InfluxQL can can only grant `READ`, `WRITE`, and `ALL PRIVILEGES` privileges.
To use the full set of InfluxDB Enterprise [permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/permissions/),
use [Chronograf](#manage-specific-privileges-with-chronograf)
or the [Meta API (recommended)](#influxdb-enterprise-meta-api).
  {{% /note %}}
- using [Chronograf](#manage-enterprise-permissions-with-chronograf)
- using the [InfluxDB Enterprise meta API](#manage-enterprise-permissions-with-the-meta-api) (**Recommended**)

### Manage read and write privileges with InfluxQL

If you only need to manage basic `READ`, `WRITE`, and `ALL` privileges,
use InfluxQL to manage authorizations.
(For instance, if you upgraded from InfluxDB OSS 1.x
and do not need the more detailed authorization in InfluxDB Enterprise, continue to use InfluxQL.)

{{% warn %}}
We recommend operators *do not* mix and match InfluxQL
with other authorization management methods (Chronograf and the API).
Doing so may lead to inconsistencies in user permissions.
{{% /warn %}}

### Manage Enterprise permissions with Chronograf

The Chronograf user interface can manage the
[full set of InfluxDB Enterprise permissions](/enterprise_influxdb/v1/administration/manage/users-and-permissions/permissions/#permissions).

The permissions listed in Chronograf are global for the cluster, and available through the API.
Outside of [FGA](/enterprise_influxdb/v1/administration/manage/users-and-permissions/fine-grained-authorization),
the only database-level permissions available are the basic `READ` and `WRITE`.
These can only be managed using [InfluxQL](#manage-read-and-write-privileges-with-influxql).

Chronograf can only set permissions globally, for all databases, within a cluster.
If you need to set permissions at the database level, use the [Meta API](#influxdb-enterprise-meta-api).

See ["Manage InfluxDB users in Chronograf"](/chronograf/v1/administration/managing-influxdb-users/)
for instructions.

### Manage Enterprise permissions with the Meta API

The InfluxDB Enterprise API is the recommended method for managing permissions.
Use the API to manage setting cluster-wide and database-specific permissions.

For more information on using the meta API,
see [here](/enterprise_influxdb/v1/administration/manage/users-and-permissions/authorization-api).
