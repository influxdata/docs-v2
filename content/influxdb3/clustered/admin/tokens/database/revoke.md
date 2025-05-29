---
title: Revoke a database token
description: >
  Use the [`influxctl token revoke` command](/influxdb3/clustered/reference/cli/influxctl/token/revoke/)
  to revoke a token from your InfluxDB cluster and disable all
  permissions associated with the token.
  Provide the ID of the token you want to revoke.
menu:
  influxdb3_clustered:
    parent: Database tokens
weight: 203
list_code_example: |
  ```sh
  influxctl token revoke <TOKEN_ID>
  ```
aliases:
  - /influxdb3/clustered/admin/tokens/delete/
  - /influxdb3/clustered/admin/tokens/database/delete/
---

Use the [`influxctl token revoke` command](/influxdb3/clustered/reference/cli/influxctl/token/revoke/)
to revoke a database token from your {{< product-name omit=" Clustered" >}} cluster and disable
all permissions associated with the token.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the [`influxctl token list` command](/influxdb3/clustered/reference/cli/influxctl/token/list)
    to output tokens with their IDs.
    Copy the **token ID** of the token you want to delete.

    ```sh
    influxctl token list
    ```

3.  Run the `influxctl token revoke` command and provide the following:

    - Token ID to revoke

4.  Confirm that you want to revoke the token.

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token revoke TOKEN_ID
```
{{% /code-placeholders %}}

> [!Warning]
> #### Revoking a token is immediate and cannot be undone
> 
> Revoking a database token is a destructive action that takes place immediately
> and cannot be undone.
> 
> #### Rotate revoked tokens
> 
> After revoking a database token, any clients using the revoked token need to
> be updated with a new database token to continue to interact with your
> {{% product-name omit=" Clustered" %}} cluster.
