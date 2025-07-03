
The `influxctl database undelete` command undeletes a previously deleted
database in an {{% product-name omit=" Clustered" %}} cluster and restores the
database with the same retention period, table, and column limits as when it was
deleted.

> [!Important]
> The database name must match the name of the deleted database and
> **a new database with the same name cannot exist**.

## Usage

<!-- pytest.mark.skip -->

```bash
influxctl database undelete [flags] <DATABASE_NAME>
```

## Arguments

| Argument          | Description                          |
| :---------------- | :----------------------------------- |
| **DATABASE_NAME** | The name of the database to undelete |

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}
