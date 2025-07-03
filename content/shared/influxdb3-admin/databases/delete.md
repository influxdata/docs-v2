
Use the [`influxdb3 delete database` command](/influxdb3/version/reference/cli/influxdb3/delete/database/)
to delete a database from {{< product-name >}}.

> [!Caution]
> #### Deleting a database cannot be undone
>
> Deleting a database is a destructive action.
> Once a database is deleted, data stored in that database cannot be recovered.

Provide the following:

- Name of the database to delete
- - {{< product-name >}} {{% token-link "admin" "admin" %}}

{{% code-placeholders "DATABASE_NAME" %}}
```sh
influxdb3 delete database DATABASE_NAME
```
{{% /code-placeholders %}}

Enter `yes` to confirm that you want to delete the database.
