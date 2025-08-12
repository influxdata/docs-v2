Learn how to set appropriate query timeouts for InfluxDB 3 to balance performance and resource protection.

Query timeouts prevent resource monopolization while allowing legitimate queries to complete successfully.
The key is finding the "goldilocks zone"—timeouts that are not too short (causing legitimate queries to fail) and not too long (allowing runaway queries to monopolize resources).

- [Understanding query timeouts](#understanding-query-timeouts)
- [How query routing affects timeout strategy](#how-query-routing-affects-timeout-strategy)
- [Timeout configuration best practices](#timeout-configuration-best-practices)
- [InfluxDB 3 client library examples](#influxdb-3-client-library-examples)
- [Monitoring and troubleshooting](#monitoring-and-troubleshooting)

## Understanding query timeouts

Query timeouts define the maximum duration a query can run before being canceled.
In {{% product-name %}}, timeouts serve multiple purposes:

- **Resource protection**: Prevent runaway queries from monopolizing system resources
- **Performance optimization**: Ensure responsive system behavior for time-sensitive operations
- **Cost control**: Limit compute resource consumption
- **User experience**: Provide predictable response times for applications and dashboards

Query execution includes network latency, query planning, data retrieval, processing, and result serialization.

### The "goldilocks zone" for query timeouts

Optimal timeouts are:
- **Long enough**: To accommodate normal query execution under typical load
- **Short enough**: To prevent resource monopolization and provide reasonable feedback
- **Adaptive**: Adjusted based on query type, system load, and historical performance

## How query routing affects timeout strategy

InfluxDB 3 uses round-robin query routing to balance load across multiple queriers.
This creates a "checkout line" effect that influences timeout strategy.

> [!Note]
> #### Concurrent query execution 
>
> InfluxDB 3 supports concurrent query execution, which helps minimize the impact of intensive or inefficient queries.
> However, you should still use appropriate timeouts and optimize your queries for best performance.

### The checkout line analogy

Consider a grocery store with multiple checkout lines:
- Customers (queries) are distributed across lines (queriers)
- A slow customer (long-running query) can block others in the same line
- More checkout lines (queriers) provide more alternatives when retrying

If one querier is unhealthy or has been hijacked by a "noisy neighbor" query (excessively resource hungry), giving up sooner may save time--it's like jumping to a cashier with no customers in line. However, if all queriers are overloaded, then short retries may exacerbate the problem--you wouldn't jump to the end of another line if the cashier is already starting to scan your items.

### Noisy neighbor effects

In distributed systems:
- A single long-running query can impact other queries on the same querier
- Shorter timeouts with retries can help queries find less congested queriers
- The effectiveness depends on the number of available queriers

### When shorter timeouts help

- **Multiple queriers available**: Retries can find less congested queriers
- **Uneven load distribution**: Some queriers may be significantly less busy
- **Temporary congestion**: Brief spikes in query load or resource usage

### When shorter timeouts hurt

- **Few queriers**: Limited alternatives for retries
- **System-wide congestion**: All queriers are equally busy
- **Expensive query planning**: High overhead for query preparation

## Timeout configuration best practices

### Make timeouts adjustable

Configure timeouts that can be modified without service restarts using environment variables, configuration files, runtime APIs, or per-query overrides. Design your client applications to easily adjust timeouts on the fly, allowing you to respond quickly to performance changes and test different timeout strategies without code changes.

See the [InfluxDB 3 client library examples](#influxdb-3-client-library-examples)
for how to configure timeouts in Python.

### Use tiered timeout strategies

Implement different timeout classes based on query characteristics.

#### Starting point recommendations

{{% hide-in "cloud-serverless" %}}
| Query Type | Recommended Timeout | Use Case | Rationale |
|------------|-------------------|-----------|-----------|
| UI and dashboard | 10 seconds | Interactive dashboards, real-time monitoring | Users expect immediate feedback |
| Generic default | 60 seconds | Application queries, APIs | Balances performance and reliability |
| Mixed workload | 2 minutes | Development, testing environments | Accommodates various query types |
| Analytical and background | 5 minutes | Reports, batch processing, ETL operations | Complex queries need more time |
{{% /hide-in %}}

{{% show-in "cloud-serverless" %}}
| Query Type | Recommended Timeout | Use Case | Rationale |
|------------|-------------------|-----------|-----------|
| UI and dashboard | 10 seconds | Interactive dashboards, real-time monitoring | Users expect immediate feedback |
| Generic default | 30 seconds | Application queries, APIs | Serverless optimized for shorter queries |
| Mixed workload | 60 seconds | Development, testing environments | Limited by serverless execution model |
| Analytical and background | 2 minutes | Reports, batch processing | Complex queries within serverless limits |
{{% /show-in %}}

{{% show-in "enterprise, core" %}}
> [!Tip]
> #### Use caching
> Where immediate feedback is crucial, consider using [Last Value Cache](/influxdb3/version/admin/manage-last-value-caches/) to speed up queries for recent values and [Distinct Value Cache](/influxdb3/version/admin/manage-distinct-value-caches/) to speed up queries for distinct values.
{{% /show-in %}}

### Implement progressive timeout and retry logic

Consider using more sophisticated retry strategies rather than simple fixed retries:

1. **Exponential backoff**: Increase delay between retry attempts
2. **Jitter**: Add randomness to prevent thundering herd effects
3. **Circuit breakers**: Stop retries when system is overloaded
4. **Deadline propagation**: Respect overall operation deadlines

### Warning signs

Consider these indicators that timeouts may need adjustment:

- **Timeouts > 10 minutes**: Usually indicates [query optimization](/influxdb3/version/query-data/troubleshoot-and-optimize/optimize-queries/) opportunities
- **High retry rates**: May indicate timeouts are too aggressive
- **Resource utilization spikes**: Long-running queries may need shorter timeouts
- **User complaints**: Balance between performance and user experience

### Environment-specific considerations

- **Development**: Use longer timeouts for debugging
- **Production**: Use shorter timeouts with monitoring
- **Cost-sensitive**: Use aggressive timeouts and [query optimization](/influxdb3/version/query-data/troubleshoot-and-optimize/optimize-queries/)

### Experimental and ad-hoc queries

When introducing a new query to your application or when issuing ad-hoc queries to a database with many users, your query might be the "noisy neighbor" (the shopping cart overloaded with groceries). By setting a tighter timeout on experimental queries you can reduce the impact on other users.


## InfluxDB 3 client library examples

### Python client with timeout configuration

Configure timeouts in the InfluxDB 3 Python client:

```python { placeholders="DATABASE_NAME|HOST_URL|AUTH_TOKEN" }
import influxdb_client_3 as InfluxDBClient3

# Configure different timeout classes (in seconds)
ui_timeout = 10      # For dashboard queries  
api_timeout = 60     # For application queries
batch_timeout = 300  # For analytical queries

# Create client with default timeout
client = InfluxDBClient3.InfluxDBClient3(
    host="https://{{< influxdb/host >}}",
    database="DATABASE_NAME", 
    token="AUTH_TOKEN",
    timeout=api_timeout  # Python client uses seconds
)

# Quick query with short timeout
def query_latest_data():
    try:
        result = client.query(
            query="SELECT * FROM sensors WHERE time >= now() - INTERVAL '5 minutes' ORDER BY time DESC LIMIT 10",
            timeout=ui_timeout
        )
        return result.to_pandas()
    except Exception as e:
        print(f"Quick query failed: {e}")
        return None

# Analytical query with longer timeout  
def query_daily_averages():
    query = """
    SELECT 
        DATE_TRUNC('day', time) as day,
        room,
        AVG(temperature) as avg_temp,
        COUNT(*) as readings
    FROM sensors 
    WHERE time >= now() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', time), room
    ORDER BY day DESC, room
    """
    
    try:
        result = client.query(
            query=query,
            timeout=batch_timeout
        )
        return result.to_pandas()
    except Exception as e:
        print(f"Analytical query failed: {e}")
        return None
```

Replace the following:

{{% hide-in "cloud-serverless" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query{{% /hide-in %}}
{{% show-in "cloud-serverless" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the bucket to query{{% /show-in %}}
{{% show-in "clustered,cloud-dedicated" %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/clustered/admin/tokens/#database-tokens) with _read_ access to the specified database.{{% /show-in %}}
{{% show-in "cloud-serverless" %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:  an [API token](/influxdb3/cloud-serverless/admin/tokens/) with _read_ access to the specified bucket.{{% /show-in %}}
{{% show-in "enterprise,core" %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}}with read permissions on the specified database{{% /show-in %}}

### Basic retry logic implementation

Implement simple retry strategies with progressive timeouts:

```python
import time
import influxdb_client_3 as InfluxDBClient3

def query_with_retry(client, query: str, initial_timeout: int = 60, max_retries: int = 2):
    """Execute query with basic retry and progressive timeout increase"""
    
    for attempt in range(max_retries + 1):
        # Progressive timeout: increase timeout on each retry
        timeout_seconds = initial_timeout + attempt * 30
        
        try:
            result = client.query(
                query=query,
                timeout=timeout_seconds
            )
            return result
            
        except Exception as e:
            if attempt == max_retries:
                print(f"Query failed after {max_retries + 1} attempts: {e}")
                raise
            
            # Simple backoff delay
            delay = 2 * (attempt + 1)
            print(f"Query attempt {attempt + 1} failed: {e}")
            print(f"Retrying in {delay} seconds with timeout {timeout_seconds}s...")
            time.sleep(delay)
    
    return None

# Usage example
result = query_with_retry(
    client=client,
    query="SELECT * FROM large_table WHERE time >= now() - INTERVAL '1 day'",
    initial_timeout=60,
    max_retries=2
)
```

## Monitoring and troubleshooting

### Key metrics to monitor

Track these essential timeout-related metrics:

- **Query duration percentiles**: P50, P95, P99 execution times
- **Timeout rate**: Percentage of queries that time out
- **Error rates**: Timeout errors vs. other failure types
- **Resource utilization**: CPU and memory usage during query execution

### Common timeout issues

#### High timeout rates

**Symptoms**: Many queries exceeding timeout limits

**Common causes**:
- Timeouts set too aggressively for query complexity
- System resource constraints
- Inefficient query patterns

**Solutions**:
1. Analyze query performance patterns
2. [Optimize slow queries](/influxdb3/version/query-data/troubleshoot-and-optimize/optimize-queries/) or increase timeouts appropriately
3. Scale system resources

#### Inconsistent query performance

**Symptoms**: Same queries sometimes fast, sometimes timeout

**Common causes**:

- Resource contention from concurrent queries
- Data compaction state (queries may be faster after compaction completes)

**Solutions**:

1. Analyze query patterns to identify and optimize slow queries
2. Implement retry logic with exponential backoff in your client applications
3. Adjust timeout values based on observed query performance patterns
{{% show-in "enterprise,core" %}}
4. Implement [Last Value Cache](/influxdb3/version/admin/manage-last-value-caches/) to speed up queries for recent values
5. Implement [Distinct Value Cache](/influxdb3/version/admin/manage-distinct-value-caches/) to speed up queries for distinct values
{{% /show-in %}}

> [!Note]
> Regular analysis of timeout patterns helps identify optimization opportunities and system scaling needs.