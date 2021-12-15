---
title: Get started with authentication and authorization
description: >
  Learn the basics of managing authentication and authorization in InfluxDB Enterprise.
menu:
  enterprise_influxdb_1_9:
    name: Get started with authentication and authorization
    parent: Manage security
weight: 30
related:
  - /enterprise_influxdb/v1.9/guides/fine-grained-authorization/
  - /{{< latest "chronograf" >}}/administration/managing-influxdb-users/
---

To secure and manage access to an InfluxDB Enterprise cluster, consider the following two aspects:
- *authentication* (verifying a user's identity)
- *authorization* (verifying what the user has access to)

{{% enterprise-warning-authn-b4-authz %}}

## Permissions in InfluxDB Enterprise

InfluxDB Enterprise has an [expanded set of 16 permissions](/enterprise_influxdb/v1.9/administration/manage/security/permissions/#permissions).
These permissions allow for
controlling read and write access to data for all databases at once,
as well as permitting certain cluster-management actions like creating or deleting resources.

InfluxB 1.x OSS only supports database-level privileges: `READ` and `WRITE`.
A third permission, `ALL`, grants admin privileges.
These can only be _can only be granted by using InfluxQL_.

## Manage user authorization

There are three ways to manage authorizations in InfluxDB Enterprise:

- via [InfluxQL](#manage-read-and-write-privileges-with-influxql)
- via [Chronograf](#manage-enterprise-permissions-with-chronograf)
- via the [InfluxDB Enterprise meta API](#manage-enterprise-permissions-with-the-meta-api) (**Recommended**)

### Manage read and write privileges with InfluxQL

{{% note %}}
InfluxQL can can only grant `READ`, `WRITE`, and `ALL PRIVILEGES` privileges.

To use the full set of permissions, [use Chronograf](#manage-specific-privileges-with-chronograf) or the [Meta API (recommended)](#influxdb-enterprise-meta-api).
{{% /note %}}

Use InfluxQL if you only need to manage basic `READ`, `WRITE`, and `ALL` privileges.
<!-- For example, you can grant Alice the ability to write to a database *X*, -->
<!-- and then grant Bob the ability to read from that database. -->

If this level of permission is sufficient, use InfluxQL to manage authorizations.
(For instance, if you upgraded from InfluxDB OSS 1.x and do not need the more detailed authorization in InfluxDB Enterprise, continue to use InfluxQL.)

{{% warn %}}
We recommend operators *do not* mix and match InfluxQL
with other authorization management methods (Chronograf and the API).
Doing so may lead to inconsistencies in user permissions.
{{% /warn %}}

### Manage Enterprise permissions with Chronograf

The Chronograf user interface can manage the
[full set of InfluxDB Enterprise permissions](/enterprise_influxdb/v1.9/administration/manage/security/permissions/#permissions).

The permissions listed in Chronograf are global for the cluster, and available through the API.
Outside of [FGA](/enterprise_influxdb/v1.9/administration/manage/security/fine-grained-authorization),
the only database-level permissions available are the basic `READ` and `WRITE`.
These can only be managed using [InfluxQL](#manage-read-and-write-privileges-with-influxql).

Chronograf can only set permissions globally, for all databases, within a cluster.
If you need to set permissions at the database level, use the [Meta API](#influxdb-enterprise-meta-api).

See ["Manage InfluxDB users in Chronograf"](/chronograf/v1.9/administration/managing-influxdb-users/)
for instructions.

### Manage Enterprise permissions with the Meta API

The InfluxDB Enterprise API is the
recommended method for managing permissions.

For more information on using the meta API,
see [here](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api).
