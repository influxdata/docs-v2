---
title: Limits
description: >-
  Retrieve rate limits and usage quotas for an InfluxDB 3 Cloud Serverless
  organization.
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/api/tags/influxdb-cloud-serverless-api-limits.yaml
specDownloadPath: /openapi/influxdb-cloud-serverless-api.yml
weight: 100
tag: Limits
isConceptual: false
operations:
  - operationId: GetOrgLimitsID
    method: GET
    path: /api/v2/orgs/{orgID}/limits
    summary: Retrieve limits for an organization
    tags:
      - Limits
related:
  - title: InfluxDB 3 API client libraries
    href: /influxdb3/cloud-serverless/reference/client-libraries/v3/
---
