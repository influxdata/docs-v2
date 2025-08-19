---
title: Revoke a management token
description: >
  Use the Admin UI or the [`influxctl management revoke` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/revoke/)
  to revoke a management token and remove all access associated with the token.
  Provide the ID of the management token you want to revoke.
menu:
  influxdb3_cloud_dedicated:
    parent: Management tokens
weight: 203
related:
  - /influxdb3/cloud-dedicated/reference/cli/influxctl/management/revoke/
list_code_example: |
  ```sh
  influxctl management revoke <TOKEN_ID>
  ```
---

Use the Admin UI or the [`influxctl management revoke` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/revoke/)
to revoke a management token and remove all access associated with the token.

{{< tabs-wrapper >}}
{{% tabs %}}
[Admin UI](#admin-ui)
[influxctl](#influxctl)
{{% /tabs %}}
{{% tab-content %}}
<!------------------------------BEGIN ADMIN UI ------------------------------>
The {{% product-name %}} administrative UI includes a portal for managing management tokens.

1.  To access the {{< product-name omit="InfluxDB " >}} Admin UI, visit the following URL in your browser:

    <pre>
    <a href="https://{{< influxdb/host >}}/">https://{{< influxdb/host >}}</a>
    </pre>
2.  Use the credentials provided by InfluxData to log into the Admin UI.
    If you don't have login credentials, [contact InfluxData support](https://support.influxdata.com).
3.  To revoke a management token, click the **Management Tokens** button in the upper right corner of the Account Management portal.
4.  **Search** for the token or use the sort button and column headers to sort the token list and find the token you want to revoke.
5.  Click the options button (three vertical dots) to the right of the token you want to revoke.
    The options menu displays.
6.  In the options menu, click **Revoke Token**. 
7.  In the **Revoke Management Token** dialog, check the box to confirm you "Understand the risk of this action".
8.  Click the **Revoke Token** button to revoke the token.
    The token is revoked and filtered from the list of active tokens.
{{% /tab-content %}}
{{% tab-content %}}
1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the [`influxctl management list` command](/influxdb3/cloud-dedicated/reference/cli/influxctl/management/list)
    to output tokens with their IDs.
    Copy the **ID** of the token you want to delete.

    ```sh
    influxctl management list
    ```

3.  Run the `influxctl management revoke` command and provide the following:

    - _Optional_: `--force` flag to skip command confirmation
    - Token ID to delete

4.  Confirm that you want to delete the token.

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl management revoke --force TOKEN_ID
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`TOKEN_ID`{{% /code-placeholder-key %}} with
the ID of the token you want to revoke.
{{% /tab-content %}}
{{% /tabs-wrapper %}}

> [!Note]
> #### Revoked tokens are included when listing management tokens
> 
> Revoked tokens still appear when listing management tokens, but they are no
> longer valid for any operations.
