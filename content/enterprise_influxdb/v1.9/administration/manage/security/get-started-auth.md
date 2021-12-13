---
title: Get started with authentication and authorization
description: >
  Learn the basics of managing authentication and authorization in InfluxDB Enterprise
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

{{% warn %}}
##### Important
Authentication [must be enabled](/enterprise_influxdb/v1.9/administration/configure/security/authentication/)
_**before**_ authorization can be managed.
If authentication is not enabled, **permissions will not be enforced**.
{{% /warn %}}

## Permissions in InfluxDB Enterprise

In InfluxB 1.x OSS, there only database-level privileges: `READ` and `WRITE`.
A third permission, `ALL`, grants admin privileges.
These can only be _can only be granted by using InfluxQL_.

Compared to InfluxDB OSS, InfluxDB Enterprise has an [expanded set of 16 permissions](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/#list-of-available-privileges).
These permissions allow for
controlling read and write access to data for all databases at once,
as well as permitting certain cluster-management actions like creating or deleting resources.

## Manage user authorization

There are three ways to manage authorizations in InfluxDB Enterprise:

- via [InfluxQL](#manage-read-and-write-privileges-with-influxql)
- via [Chronograf](#manage-specific-privileges-with-chronograf)
- via the [InfluxDB Enterprise meta API](#influxdb-enterprise-meta-api) (**Recommended**)

### Manage read and write privileges with InfluxQL

{{% note %}}
InfluxQL can can only grant `READ`, `WRITE`, and `ALL PRIVILEGES` privileges.

To use the full set of permissions, [use Chronograf](#manage-specific-privileges-with-chronograf) or the [Meta API (recommended)](#influxdb-enterprise-meta-api).
{{% /note %}}

Use InfluxQL if you only need to manage basic `READ`, `WRITE`, and `ALL` privileges.
For example, you can grant Alice the ability to write to a database *X*,
and then grant Bob the ability to read from that database.

If this level of permission is sufficient, use InfluxQL to manage authorizations.
(For instance, if you have upgraded from InfluxDB OSS 1.x to InfluxDB Enterprise
and do not need the more detailed authorization levels in InfluxDB Enterprise,
you can continue to use InfluxQL as before.)

{{% warn %}}
We recommend operators *do not* mix and match authorization management methods.
{{% /warn %}}

### Manage specific privileges with Chronograf

The Chronograf user interface can manage the
[full set of permissions](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api/#list-of-available-privileges).

The permissions listed in Chronograf are global for the cluster, and available through the API.
Outside of [FGA](/enterprise_influxdb/v1.9/administration/manage/security/fine-grained-authorization),
the only database-level permissions available are the basic `READ` and `WRITE`.
These can only be managed using [InfluxQL](#manage-read-and-write-privileges-with-influxql).

To manage privileges in Chronograf:

1. Login to Chronograf as an admin user.
2. Click on **InfluxDB Admin** → **Users**.
3. Each user has a dropdown for **Permissions**.
   Select the desired permissions and click **Apply**.

### InfluxDB Enterprise meta API

Programmatically manage permissions with the InfluxDB Enterprise API.

For more information on using the meta API,
see [here](/enterprise_influxdb/v1.9/administration/manage/security/authentication_and_authorization-api).
