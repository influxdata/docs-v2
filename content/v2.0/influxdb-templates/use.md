---
title: Use InfluxDB templates
description: >
  Use the `influx pkg` command to view and install templates from your local
  filesystem or from URLs.
menu:
  v2_0:
    parent: InfluxDB templates
    name: Use templates
weight: 101
v2.0/tags: [templates]
---

Use the `influx pkg` command to summarize, validate, and install templates from
your local filesystem and from URLs.

## View a template summary
To view a summary of what's included in a template before installing the template,
use the [`influx pkg summary` command](/v2.0/reference/cli/influx/pkg/summary/).
Summarize templates stored in your local filesystem or from a URL.

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[From a file](#)
[From a URL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# Syntax
influx pkg summary -f <template-filepath>

# Example
influx pkg summary -f /path/to/template.yml
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# Syntax
influx pkg summary -u <template-url>

# Example
influx pkg summary -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

## Validate a template
To validate a template before installing it or for troubleshooting purposes, use
the [`influx pkg validate` command](/v2.0/reference/cli/influx/pkg/validate/).
Validate templates stored in your local filesystem or from a URL.

{{% code-tabs-wrapper %}}
{{% code-tabs %}}
[From a file](#)
[From a URL](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
# Syntax
influx pkg validate -f <template-filepath>

# Example
influx pkg validate -f /path/to/template.yml
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
# Syntax
influx pkg validate -u <template-url>

# Example
influx pkg validate -u https://raw.githubusercontent.com/influxdata/community-templates/master/linux_system/linux_system.yml
```
{{% /code-tab-content %}}
{{% /code-tabs-wrapper %}}

## Install templates

### Install templates from files
- Install individual files
- Install mulitple files
- Install all files in a directory
- Recurse through a directory - `-recurse`

### Install templates from a URL
```sh
# Syntax
influx pkg -u <template-url>

# Example
influx pkg -u <template-url>
```

### Install templates from both files and URLs
```sh
# Syntax
influx pkg -u <template-url> -f <template-path>

# Example
influx pkg \
  -u https://mydomain.com/templates/template1.yml \
  -u https://mydomain.com/templates/template2.yml \
  -f ~/templates/custom-template.yml \
  -f ~/templates/iot/home/ \
  --recurse
```

## Include secrets when installing a template
-
