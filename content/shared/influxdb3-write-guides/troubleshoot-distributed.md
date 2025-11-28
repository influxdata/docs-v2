Learn how to avoid unexpected results and recover from errors when writing to {{% product-name %}}.

- [Handle write responses](#handle-write-responses)
  - [Review HTTP status codes](#review-http-status-codes)
- [Troubleshoot failures](#troubleshoot-failures)
- [Troubleshoot rejected points](#troubleshoot-rejected-points)
- [Report write issues](#report-write-issues)
{{% show-in "cloud-dedicated,clustered" %}}- [Implement an exponential backoff strategy](#implement-an-exponential-backoff-strategy){{% /show-in %}}

## Handle write responses

{{% product-name %}} does the following when you send a write request:

1. Validates the request.
2. If successful, attempts to [ingest data](/influxdb3/version/reference/internals/durability/#data-ingest) from the request body; otherwise, responds with an [error status](#review-http-status-codes).
3. Ingests or rejects data from the batch and returns one of the following HTTP status codes:

   - `204 No Content`: All of the data is ingested and queryable.
   - `400 Bad Request`: Some {{% show-in "cloud-dedicated,clustered" %}}(_when **partial writes** are configured for the cluster_){{% /show-in %}} or all of the data has been rejected. Data that has not been rejected is ingested and queryable.

   The response body contains error details about [rejected points](#troubleshoot-rejected-points), up to 100 points.

Writes are synchronous--the response status indicates the final status of the write and all ingested data is queryable.

To ensure that InfluxDB handles writes in the order you request them,
wait for the response before you send the next request.

### Review HTTP status codes

InfluxDB uses conventional HTTP status codes to indicate the success or failure of a request.
The `message` property of the response body may contain additional details about the error.
{{< product-name >}} returns one the following HTTP status codes for a write request:

{{% show-in "clustered,cloud-dedicated" %}}
| HTTP response code              | Response body                                                                 | Description    |
| :-------------------------------| :---------------------------------------------------------------                                                               | :------------- |
| `204 "No Content"`              | Empty                                                                                                                | InfluxDB ingested all of the data in the batch |
| `400 "Bad request"`             | error details about rejected points, up to 100 points: `line` contains the first rejected line, `message` describes rejections | Some or all request data isn't allowed (for example, is malformed or falls outside of the database's retention period)--the response body indicates whether a partial write has occurred or if all data has been rejected |
| `401 "Unauthorized"`            | Empty | The `Authorization` request header is missing or malformed or the [token](/influxdb3/version/admin/tokens/) doesn't have permission to write to the database |
| `404 "Not found"`               | A requested **resource type** (for example, "database"), and **resource name** | A requested resource wasn't found |
| `422 "Unprocessable Entity"`    | `message` contains details about the error                                                                                     | The data isn't allowed (for example, falls outside of the database's retention period). |
| `500 "Internal server error"`   | Empty                                                                                                                              | Default status for an error |
| `503 "Service unavailable"`     | Empty                                                                                                                              | The server is temporarily unavailable or the requested service is resource constrained. [Implement an exponential backoff strategy](#implement-an-exponential-backoff-strategy). |
{{% /show-in %}}

{{% show-in "cloud-serverless" %}}
| HTTP response code              | Response body                                                                 | Description    |
| :-------------------------------| :---------------------------------------------------------------                                                               | :------------- |
| `204 "No Content"`              | Empty                                                                                                                | InfluxDB ingested all of the data in the batch |
| `400 "Bad request"`             | error details about rejected points, up to 100 points: `line` contains the first rejected line, `message` describes rejections | Some or all request data isn't allowed (for example, is malformed or falls outside of the bucket's retention period)--the response body indicates whether a partial write has occurred or if all data has been rejected |
| `401 "Unauthorized"`            | Empty | The `Authorization` request header is missing or malformed or the [token](/influxdb3/version/admin/tokens/) doesn't have permission to write to the bucket |
| `404 "Not found"`               | A requested **resource type** (for example, "organization" or "bucket"), and **resource name** | A requested resource wasn't found |
| `413 "Request too large"`       | cannot read data: points in batch is too large                                                                                 | The request exceeds the maximum [global limit](/influxdb3/cloud-serverless/admin/billing/limits/) |
| `422 "Unprocessable Entity"`    | `message` contains details about the error                                                                                     | The data isn't allowed (for example, falls outside of the database's retention period). |
| `429 "Too many requests"`       | Empty                                                                                                                              | The number of requests exceeds the [adjustable service quota](/influxdb3/cloud-serverless/admin/billing/limits/#adjustable-service-quotas). The `Retry-After` header contains the number of seconds to wait before trying the write again. |
| `500 "Internal server error"`   | Empty                                                                                                                              | Default status for an error |
| `503 "Service unavailable"`     | Empty                                                                                                                              | The server is temporarily unavailable to accept writes. The `Retry-After` header contains the number of seconds to wait before trying the write again. |
{{% /show-in %}}

The `message` property of the response body may contain additional details about the error.
If your data did not write to the {{% show-in "cloud-serverless" %}}bucket{{% /show-in %}}{{% show-in "cloud-dedicated,clustered" %}}database{{% /show-in %}}, see how to [troubleshoot rejected points](#troubleshoot-rejected-points).

## Troubleshoot failures

If you notice data is missing in your database, do the following:

- Check the [HTTP status code](#review-http-status-codes) in the response.
- Check the `message` property in the response body for details about the error.
- If the `message` describes a field error, [troubleshoot rejected points](#troubleshoot-rejected-points).
- Verify all lines contain valid syntax ([line protocol](/influxdb3/version/reference/syntax/line-protocol/)).
- Verify the timestamps in your data match the [precision parameter](/influxdb3/version/reference/glossary/#precision) in your request.
- Minimize payload size and network errors by [optimizing writes](/influxdb3/version/write-data/best-practices/optimize-writes/).

## Troubleshoot rejected points

When writing points from a batch, InfluxDB rejects points that have syntax errors or schema conflicts.
If InfluxDB processes the data in your batch and then rejects points, the [HTTP response](#handle-write-responses) body contains the following properties that describe rejected points:

- `code`: `"invalid"`
- `line`: the line number of the _first_ rejected point in the batch.
- `message`: a string that contains line-separated error messages, one message for each rejected point in the batch, up to 100 rejected points. Line numbers are 1-based.

InfluxDB rejects points for the following reasons:

- a line protocol parsing error
- an invalid timestamp
- a schema conflict

Schema conflicts occur when you try to write data that contains any of the following:

- a wrong data type: the point falls within the same partition (default partitioning is measurement and day) as existing {{% show-in "cloud-serverless" %}}bucket{{% /show-in %}} {{% show-in "cloud-dedicated,clustered" %}}database{{% /show-in %}} data and contains a different data type for an existing field
- a tag and a field that use the same key

### Example

The following example shows a response body for a write request that contains two rejected points:

```json
{
  "code": "invalid",
  "line": 2,
  "message": "failed to parse line protocol:
              errors encountered on line(s):
              error parsing line 2 (1-based): Invalid measurement was provided
              error parsing line 4 (1-based): Unable to parse timestamp value '123461000000000000000000000000'"
}
```

Check for [field data type](/influxdb3/version/reference/syntax/line-protocol/#data-types-and-format) differences between the rejected data point and points within the same database and partition (default partitioning
is by measurement and day)--for example, did you attempt to write `string` data to an `int` field?

## Report write issues

If you experience persistent write issues that you can't resolve using the troubleshooting steps above, use these guidelines to gather the necessary information when reporting the issue to InfluxData support.

> [!Note]
> #### Before reporting an issue
>
> Ensure you have followed all [troubleshooting steps](#troubleshoot-failures) and
> reviewed the [write optimization guidelines](/influxdb3/version/write-data/best-practices/optimize-writes/)
> to rule out common configuration and data formatting issues.

### Gather essential information

When reporting write issues, provide the following information to help InfluxData engineers diagnose the problem:

#### 1. Error details and logs

**Capture the complete error response:**

```bash { placeholders="AUTH_TOKEN|DATABASE_NAME" }
# Example: Capture both successful and failed write attempts
curl --silent --show-error --write-out "\nHTTP Status: %{http_code}\nResponse Time: %{time_total}s\n" \
  --request POST \
  "https://{{< influxdb/host >}}/write?db=DATABASE_NAME&precision=ns" \
  --header "Authorization: Bearer AUTH_TOKEN" \
  --header "Content-Type: text/plain; charset=utf-8" \
  --data-binary @problematic-data.lp \
  > write-error-response.txt 2>&1
```

**Log client-side errors:**

If using a client library, enable debug logging and capture the full exception details:

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[Python](#)
[Go](#)
[Java](#)
[JavaScript](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```python { placeholders="DATABASE_NAME|AUTH_TOKEN" }
import logging
from influxdb_client_3 import InfluxDBClient3

# Enable debug logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("influxdb_client_3")

try:
    client = InfluxDBClient3(token="AUTH_TOKEN", host="{{< influxdb/host >}}", database="DATABASE_NAME")
    client.write(data)
except Exception as e:
    logger.error(f"Write failed: {str(e)}")
    # Include full stack trace in your report
    import traceback
    traceback.print_exc()
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```go { placeholders="DATABASE_NAME|AUTH_TOKEN" }
package main

import (
    "context"
    "fmt"
    "log"
    "os"
    
    "github.com/InfluxCommunity/influxdb3-go"
)

func main() {
    // Enable debug logging
    client, err := influxdb3.New(influxdb3.ClientConfig{
        Host:     "https://{{< influxdb/host >}}",
        Token:    "AUTH_TOKEN",
        Database: "DATABASE_NAME",
        Debug:    true,
    })
    
    if err != nil {
        log.Fatal(err)
    }
    defer client.Close()
    
    err = client.Write(context.Background(), data)
    if err != nil {
        // Log the full error details
        fmt.Fprintf(os.Stderr, "Write error: %+v\n", err)
    }
}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```java { placeholders="DATABASE_NAME|AUTH_TOKEN" }
import com.influxdb.v3.client.InfluxDBClient;
import java.util.logging.Logger;
import java.util.logging.Level;

public class WriteErrorExample {
    private static final Logger logger = Logger.getLogger(WriteErrorExample.class.getName());
    
    public static void main(String[] args) {
        try (InfluxDBClient client = InfluxDBClient.getInstance(
                "https://{{< influxdb/host >}}",
                "AUTH_TOKEN".toCharArray(),
                "DATABASE_NAME")) {
            
            client.writeRecord(data);
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Write failed", e);
            // Include full stack trace in your report
            e.printStackTrace();
        }
    }
}
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```javascript { placeholders="DATABASE_NAME|AUTH_TOKEN" }
import { InfluxDBClient } from '@influxdata/influxdb3-client'

const client = new InfluxDBClient({
  host: 'https://{{< influxdb/host >}}',
  token: 'AUTH_TOKEN',
  database: 'DATABASE_NAME'
})

try {
  await client.write(data)
} catch (error) {
  console.error('Write failed:', error)
  // Include the full error object in your report
  console.error('Full error details:', JSON.stringify(error, null, 2))
}
```
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

Replace the following in your code:

{{% hide-in "cloud-serverless" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the database to query{{% /hide-in %}}
{{% show-in "cloud-serverless" %}}
- {{% code-placeholder-key %}}`DATABASE_NAME`{{% /code-placeholder-key %}}: the name of the bucket to query{{% /show-in %}}
{{% show-in "clustered,cloud-dedicated" %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: a [database token](/influxdb3/clustered/admin/tokens/#database-tokens) with _write_ access to the specified database.{{% /show-in %}}
{{% show-in "cloud-serverless" %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}:  an [API token](/influxdb3/cloud-serverless/admin/tokens/) with _write_ access to the specified bucket.{{% /show-in %}}
{{% show-in "enterprise,core" %}}
- {{% code-placeholder-key %}}`AUTH_TOKEN`{{% /code-placeholder-key %}}: your {{% token-link "database" %}} with write permissions on the specified database{{% /show-in %}}

#### 2. Data samples and patterns

**Provide representative data samples:**

- Include 10-20 lines of the problematic line protocol data (sanitized if necessary)
- Show both successful and failing data formats
- Include timestamp ranges and precision used
- Specify if the issue occurs with specific measurements, tags, or field types

**Example data documentation:**
```
# Successful writes:
measurement1,tag1=value1,tag2=value2 field1=1.23,field2="text" 1640995200000000000

# Failing writes:
measurement1,tag1=value1,tag2=value2 field1="string",field2=456 1640995260000000000
# Error: field data type conflict - field1 changed from float to string
```

#### 3. Write patterns and volume

Document your write patterns:

- **Frequency**: How often do you write data? (for example, every 10 seconds, once per minute)
- **Batch size**: How many points per write request?
- **Concurrency**: How many concurrent write operations?
- **Data retention**: How long is data retained?
- **Timing**: When did the issue first occur? Is it intermittent or consistent?

#### 4. Environment details

{{% show-in "clustered" %}}
**Cluster configuration:**
- InfluxDB Clustered version
- Kubernetes environment details
- Node specifications (CPU, memory, storage)
- Network configuration between client and cluster
{{% /show-in %}}

**Client configuration:**
- Client library version and language
- Connection settings (timeouts, retry logic)
- Geographic location relative to cluster

#### 5. Reproduction steps

Provide step-by-step instructions to reproduce the issue:

1. **Environment setup**: How to configure a similar environment
2. **Data preparation**: Sample data files or generation scripts  
3. **Write commands**: Exact commands or code used
4. **Expected vs actual results**: What should happen vs what actually happens

### Create a support package

Organize all gathered information into a comprehensive package:

**Files to include:**
- `write-error-response.txt` - HTTP response details
- `client-logs.txt` - Client library debug logs
- `sample-data.lp` - Representative line protocol data (sanitized)
- `reproduction-steps.md` - Detailed reproduction guide
- `environment-details.md` - {{% show-in "clustered" %}}Cluster and{{% /show-in %}} client configuration
- `write-patterns.md` - Usage patterns and volume information

**Package format:**
```bash
# Create a timestamped support package
TIMESTAMP=$(date -Iseconds)
mkdir "write-issue-${TIMESTAMP}"
# Add all relevant files to the directory
tar -czf "write-issue-${TIMESTAMP}.tar.gz" "write-issue-${TIMESTAMP}/"
```

### Submit the issue

Include the support package when contacting InfluxData support through your standard [support channels](#bug-reports-and-feedback), along with:

- A clear description of the problem
- Impact assessment (how critical is this issue?)
- Any workarounds you've attempted
- Business context if the issue affects production systems

This comprehensive information will help InfluxData engineers identify root causes and provide targeted solutions for your write issues.

{{% show-in "cloud-dedicated,clustered" %}}
## Implement an exponential backoff strategy

Use exponential backoff with jitter for retrying requests that return `429` or `503`.
This reduces load spikes and avoids thundering-herd problems.

**Recommended parameters**:

- Base delay: 1s
- Multiplier: 2 (double each retry)
- Max delay: 30s
- Max retries: 5 (increase only with care)
- Jitter: use "full jitter" (random between 0 and computed delay)

### Exponential backoff examples

{{< code-tabs-wrapper >}}
{{% code-tabs %}}
[cURL](#)
[Python](#)
[JavaScript](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
<!--------------------------------- BEGIN cURL -------------------------------->
<!--pytest.mark.skip-->
```sh
base=1
max_delay=30
max_retries=5

for attempt in $(seq 0 $max_retries); do
  resp_code=$(curl -s -o /dev/null -w "%{http_code}" --request POST "https://{{< influxdb/host >}}/write?db=DB" ...)
  if [ "$resp_code" -eq 204 ]; then
    echo "Write succeeded"
    break
  fi

  if [ "$resp_code" -ne 429 ] && [ "$resp_code" -ne 503 ]; then
    echo "Non-retryable response: $resp_code"
    break
  fi

  # compute exponential delay and apply full jitter
  delay=$(awk -v b=$base -v a=$attempt -v m=$max_delay 'BEGIN{d=b*(2^a); if(d>m) d=m; print d}')
  sleep_seconds=$(awk -v d=$delay 'BEGIN{srand(); printf "%.3f", rand()*d}')
  sleep $sleep_seconds
done
```
<!---------------------------------- END cURL --------------------------------->
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!-------------------------------- BEGIN Python ------------------------------->
<!--pytest.mark.skip-->
```python
import random
import time
import requests

base = 1.0
max_delay = 30.0
max_retries = 5

for attempt in range(max_retries + 1):
    r = requests.post(url, headers=headers, data=body, timeout=10)
    if r.status_code == 204:
        break
    if r.status_code not in (429, 503):
        raise RuntimeError(f"Non-retryable: {r.status_code} {r.text}")

    # exponential backoff with full jitter
    retry_delay = min(base * (2 ** attempt), max_delay)
    sleep = random.random() * retry_delay  # full jitter
    time.sleep(sleep)
else:
    raise RuntimeError("Max retries exceeded")
```
<!--------------------------------- END Python -------------------------------->
{{% /code-tab-content %}}

{{% code-tab-content %}}
<!------------------------------ BEGIN JavaScript ----------------------------->
<!--pytest.mark.skip-->
```js
const base = 1000;
const maxDelay = 30000;
const maxRetries = 5;

async function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

for (let attempt = 0; attempt <= maxRetries; attempt++) {
  const res = await fetch(url, { method: 'POST', body });
  if (res.status === 204) break;
  if (![429, 503].includes(res.status)) throw new Error(`Non-retryable ${res.status}`);

  let delay = base * 2 ** attempt;
  delay = Math.min(delay, maxDelay);

  const sleepMs = Math.random() * delay; // full jitter
  await sleep(sleepMs);
}
```
<!------------------------------- END JavaScript ------------------------------>
{{% /code-tab-content %}}
{{< /code-tabs-wrapper >}}

### Exponential backoff best practices

- Only retry on idempotent or safe request semantics your client supports.
- Retry only for `429` (Too Many Requests) and `503` (Service Unavailable).
- Do not retry on client errors like `400`, `401`, `404`, `422`.
- Cap the delay with `max_delay` to avoid excessively long waits.
- Limit total retries to avoid infinite loops and provide meaningful errors.
- Log retry attempts and backoff delays for observability and debugging.
- Combine backoff with bounded concurrency to avoid overwhelming the server.

{{% /show-in %}}
