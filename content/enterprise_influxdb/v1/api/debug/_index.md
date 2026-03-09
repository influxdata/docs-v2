---
title: Debug
description: >-
  Debugging and profiling endpoints for troubleshooting and performance
  analysis.
type: api
layout: list
staticFilePath: /openapi/influxdb-enterprise-v1/ref/tags/influxdb-enterprise-v1-ref-debug.yaml
weight: 100
tag: Debug
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetDebugPprof
    method: GET
    path: /debug/pprof
    summary: Get profiling index
    tags:
      - Debug
  - operationId: GetDebugPprofProfile
    method: GET
    path: /debug/pprof/{profile}
    summary: Get profile data
    tags:
      - Debug
  - operationId: GetDebugPprofAll
    method: GET
    path: /debug/pprof/all
    summary: Get all profiles archive
    tags:
      - Debug
  - operationId: GetDebugRequests
    method: GET
    path: /debug/requests
    summary: Track HTTP requests
    tags:
      - Debug
  - operationId: GetDebugVars
    method: GET
    path: /debug/vars
    summary: Get server statistics
    tags:
      - Debug
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
