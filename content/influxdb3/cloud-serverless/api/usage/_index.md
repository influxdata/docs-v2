---
title: Usage
description: >-
  Retrieve usage metrics and cardinality data for an InfluxDB 3 Cloud Serverless
  organization.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-usage.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Usage
isConceptual: false
operations:
  - operationId: GetOrgUsageID
    method: GET
    path: /api/v2/orgs/{orgID}/usage
    summary: Retrieve usage for an organization
    tags:
      - Usage
related:
  - title: InfluxDB 3 API client libraries
    href: /influxdb3/cloud-serverless/reference/client-libraries/v3/
---
