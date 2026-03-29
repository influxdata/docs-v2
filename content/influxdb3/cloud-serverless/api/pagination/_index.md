---
title: Pagination
description: >-
  Some InfluxDB API list operations may support the following query parameters
  for paginating results:

    | Query parameter          | Value type            | Description                                |
    |:------------------------ |:--------------------- |:-------------------------------------------|
    | `limit`                  | integer               | The maximum number of records to return (after other parameters are applied). |
    | `offset`                 | integer               | The number of records to skip (before `limit`, after other parameters are applied). |
    | `after`                  | string (resource ID)  | Only returns resources created after the specified resource. |

    ### Limitations

    - For specific endpoint parameters and examples, see the endpoint definition.
    - If you specify an `offset` parameter value greater than the total number of records,
      then InfluxDB returns an empty list in the response
      (given `offset` skips the specified number of records).

      The following example passes `offset=50` to skip the first 50 results,
      but the user only has 10 buckets:

      ```sh
      curl --request GET "INFLUX_URL/api/v2/buckets?limit=1&offset=50" \
          --header "Authorization: Token INFLUX_API_TOKEN"
      ```

      The response contains the following:

      ```json
      {
        "links": {
            "prev": "/api/v2/buckets?descending=false\u0026limit=1\u0026offset=49\u0026orgID=ORG_ID",
            "self": "/api/v2/buckets?descending=false\u0026limit=1\u0026offset=50\u0026orgID=ORG_ID"
        },
        "buckets": []
      }
      ```
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-pagination.yaml
weight: 100
tag: Pagination
isConceptual: true
menuGroup: Other
tagDescription: >-
  Some InfluxDB API list operations may support the following query parameters
  for paginating results:

    | Query parameter          | Value type            | Description                                |
    |:------------------------ |:--------------------- |:-------------------------------------------|
    | `limit`                  | integer               | The maximum number of records to return (after other parameters are applied). |
    | `offset`                 | integer               | The number of records to skip (before `limit`, after other parameters are applied). |
    | `after`                  | string (resource ID)  | Only returns resources created after the specified resource. |

    ### Limitations

    - For specific endpoint parameters and examples, see the endpoint definition.
    - If you specify an `offset` parameter value greater than the total number of records,
      then InfluxDB returns an empty list in the response
      (given `offset` skips the specified number of records).

      The following example passes `offset=50` to skip the first 50 results,
      but the user only has 10 buckets:

      ```sh
      curl --request GET "INFLUX_URL/api/v2/buckets?limit=1&offset=50" \
          --header "Authorization: Token INFLUX_API_TOKEN"
      ```

      The response contains the following:

      ```json
      {
        "links": {
            "prev": "/api/v2/buckets?descending=false\u0026limit=1\u0026offset=49\u0026orgID=ORG_ID",
            "self": "/api/v2/buckets?descending=false\u0026limit=1\u0026offset=50\u0026orgID=ORG_ID"
        },
        "buckets": []
      }
      ```
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
