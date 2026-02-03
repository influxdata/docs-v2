---
title: Templates
description: >-
  Export and apply InfluxDB **templates**.

  Manage **stacks** of templated InfluxDB resources.


  InfluxDB templates are prepackaged configurations for resources.

  Use InfluxDB templates to configure a fresh instance of InfluxDB,

  back up your dashboard configuration, or share your configuration.


  Use the `/api/v2/templates` endpoints to export templates and apply templates.


  **InfluxDB stacks** are stateful InfluxDB templates that let you

  add, update, and remove installed template resources over time, avoid
  duplicating

  resources when applying the same or similar templates more than once, and

  apply changes to distributed instances of InfluxDB OSS or InfluxDB Cloud.


  Use the `/api/v2/stacks` endpoints to manage installed template resources.


  <!-- TSM-only -->
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-templates.yaml
weight: 100
tag: Templates
isConceptual: false
menuGroup: Other
operations:
  - operationId: ListStacks
    method: GET
    path: /api/v2/stacks
    summary: List installed stacks
    tags:
      - Templates
  - operationId: CreateStack
    method: POST
    path: /api/v2/stacks
    summary: Create a stack
    tags:
      - Templates
  - operationId: ReadStack
    method: GET
    path: /api/v2/stacks/{stack_id}
    summary: Retrieve a stack
    tags:
      - Templates
  - operationId: UpdateStack
    method: PATCH
    path: /api/v2/stacks/{stack_id}
    summary: Update a stack
    tags:
      - Templates
  - operationId: DeleteStack
    method: DELETE
    path: /api/v2/stacks/{stack_id}
    summary: Delete a stack and associated resources
    tags:
      - Templates
  - operationId: UninstallStack
    method: POST
    path: /api/v2/stacks/{stack_id}/uninstall
    summary: Uninstall a stack
    tags:
      - Templates
  - operationId: ApplyTemplate
    method: POST
    path: /api/v2/templates/apply
    summary: Apply or dry-run a template
    tags:
      - Templates
  - operationId: ExportTemplate
    method: POST
    path: /api/v2/templates/export
    summary: Export a new template
    tags:
      - Templates
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
