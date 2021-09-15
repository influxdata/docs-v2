---
title: Manage security
description: Configuration, security, and logging in InfluxDB enterprise.
menu:
  enterprise_influxdb_1_9:
    name: Manage security
    weight: 40
    parent: Manage
aliases:
  - /enterprise_influxdb/v1.9/administration/security/
---

<!--
Some customers may choose to install InfluxDB Enterprise with public internet access,
however doing so can inadvertently expose your data and invite unwelcome attacks on your database.
Check out the sections below for how protect the data in your InfluxDB Enterprise instance.

## Enable authentication

Password protect your InfluxDB Enterprise instance to keep any unauthorized individuals
from accessing your data.

Resources:
[Set up Authentication](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#set-up-authentication)

## Manage users and permissions

Restrict access by creating individual users and assigning them relevant
read and/or write permissions.

Resources:
[User types and privileges](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#user-types-and-privileges),
[User management commands](/enterprise_influxdb/v1.9/administration/authentication_and_authorization/#user-management-commands),
[Fine-grained authorization](/enterprise_influxdb/v1.9/guides/fine-grained-authorization/)

## Enable HTTPS

Using HTTPS secures the communication between clients and the InfluxDB server, and, in
some cases, HTTPS verifies the authenticity of the InfluxDB server to clients (bi-directional authentication).
The communicatio between the meta nodes and the data nodes are also secured via HTTPS.

Resources:
[Enabling HTTPS](/enterprise_influxdb/v1.9/guides/https_setup/)

## Secure your host

### Ports

For InfluxDB Enterprise data nodes, close all ports on each host except for port `8086`.
You can also use a proxy to port `8086`.  By default, data nodes and meta nodes communicate with each other over '8088','8089',and'8091'

For InfluxDB Enterprise, [backing up and restoring](/enterprise_influxdb/v1.9/administration/backup-and-restore/) is performed from the meta nodes.

### AWS Recommendations

InfluxData recommends implementing on-disk encryption; InfluxDB does not offer built-in support to encrypt the data.

-->

{{< children >}}
