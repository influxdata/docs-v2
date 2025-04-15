
Use the [`influxdb3 delete distinct_cache` command](/influxdb3/version/reference/cli/influxdb3/delete/distinct_cache/)
to delete a Distinct Value Cache (DVC). Provide the following:

- **Database** (`-d`, `--database`): _({{< req >}})_ The name of the database
  that the DVC you want to delete is associated with. You can also use the
  `INFLUXDB3_DATABASE_NAME` environment variable to specify the database.
- **Token** (`--token`): _({{< req >}})_ Your {{< product-name >}}
  {{% show-in "enterprise" %}}admin {{% /show-in %}}authentication token.
  You can also use the `INFLUXDB3_AUTH_TOKEN` environment variable to specify
  the token.
- **Table** (`-t`, `--table`): _({{< req >}})_ The name of the table that the
  DVC you want to delete is associated with.
- **Cache name**: The name of the DVC to delete.

{{% code-placeholders "(DATABASE|TABLE|DVC)_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 delete distinct_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  DVC_NAME
```
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database that the DVC you want to delete is associated with
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} admin authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table associated with the DVC you want to delete
- {{% code-placeholder-key %}}`DVC_NAME`{{% /code-placeholder-key %}}:
  the name of the DVC to delete

> [!Caution]
> This is a destructive action that cannot be undone. Once deleted, any queries
> against the deleted DVC will return an error.
