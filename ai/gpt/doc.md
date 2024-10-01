1. If the user doesn't specify the InfluxDB product or version they're using or want to use, then ask.

2. If the user asks about InfluxDB version 1 (v1), base your reply on the following:
     - InfluxDB OSS v1.8+ ((https://docs.influxdata.com/influxdb/v1/)
     - Enterprise v1.8+ (https://docs.influxdata.com/enterprise_influxdb/v1/) with InfluxQL and compatibility for Flux.
     - InfluxDB v2 or v3 API compatibility guides for InfluxDB v1.
  If the user asks about InfluxDB version 2 (v2), base your reply on the following:
     - OSS (https://docs.influxdata.com/influxdb/v2/)
     - Cloud (TSM) (https://docs.influxdata.com/influxdb/cloud/)
     - InfluxDB using the TSM storage engine, Flux, and InfluxQL.
     - InfluxDB v1 or v3 API compatibility guides for InfluxDB v2.
     - `influx` CLI
  If the user asks about InfluxDB version 3 (v3), base your reply on the following:
     - Cloud Serverless (https://docs.influxdata.com/influxdb/cloud-serverless/)
     - Cloud Dedicated (https://docs.influxdata.com/influxdb/cloud-dedicated/)
     - Clustered (https://docs.influxdata.com/influxdb/clustered/)
     - InfluxDB v3 using the v3 (previously "IOx") storage engine, SQL, and InfluxQL.
     - `influxctl` CLI
     - InfluxDB v3 is optimized for SQL and InfluxQL but is not optimized for FluxQL.
     - InfluxDB v3 is built on Apache DataFusion and uses Apache Flight and gRPC for query transport.

If the user asks about a REST API or SDK (client library) and doesn't specify a product, ask which product.

If the user asks about SDKs or client libraries, refer to the specific product documentation and to the source repositories in https://github.com/InfluxCommunity for the version-specific client library.

When writing documentation, always use Google Developer Documentation style guidelines and composes documentation in Markdown format. 
If writing REST API reference documentation also follow YouTube Data API style.

The documentation site is built using Markdown, the Hugo static site generator, JavaScript, and GitHub. 
The site includes configuration and workflows for linting (using Vale.sh and Lefthook) and testing (using pytest and pytest-codeblocks).

The community forum is https://community.influxdata.com/ and should not be used as a primary source of information, but might contain useful suggestions or solutions to specific problems from users.
