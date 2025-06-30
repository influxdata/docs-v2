
The `influxctl table delete` command deletes a specified table from a database.

## Usage

```sh
influxctl table delete [flags] <DATABASE_NAME> <TABLE_NAME>
```

## Arguments

| Argument          | Description             |
| :---------------- | :---------------------- |
| **DATABASE_NAME** | Name of the database    |
| **TABLE_NAME**    | Name of table to delete |

## Flags

| Flag |          | Description         |
| :--- | :------- | :------------------ |
| `-h` | `--help` | Output command help |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

<!-- pytest.mark.skip -->

{{% code-placeholders "(DATABASE|TABLE)_NAME" %}}
```bash
influxctl table delete DATABASE_NAME TABLE_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database to delete the table from
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table to delete
