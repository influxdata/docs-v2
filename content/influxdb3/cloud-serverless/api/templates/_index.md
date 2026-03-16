---
title: Templates
description: >-
  Export and apply InfluxDB templates, and manage template stacks for InfluxDB 3
  Cloud Serverless.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-templates.yaml
weight: 100
tag: Templates
isConceptual: false
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
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
