---
title: Create a management token
description: >
  Use the [`influxctl management create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/management/create)
  to manually create a management token.
menu:
  influxdb_cloud_dedicated:
    parent: Management tokens
weight: 201
influxdb/cloud-dedicated/tags: [tokens]
related:
  - /influxdb/cloud-dedicated/admin/tokens/management/#use-a-management-token, Use a management token
  - /influxdb/cloud-dedicated/reference/cli/influxctl/management/create/
list_code_example: |
  ```sh
  influxctl management create \
    --expires-at $(date -v+1d -Iseconds) \
    --description "Example token description"
  ```
---

By default, management tokens are short-lived tokens issued by an OAuth2 identity
provider that grant a specific user administrative access to your
{{< product-name omit=" Clustered">}} cluster.
However, for automation purposes, you can manually create management tokens that
authenticate directly with your InfluxDB cluster and do not require human
interaction with your identity provider.

{{% warn %}}
#### For automation use cases only

The tools outlined below are meant for automation use cases and should not be
used to circumvent your identity provider. **Take great care when manually creating
and using management tokens**.

{{< product-name >}} requires that at least one user associated with your cluster 
and authorized through your OAuth2 identity provider to manually create a
management token.
{{% /warn %}}

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Use the [`influxctl management create` command](/influxdb/cloud-dedicated/reference/cli/influxctl/management/create/)
    to manually create a management token. Provide the following:

    - _Optional_: the `--expires-at` flag with an RFC3339 date string that defines the
      token expiration date and time--for example, `{{< datetime/current-date offset=1 >}}`.
      If an expiration isn't set, the token does not expire until revoked.
    - _Optional_: the `--description` flag with a description for the management token.

{{% code-placeholders "RFC3339_EXPIRATION|TOKEN_DESCRIPTION" %}}
```sh
influxctl management create \
  --expires-at RFC3339_EXPIRATION \
  --description TOKEN_DESCRIPTION
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`RFC3339_EXPIRATION`{{% /code-placeholder-key %}}:
  An RFC3339 date string to expire the token at--for example,
  `{{< datetime/current-date offset=1 >}}`.
- {{% code-placeholder-key %}}`TOKEN_DESCRIPTION`{{% /code-placeholder-key %}}:
  Management token description.

Once created, the command returns the management token string.

{{% note %}}
#### Store secure tokens in a secret store

Management token strings are returned _only_ on token creation.
We recommend storing database tokens in a **secure secret store**.
For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/telegraf/tree/master/plugins/secretstores/os).
{{% /note %}}
