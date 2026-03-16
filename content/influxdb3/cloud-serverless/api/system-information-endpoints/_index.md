---
title: System information endpoints
description: >-
  Endpoints for retrieving system-level information about the InfluxDB 3 Cloud
  Serverless instance.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-system-information-endpoints.yaml
weight: 100
tag: System information endpoints
isConceptual: false
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
operations:
  - operationId: GetRoutes
    method: GET
    path: /api/v2
    summary: List all top level routes
    tags:
      - System information endpoints
  - operationId: GetResources
    method: GET
    path: /api/v2/resources
    summary: List all known resources
    tags:
      - System information endpoints
related:
  - title: InfluxDB 3 API client libraries
    href: /influxdb3/cloud-serverless/reference/client-libraries/v3/
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
