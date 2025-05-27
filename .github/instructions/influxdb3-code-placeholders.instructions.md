---
mode: 'edit'
applyTo: "content/{influxdb3/core,influxdb3/enterprise,shared/influxdb3*}/**"
---
## Best Practices

- Use UPPERCASE for placeholders to make them easily identifiable
- Don't use pronouns in placeholders (e.g., "your", "this")
- List placeholders in the same order they appear in the code
- Provide clear descriptions including:
- - Expected data type or format
- - Purpose of the value
- - Any constraints or requirements
- Mark optional placeholders as "Optional:" in their descriptions
- Placeholder key descriptions should fit the context of the code snippet
- Include examples for complex formats

## Writing Placeholder Descriptions

Descriptions should follow consistent patterns:

1. **Admin Authentication tokens**: 
   - Recommended: "a {{% token-link "admin" %}} for your {{< product-name >}} instance"
   - Avoid: "your token", "the token", "an authorization token"
2. **Database resource tokens**:
   - Recommended: "your {{% token-link "database" %}}"{{% show-in "enterprise" %}} with permissions on the specified database{{% /show-in %}}
   - Avoid: "your token", "the token", "an authorization token"
3. **Database names**:
   - Recommended: "the name of the database to [action]" 
   - Avoid: "your database", "the database name"
4. **Conditional content**:
   - Use `{{% show-in "enterprise" %}}` for content specific to enterprise versions
   - Example: "your {{% token-link "database" %}}{{% show-in "enterprise" %}} with permission to query the specified database{{% /show-in %}}"

## Common placeholders for InfluxDB 3

- `AUTH_TOKEN`: your {{% token-link %}}
- `DATABASE_NAME`: the database to use
- `TABLE_NAME`: Name of the table/measurement to query or write to
- `NODE_ID`: Node ID for a specific node in a cluster
- `CLUSTER_ID`: Cluster ID for a specific cluster
- `HOST`: InfluxDB server hostname or URL
- `PORT`: InfluxDB server port (typically 8181)
- `QUERY`: SQL or InfluxQL query string
- `LINE_PROTOCOL`: Line protocol data for writes
- `PLUGIN_FILENAME`: Name of plugin file to use
- `CACHE_NAME`: Name for a new or existing cache

## Hugo shortcodes in Markdown

- `{{% code-placeholders "PLACEHOLDER1|PLACEHOLDER2" %}}`: Use this shortcode to define placeholders in code snippets.
- `{{% /code-placeholders %}}`: End the shortcode.
- `{{% code-placeholder-key %}}`: Use this shortcode to define a specific placeholder key.
- `{{% /code-placeholder-key %}}`: End the specific placeholder key shortcode.

## Language-Specific Placeholder Formatting

- **Bash/Shell**: Use uppercase variables with no quotes or prefix
  ```bash
  --database DATABASE_NAME
  ```
- Python: Use string literals with quotes
  ```python
  database_name='DATABASE_NAME'
  ```
- JSON: Use key-value pairs with quotes
  ```json
  {
    "database": "DATABASE_NAME"
  }
  ```

## Real-World Examples from Documentation

### InfluxDB CLI Commands
This pattern appears frequently in CLI documentation:

{{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
```bash
influxdb3 write \
  --database DATABASE_NAME \
  --token AUTH_TOKEN \
  --precision ns
{{% /code-placeholders %}}

Replace the following placeholders with your values:

{{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to write to
{{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with write permissions on the specified database{{% /show-in %}}