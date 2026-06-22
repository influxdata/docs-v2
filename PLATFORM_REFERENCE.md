<!-- This file is auto-generated from data/products.yml. Do not edit directly. -->

<!-- Run 'yarn build:agent:instructions' to regenerate this file. -->

Use this compact product disambiguation reference to map user requests to
canonical product names, content paths, and production documentation URLs.

Production docs URL rule:

- For each entry with a `Content path`, map it to
  `https://docs.influxdata.com/<content-path>/`.
- Treat `data/products.yml` as the canonical source of truth when you need
  details not listed here.

InfluxDB OSS v2:

- Aliases: InfluxDB OSS, v2
- Content path: `influxdb/v2`
- Production docs URL: <https://docs.influxdata.com/influxdb/v2/>
- Query languages: InfluxQL, Flux
- Host hint: `localhost:8086`
- Characteristics: Free, Self-hosted, InfluxQL/Flux, Token or Username/Password, Buckets
- URL contains hints: localhost:8086
- Ping header hints: `x-influxdb-build=OSS`, `x-influxdb-version=^(1|2)\.`

InfluxDB OSS v1:

- Aliases: InfluxDB OSS, v1
- Content path: `influxdb/v1`
- Production docs URL: <https://docs.influxdata.com/influxdb/v1/>
- Query languages: InfluxQL, Flux
- Host hint: `localhost:8086`
- Characteristics: Free, Self-hosted, InfluxQL/Flux, Token or Username/Password, Buckets
- URL contains hints: localhost:8086
- Ping header hints: `x-influxdb-build=OSS`, `x-influxdb-version=^(1|2)\.`

InfluxDB Enterprise v1:

- Content path: `enterprise_influxdb`
- Production docs URL: <https://docs.influxdata.com/enterprise_influxdb/>
- Query languages: InfluxQL, Flux
- Characteristics: Paid, Self-hosted, InfluxQL/Flux, Username/Password, Databases
- Ping header hints: `x-influxdb-build=Enterprise`

InfluxDB Cloud (TSM):

- Aliases: InfluxDB Cloud
- Content path: `influxdb/cloud`
- Production docs URL: <https://docs.influxdata.com/influxdb/cloud/>
- Query languages: InfluxQL, Flux
- Host hint: `cloud2.influxdata.com`
- Characteristics: Paid/Free, Cloud, InfluxQL/Flux, Token, Databases/Buckets
- URL contains hints: us-west-2-1.aws.cloud2.influxdata.com, us-west-2-2.aws.cloud2.influxdata.com, us-east-1-1.aws.cloud2.influxdata.com, eu-central-1-1.aws.cloud2.influxdata.com, us-central1-1.gcp.cloud2.influxdata.com, westeurope-1.azure.cloud2.influxdata.com, eastus-1.azure.cloud2.influxdata.com

InfluxDB Cloud Serverless:

- Aliases: InfluxDB Cloud
- Content path: `influxdb3/cloud-serverless`
- Production docs URL: <https://docs.influxdata.com/influxdb3/cloud-serverless/>
- Query languages: SQL, InfluxQL, Flux
- Host hint: `cloud2.influxdata.com`
- Characteristics: Paid/Free, Cloud, All languages, Token, Buckets
- URL contains hints: us-east-1-1.aws.cloud2.influxdata.com, eu-central-1-1.aws.cloud2.influxdata.com

InfluxDB Cloud Dedicated:

- Aliases: InfluxDB Cloud
- Content path: `influxdb3/cloud-dedicated`
- Production docs URL: <https://docs.influxdata.com/influxdb3/cloud-dedicated/>
- Query languages: SQL, InfluxQL
- Host hint: `cluster-id.a.influxdb.io`
- Characteristics: Paid, Cloud, SQL/InfluxQL, Token, Databases
- URL contains hints: influxdb.io

InfluxDB Clustered:

- Content path: `influxdb3/clustered`
- Production docs URL: <https://docs.influxdata.com/influxdb3/clustered/>
- Query languages: SQL, InfluxQL
- Host hint: `cluster-host.com`
- Characteristics: Paid, Self-hosted, SQL/InfluxQL, Token, Databases
- Ping header hints: `x-influxdb-version=influxqlbridged-development`

InfluxDB 3 Core:

- Content path: `influxdb3/core`
- Production docs URL: <https://docs.influxdata.com/influxdb3/core/>
- Query languages: SQL, InfluxQL
- Host hint: `localhost:8181`
- Characteristics: Free, Self-hosted, SQL/InfluxQL, No auth required, Databases
- URL contains hints: localhost:8181
- Ping header hints: `x-influxdb-version=^3\.`, `x-influxdb-build=Core`

InfluxDB 3 Enterprise:

- Content path: `influxdb3/enterprise`
- Production docs URL: <https://docs.influxdata.com/influxdb3/enterprise/>
- Query languages: SQL, InfluxQL
- Host hint: `localhost:8181`
- Characteristics: Paid, Self-hosted, SQL/InfluxQL, Token, Databases
- URL contains hints: localhost:8181
- Ping header hints: `x-influxdb-version=^3\.`, `x-influxdb-build=Enterprise`

InfluxDB 3 Explorer:

- Aliases: Explorer
- Content path: `influxdb3/explorer`
- Production docs URL: <https://docs.influxdata.com/influxdb3/explorer/>
- Host hint: `localhost:8080`

Telegraf:

- Content path: `telegraf`
- Production docs URL: <https://docs.influxdata.com/telegraf/>

Chronograf:

- Content path: `chronograf`
- Production docs URL: <https://docs.influxdata.com/chronograf/>

Kapacitor:

- Content path: `kapacitor`
- Production docs URL: <https://docs.influxdata.com/kapacitor/>

Flux:

- Content path: `flux`
- Production docs URL: <https://docs.influxdata.com/flux/>
