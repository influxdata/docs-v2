---
title: Telegrafs
description: API reference for Telegrafs
type: api
layout: list
staticFilePath: >-
  /openapi/influxdb-cloud-serverless/tags/tags/influxdb-cloud-serverless-telegrafs.yaml
weight: 100
tag: Telegrafs
isConceptual: false
menuGroup: Other
operations:
  - operationId: GetTelegrafs
    method: GET
    path: /api/v2/telegrafs
    summary: List all Telegraf configurations
    tags:
      - Telegrafs
  - operationId: PostTelegrafs
    method: POST
    path: /api/v2/telegrafs
    summary: Create a Telegraf configuration
    tags:
      - Telegrafs
  - operationId: GetTelegrafsID
    method: GET
    path: /api/v2/telegrafs/{telegrafID}
    summary: Retrieve a Telegraf configuration
    tags:
      - Telegrafs
  - operationId: PutTelegrafsID
    method: PUT
    path: /api/v2/telegrafs/{telegrafID}
    summary: Update a Telegraf configuration
    tags:
      - Telegrafs
  - operationId: DeleteTelegrafsID
    method: DELETE
    path: /api/v2/telegrafs/{telegrafID}
    summary: Delete a Telegraf configuration
    tags:
      - Telegrafs
  - operationId: GetTelegrafsIDLabels
    method: GET
    path: /api/v2/telegrafs/{telegrafID}/labels
    summary: List all labels for a Telegraf config
    tags:
      - Telegrafs
  - operationId: PostTelegrafsIDLabels
    method: POST
    path: /api/v2/telegrafs/{telegrafID}/labels
    summary: Add a label to a Telegraf config
    tags:
      - Telegrafs
  - operationId: DeleteTelegrafsIDLabelsID
    method: DELETE
    path: /api/v2/telegrafs/{telegrafID}/labels/{labelID}
    summary: Delete a label from a Telegraf config
    tags:
      - Telegrafs
  - operationId: GetTelegrafsIDMembers
    method: GET
    path: /api/v2/telegrafs/{telegrafID}/members
    summary: List all users with member privileges for a Telegraf config
    tags:
      - Telegrafs
  - operationId: PostTelegrafsIDMembers
    method: POST
    path: /api/v2/telegrafs/{telegrafID}/members
    summary: Add a member to a Telegraf config
    tags:
      - Telegrafs
  - operationId: DeleteTelegrafsIDMembersID
    method: DELETE
    path: /api/v2/telegrafs/{telegrafID}/members/{userID}
    summary: Remove a member from a Telegraf config
    tags:
      - Telegrafs
  - operationId: GetTelegrafsIDOwners
    method: GET
    path: /api/v2/telegrafs/{telegrafID}/owners
    summary: List all owners of a Telegraf configuration
    tags:
      - Telegrafs
  - operationId: PostTelegrafsIDOwners
    method: POST
    path: /api/v2/telegrafs/{telegrafID}/owners
    summary: Add an owner to a Telegraf configuration
    tags:
      - Telegrafs
  - operationId: DeleteTelegrafsIDOwnersID
    method: DELETE
    path: /api/v2/telegrafs/{telegrafID}/owners/{userID}
    summary: Remove an owner from a Telegraf config
    tags:
      - Telegrafs
---
