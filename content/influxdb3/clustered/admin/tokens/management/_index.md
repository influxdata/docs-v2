---
title: Manage management tokens
seotitle: Manage management tokens in InfluxDB Clustered
description: >
  Manage management tokens in your InfluxDB cluster.
  Management tokens grant permission to perform administrative actions such as
  managing users, databases, and database tokens.
menu:
  influxdb3_clustered:
    parent: Manage tokens
    name: Management tokens
weight: 101
influxdb3/clustered/tags: [tokens]
---

Management tokens grant permission to perform administrative actions such as
managing users, databases, and database tokens in your
{{< product-name omit=" Clustered">}} cluster.

> [!Note]
> Management tokens do _not_ grant permissions to write or query time series data
> in your {{< product-name omit=" Clustered">}} cluster.
> 
> To grant write or query permissions, use management tokens to create [database tokens](/influxdb3/clustered/admin/tokens/database/).

By default, management tokens are short-lived tokens issued by an OAuth
provider that grant a specific user administrative access to your
{{< product-name omit=" Clustered">}} cluster.
However, for automation purposes, you can manually create management tokens that
authenticate directly with your InfluxDB Cluster and do not require human
interaction with your OAuth provider.

> [!Warning]
> #### For automation use cases only
> 
> The tools outlined below are meant for automation use cases and should not be
> used to circumvent your OAuth provider. **Take great care when manually creating
> and using management tokens**.
> 
> {{< product-name >}} requires at least one user associated with your cluster 
> and authorized through OAuth to manually create a management token.

{{< children type="anchored-list" >}}
- [Use a management token](#use-a-management-token)

{{< children readmore=true hlevel="h2" hr=true >}}

---

## Use a management token

Use management tokens to automate authorization for the
[`influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/):

1.  [Create a management token](#create-a-management-token) and securely store the output token value. You'll use it in the next step.
2.  On the machine where the `influxctl` CLI is to be automated, update your
    [`influxctl` connection profile](/influxdb3/clustered/reference/cli/influxctl/#configure-connection-profiles)
    by assigning the `mgmt_token` setting to the token string from the preceding step.

{{% code-placeholders "(INFLUXDB|MANAGEMENT)_(PORT|TOKEN)" %}}
```toml
[[profile]]
  name = "default"
  product = "clustered"
  host = "{{< influxdb/host >}}"
  port = "INFLUXDB_PORT"
  mgmt_token = "MANAGEMENT_TOKEN"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`INFLUXDB_PORT`{{% /code-placeholder-key %}}:
  {{< product-name >}} InfluxDB cluster port
- {{% code-placeholder-key %}}`MANAGEMENT_TOKEN`{{% /code-placeholder-key %}}:
  Management token string
