The example WAL plugin monitors data write operations in InfluxDB 3 by tracking row counts for each table during WAL (Write-Ahead Log) flush events. 
It creates summary reports in a `write_reports` table to help analyze data ingestion patterns and rates.
The plugin can optionally double-count rows for a specified table to demonstrate configurable behavior.

## Configuration

### Optional parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `double_count_table` | string | none | Table name for which to double the row count in write reports (for testing/demonstration) |

## Requirements

### Software requirements
- InfluxDB 3 Core or InfluxDB 3 Enterprise with Processing Engine enabled
- No additional Python packages required (uses built-in libraries)

### Installation steps

1. Start InfluxDB 3 with plugin support:
   ```bash
   influxdb3 serve \
     --node-id node0 \
     --object-store file \
     --data-dir ~/.influxdb3 \
     --plugin-dir ~/.plugins
   ```

## Trigger setup

### Write monitoring

Monitor all table writes and generate write reports:

```bash
influxdb3 create trigger \
  --database monitoring \
  --plugin-filename examples/wal_plugin/wal_plugin.py \
  --trigger-spec "all_tables" \
  wal_monitoring
```

### Write monitoring with special handling

Monitor writes with special handling for a specific table:

```bash
influxdb3 create trigger \
  --database monitoring \
  --plugin-filename examples/wal_plugin/wal_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'double_count_table=temperature' \
  wal_monitoring_special
```

## Example usage

### Example: Basic write monitoring

Set up write monitoring to track data ingestion:

```bash
# Create the monitoring trigger
influxdb3 create trigger \
  --database testdb \
  --plugin-filename examples/wal_plugin/wal_plugin.py \
  --trigger-spec "all_tables" \
  write_monitor

# Write test data to various tables
influxdb3 write \
  --database testdb \
  "temperature,location=office value=22.5"
  
influxdb3 write \
  --database testdb \
  "humidity,location=office value=45.2"
  
influxdb3 write \
  --database testdb \
  "pressure,location=office value=1013.25"

# The plugin automatically generates write reports in the `write_reports` measurement.

# Query the write reports
influxdb3 query \
  --database testdb \
  "SELECT * FROM write_reports ORDER BY time DESC"
```

### Expected output

```
table_name  | row_count | time
------------|-----------|-----
pressure    | 1         | 2024-01-01T12:02:00Z
humidity    | 1         | 2024-01-01T12:01:00Z
temperature | 1         | 2024-01-01T12:00:00Z
```

### Example: Monitoring with special table handling

Monitor writes with doubled counting for temperature data:

```bash
# Create trigger with special handling
influxdb3 create trigger \
  --database testdb \
  --plugin-filename examples/wal_plugin/wal_plugin.py \
  --trigger-spec "all_tables" \
  --trigger-arguments 'double_count_table=temperature' \
  write_monitor_special

# Write test data
influxdb3 write \
  --database testdb \
  "temperature,location=office value=22.5"
  
influxdb3 write \
  --database testdb \
  "humidity,location=office value=45.2"

# Query the write reports
influxdb3 query \
  --database testdb \
  "SELECT * FROM write_reports ORDER BY time DESC"
```

### Expected output

```
table_name  | row_count | time
------------|-----------|-----
humidity    | 1         | 2024-01-01T12:01:00Z
temperature | 2         | 2024-01-01T12:00:00Z
```

**Note**: The temperature table shows a row count of 2 despite only writing 1 row, demonstrating the `double_count_table` parameter.

## Generated Measurements

### write_reports
Tracks the number of rows written to each table during WAL flush events.

**Tags:**
- `table_name`: Name of the table that received writes

**Fields:**
- `row_count`: Number of rows written in this WAL flush (integer)

**Special behavior:**
- If `double_count_table` parameter matches the table name, the row count will be doubled
- The plugin automatically skips the `write_reports` table to avoid infinite recursion

## Code overview

### Files

- `wal_plugin.py`: Main plugin code that processes write batches and generates reports

### Main functions

#### `process_writes(influxdb3_local, table_batches, args)`
Entry point for processing write batches. Called each time data is written to the database.

**Parameters:**
- `influxdb3_local`: InfluxDB client for writing and logging
- `table_batches`: List of table batches containing written data
- `args`: Configuration arguments from trigger setup

**Processing logic:**
1. Iterates through each table batch in the write operation
2. Skips the `write_reports` table to prevent recursion
3. Counts rows in each batch
4. Applies special handling if `double_count_table` matches
5. Writes report record to `write_reports` measurement

### Logging

Logs are stored in the `_internal` database in the `system.processing_engine_logs` table. To view logs:

{{% code-placeholders "AUTH_TOKEN" %}}
```bash
influxdb3 query \
  --database _internal \
  --token AUTH_TOKEN \
  "SELECT * FROM system.processing_engine_logs WHERE trigger_name = 'wal_monitoring'"
```
{{% /code-placeholders %}}

Replace {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}} with your {{% token-link "admin" %}}.

## Troubleshooting

### Common issues

#### Issue: No write reports appearing
**Solution**: 
1. Verify the trigger was created successfully:
   {{% code-placeholders "DATABASE_NAME|AUTH_TOKEN" %}}
   ```bash
   influxdb3 show summary --database DATABASE_NAME --token AUTH_TOKEN
   ```
   {{% /code-placeholders %}}
   
   Replace the following:
   
   - {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database
   - {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}{{% show-in "enterprise" %}} with read permissions on the specified database{{% /show-in %}}
2. Check that data is actually being written to tables other than `write_reports`
3. Review logs for errors

#### Issue: Infinite recursion with write_reports
**Solution**: This shouldn't happen as the plugin automatically skips the `write_reports` table, but if you see this:
1. Check that you haven't modified the plugin to remove the skip logic
2. Verify the table name comparison is working correctly

#### Issue: Row counts seem incorrect
**Solution**: 
1. Remember that row counts represent WAL flush batches, not individual write operations
2. Multiple write operations may be batched together before the plugin processes them
3. Check if `double_count_table` is set and affecting specific tables

### Performance considerations

- This plugin processes every write operation, so it adds minimal overhead
- The plugin generates one additional write per table per WAL flush batch
- Consider the storage impact of write reports for high-volume systems

### Use cases

- **Write monitoring**: Track data ingestion patterns and volumes
- **Debugging**: Identify which tables are receiving writes
- **Performance analysis**: Monitor write batch sizes and patterns
- **Data validation**: Verify expected write volumes
- **Testing**: Use `double_count_table` parameter for testing scenarios

## Report an issue

For plugin issues, see the Plugins repository [issues page](https://github.com/influxdata/influxdb3_plugins/issues).

## Find support for {{% product-name %}}

The [InfluxDB Discord server](https://discord.gg/9zaNCW2PRT) is the best place to find support for InfluxDB 3 Core and InfluxDB 3 Enterprise.
For other InfluxDB versions, see the [Support and feedback](#bug-reports-and-feedback) options.