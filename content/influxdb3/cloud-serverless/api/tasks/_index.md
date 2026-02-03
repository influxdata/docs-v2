---
title: Tasks
description: >-
  Process and analyze your data with tasks

  in the InfluxDB task engine.

  Use the `/api/v2/tasks` endpoints to schedule and manage tasks, retry task
  runs, and retrieve run logs.


  To configure a task, provide the script and the schedule to run the task.

  For examples, see how to create a task with the `POST /api/v2/tasks` endpoint.


  <span id="tasks-schemaref-task" />


  ### Properties


  A `task` object contains information about an InfluxDB task resource.


  The following table defines the properties that appear in this object:


  <SchemaDefinition schemaRef="#/components/schemas/Task" />


  <!-- TSM-only -->
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/ref/tags/influxdb-cloud-serverless-ref-tasks.yaml
weight: 100
tag: Tasks
isConceptual: false
menuGroup: Other
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
alt_links:
  core: /influxdb3/core/api/
  enterprise: /influxdb3/enterprise/api/
  cloud-serverless: /influxdb3/cloud-serverless/api/
  cloud-dedicated: /influxdb3/cloud-dedicated/api/
  clustered: /influxdb3/clustered/api/
  v2: /influxdb/v2/api/
  cloud: /influxdb/cloud/api/
---
