---
title: System Information
description: Endpoints for checking server status, health, and version information.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/ref/tags/influxdb-enterprise-v1-ref-system-information.yaml
weight: 100
tag: System Information
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetPing
    method: GET
    path: /ping
    summary: Check server status
    tags:
      - System Information
  - operationId: HeadPing
    method: HEAD
    path: /ping
    summary: Check server status (HEAD)
    tags:
      - System Information
  - operationId: GetHealth
    method: GET
    path: /health
    summary: Check server health
    tags:
      - System Information
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
