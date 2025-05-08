# GitHub Copilot Instructions for InfluxData Documentation

## Purpose and scope

GitHub Copilot should help document InfluxData products by creating clear, accurate technical content with proper code examples, frontmatter, and formatting.

## Documentation structure

- **Product version data**: `/data/products.yml`
- **Products**:
  - InfluxDB 3 Core
    - Documentation source path: `/content/influxdb3/core`
    - Published for the web: https://docs.influxdata.com/influxdb3/core/
    - Code repositories: https://github.com/influxdata/influxdb, https://github.com/influxdata/influxdb3_core
  - InfluxDB 3 Enterprise
    - Documentation source path: `/content/influxdb3/enterprise`
    - Published for the web: https://docs.influxdata.com/influxdb3/enterprise/
    - Code repositories: https://github.com/influxdata/influxdb, https://github.com/influxdata/influxdb3_enterprise
  - InfluxDB Cloud Dedicated
    - Documentation source path: `/content/influxdb3/cloud-dedicated`
    - Published for the web: https://docs.influxdata.com/influxdb3/cloud-dedicated/
    - Code repository: https://github.com/influxdata/influxdb
  - InfluxDB Cloud Serverless
    - Documentation source path: `/content/influxdb3/cloud-serverless`
    - Published for the web: https://docs.influxdata.com/influxdb3/cloud-serverless/
    - Code repository: https://github.com/influxdata/idpe
  - InfluxDB Cloud v2 (TSM)
    - Documentation source path: `/content/influxdb/cloud`
    - Published for the web: https://docs.influxdata.com/influxdb/cloud/
    - Code repository: https://github.com/influxdata/idpe
  - InfluxDB Clustered
    - Documentation source path: `/content/influxdb3/clustered`
    - Published for the web: https://docs.influxdata.com/influxdb3/clustered/
    - Code repository: https://github.com/influxdata/influxdb
  - InfluxDB Enterprise v1 (1.x)
    - Documentation source path: `/content/influxdb/enterprise_influxdb`
    - Published for the web: https://docs.influxdata.com/enterprise_influxdb/v1/
    - Code repository: https://github.com/influxdata/influxdb
  - InfluxDB OSS 1.x
    - Documentation source path: `/content/influxdb/v1`
    - Published for the web: https://docs.influxdata.com/influxdb/v1/
    - Code repository: https://github.com/influxdata/influxdb
  - InfluxDB OSS 2.x
    - Documentation source path: `/content/influxdb/v2`
    - Published for the web: https://docs.influxdata.com/influxdb/v2/
    - Code repository: https://github.com/influxdata/influxdb
  - Telegraf
    - Documentation source path: `/content/telegraf/v1`
    - Published for the web: https://docs.influxdata.com/telegraf/v1/
    - Code repository: https://github.com/influxdata/telegraf
  - Kapacitor
    - Documentation source path: `/content/kapacitor/v1`
    - Published for the web: https://docs.influxdata.com/kapacitor/v1/
    - Code repository: https://github.com/influxdata/kapacitor
  - Chronograf
    - Documentation source path: `/content/chronograf/v1`
    - Published for the web: https://docs.influxdata.com/chronograf/v1/
    - Code repository: https://github.com/influxdata/chronograf
  - Flux
    - Documentation source path: `/content/flux/v0`
    - Published for the web: https://docs.influxdata.com/flux/v0/
    - Code repository: https://github.com/influxdata/flux
- **InfluxData-supported tools**:
  - InfluxDB API client libraries
    - Code repositories: https://github.com/InfluxCommunity
  - InfluxDB 3 processing engine plugins
    - Code repository: https://github.com/influxdata/influxdb3_plugins
- **Query Languages**: SQL, InfluxQL, Flux (use appropriate language per product version)
- **Documentation Site**: https://docs.influxdata.com
- **Repository**: https://github.com/influxdata/docs-v2
- **Framework**: Hugo static site generator

## Style guidelines

- Follow Google Developer Documentation style guidelines
- For API references, follow YouTube Data API style
- Use semantic line feeds (one sentence per line)
- Format code examples to fit within 80 characters
- Command line examples:
    - Should be formatted as code blocks
    - Should use long options (e.g., `--option` instead of `-o`)
- Use cURL for API examples
    - Format to fit within 80 characters
    - Should use `--data-urlencode` for query parameters
    - Should use `--header` for headers
- Use only h2-h6 headings in content (h1 comes from frontmatter title properties)
- Use sentence case for headings
- Use GitHub callout syntax
- Image naming: `project/version-context-description.png`
- Use appropriate product names and versions consistently
- Follow InfluxData vocabulary guidelines

## Markdown and shortcodes

- Include proper frontmatter for each page:

  ```yaml
  title: # Page title (h1)
  seotitle: # SEO title
  list_title: # Title for article lists
  description: # SEO description
  menu:
    product_version:
  weight: # Page order (1-99, 101-199, etc.)
  ```
- Follow the shortcode examples in `content/example.md` and the documentation
  for docs-v2 contributors in `CONTRIBUTING.md`
- Use provided shortcodes correctly:
  - Notes/warnings: `{{% note %}}`, `{{% warn %}}`
  - Product-specific: `{{% enterprise %}}`, `{{% cloud %}}`
  - Tabbed content: `{{< tabs-wrapper >}}`, `{{% tabs %}}`, `{{% tab-content %}}`
  - Tabbed content for code examples (without additional text): `{{< code-tabs-wrapper >}}`, `{{% code-tabs %}}`, `{{% code-tab-content %}}`
  - Version links: `{{< latest >}}`, `{{< latest-patch >}}`
  - API endpoints: `{{< api-endpoint >}}`
  - Required elements: `{{< req >}}`
  - Navigation: `{{< page-nav >}}`
  - Diagrams: `{{< diagram >}}`, `{{< filesystem-diagram >}}`

## Code examples and testing

- Provide complete, working examples with proper testing annotations:

```python
print("Hello, world!")
```

<!--pytest-codeblocks:expected-output-->

```
Hello, world!
```

- CLI command example:

```sh
influx query 'from(bucket:"example") |> range(start:-1h)'
```

<!--pytest-codeblocks:expected-output-->

```
Table: keys: [_start, _stop, _field, _measurement]
           _start:time                      _stop:time           _field:string     _measurement:string                      _time:time                  _value:float
------------------------------  ------------------------------  ----------------------  ----------------------  ------------------------------  ----------------------------
```

- Include necessary environment variables
- Show proper credential handling for authenticated commands

## API documentation

- `/api-docs` contains OpenAPI spec files used for API reference documentation
- Follow OpenAPI specification patterns
- Match REST API examples to current implementation
- Include complete request/response examples
- Document required headers and authentication

## Versioning and product differentiation

- Clearly distinguish between different InfluxDB versions (1.x, 2.x, 3.x)
- Use correct terminology for each product variant
- Apply appropriate UI descriptions and screenshots
- Reference appropriate query language per version

## Development tools

- Vale.sh linter for style checking
  - Configuration file: `.vale.ini` 
- Docker for local development and testing
- pytest and pytest-codeblocks for validating code examples
- Use cypress for testing documentation UI and links
- Prettier for code formatting
- ESLint for JavaScript and TypeScript linting
- Lefthook (NPM package) for managing pre-commit hooks for quality assurance

## Code style

- Use modern JavaScript (ES6+) syntax

## Related repositories

- **Internal documentation assistance requests**: https://github.com/influxdata/DAR/issues Documentation
