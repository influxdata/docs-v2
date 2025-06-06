---
title: Create a management token
description: >
  Use the Admin UI or the [`influxctl management create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/create)
  to manually create a management token.
menu:
  influxdb3_cloud_dedicated:
    parent: Management tokens
weight: 201
influxdb3/cloud-dedicated/tags: [tokens]
related:
  - /influxdb3/cloud-dedicated/admin/tokens/management/#use-a-management-token, Use a management token
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/management/create/
list_code_example: |
  ```sh
  influxctl management create \
    --expires-at $(date -v+1d -Iseconds) \
    --description "Example token description"
  ```
---
Use the Admin UI or the [`influxctl management create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/create)
to manually create a management token.

By default, management tokens are short-lived tokens issued by an OAuth2 identity
provider that grant a specific user administrative access to your
{{< product-name omit=" Clustered">}} cluster.
However, for automation purposes, you can manually create management tokens that
authenticate directly with your InfluxDB cluster and do not require human
interaction with your identity provider.

> [!Warning]
> #### For automation use cases only
> 
> The tools outlined below are meant for automation use cases and should not be
> used to circumvent your identity provider. **Take great care when manually creating
> and using management tokens**.
> 
> {{< product-name >}} requires that at least one user associated with your cluster 
> and authorized through your OAuth2 identity provider to manually create a
> management token.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#admin-ui)
[influxctl](#influxctl)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------BEGIN ADMIN UI ------------------------------>
The InfluxDB Cloud Dedicated administrative UI includes a portal for creating
and managing management tokens.

1. To access the {{< product-name >}} Admin UI, visit the following URL in your browser:

   <pre>
   <a href="https://console.influxdata.com">https://console.influxdata.com</a>
   </pre>

2. Use the credentials provided by InfluxData to log into the Admin UI.
   If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).
3. Click the **Management Tokens** button in the upper right corner of the Account Management portal.
4. In the Management Tokens portal, click the **New Management Token** button. 
   The **Create Management Token** dialog displays.

   {{< img-hd src="/img/influxdb3/cloud-dedicated-admin-ui-create-management-token.png" alt="Create management token dialog" />}}

5. You can optionally set the following fields:
   - **Expiration date**: Set an expiration date for the token
   - **Expiration time**: Set an expiration time for the token
   - **Description**: Enter a description for the token
   - 
     If an expiration isn't set, the token does not expire until revoked.
6. Click the **Create Token** button. The dialog displays the **Token secret** string and the description you provided.
{{% /tab-content %}}
{{% tab-content %}}

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Use the [`influxctl management create` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/create/)
    to manually create a management token. Provide the following:

    - _Optional_: the `--expires-at` flag with an RFC3339 date string that defines the
      token expiration date and time--for example, `{{< datetime/current-date offset=1 >}}`.
      If an expiration isn't set, the token does not expire until revoked.
    - _Optional_: the `--description` flag with a description for the management token in double quotes `""`.

{{% code-placeholders "RFC3339_EXPIRATION|TOKEN_DESCRIPTION" %}}
```sh
influxctl management create \
  --expires-at RFC3339_EXPIRATION \
  --description "TOKEN_DESCRIPTION"
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`RFC3339_EXPIRATION`{{% /code-placeholder-key %}}:
  An RFC3339 date string to expire the token at--for example,
  `{{< datetime/current-date offset=1 >}}`.
- {{% code-placeholder-key %}}`TOKEN_DESCRIPTION`{{% /code-placeholder-key %}}:
  Management token description.
{{% /tab-content %}}
{{< /tabs-wrapper >}}

Once created, the command returns the management token string.

> [!Note]
> #### Store secure tokens in a secret store
> 
> Management token strings are returned _only_ on token creation.
> We recommend storing database tokens in a **secure secret store**.
> For example, see how to [authenticate Telegraf using tokens in your OS secret store](https://github.com/influxdata/> telegraf/tree/master/plugins/secretstores/os).
