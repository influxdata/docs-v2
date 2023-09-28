---
title: kapacitor define-template
description: >
  The `kapacitor define-template` command creates or updates a template.
menu:
  kapacitor_v1:
    name: kapacitor define-template
    parent: kapacitor
weight: 301
---

The `kapacitor define-template` command creates or updates a template.
A template is defined using a TICKscript that contains the data processing 
pipeline of the template.

{{% note %}}
Updating a template will reload all associated tasks.
{{% /note %}}

## Usage

```sh
kapacitor define-template <template-id> [flags]
```

## Arguments

- **template-id**: Unique identifier for the template

## Flags {#command-flags}

| Flag    | Description                        |
| :------ | :--------------------------------- |
| `-tick` | TICKscript filepath                |
| `-type` | Template type (`stream` or `batch`) |


## Examples

- [Create a new template for stream tasks](#create-a-new-template-for-stream-tasks)
- [Create a new template for batch tasks](#create-a-new-template-for-batch-tasks)
- [Update a template's TICKscript](#update-a-templates-tickscript)
- [Update a template's type](#update-a-templates-type)

### Create a new template for stream tasks

When creating a new template, you must provide a template ID, TICKscript, and
template type.

```sh
kapacitor define-template my-template \
  -tick /path/to/TICKscript.tick \
  -type stream
```

### Create a new template for batch tasks

When creating a new template, you must provide a template ID, TICKscript, and
template type.

```sh
kapacitor define-template my-template \
  -tick /path/to/TICKscript.tick \
  -type batch
```

### Update a template's TICKscript

```sh
kapacitor define-template existing-template \
  -tick /path/to/new_TICKscript.tick 
```

### Update a template's type

```sh
kapacitor define-template existing-template -type batch
```
