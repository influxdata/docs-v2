def process_writes(influxdb3_local, table_batches, args=None):
    """
    Process writes to the InfluxDB 3 processing engine, handling
    data persisted to the object store.
    """
    # Process data as it's written to the database
    for table_batch in table_batches:
        table_name = table_batch["table_name"]
        rows = table_batch["rows"]
        
        # Log information about the write
        influxdb3_local.info(f"Processing {len(rows)} rows from {table_name}")
        
        # Write derived data back to the database
        line = LineBuilder("processed_data")
        line.tag("source_table", table_name)
        line.int64_field("row_count", len(rows))
        influxdb3_local.write(line)