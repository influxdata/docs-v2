
The `influxctl database delete` command deletes a database from an 
{{< product-name omit=" Clustered" >}} cluster.

## Usage

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database delete [command options] [--force] <DATABASE_NAME> [<DATABASE_NAME_N>...]
```

> [!Warning]
> #### Cannot be undone
> 
> Deleting a database is a destructive action that cannot be undone.
>
> #### Wait before writing to a new database with the same name
>
> After deleting a database from your {{% product-name omit=" Clustered" %}}
> cluster, you can reuse the name to create a new database, but **wait two to
> three minutes** after deleting the previous database before writing to the new
> database to allow write caches to clear.
>
> #### Tokens still grant access to databases with the same name
>
> [Database tokens](/influxdb3/version/admin/tokens/database/) are associated to
> databases by name. If you create a new database with the same name, tokens
> that granted access to the deleted database will also grant access to the new
> database.

## Arguments

| Argument          | Description                    |
| :---------------- | :----------------------------- |
| **DATABASE_NAME** | Name of the database to delete |

## Flags

| Flag |           | Description                                                 |
| :--- | :-------- | :---------------------------------------------------------- |
|      | `--force` | Do not prompt for confirmation to delete (default is false) |
| `-h` | `--help`  | Output command help                                         |

{{% caption %}}
_Also see [`influxctl` global flags](/influxdb3/version/reference/cli/influxctl/#global-flags)._
{{% /caption %}}

## Examples

##### Delete a database named "mydb"

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database delete mydb
```

##### Delete multiple databases

<!--Skip tests for database create and delete: namespaces aren't reusable-->
<!--pytest.mark.skip-->

```sh
influxctl database delete mydb1 mydb2
```
