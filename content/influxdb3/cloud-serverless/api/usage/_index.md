---
title: Usage
description: >-
  Retrieve usage metrics and cardinality data for an InfluxDB 3 Cloud Serverless
  organization.
type: api
layout: list
staticFilePath: /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-usage.yaml
weight: 100
tag: Usage
isConceptual: false
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
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
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
