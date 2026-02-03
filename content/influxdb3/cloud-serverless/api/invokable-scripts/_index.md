---
title: Invokable Scripts
description: |-
  Store, manage, and execute scripts in InfluxDB.
  A script stores your custom Flux script and provides an invokable
  endpoint that accepts runtime parameters.
  In a script, you can specify custom runtime parameters
  (`params`)--for example, `params.myparameter`.
  Once you create a script, InfluxDB generates an
  `/api/v2/scripts/SCRIPT_ID/invoke` endpoint
  for your organization.
  You can run the script from API requests and tasks, defining parameter
  values for each run.
  When the script runs, InfluxDB replaces `params` references in the
  script with the runtime parameter values you define.

  Use the `/api/v2/scripts` endpoints to create and manage scripts.
  See related guides to learn how to define parameters and execute scripts.

  <!-- TSM-only -->
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-invokable-scripts.yaml
weight: 100
tag: Invokable Scripts
isConceptual: false
menuGroup: Other
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
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
