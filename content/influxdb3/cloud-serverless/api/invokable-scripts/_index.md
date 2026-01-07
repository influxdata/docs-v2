---
title: Invokable Scripts
description: |
  Store, manage, and execute scripts in InfluxDB.
  A script stores your custom Flux script and provides an invokable
  endpoint that accepts runtime parameters.
  In a script, you can specify custom runtime parameters
  (`params`)--for example, `params.myparameter`.
  Once you create a script, InfluxDB generates an
  [`/api/v2/scripts/SCRIPT_ID/invoke` endpoint](#operation/PostScriptsIDInvoke)
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
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-invokable-scripts.yaml
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
---
