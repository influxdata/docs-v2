---
title: Invokable Scripts
description: >-
  Store, manage, and execute custom Flux scripts in InfluxDB 3 Cloud Serverless.
  Scripts accept runtime parameters and can be invoked via dedicated endpoints.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-invokable-scripts.yaml
weight: 100
tag: Invokable Scripts
isConceptual: false
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
operations:
  - operationId: GetScripts
    method: GET
    path: /api/v2/scripts
    summary: List scripts
    tags:
      - Invokable Scripts
  - operationId: PostScripts
    method: POST
    path: /api/v2/scripts
    summary: Create a script
    tags:
      - Invokable Scripts
  - operationId: GetScriptsID
    method: GET
    path: /api/v2/scripts/{scriptID}
    summary: Retrieve a script
    tags:
      - Invokable Scripts
  - operationId: PatchScriptsID
    method: PATCH
    path: /api/v2/scripts/{scriptID}
    summary: Update a script
    tags:
      - Invokable Scripts
  - operationId: DeleteScriptsID
    method: DELETE
    path: /api/v2/scripts/{scriptID}
    summary: Delete a script
    tags:
      - Invokable Scripts
  - operationId: PostScriptsIDInvoke
    method: POST
    path: /api/v2/scripts/{scriptID}/invoke
    summary: Invoke a script
    tags:
      - Invokable Scripts
  - operationId: GetScriptsIDParams
    method: GET
    path: /api/v2/scripts/{scriptID}/params
    summary: Find script parameters.
    tags:
      - Invokable Scripts
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
