---
title: Tasks
description: >-
  Schedule and manage Flux tasks that process and transform data on a recurring
  basis in InfluxDB 3 Cloud Serverless.
type: api
layout: list
staticFilePath: /openapi/influxdb3-cloud-serverless/tags/influxdb3-cloud-serverless-tasks.yaml
weight: 100
tag: Tasks
isConceptual: false
menuGroup: Other
specDownloadPath: /openapi/influxdb3-cloud-serverless.yml
articleDataKey: influxdb3-cloud-serverless
articleSection: api
operations:
  - operationId: GetTasks
    method: GET
    path: /api/v2/tasks
    summary: List all tasks
    tags:
      - Tasks
  - operationId: PostTasks
    method: POST
    path: /api/v2/tasks
    summary: Create a task
    tags:
      - Tasks
  - operationId: GetTasksID
    method: GET
    path: /api/v2/tasks/{taskID}
    summary: Retrieve a task
    tags:
      - Tasks
  - operationId: PatchTasksID
    method: PATCH
    path: /api/v2/tasks/{taskID}
    summary: Update a task
    tags:
      - Tasks
  - operationId: DeleteTasksID
    method: DELETE
    path: /api/v2/tasks/{taskID}
    summary: Delete a task
    tags:
      - Tasks
  - operationId: GetTasksIDLabels
    method: GET
    path: /api/v2/tasks/{taskID}/labels
    summary: List labels for a task
    tags:
      - Tasks
  - operationId: PostTasksIDLabels
    method: POST
    path: /api/v2/tasks/{taskID}/labels
    summary: Add a label to a task
    tags:
      - Tasks
  - operationId: DeleteTasksIDLabelsID
    method: DELETE
    path: /api/v2/tasks/{taskID}/labels/{labelID}
    summary: Delete a label from a task
    tags:
      - Tasks
  - operationId: GetTasksIDLogs
    method: GET
    path: /api/v2/tasks/{taskID}/logs
    summary: Retrieve all logs for a task
    tags:
      - Tasks
  - operationId: GetTasksIDMembers
    method: GET
    path: /api/v2/tasks/{taskID}/members
    summary: List all task members
    tags:
      - Tasks
  - operationId: PostTasksIDMembers
    method: POST
    path: /api/v2/tasks/{taskID}/members
    summary: Add a member to a task
    tags:
      - Tasks
  - operationId: DeleteTasksIDMembersID
    method: DELETE
    path: /api/v2/tasks/{taskID}/members/{userID}
    summary: Remove a member from a task
    tags:
      - Tasks
  - operationId: GetTasksIDOwners
    method: GET
    path: /api/v2/tasks/{taskID}/owners
    summary: List all owners of a task
    tags:
      - Tasks
  - operationId: PostTasksIDOwners
    method: POST
    path: /api/v2/tasks/{taskID}/owners
    summary: Add an owner for a task
    tags:
      - Tasks
  - operationId: DeleteTasksIDOwnersID
    method: DELETE
    path: /api/v2/tasks/{taskID}/owners/{userID}
    summary: Remove an owner from a task
    tags:
      - Tasks
  - operationId: GetTasksIDRuns
    method: GET
    path: /api/v2/tasks/{taskID}/runs
    summary: List runs for a task
    tags:
      - Tasks
  - operationId: PostTasksIDRuns
    method: POST
    path: /api/v2/tasks/{taskID}/runs
    summary: Start a task run, overriding the schedule
    tags:
      - Tasks
  - operationId: GetTasksIDRunsID
    method: GET
    path: /api/v2/tasks/{taskID}/runs/{runID}
    summary: Retrieve a run for a task.
    tags:
      - Tasks
  - operationId: DeleteTasksIDRunsID
    method: DELETE
    path: /api/v2/tasks/{taskID}/runs/{runID}
    summary: Cancel a running task
    tags:
      - Tasks
  - operationId: GetTasksIDRunsIDLogs
    method: GET
    path: /api/v2/tasks/{taskID}/runs/{runID}/logs
    summary: Retrieve all logs for a run
    tags:
      - Tasks
  - operationId: PostTasksIDRunsIDRetry
    method: POST
    path: /api/v2/tasks/{taskID}/runs/{runID}/retry
    summary: Retry a task run
    tags:
      - Tasks
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
