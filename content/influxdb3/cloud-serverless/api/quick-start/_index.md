---
title: Quick start
description: |-
  Authenticate, write, and query with the API:

  1. Create a database token to authorize API requests in the InfluxDB Cloud
     Serverless UI.

  2. Write data to InfluxDB Cloud Serverless.

     ```bash
     curl -X POST "https://cloud2.influxdata.com/api/v2/write?bucket=DATABASE_NAME&precision=ns" \
       --header "Authorization: Token DATABASE_TOKEN" \
       --header "Content-Type: text/plain; charset=utf-8" \
       --data-raw "home,room=Kitchen temp=72.0
     home,room=Living\ room temp=71.5"
     ```

     If all data is written, the response is `204 No Content`.

  3. Query data from InfluxDB Cloud Serverless using SQL or InfluxQL.
     For best performance, use a Flight client to query data.
     The HTTP API `/query` endpoint supports InfluxQL queries.

     ```bash
     curl -G "https://cloud2.influxdata.com/query" \
       --header "Authorization: Token DATABASE_TOKEN" \
       --data-urlencode "db=DATABASE_NAME" \
       --data-urlencode "q=SELECT * FROM home WHERE time > now() - 1h"
     ```

  For more information about using InfluxDB Cloud Serverless, see the
  [Get started](/influxdb3/cloud-serverless/get-started/) guide.
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-quick-start.yaml
weight: 1
tag: Quick start
isConceptual: true
menuGroup: Concepts
tagDescription: |-
  Authenticate, write, and query with the API:

  1. Create a database token to authorize API requests in the InfluxDB Cloud
     Serverless UI.

  2. Write data to InfluxDB Cloud Serverless.

     ```bash
     curl -X POST "https://cloud2.influxdata.com/api/v2/write?bucket=DATABASE_NAME&precision=ns" \
       --header "Authorization: Token DATABASE_TOKEN" \
       --header "Content-Type: text/plain; charset=utf-8" \
       --data-raw "home,room=Kitchen temp=72.0
     home,room=Living\ room temp=71.5"
     ```

     If all data is written, the response is `204 No Content`.

  3. Query data from InfluxDB Cloud Serverless using SQL or InfluxQL.
     For best performance, use a Flight client to query data.
     The HTTP API `/query` endpoint supports InfluxQL queries.

     ```bash
     curl -G "https://cloud2.influxdata.com/query" \
       --header "Authorization: Token DATABASE_TOKEN" \
       --data-urlencode "db=DATABASE_NAME" \
       --data-urlencode "q=SELECT * FROM home WHERE time > now() - 1h"
     ```

  For more information about using InfluxDB Cloud Serverless, see the
  [Get started](/influxdb3/cloud-serverless/get-started/) guide.
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
