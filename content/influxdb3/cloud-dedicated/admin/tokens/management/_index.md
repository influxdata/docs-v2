---
title: Manage management tokens
seotitle: Manage management tokens in InfluxDB Cloud Dedicated
description: >
  Manage management tokens in your InfluxDB Cloud Dedicated cluster.
  Management tokens grant permission to perform administrative actions such as
  managing users, databases, and database tokens.
menu:
  influxdb3_cloud_dedicated:
    parent: Manage tokens
    name: Management tokens
weight: 101
influxdb3/cloud-dedicated/tags: [tokens]
related:
  - /influxdb3/cloud-dedicated/reference/internals/security/
---

Management tokens grant permission to perform administrative actions such as
managing users, databases, and database tokens in your
{{< product-name omit=" Clustered">}} cluster.

> [!Note]
> Management tokens do _not_ grant permissions to write or query time series data
> in your {{< product-name omit=" Clustered">}} cluster.
> 
> To grant write or query permissions, use management tokens to create
> [database tokens](/influxdb3/cloud-dedicated/admin/tokens/database/).

By default, management tokens are short-lived tokens issued by your identity
provider for a [specific client session](/influxdb3/cloud-dedicated/reference/internals/security/#management-tokens-in-the-influxctl-cli) (for example, `influxctl`).

However, for automation purposes, you can manually create management tokens that
authenticate directly with your InfluxDB Cluster and do not require human
interaction with your identity provider.
_Manually created management tokens provide full access to all account resources
and aren't affected by [user groups](/influxdb3/cloud-dedicated/reference/internals/security/#user-groups)_.

> [!Warning]
> #### For automation use cases only
> 
> The tools outlined below are meant for automation use cases and shouldn't be
> used to circumvent your identity provider or user group permissions.
> **Take great care when manually creating and using management tokens**.
> 
> {{< product-name >}} requires at least one [Admin user](/influxdb3/cloud-dedicated/reference/internals/security/#admin-user-group) associated with your cluster 
> and authorized through your OAuth2 identity provider to manually create a
> management token.

{{< children type="anchored-list" >}}
- [Use a management token](#use-a-management-token)

{{< children readmore=true hlevel="h2" hr=true >}}

---

## Use a management token

Use management tokens to automate authorization for the
[`influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/):

1.  [Create a management token](#create-a-management-token) and securely store the output token value. You'll use it in the next step.
2.  On the machine where the `influxctl` CLI is to be automated, update your
    [`influxctl` connection profile](/influxdb3/cloud-dedicated/reference/cli/influxctl/#configure-connection-profiles)
    by assigning the `mgmt_token` setting to the token string from the preceding step.

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
