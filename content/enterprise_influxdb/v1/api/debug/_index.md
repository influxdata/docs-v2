---
title: Debug
description: >-
  Debugging and profiling endpoints for troubleshooting and performance
  analysis.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-enterprise-v1/influxdb-enterprise-v1-openapi/tags/influxdb-enterprise-v1-influxdb-enterprise-v1-openapi-debug.yaml
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
---
