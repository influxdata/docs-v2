---
title: Manage management tokens
seotitle: Manage management tokens in InfluxDB Cloud Dedicated
description: >
  Manage management tokens in your InfluxDB Cloud Dedicated cluster.
  Management tokens grant permission to perform administrative actions such as
  managing users, databases, and database tokens.
menu:
  influxdb_cloud_dedicated:
    parent: Manage tokens
    name: Management tokens
weight: 101
influxdb/cloud-dedicated/tags: [tokens]
---

Management tokens grant permission to perform administrative actions such as
managing users, databases, and database tokens in your
{{< product-name omit=" Clustered">}} cluster.

{{% note %}}
Management tokens do _not_ grant permissions to write or query time series data
in your {{< product-name omit=" Clustered">}} cluster.
{{% /note %}}

By default, management tokens are short-lived tokens issued by an OAuth
provider that grant a specific user administrative access to your
{{< product-name omit=" Clustered">}} cluster.
However, for automation purposes, you can manually create management tokens that
authenticate directly with your InfluxDB Cluster and do not require human
interaction with your OAuth provider.

{{% warn %}}
#### For automation use cases only

The tools outlined below are meant for automation use cases and should not be
used to circumvent your OAuth provider. **Take great care when manually creating
and using management tokens**.

{{< product-name >}} requires that at least one user associated with your cluster 
and authorized through OAuth to manually create a management token.
{{% /warn %}}

{{< children type="anchored-list" >}}
- [Use a management token](#use-a-management-token)

{{< children readmore=true hlevel="h2" hr=true >}}

---

## Use a management token

Use management tokens to automate authorization for the
[`influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/):

1.  [Create a new management token](#create-a-management-token).
2.  On the machine where the `influxctl` CLI is to be automated, update your
    [`influxctl` connection profile](/influxdb/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
    by adding the `mgmt_token` setting with the management token string.

{{% code-placeholders "(ACCOUNT|CLUSTER|MANAGEMENT)_(ID|TOKEN)" %}}
```toml
[[profile]]
  name = "default"
  product = "dedicated"
  account_id = "ACCOUNT_ID"
  cluster_id = "CLUSTER_ID"
  mgmt_token = "MANAGEMENT_TOKEN"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`ACCOUNT_ID`{{% /code-placeholder-key %}}:
  {{< product-name >}} account ID
- {{% code-placeholder-key %}}`CLUSTER_ID`{{% /code-placeholder-key %}}:
  {{< product-name >}} cluster ID
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}:
  Management token string
