---
title: influx CLI release notes
description: Important changes and and what's new in each version of the influx command line interface (CLI).
weight: 103
menu:
  influxdb_cloud_ref:
    parent: Release notes
    name: influx CLI 
---

## v2.1.0 [2021-07-29]

## New repository

This is the initial release of the `influx` CLI from the `influxdata/influx-cli` GitHub repository.

## Breaking changes

### `influx write` skip-header parsing

To simplify the CLI parser, the `write` command no longer supports `--skipHeader`
as short-hand for `--skipHeader 1`.

### Stricter input validation for `influx template` commands

The `apply`, `export`, and `stacks` commands now raise errors when CLI options fail to parse instead of silently discarding bad inputs.
This change was made to help users debug when their commands fail to execute as expected.

### Server-side template summarization and validation

The `template` and `template validate` commands now use an API request to the server to perform their logic, instead of performing the work on the client-side.
Offline summarization and validation is no longer supported.
This change was made to avoid significant code duplication between `influxdb` and `influx CLI`, and to allow server-side template logic to evolve without requiring coordinated CLI changes.

### `influx stacks --json` output conventions

The output of `influx stacks --json` previously used an UpperCamelCase naming convention for most keys.
The command now uses lowerCamelCase consistently for all objects keys, matching the schema returned by the API.

## Features

- Add global `--http-debug` flag to all `influx` commands to help inspect communication with InfluxDB servers.
- Add [`bucket-schema` commands](/influxdb/cloud/reference/cli/influx/bucket-schema/) to manage explicit measurement schemas in InfluxDB Cloud.
- Update [`bucket create`](/influxdb/cloud/reference/cli/influx/bucket/create/) to allow setting a schema type.
- Update [`bucket list`](/influxdb/cloud/reference/cli/influx/bucket/list/) to display schema types.
- (InfluxDB OSS only) Updates to `backup` and `restore`:
  - Reimplement [`backup`](/influxdb/cloud/reference/cli/influx/backup/) to support downloading embedded SQL store from InfluxDB v2.1.x.
  - Add `--compression` flag to support enabling/disabling GZIP compression of downloaded files.
  - Reimplement `restore` to support uploading embedded SQL store from InfluxDB v2.1.x.
- (InfluxDB OSS only) Add [`--password`](/influxdb/cloud/reference/cli/influx/user/password/) flag to `user password` command to allow bypassing interactive prompt.
- Bind [`--skip-verify`](/influxdb/cloud/reference/cli/influx/org/members/add/#flags) flag to the `INFLUX_SKIP_VERIFY` environment variable.

## Bug fixes

- Fix interactive password collection and color rendering in PowerShell.
- `org members list` no longer hangs on organizations with more than 10 members.
- Detect and warn when inputs to `write` contain standalone CR characters.
- `dashboards` command now accepts `--org` flag, or falls back to default org in config.
- Return a consistent error when responses fail to decode, including hints for OSS-only and Cloud-only commands.
