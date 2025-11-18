Identifying which InfluxDB product and version you're using is essential for accessing the correct documentation, troubleshooting issues, and planning upgrades.

> \[!Note]
> {{< influxdb-version-detector >}}

## Quick detection methods

{{% hide-in "core,enterprise,cloud-serverless,cloud-dedicated,clustered,v2,cloud,v1" %}}

### By URL pattern

If you access InfluxDB via a URL, the hostname often indicates which product you're using:

| URL Pattern                                | Product                   |
| ------------------------------------------ | ------------------------- |
| `*.influxdb.io`                            | InfluxDB Cloud Dedicated  |
| `us-east-1-1.aws.cloud2.influxdata.com`    | InfluxDB Cloud Serverless |
| `eu-central-1-1.aws.cloud2.influxdata.com` | InfluxDB Cloud Serverless |
| `*.influxcloud.net`                        | InfluxDB Cloud 1 (legacy) |
| Other `*.cloud2.influxdata.com` regions    | InfluxDB Cloud (TSM)      |

### By default port

Different InfluxDB products use different default ports:

- **Port 8181**: InfluxDB 3 (Core or Enterprise)
- **Port 8086**: InfluxDB v1 or v2

### By HTTP headers

Check the `/ping` endpoint to examine HTTP response headers:

```bash
curl -i http://localhost:8086/ping
```

The response headers reveal your InfluxDB product:

| Headers                                                       | Product                |
| ------------------------------------------------------------- | ---------------------- |
| `x-influxdb-version: ^3.*`<br/>`x-influxdb-build: Core`       | InfluxDB 3 Core        |
| `x-influxdb-version: ^3.*`<br/>`x-influxdb-build: Enterprise` | InfluxDB 3 Enterprise  |
| `x-influxdb-version: ^2.*`<br/>`x-influxdb-build: OSS`        | InfluxDB OSS v2        |
| `x-influxdb-version: ^1.*`<br/>`x-influxdb-build: OSS`        | InfluxDB OSS v1        |
| `x-influxdb-build: Enterprise`<br/>(with v1 version)          | InfluxDB Enterprise v1 |

{{% /hide-in %}}

{{% show-in "core" %}}

### InfluxDB 3 Core detection

Check the version using the `influxdb3` command:

```bash
influxdb3 --version
```

Query the `/health` endpoint:

```bash
curl http://localhost:8181/health
```

Check the `/ping` endpoint headers:

```bash
curl -i http://localhost:8181/ping
```

Look for:

- `x-influxdb-version`: Version number (for example, `3.6.0`)
- `x-influxdb-build`: `Core`

{{% /show-in %}}

{{% show-in "enterprise" %}}

### InfluxDB 3 Enterprise detection

Check the version using the `influxdb3` command:

```bash
influxdb3 --version
```

Query the `/health` endpoint:

```bash
curl http://localhost:8181/health
```

Check the `/ping` endpoint headers:

```bash
curl -i http://localhost:8181/ping
```

Look for:

- `x-influxdb-version`: Version number (for example, `3.6.0`)
- `x-influxdb-build`: `Enterprise`

{{% /show-in %}}

{{% show-in "clustered" %}}

### InfluxDB Clustered detection

Use the `influxctl` CLI to check your cluster version:

```bash
influxctl version
```

To view cluster information:

```bash
influxctl cluster list
```

{{% /show-in %}}

{{% show-in "cloud-serverless" %}}

### InfluxDB Cloud Serverless detection

**InfluxDB Cloud Serverless** can be identified by:

**URL patterns**:

- `us-east-1-1.aws.cloud2.influxdata.com`
- `eu-central-1-1.aws.cloud2.influxdata.com`

**Account settings**: Check your InfluxDB Cloud account dashboard for product and version details.

**HTTP headers**: API responses include version information in response headers.

{{% /show-in %}}

{{% show-in "cloud-dedicated" %}}

### InfluxDB Cloud Dedicated detection

**InfluxDB Cloud Dedicated** can be identified by:

**URL pattern**: `*.influxdb.io`

- Example: `cluster-id.a.influxdb.io`

**Account settings**: Check your InfluxDB Cloud Dedicated account dashboard for cluster and version details.

**HTTP headers**: API responses include version information in response headers.

{{% /show-in %}}

{{% show-in "v2" %}}

### InfluxDB OSS v2 detection

Check the version using `influxd`:

```bash
influxd version
```

Query the `/health` endpoint and extract the version:

```bash
curl -s http://localhost:8086/health | jq -r '.version'
```

The InfluxDB UI displays the version:

- On the login page
- In the right column of the main landing page
- In the user menu dropdown

For more details, see [How can I identify my InfluxDB version?](/influxdb/v2/reference/faq/#administration-1)

{{% /show-in %}}

{{% show-in "cloud" %}}

### InfluxDB Cloud (TSM) detection

**InfluxDB Cloud (TSM)** can be identified by:

**URL patterns** (regional cloud2.influxdata.com URLs, excluding Serverless regions):

- `us-west-2-1.aws.cloud2.influxdata.com`
- `us-west-2-2.aws.cloud2.influxdata.com`
- `us-east-1-2.aws.cloud2.influxdata.com` (note: different from Serverless)
- `us-central1-1.gcp.cloud2.influxdata.com`
- `westeurope-1.azure.cloud2.influxdata.com`
- `eastus-1.azure.cloud2.influxdata.com`

**Account settings**: Check your InfluxDB Cloud account dashboard for product details.

**HTTP headers**: API responses include version information in response headers.

{{% /show-in %}}

{{% show-in "v1" %}}

### InfluxDB OSS v1 / Enterprise v1 detection

Check the version using `influxd`:

```bash
influxd version
```

Check the `/ping` endpoint headers:

```bash
curl -i http://localhost:8086/ping
```

Look for the `x-influxdb-version` header (for example, `1.11.7`).

For Enterprise v1, the `x-influxdb-build` header will show `Enterprise`.

{{% /show-in %}}

{{% hide-in "core,enterprise,cloud-serverless,cloud-dedicated,clustered,v2,cloud,v1" %}}

## Product-specific methods

### InfluxDB 3 Core and Enterprise

{{< tabs-wrapper >}}
{{% tabs %}}
[Command line](#)
[Health endpoint](#)
[HTTP headers](#)
{{% /tabs %}}

{{% tab-content %}}

Check the version using the `influxdb3` command:

```bash
influxdb3 --version
```

{{% /tab-content %}}

{{% tab-content %}}

Query the `/health` endpoint:

```bash
curl http://localhost:8181/health
```

The response includes version information and build details.

{{% /tab-content %}}

{{% tab-content %}}

Check the `/ping` endpoint headers:

```bash
curl -i http://localhost:8181/ping
```

Look for:

- `x-influxdb-version`: Version number (for example, `3.6.0`)
- `x-influxdb-build`: `Core` or `Enterprise`

{{% /tab-content %}}

{{< /tabs-wrapper >}}

### InfluxDB Clustered

Use the `influxctl` CLI to check your cluster version:

```bash
influxctl version
```

To view cluster information:

```bash
influxctl cluster list
```

### InfluxDB OSS v2

{{< tabs-wrapper >}}
{{% tabs %}}
[Command line](#)
[Health API](#)
[User interface](#)
{{% /tabs %}}

{{% tab-content %}}

Check the version using `influxd`:

```bash
influxd version
```

**Example output:**

```
InfluxDB 2.7.12 (git: x0x000xx0x) build_date: 2024-MM-DDThh:mm:ssZ
```

{{% /tab-content %}}

{{% tab-content %}}

Query the `/health` endpoint and extract the version:

```bash
curl -s http://localhost:8086/health | jq -r '.version'
```

{{% /tab-content %}}

{{% tab-content %}}

The InfluxDB UI displays the version:

- On the login page
- In the right column of the main landing page
- In the user menu dropdown

{{% /tab-content %}}

{{< /tabs-wrapper >}}

For more details, see [How can I identify my InfluxDB version?](/influxdb/v2/reference/faq/#administration-1)

### InfluxDB Cloud (Serverless, Dedicated, TSM)

For InfluxDB Cloud products, check the version information:

- **Account settings**: Version details appear in your account dashboard
- **UI footer**: The version may be displayed at the bottom of the web interface
- **HTTP headers**: API responses include version headers
- **URL pattern**: See [By URL pattern](#by-url-pattern) above

### InfluxDB OSS v1 and Enterprise v1

{{< tabs-wrapper >}}
{{% tabs %}}
[Command line](#)
[HTTP API](#)
{{% /tabs %}}

{{% tab-content %}}

Check the version using `influxd`:

```bash
influxd version
```

{{% /tab-content %}}

{{% tab-content %}}

Check the `/ping` endpoint headers:

```bash
curl -i http://localhost:8086/ping
```

Look for the `x-influxdb-version` header (for example, `1.11.7`).

{{% /tab-content %}}

{{< /tabs-wrapper >}}

{{% /hide-in %}}

{{% hide-in "core,enterprise,cloud-serverless,cloud-dedicated,clustered,v2,cloud,v1,enterprise-v1" %}}

## Understanding InfluxDB products

InfluxData offers multiple InfluxDB products to suit different use cases:

| Product                       | License   | Hosting                  | Query Languages     | Default Port |
| ----------------------------- | --------- | ------------------------ | ------------------- | ------------ |
| **InfluxDB 3 Core**           | Free      | Self-hosted              | SQL, InfluxQL       | 8181         |
| **InfluxDB 3 Enterprise**     | Paid      | Self-hosted              | SQL, InfluxQL       | 8181         |
| **InfluxDB Cloud Serverless** | Free/Paid | Cloud                    | SQL, InfluxQL, Flux | N/A          |
| **InfluxDB Cloud Dedicated**  | Paid      | Cloud                    | SQL, InfluxQL       | N/A          |
| **InfluxDB Clustered**        | Paid      | Self-hosted (Kubernetes) | SQL, InfluxQL       | Custom       |
| **InfluxDB OSS v2**           | Free      | Self-hosted              | InfluxQL, Flux      | 8086         |
| **InfluxDB Cloud (TSM)**      | Free/Paid | Cloud                    | InfluxQL, Flux      | N/A          |
| **InfluxDB OSS v1**           | Free      | Self-hosted              | InfluxQL            | 8086         |
| **InfluxDB Enterprise v1**    | Paid      | Self-hosted              | InfluxQL, Flux      | 8086         |
| **InfluxDB Cloud 1**          | Paid      | Cloud                    | InfluxQL            | N/A          |

### Key characteristics

- **InfluxDB 3** products use SQL and InfluxQL, run on port 8181 (self-hosted), and provide improved performance and scalability
- **InfluxDB v2** products use InfluxQL and Flux, run on port 8086 (self-hosted), and use a bucket-based data model
- **InfluxDB v1** products use InfluxQL, run on port 8086 (self-hosted), and use a database-based data model

{{% /hide-in %}}

## Understanding InfluxDB products

For a complete comparison of InfluxDB versions and deployment options, see the [InfluxDB platform overview](/platform/).

## Troubleshooting

### Can't access your InfluxDB instance?

If you can't directly access your InfluxDB instance:

1. Use the [interactive version detector](#identify-your-influxdb-version) above or {{< ask-ai-link link-text="Ask InfluxData AI" query="Help determine my InfluxDB version based on licensing, hosting, server age, and API." >}}
2. Answer questions about your setup:
   - License type (paid or free)
   - Hosting model (cloud or self-hosted)
   - Server age
   - Query language preferences
3. Get product recommendations based on your answers

### Still not sure?

If you're still uncertain, see the [Support and feedback](#bug-reports-and-feedback) options.
