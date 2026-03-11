---
title: Authentication
description: >-
  InfluxDB Enterprise v1 supports multiple authentication methods:


  ### Basic Authentication

  ```bash

  curl -u username:password http://localhost:8086/query?q=SHOW+DATABASES

  ```


  ### Query String Authentication

  ```bash

  curl "http://localhost:8086/query?u=username&p=password&q=SHOW+DATABASES"

  ```


  ### Token Authentication (v2-compatible)

  For v2-compatible endpoints, use the Token scheme:

  ```bash

  curl -H "Authorization: Token username:password"
  http://localhost:8086/api/v2/query

  ```
type: api
layout: single
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/influxdb-enterprise-v1-openapi/tags/influxdb-enterprise-v1-influxdb-enterprise-v1-openapi-authentication.yaml
weight: 100
tag: Authentication
isConceptual: true
menuGroup: Concepts
tagDescription: >-
  InfluxDB Enterprise v1 supports multiple authentication methods:


  ### Basic Authentication

  ```bash

  curl -u username:password http://localhost:8086/query?q=SHOW+DATABASES

  ```


  ### Query String Authentication

  ```bash

  curl "http://localhost:8086/query?u=username&p=password&q=SHOW+DATABASES"

  ```


  ### Token Authentication (v2-compatible)

  For v2-compatible endpoints, use the Token scheme:

  ```bash

  curl -H "Authorization: Token username:password"
  http://localhost:8086/api/v2/query

  ```
showSecuritySchemes: true
---
