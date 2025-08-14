
The `influxctl table rename` command renames a table in the specified database in
an {{< product-name omit=" Clustered" >}} cluster.

## Usage

<!-- pytest.mark.skip -->

```bash
influxctl table rename [flags] <DATABASE_NAME> <CURRENT_TABLE_NAME> <NEW_TABLE_NAME>
```

## Arguments

| Argument               | Description                          |
| :--------------------- | :----------------------------------- |
| **DATABASE_NAME**      | Name of the database the table is in |
| **CURRENT_TABLE_NAME** | Current name of the table            |
| **NEW_TABLE_NAME**     | New name for the table               |

## Flags

| Flag |            | Description                                   |
| :--- | :--------- | :-------------------------------------------- |
|      | `--format` | Output format (`table` _(default)_ or `json`) |
| `-h` | `--help`   | Output command help                           |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

<!-- pytest.mark.skip -->

```bash
# Rename the "example-tb" table to "example_tb"
influxctl table rename mydb example-tb example_tb
```
