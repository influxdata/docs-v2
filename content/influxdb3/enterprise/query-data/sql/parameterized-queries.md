---
title: Use parameterized queries with SQL
description: >
  Use parameterized queries to prevent injection attacks and make queries more reusable.
weight: 404
menu:
  influxdb3_enterprise:
    name: Parameterized queries
    parent: Query with SQL
    identifier: parameterized-queries-sql
influxdb3/enterprise/tags: [query, security, sql]
list_code_example: |
  ##### Using Go and the influxdb3-go client

  ```go
  // Use the $parameter syntax to reference parameters in a query.
  // The following SQL query contains $room and $min_temp placeholders.
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

  // Call the client's function to query InfluxDB with parameters.
  iterator, err := client.QueryWithParameters(context.Background(), query, parameters)
  ```
# Leaving in draft until tested
draft: true
source: /shared/influxdb3-query-guides/sql/parameterized-queries.md
---

<!--
The content for this page is at content/shared/influxdb3-query-guides/sql/parameterized-queries.md
-->