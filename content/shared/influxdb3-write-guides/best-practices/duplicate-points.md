Learn how {{% product-name %}} handles duplicate points and how to design
writes that produce predictable results.

- [How InfluxDB handles duplicate points](#how-influxdb-handles-duplicate-points)
- [Recommended patterns for last-value tracking](#recommended-patterns-for-last-value-tracking)
  - [Append-only with unique timestamps (recommended)](#append-only-with-unique-timestamps-recommended)
  - [Append-only with change tracking field](#append-only-with-change-tracking-field)
- [Anti-patterns to avoid](#anti-patterns-to-avoid)
{{% show-in "cloud-dedicated" %}}- [Retention guidance for last-value tables](#retention-guidance-for-last-value-tables)
{{% /show-in %}}{{% show-in "cloud-dedicated,clustered,cloud-serverless" %}}- [Performance considerations](#performance-considerations)
{{% /show-in %}}

## How InfluxDB handles duplicate points

A point is identified by its table, tag set, and timestamp.
For the full definition, see [Data model](/influxdb3/version/reference/data-model/#point-identity).

If you write a point with the same table, tag set, and timestamp as an
existing point, {{% product-name %}} stores a single row for that identity
and merges the field sets of the duplicate writes.
When duplicate writes set the same field, {{% product-name %}} doesn't
guarantee which value is retained.

> [!Warning]
> #### Overwrites are not deterministic
>
> Overwriting a point (same table, tag set, and timestamp) is not a reliable
> way to maintain a last-value view.
> Queries may return either version, and either version may be stored.
> To maintain a last-value view, use an
> [append-only pattern](#recommended-patterns-for-last-value-tracking).

For the timing-related causes of unexpected duplicate-point results, see
[Troubleshoot issues writing data](/influxdb3/version/write-data/troubleshoot/#unexpected-duplicate-point-results).

## Recommended patterns for last-value tracking

To reliably maintain a last-value view of your data, use one of the following
append-only patterns:

- [Append-only with unique timestamps (recommended)](#append-only-with-unique-timestamps-recommended)
- [Append-only with change tracking field](#append-only-with-change-tracking-field)

### Append-only with unique timestamps (recommended)

Write each change as a new point with a unique timestamp using the actual
event time.
Query for the most recent point to get the current value.

**Line protocol example**:

```lp
device_status,device_id=sensor01 status="active",temperature=72.5 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1 1700000300000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1 1700000600000000000
```

**SQL query to get latest state**:

```sql
SELECT
  device_id,
  status,
  temperature,
  time
FROM device_status
WHERE time >= now() - INTERVAL '7 days'
  AND device_id = 'sensor01'
ORDER BY time DESC
LIMIT 1
```

**InfluxQL query to get latest state**:

```influxql
SELECT LAST(status), LAST(temperature)
FROM device_status
WHERE device_id = 'sensor01'
  AND time >= now() - 7d
GROUP BY device_id
```

### Append-only with change tracking field

To filter by "changes since a specific time," add a dedicated
`last_change_timestamp` field.

**Line protocol example**:

```lp
device_status,device_id=sensor01 status="active",temperature=72.5,last_change_timestamp=1700000000000000000i 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1,last_change_timestamp=1700000300000000000i 1700000300000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1,last_change_timestamp=1700000600000000000i 1700000600000000000
```

**SQL query to get changes since a specific time**:

```sql
SELECT
  device_id,
  status,
  temperature,
  time
FROM device_status
WHERE last_change_timestamp >= 1700000000000000000
ORDER BY time DESC
```

## Anti-patterns to avoid

The following patterns produce non-deterministic results:

- [Don't overwrite the same (time, tags) point](#dont-overwrite-the-same-time-tags-point)
- [Don't add a field while overwriting data (time, tags)](#dont-add-a-field-while-overwriting-data-time-tags)
- [Don't rely on short write delays to force ordering](#dont-rely-on-short-write-delays-to-force-ordering)

### Don't overwrite the same (time, tags) point

If you write multiple points with the same time and tag set, any of the
values might be retained.
For example, **don't do this**:

```text
-- All writes use the same timestamp
device_status,device_id=sensor01 status="active",temperature=72.5 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1 1700000000000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1 1700000000000000000
```

### Don't add a field while overwriting data (time, tags)

Adding a field doesn't make points unique.
Points with the same time and tag set are still duplicates--for example,
**don't do this**:

```text
-- All writes use the same timestamp, but add a version field
device_status,device_id=sensor01 status="active",temperature=72.5,version=1i 1700000000000000000
device_status,device_id=sensor01 status="active",temperature=73.1,version=2i 1700000000000000000
device_status,device_id=sensor01 status="inactive",temperature=73.1,version=3i 1700000000000000000
```

### Don't rely on short write delays to force ordering

A delay between duplicate writes doesn't guarantee which write is retained.
For example, **don't do this**:

```text
-- Writing with delays between each write
device_status,device_id=sensor01 status="active" 1700000000000000000
# Wait 10 seconds...
device_status,device_id=sensor01 status="inactive" 1700000000000000000
```

{{% show-in "core,enterprise" %}}
Append-only patterns increase row count.
See [Create a database](/influxdb3/version/admin/databases/create/) to
configure shorter retention for last-value data.
For query and storage guidance, see
[Performance tuning](/influxdb3/version/admin/performance-tuning/).
{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}

## Retention guidance for last-value tables

{{% product-name %}} applies retention at the database level.
If your last-value view only needs to retain data for days or weeks, but your
main database retains data for months or years (for example, ~400 days),
consider creating a separate database with shorter retention specifically for
last-value tracking.

**Benefits**:

- Reduces storage costs for last-value data
- Improves query performance by limiting data volume
- Allows independent retention policies for different use cases

**Example**:

```bash
# Create a database for last-value tracking with 7-day retention
influxctl database create device_status_current --retention-period 7d

# Create your main database with longer retention
influxctl database create device_status_history --retention-period 400d
```

Then write current status to `device_status_current` and historical data to
`device_status_history`.
{{% /show-in %}}

{{% show-in "cloud-dedicated,clustered,cloud-serverless" %}}

## Performance considerations

### Row count and query performance

Append-only patterns increase row counts compared to overwriting duplicate
points.
To maintain query performance:

1. **Limit query time ranges**: Query only the time range you need (for
   example, last 7 days for current state).
2. **Use time-based filters**: Always include a `WHERE time >=` clause to
   narrow the query scope.
3. **Consider shorter retention**: For last-value views, use a dedicated
   {{% show-in "cloud-serverless" %}}bucket{{% /show-in %}}{{% hide-in "cloud-serverless" %}}database{{% /hide-in %}}
   with shorter retention.

**Example - Good query with time filter**:

```sql
SELECT device_id, status, temperature, time
FROM device_status
WHERE time >= now() - INTERVAL '7 days'
ORDER BY time DESC
```

**Example - Avoid querying entire table**:

```sql
-- Don't do this - queries all historical data
SELECT device_id, status, temperature, time
FROM device_status
ORDER BY time DESC
```

### Storage and cache bandwidth

Append-only patterns create more data points, which results in larger Parquet
files.
This can increase cache bandwidth usage when querying large time ranges.

**Mitigation strategies**:

1. **Narrow time filters**: Query only same-day partitions when possible.
2. **Use partition-aligned time ranges**: Queries that align with partition
   boundaries are more efficient.
3. **Consider aggregation**: For historical analysis, use downsampled or
   aggregated data instead of raw points.

**Example - Partition-aligned query**:

```sql
SELECT device_id, status, temperature, time
FROM device_status
WHERE time >= '2025-11-20T00:00:00Z'
  AND time < '2025-11-21T00:00:00Z'
ORDER BY time DESC
```
{{% /show-in %}}
