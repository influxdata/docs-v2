---
title: Create an organization
seotitle: Create an organization in InfluxDB
description: Create an organization in InfluxDB using the InfluxDB UI or the influx CLI.
menu:
  influxdb_v2:
    name: Create an organization
    parent: Manage organizations
weight: 101
aliases:
  - /influxdb/v2/organizations/create-org/
---

Use the InfluxDB user interface (UI) or the `influx` command line interface (CLI)
to create an organization.

{{% note %}}
#### Organization and bucket limits

A single InfluxDB {{< current-version >}} OSS instance supports approximately 20 buckets actively being
written to or queried across all organizations depending on the use case.
Any more than that can adversely affect performance.
Because each organization is created with a bucket, we do not recommend more than
20 organizations in a single InfluxDB OSS instance.
{{% /note %}}

## Create an organization in the InfluxDB UI

1. In the navigation menu on the left, click the **Account dropdown**.

    {{< nav-icon "account" >}}

2. Select **Create Organization**.
3. In the window that appears, enter an **Organization Name** and **Bucket Name** and click **Create**.

## Create an organization using the influx CLI

Use the [`influx org create` command](/influxdb/v2/reference/cli/influx/org/create)
to create a new organization. Provide the following:

- An [operator token](/influxdb/v2/admin/tokens/#operator-token) using your
  [`influx` CLI connection configuration](/influxdb/v2/reference/cli/influx/#provide-required-authentication-credentials),
  `INFLUX_TOKEN` environment variable, or the `--token, -t` flag.
- A name for the organization with the `--name, -n` flag.
- _Optional:_ A description of the organization with the `--description, -d` flag.


{{% code-placeholders "ORG_(NAME|DESCRIPTION)" %}}
```sh
influx org create \
  --name ORG_NAME \
  --description "ORG_DESCRIPTION"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ORG_NAME`{{% /code-placeholder-key %}}:
  The name of the organization to create
- {{% code-placeholder-key %}}`ORG_DESCRIPTION`{{% /code-placeholder-key %}}:
  A description of the organization
