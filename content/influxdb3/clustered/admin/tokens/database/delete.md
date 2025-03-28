---
title: Delete a database token
description: >
  Use the [`influxctl token delete` command](/influxdb3/clustered/reference/cli/influxctl/token/delete/)
  to delete a token from your InfluxDB cluster and revoke all
  permissions associated with the token.
  Provide the ID of the token you want to delete.
menu:
  influxdb3_clustered:
    parent: Database tokens
weight: 203
list_code_example: |
  ```sh
  influxctl token delete <TOKEN_ID>
  ```
aliases:
  - /influxdb3/clustered/admin/tokens/delete/
---

Use the [`influxctl token delete` command](/influxdb3/clustered/reference/cli/influxctl/token/delete/)
to delete a database token from your InfluxDB cluster and revoke
all permissions associated with the token.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the [`influxctl token list` command](/influxdb3/clustered/reference/cli/influxctl/token/list)
    to output tokens with their IDs.
    Copy the **token ID** of the token you want to delete.

    ```sh
    influxctl token list
    ```

3.  Run the `influxctl token delete` command and provide the following:

    - Token ID to delete

4.  Confirm that you want to delete the token.

{{% code-placeholders "TOKEN_ID" %}}
```sh
influxctl token delete TOKEN_ID
```
{{% /code-placeholders %}}

> [!Warning]
> #### Deleting a token is immediate and cannot be undone
> 
> Deleting a database token is a destructive action that takes place immediately
> and cannot be undone.
> 
> #### Rotate deleted tokens
> 
> After deleting a database token, any clients using the deleted token need to be
> updated with a new database token to continue to interact with your InfluxDB
> cluster.
