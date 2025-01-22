
Use SQL to explore your data schema in your {{< product-name >}} database.

## List tables in a database

Use `SHOW TABLES` to list tables in your InfluxDB database.

```sql
SHOW TABLES
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

Tables listed with the `table_schema` of `iox` are tables.
Tables with `system` or `information_schema` table schemas are system tables
that store internal metadata.

| table_catalog | table_schema       | table_name  | table_type |
| :------------ | :----------------- | :---------- | ---------: |
| public        | iox                | home        | BASE TABLE |
| public        | iox                | noaa        | BASE TABLE |
| public        | system             | queries     | BASE TABLE |
| public        | information_schema | tables      |       VIEW |
| public        | information_schema | views       |       VIEW |
| public        | information_schema | columns     |       VIEW |
| public        | information_schema | df_settings |       VIEW |

{{% /expand %}}
{{< /expand-wrapper >}}

## List columns in a table

Use the `SHOW COLUMNS` statement to view what columns are in a table.
Use the `IN` clause to specify the table.

```sql
SHOW COLUMNS IN home
```

{{< expand-wrapper >}}
{{% expand "View example output" %}}

| table_catalog | table_schema | table_name | column_name | data_type                   | is_nullable |
| :------------ | :----------- | :--------- | :---------- | :-------------------------- | ----------: |
| public        | iox          | home       | co          | Int64                       |         YES |
| public        | iox          | home       | hum         | Float64                     |         YES |
| public        | iox          | home       | room        | Dictionary(Int32, Utf8)     |         YES |
| public        | iox          | home       | temp        | Float64                     |         YES |
| public        | iox          | home       | time        | Timestamp(Nanosecond, None) |          NO |

{{% /expand %}}
{{< /expand-wrapper >}}
