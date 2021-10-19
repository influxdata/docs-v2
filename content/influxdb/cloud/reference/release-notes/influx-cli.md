---
title: influx CLI release notes
description: Important changes and and what's new in each version of the influx command line interface (CLI).
weight: 103
menu:
  influxdb_cloud_ref:
    parent: Release notes
    name: influx CLI 
---

## v2.2.0 [unreleased]

This release includes three new features and bug fixes.

## Features

This release makes it easier to create tokens in the `influx` CLI, adds support for viewing more than 20 buckets, and adds bucket shorthand (`-b`) to `influx delete`.

### Create an All-Access token in the influx CLI

- Add ability to [use the influx CLI to create an All-Access API token](/influxdb/cloud/security/tokens/create-token/#create-a-token-using-the-influx-cli) with read and write permissions to all resources in an organization.

  {{% oss-only %}}

### Create an Operator token in the influx CLI

- Add ability to [use the influx CLI to create an Operator token](/influxdb/v2.0/security/tokens/#operator-token) with read and write permissions to all resources in all organizations.
  {{% /oss-only %}}

### View more buckets in the influx CLI

- [influx bucket list](/influxdb/cloud/reference/cli/influx/bucket/list/): Update pagination to support displaying more than 20 buckets.

### New bucket shorthand for influx delete

- [`influx delete`](/influxdb/cloud/reference/cli/influx/delete/): Add shorthand `-b` for `--bucket`.

## Bug fixes

- Detect and warn when `influx restore --full` changes the operator token.
- Set newly-created config as active in `setup`.
- Embed timezone data into Windows builds to avoid errors.

## v2.1.1 [2021-09-24]

## Go version

Upgrade to Go 1.17.

## Bug fixes 

- Fix shell completion for top-level `influx` commands.
- Make global `--http-debug` flag visible in help text.
- Don't set empty strings for IDs in permission resources.
- Detect and error out on incorrect positional arguments.
- Respect value of `--host` flag when writing CLI configs in `setup`.

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
- Update [`bucket create`](/influxdb/cloud/reference/cli/influx/bucket/create/) to allow setting a schema type.
- Update [`bucket list`](/influxdb/cloud/reference/cli/influx/bucket/list/) to display schema types.
- Bind [`--skip-verify`](/influxdb/cloud/reference/cli/influx/org/members/add/#flags) flag to the `INFLUX_SKIP_VERIFY` environment variable.
- (InfluxDB Cloud only) Add [`buck
- (InfluxDB OSS only) Updates to `backup` and `restore`:
  - Reimplement [`backup`](/influxdb/cloud/reference/cli/influx/backup/) to support downloading embedded SQL store from InfluxDB 2.0 or later.
  - Add [`--compression`](/influxdb/v2.0/reference/cli/influx/backup/_index.md) flag to support GZIP compression of downloaded files.
  - Reimplement `restore` to support uploading embedded SQL store from InfluxDB v2.1.x.
- (InfluxDB OSS only) Add [`--password`](/influxdb/cloud/reference/cli/influx/user/password/) flag to `user password` command to allow bypassing interactive prompt.

## Bug fixes

- Fix interactive password collection and color rendering in PowerShell.
- `org members list` no longer hangs on organizations with more than 10 members.
- Detect and warn when inputs to `write` contain standalone CR characters.
- `dashboards` command now accepts `--org` flag, or falls back to default org in config.
- Return a consistent error when responses fail to decode, including hints for OSS-only and Cloud-only commands.
