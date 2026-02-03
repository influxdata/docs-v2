---
title: Variables
description: API reference for Variables
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-variables.yaml
weight: 100
tag: Variables
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetVariables
    method: GET
    path: /api/v2/variables
    summary: List all variables
    tags:
      - Variables
  - operationId: PostVariables
    method: POST
    path: /api/v2/variables
    summary: Create a variable
    tags:
      - Variables
  - operationId: GetVariablesID
    method: GET
    path: /api/v2/variables/{variableID}
    summary: Retrieve a variable
    tags:
      - Variables
  - operationId: PutVariablesID
    method: PUT
    path: /api/v2/variables/{variableID}
    summary: Replace a variable
    tags:
      - Variables
  - operationId: PatchVariablesID
    method: PATCH
    path: /api/v2/variables/{variableID}
    summary: Update a variable
    tags:
      - Variables
  - operationId: DeleteVariablesID
    method: DELETE
    path: /api/v2/variables/{variableID}
    summary: Delete a variable
    tags:
      - Variables
  - operationId: GetVariablesIDLabels
    method: GET
    path: /api/v2/variables/{variableID}/labels
    summary: List all labels for a variable
    tags:
      - Variables
  - operationId: PostVariablesIDLabels
    method: POST
    path: /api/v2/variables/{variableID}/labels
    summary: Add a label to a variable
    tags:
      - Variables
  - operationId: DeleteVariablesIDLabelsID
    method: DELETE
    path: /api/v2/variables/{variableID}/labels/{labelID}
    summary: Delete a label from a variable
    tags:
      - Variables
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
