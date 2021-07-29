---
title: influx CLI release notes
description: Important changes and and what's new in each version of Flux.
weight: 102
menu:
  influxdb_cloud_ref:
    parent: Release notes
    name: Flux
---


## v2.1.0 [2021-07-29]

## New Repository

This is the initial release of the `influx` CLI from the `influxdata/influx-cli` GitHub repository.

## Breaking Changes

### influx write skip-header parsing

The write command no longer supports --skipHeader as short-hand for --skipHeader 1. This change was made to simplify our CLI parser.

### Stricter input validation for template-related commands

The apply, export, and stacks commands now raise errors when CLI options fail to parse instead of silently discarding bad inputs. This change was made to help users debug when their commands fail to execute as expected.

### Server-side template summarization & validation

The template and template validate commands now use an API request to the server to perform their logic, instead of performing the work on the client-side. Offline summarization & validation is no longer supported. This change was made to avoid significant code duplication between influxdb and influx-cli, and to allow server- side template logic to evolve without requiring coordinated CLI changes.

### influx stacks --json output conventions

The output of influx stacks --json previously used an UpperCamelCase naming convention for most, but not all, keys. The command now uses lowerCamelCase consistently for all objects keys, matching the schema returned by the API.

## Features

33: Add global --http-debug flag to help inspect communication with InfluxDB servers.
52: Add bucket-schema commands to manage explicit measurement schemas in InfluxDB Cloud.
52: Update bucket create to allow setting a schema type.
52: Update bucket list to display schema types.
116: Reimplement backup to support downloading embedded SQL store from InfluxDB v2.1.x.
116: Add --compression flag to backup to support enabling/disabling GZIP compression of downloaded files.
121: Reimplement restore to support uploading embedded SQL store from InfluxDB v2.1.x.
191: Add --password flag to user password command to allow bypassing interactive prompt.
208: Bind --skip-verify flag to INFLUX_SKIP_VERIFY environment variable.
Bug Fixes
35: Fix interactive password collection & color rendering in PowerShell.
97: org members list no longer hangs on organizations with more than 10 members.
109: Detect & warn when inputs to write contain standalone CR characters.
122: dashboards command now accepts --org flag, or falls back to default org in config.
140: Return a consistent error when responses fail to decode, with hints for OSS- our Cloud-only commands.

## Bug Fixes

35: Fix interactive password collection & color rendering in PowerShell.
97: org members list no longer hangs on organizations with more than 10 members.
109: Detect & warn when inputs to write contain standalone CR characters.
122: dashboards command now accepts --org flag, or falls back to default org in config.
140: Return a consistent error when responses fail to decode, with hints for OSS- our Cloud-only commands.