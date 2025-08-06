
Use the [`influxdb3 delete last_cache` command](/influxdb3/version/reference/cli/influxdb3/delete/last_cache/)
to delete a Last Value Cache (LVC). Provide the following:

- **Database** (`-d`, `--database`): _({{< req >}})_ The name of the database
  that the LVC you want to delete is associated with. You can also use the
  `INFLUXDB3_DATABASE_NAME` environment variable to specify the database.
- **Token** (`--token`): _({{< req >}})_ Your {{< product-name >}}
  {{% show-in "enterprise" %}}admin {{% /show-in %}}authentication token.
  You can also use the `INFLUXDB3_AUTH_TOKEN` environment variable to specify
  the database.
- **Table** (`-t`, `--table`): _({{< req >}})_ The name of the table that the
  LVC you want to delete is associated with.
- **Cache name**: The name of the LVC to delete.

{{% code-placeholders "(DATABASE|TABLE|LVC)_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 delete last_cache \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --table TABLE_NAME \
  LVC_NAME
```
{{% /code-placeholders %}}

## Use the HTTP API

To use the HTTP API to delete a Last Value Cache, send a `DELETE` request to the `/api/v3/configure/last_cache` endpoint with query parameters.

{{% api-endpoint method="DELETE" endpoint="/api/v3/configure/last_cache" api-ref="/influxdb3/core/api/v3/#operation/DeleteConfigureLastCache" %}}

{{% code-placeholders "(DATABASE|TABLE|LVC)_NAME|AUTH_TOKEN" %}}
```bash
curl -X DELETE "https://localhost:8181/api/v3/configure/last_cache?db=DATABASE_NAME&table=TABLE_NAME&name=LVC_NAME" \
  --header "Authorization: Bearer AUTH_TOKEN"
```
{{% /code-placeholders %}}

## Example

```bash
curl -X DELETE "https://localhost:8181/api/v3/configure/last_cache?db=example-db&table=home&name=homeLastCache" \
  --header "Authorization: Bearer 00xoXX0xXXx0000XxxxXx0Xx0xx0"
```

**Response codes:**

- `200` : Success. The last cache has been deleted.
- `400` : Bad request.
- `401` : Unauthorized.
- `404` : Cache not found.

Replace the following:

- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}:
  the name of the database that the LVC you want to delete is associated with
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:
  your {{< product-name >}} {{% show-in "enterprise" %}}admin {{% /show-in %}}
  authentication token
- {{% code-placeholder-key %}}`TABLE_NAME`{{% /code-placeholder-key %}}:
  the name of the table that the LVC you want to delete is associated with
- {{% code-placeholder-key %}}`LVC`{{% /code-placeholder-key %}}:
  the name of the LVC to delete

> [!Caution]
> This is a destructive action that cannot be undone. Once deleted, any queries
> against the deleted LVC will return an error.
