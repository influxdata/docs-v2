---
title: System Information
description: Endpoints for checking server status, health, and version information.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/influxdb-enterprise-v1-openapi/tags/influxdb-enterprise-v1-influxdb-enterprise-v1-openapi-system-information.yaml
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
---
