# Clustered & Cloud Dedicated API Documentation Structure Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Unified API documentation for Clustered and Cloud Dedicated with separate downloadable specs for Data API and Management API.

**Architecture:** Single nav menu combining tags from both API specs, with dual download buttons on landing page and context-aware buttons on tag pages.

**Tech Stack:** Hugo templates, OpenAPI specs, existing API doc generator

***

## Context

Clustered and Cloud Dedicated have two distinct API planes:

- **Data API** - Write and Query endpoints using database tokens
- **Management API** - Databases, Tables, Tokens endpoints using management tokens

## Design Decisions

### Navigation Structure

Single `/api/` section with combined nav:

```
InfluxDB HTTP API
├── Quick start          (conceptual)
├── Authentication       (conceptual, covers both token types)
├── API compatibility    (conceptual)
├── Common parameters    (conceptual)
├── Headers              (conceptual)
├── Response codes       (conceptual)
├── Database tokens      (Management API)
├── Databases            (Management API)
├── Tables               (Management API)
├── Ping                 (Data API)
├── Query data           (Data API)
├── Write data           (Data API)
└── All endpoints        (combined)
```

### Download Buttons

**Landing page:** Two buttons side-by-side

- "Download Data API Spec" → `/openapi/influxdb-{product}-v2-data-api.yml`
- "Download Management API Spec" → `/openapi/influxdb-{product}-management-api.yml`

**Tag pages:** Context-aware single button based on `staticFilePath`

### Authentication Page

Single unified page covering:

- Token types table (Management vs Database)
- Authentication schemes table (Bearer, Token, Basic, Query string)
- Which endpoints use which token type
- Security schemes from OpenAPI spec

### OpenAPI Spec Organization

**`v2/ref.yml` (Data API):**

- Contains all conceptual tags (Quick start, Authentication, etc.)
- Contains Data API operation tags (Ping, Query data, Write data)

**`management/openapi.yml`:**

- NO CHANGES to source file
- Contains only operation tags (Database tokens, Databases, Tables)

Generator combines both specs into unified `articles.yml`.

### Cleanup Required

Remove old pages:

- `/content/influxdb3/clustered/api/v2/_index.html`
- `/content/influxdb3/cloud-dedicated/api/v2/_index.html`
- `/content/influxdb3/*/api/admin-authentication-management-operations/`
- `/content/influxdb3/*/api/management-authentication-admin-operations/`

***

## Implementation Tasks

### Task 1: Update Authentication tag in Data API specs

Update `api-docs/influxdb3/clustered/v2/ref.yml` and `api-docs/influxdb3/cloud-dedicated/v2/ref.yml`:

- Revise Authentication tag description to cover both token types
- Include table of token types and which endpoints use them
- Keep `showSecuritySchemes: true` for security scheme rendering

### Task 2: Update Quick start tag in Data API specs

Update Quick start in both v2/ref.yml files:

- Cover both Data and Management API getting started flow
- Show management token creation, then database/token setup, then write/query

### Task 3: Add dual download buttons to API landing page

Modify `layouts/api/list.html` or create partial:

- Detect Clustered/Cloud Dedicated products
- Show two download buttons on section index pages
- Style buttons side-by-side

### Task 4: Update tag page download button logic

Modify `layouts/api/single.html` and/or `layouts/api/list.html`:

- Detect API type from `staticFilePath` (contains `management-api` or `v2-data-api`)
- Show appropriate download button for the API

### Task 5: Remove old v2 HTML pages

Delete:

- `content/influxdb3/clustered/api/v2/`
- `content/influxdb3/cloud-dedicated/api/v2/`

### Task 6: Remove old authentication directories

Delete leftover directories:

- `content/influxdb3/clustered/api/admin-authentication-management-operations/`
- `content/influxdb3/clustered/api/management-authentication-admin-operations/`
- `content/influxdb3/cloud-dedicated/api/admin-authentication-management-operations/`
- `content/influxdb3/cloud-dedicated/api/management-authentication-admin-operations/`

### Task 7: Regenerate API docs and verify

Run `yarn build:api-docs` and verify:

- Nav shows combined tags from both APIs
- Authentication page has unified content
- Download buttons work correctly
- Old pages are gone

***

## Success Criteria

- [ ] Single Authentication page covers both token types clearly
- [ ] Landing page shows two download buttons for Clustered/Cloud Dedicated
- [ ] Tag pages show context-appropriate download button
- [ ] Nav combines tags from both API specs
- [ ] Old v2 HTML pages removed
- [ ] Old duplicate authentication directories removed
- [ ] `yarn build:api-docs` succeeds
- [ ] Hugo builds without errors
