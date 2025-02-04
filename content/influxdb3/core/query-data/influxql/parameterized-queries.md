---
title: Use parameterized queries with InfluxQL
description: >
  Use parameterized queries to prevent injection attacks and make queries more reusable.
weight: 404
menu:
  influxdb3_core:
    name: Parameterized queries
    parent: Query with InfluxQL
    identifier: parameterized-queries-influxql
influxdb3/core/tags: [query, security, influxql]
list_code_example: |
  ##### Using Go and the influxdb3-go client

  ```go
  // Use the $parameter syntax to reference parameters in a query.
  // The following InfluxQL query contains $room and $min_time parameters.
  query := `
      SELECT * FROM home
      WHERE time >= $min_time
        AND temp >= $min_temp
        AND room = $room`

  // Assign parameter names to input values.
  parameters := influxdb3.QueryParameters{
          "room": "Kitchen",
          "min_temp": 20.0,
          "min_time": "2024-03-18 00:00:00.00",
  }

  // Call the client's function to query InfluxDB with parameters and the
  // the InfluxQL QueryType.
  iterator, err := client.QueryWithParameters(context.Background(),
    query,
    parameters,
    influxdb3.WithQueryType(influxdb3.InfluxQL))
  ```
# Leaving in draft until tested
draft: true
source: /shared/influxdb3-query-guides/influxql/parameterized-queries.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/influxql/parameterized-queries.md
-->
