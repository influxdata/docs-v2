---
title: Revoke a management token
description: >
  Use the [`influxctl management revoke` command](/influxdb3/clustered/reference/cli/influxctl/management/revoke/)
  to revoke a management token and remove all access associated with the token.
  Provide the ID of the management token you want to revoke.
menu:
  influxdb3_clustered:
    parent: Management tokens
weight: 203
related:
  - /influxdb3/clustered/reference/cli/influxctl/management/revoke/
list_code_example: |
  ```sh
  influxctl management revoke <TOKEN_ID>
  ```
---

Use the [`influxctl management revoke` command](/influxdb3/clustered/reference/cli/influxctl/management/revoke/)
to revoke a management token and remove all access associated with the token.

1.  If you haven't already, [download and install the `influxctl` CLI](/influxdb3/clustered/reference/cli/influxctl/#download-and-install-influxctl).
2.  Run the [`influxctl management list` command](/influxdb3/clustered/reference/cli/influxctl/management/list)
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

> [!Note]
> #### Revoked tokens are included when listing management tokens
> 
> Revoked tokens still appear when listing management tokens, but they are no
> longer valid for any operations.
