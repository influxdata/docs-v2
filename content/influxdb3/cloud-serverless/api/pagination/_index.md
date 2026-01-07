---
title: Pagination
description: >
  Some InfluxDB API [list operations](#tag/SupportedOperations) may support the
  following query parameters for paginating results:

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
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-pagination.yaml
weight: 100
tag: Pagination
isConceptual: true
menuGroup: Other
tagDescription: >
  Some InfluxDB API [list operations](#tag/SupportedOperations) may support the
  following query parameters for paginating results:

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
---
