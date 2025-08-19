
InfluxDB 3 has specific naming restrictions and conventions that apply to 
databases, tables, tags, fields, and other identifiers. Understanding these 
restrictions helps ensure your data model works correctly with all query languages 
and avoids naming conflicts.

## Database names

Database names must follow these restrictions:

- **Length**: Maximum 64 characters
- **Allowed characters**: Only alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`), and forward-slash (`/`)
- **Prohibited characters**: Cannot contain whitespace, punctuation, or other special characters
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Database names are case-sensitive

### Examples

**Valid database names:**
```text
mydb
sensor_data
prod-metrics
logs/application
webserver123
```

**Invalid database names:**
```text
my database        # Contains whitespace
sensor.data        # Contains period
app@server         # Contains special character
_internal          # Starts with underscore (not recommended)
very_long_database_name_that_exceeds_sixty_four_character_limit  # Too long
```

## Table (measurement) names

Table names in {{% product-name %}} follow line protocol measurement naming rules:

- **Length**: No explicit limit, but practical limits apply for performance
- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`)
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Table names are case-sensitive
- **Quoting**: Use double quotes when names contain special characters or whitespace

### Examples

**Valid table names:**
```text
temperature
cpu_usage
http-requests
sensor123
웹서버_메트릭스  # UTF-8 characters
```

**Names requiring quotes in queries:**
```text
"my table"         # Contains whitespace
"cpu.usage"        # Contains period
"http@requests"    # Contains special character
```

**Invalid table names:**
```text
_internal          # Starts with underscore (not recommended)
```

## Tag keys and field keys

Tag keys and field keys follow these restrictions:

- **Length**: No explicit limit, but shorter names improve performance
- **Allowed characters**: Alphanumeric characters (a-z, A-Z, 0-9), underscore (`_`), dash (`-`)
- **Starting character**: Should start with a letter or number and should not start with underscore (`_`)
- **Case sensitivity**: Tag and field keys are case-sensitive
- **Quoting**: Use double quotes when names contain special characters or whitespace

### Examples

**Valid tag and field keys:**
```text
host
region
temperature
cpu_usage
http-status
sensor123
```

**Keys requiring quotes in queries:**
```text
"host name"        # Contains whitespace
"cpu.usage"        # Contains period
"http@status"      # Contains special character
```

**Invalid tag and field keys:**
```text
_internal          # Starts with underscore (not recommended)
```

## Tag values and field values

Tag and field values have different restrictions:

### Tag values
- **Type**: Must be strings
- **Length**: No explicit limit
- **Characters**: Any UTF-8 characters allowed
- **Case sensitivity**: Tag values are case-sensitive
- **Null values**: Allowed (excluded from primary key)

### Field values
- **Type**: Can be integers, floats, strings, booleans, or unsigned integers
- **Length**: No explicit limit for strings
- **Characters**: Any UTF-8 characters allowed for strings
- **Case sensitivity**: String field values are case-sensitive
- **Null values**: Allowed (but at least one field must be non-null per row)

## Query language specific considerations

Different query languages have additional naming requirements:

### SQL identifiers

When using SQL to query {{% product-name %}}:

- **Unquoted identifiers**: Must start with letter or underscore, contain only letters, digits, or underscores
- **Quoted identifiers**: Use double quotes (`"`) for names with special characters, whitespace, or to preserve case
- **Case sensitivity**: Unquoted identifiers are case-insensitive, quoted identifiers are case-sensitive
- **Reserved keywords**: [SQL keywords](/influxdb3/clustered/reference/sql/#keywords) must be quoted when used as identifiers

### InfluxQL identifiers

When using InfluxQL to query {{% product-name %}}:

- **Unquoted identifiers**: Must start with ASCII letter or underscore, contain only ASCII letters, digits, or underscores
- **Quoted identifiers**: Use double quotes (`"`) for names with special characters or whitespace
- **Case sensitivity**: All identifiers are case-sensitive
- **Reserved keywords**: [InfluxQL keywords](/influxdb3/clustered/reference/influxql/#keywords) must be quoted when used as identifiers
- **Character encoding**: UTF-8 encoding supported

## Reserved namespaces

### System reserved prefixes

The following prefixes may be reserved for system use:

- **`_`** (underscore): May be reserved for system databases, measurements, and field keys
- **`iox_`**: Reserved for InfluxDB internal metadata

> [!Caution]
> #### Using underscore-prefixed names
>
> While InfluxDB might not explicitly reject names starting with underscore (`_`),
> using them risks conflicts with current or future system features and may
> result in unexpected behavior or data loss.

### Common reserved keywords

Avoid using these common reserved keywords as identifiers without quoting:

**SQL keywords** (partial list):
- `SELECT`, `FROM`, `WHERE`, `GROUP`, `ORDER`, `BY`
- `CREATE`, `DROP`, `ALTER`, `INSERT`, `UPDATE`, `DELETE`
- `TABLE`, `DATABASE`, `INDEX`, `VIEW`
- `TIME`, `TIMESTAMP`, `INTERVAL`

**InfluxQL keywords** (partial list):
- `SELECT`, `FROM`, `WHERE`, `GROUP`, `ORDER`, `BY`
- `SHOW`, `DROP`, `CREATE`, `DELETE`
- `MEASUREMENT`, `TAG`, `FIELD`, `TIME`
- `LIMIT`, `OFFSET`, `SLIMIT`, `SOFFSET`

For complete lists, see:
- [SQL keywords](/influxdb3/clustered/reference/sql/#keywords)
- [InfluxQL keywords](/influxdb3/clustered/reference/influxql/#keywords)

## Best practices

### Naming conventions

1. **Use descriptive names**: Choose names that clearly describe the data
2. **Keep names simple**: Avoid special characters when possible
3. **Use consistent casing**: Establish and follow a consistent case convention
4. **Avoid reserved keywords**: Don't use SQL or InfluxQL keywords as identifiers
5. **Use underscores for separation**: Prefer `cpu_usage` over `cpu-usage` or `cpuUsage`

### Performance considerations

1. **Shorter names**: Shorter names improve query performance and reduce storage
2. **Avoid excessive tag cardinality**: Too many unique tag values can impact performance
3. **Limit column count**: Keep the number of columns (tags + fields) reasonable
4. **Consistent naming**: Use the same names across related tables

### Example naming strategy

```text
# Database naming
prod-metrics
dev-logs
sensor-data

# Table naming
cpu_usage
memory_utilization
http_requests
disk_io

# Tag keys
host
region
service
environment

# Field keys
value
count
duration_ms
bytes_sent
```

## Quoting identifiers

When identifiers contain special characters, whitespace, or reserved keywords, 
they must be quoted in queries:

### SQL examples

```sql
-- Quoted database and table names
SELECT * FROM "my-database"."my table";

-- Quoted column names
SELECT "cpu usage", "memory.available" FROM metrics;

-- Reserved keyword as identifier
SELECT "group" FROM "user-data";
```

### InfluxQL examples

```influxql
-- Quoted measurement name
SELECT * FROM "http requests";

-- Quoted tag key with special characters
SELECT * FROM metrics WHERE "host.name" = 'server01';

-- Reserved keyword as field
SELECT "time" FROM "system-metrics";
```

## Troubleshooting naming issues

### Common error patterns

1. **Unquoted special characters**: Use double quotes around identifiers with special characters
2. **Reserved keyword conflicts**: Quote reserved keywords when used as identifiers
3. **Case sensitivity issues**: Check case sensitivity rules for your query language
4. **Underscore prefix warnings**: Avoid starting names with underscore to prevent conflicts

### Validation tips

1. **Test names in queries**: Verify names work correctly in your target query language
2. **Check for reserved keywords**: Cross-reference names against keyword lists
3. **Validate character encoding**: Ensure UTF-8 characters are properly encoded
4. **Consider future compatibility**: Choose names that work across different query languages