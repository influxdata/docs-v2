---
title: Query Google Cloud Bigtable
list_title: Google Cloud Bigtable
description: >
  Use [`bigtable.from`](/flux/v0.x/stdlib/experimental/bigtable/from) to
  query [Google Cloud Bigtable](https://cloud.google.com/bigtable/) with Flux.
menu:
  flux_0_x:
    name: Bigtable
    parent: Query data sources
weight: 104
related: 
  - /flux/v0.x/stdlib/experimental/bigtable/from/
  - https://cloud.google.com/bigtable/docs/access-control, Cloud Bigtable Access Control
  - https://cloud.google.com/iam/docs/how-to, Google Cloud IAM How-to guides
  - https://cloud.google.com/docs/authentication/production, Setting Up Authentication for Production Applications on Google Cloud
list_code_example: |
  ```js
  import "experimental/bigtable"
  
  bigtable.from(url: "http://example.com/metrics")
  ```
---

To query [Google Cloud Bigtable](https://cloud.google.com/bigtable/) with Flux:

1. Import the [`experimental/bigtable` package](/flux/v0.x/stdlib/experimental/bigtable/).
2. Use [`bigtable.from`](/flux/v0.x/stdlib/experimental/bigtable/from) and
   provide the following parameters:

    - **token**: Google Cloud IAM token
    - **project**: Bigtable project ID
    - **instance**: Bigtable instance ID
    - **table**: Bigtable table to query

```js
import "experimental/bigtable"

bigtable.from(
  token: "mySuPeRseCretTokEn",
  project: "exampleProjectID",
  instance: "exampleInstanceID",
  table: "example-table"
)
```

## Results structure
`bigtable.from()` returns a [stream of tables](/flux/v0.x/get-started/data-model/#stream-of-tables)
with no grouping (all rows in a single table).
For more information about table grouping, see
[Flux data model - Restructure tables](/flux/v0.x/get-started/data-model/#restructure-tables).

## Store sensitive credentials as secrets
If using **InfluxDB Cloud** or **InfluxDB OSS 2.x**, we recommend storing Bigtable
connection credentials as [InfluxDB secrets](/influxdb/cloud/security/secrets/).
Use [`secrets.get()`](/flux/v0.x/stdlib/influxdata/influxdb/secrets/get/) to
retrieve a secret from the InfluxDB secrets API.

```js
import "experimental/bigtable"
import "influxdata/influxdb/secrets"

bigtable_token = secrets.get(key: "BIGTABLE_TOKEN")
bigtable_project = secrets.get(key: "BIGTABLE_PROJECT_ID")
bigtable_instance = secrets.get(key: "BIGTABLE_INSTANCE_ID")

bigtable.from(
  token: bigtable_token,
  project: bigtable_project,
  instance: bigtable_instance,
  table: "example-table"
)
```
