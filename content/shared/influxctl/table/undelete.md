
The `influxctl table undelete` command undeletes a previously deleted
table in an {{% product-name omit=" Clustered" %}} cluster and restores the
table with the same partition template and other table settings present when the
table was deleted.

> [!Important]
> The table name must match the name of the deleted table and
> **a new, active table with the same name cannot exist**.

## Usage

<!-- pytest.mark.skip -->

```bash
influxctl table undelete <DATABASE_NAME> <TABLE_ID>
```

## Arguments

| Argument          | Description                                                  |
| :---------------- | :----------------------------------------------------------- |
| **DATABASE_NAME** | The name of the database that contains the table to undelete |
| **TABLE_ID**      | The ID of the table to undelete                              |

> [!Tip]
> #### View deleted table IDs
>
> To view the IDs of deleted tables, use the `influxctl table list` command with
> the `--filter-status=deleted` flag--for example:
>
> <!--pytest.mark.skip-->
> 
> ```bash {placeholders="DATABASE_NAME" }
> influxctl table list --filter-status=deleted DATABASE_NAME
> ```
>
> Replace {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}
> with the name of the database associate with the table you want to undelete.

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
