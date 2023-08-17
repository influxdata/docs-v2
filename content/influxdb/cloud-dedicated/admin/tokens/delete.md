---
title: Delete a token
description: >
  Use the [`influxctl token delete` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/delete/)
  to delete a token from your InfluxDB Cloud Dedicated cluster and revoke all
  permissions associated with the token.
  Provide the ID of the token you want to delete.
menu:
  influxdb_cloud_dedicated:
    parent: Manage tokens
weight: 203
list_code_example: |
  ```sh
  influxctl token delete <TOKEN_ID>
  ```
---

Use the [`influxctl token delete` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/delete/)
to delete a database token from your InfluxDB Cloud Dedicated cluster and revoke
all permissions associated with the token.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb/cloud-dedicated/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the [`influxctl token list` command](/influxdb/cloud-dedicated/reference/cli/influxctl/token/list)
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

{{% warn %}}
#### Deleting a token is immediate and cannot be undone

Deleting a database token is a destructive action that takes place immediately
and cannot be undone.

#### Rotate deleted tokens

After deleting a database token, any clients using the deleted token need to be
updated with a new database token to continue to interact with your InfluxDB
Cloud Dedicated cluster.
{{% /warn %}}
