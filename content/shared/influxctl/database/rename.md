
The `influxctl database rename` command renames a databases in an
{{% product-name omit=" Clustered" %}} cluster.
This command does _not_ change the database ID, database properties, or the
data stored in the database.

> [!Warning]
> #### Renaming a database requires new tokens
> 
> [Database tokens](/influxdb3/version/admin/tokens/database/) are associated to
> databases by name. After renaming a database, tokens referencing the old name
> no longer function. You must generate tokens for the new database name.

## Usage

<!-- pytest.mark.skip -->

```bash
influxctl database rename [flags] <CURRENT_DB_NAME> <NEW_DB_NAME>
```

## Arguments

| Argument            | Description                  |
| :------------------ | :--------------------------- |
| **CURRENT_DB_NAME** | Name current of the database |
| **NEW_DB_NAME**     | New name for the database    |

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
