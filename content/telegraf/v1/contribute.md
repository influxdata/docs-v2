---
title: Contribute to Telegraf
description:
menu:
  telegraf_v1_ref:
    name: Contribute to Telegraf
    weight: 80
---

There are many ways to contribute to InfluxData open source products.
Whether you want to report a bug, write a plugin, or answer support questions,
the following sections will guide you through the process. 

- [Open GitHub issues](#open-github-issues)
  - [File bug reports](#file-bug-reports)
  - [Open feature requests](#open-feature-requests)
  - [Ask or answer support questions](#ask-or-answer-support-questions)
- [Contribute code](#contribute-code)
  - [Create a pull request](#create-a-pull-request)
  - [Contribute an external plugin](#contribute-an-external-plugin)
- [Report security vulnerabilities](#report-security-vulnerabilities)

## Open GitHub issues

### File bug reports

1.  Search [Telegraf GitHub issues](https://github.com/influxdata/telegraf/issues)
    for related issues that are open or have been fixed. 
2.  If an issue does not already exist,
    [create a new bug report issue](https://github.com/influxdata/telegraf/issues/new?assignees=&labels=bug&projects=&template=BUG_REPORT.yml).
3.  Include all the requested details.

{{% note %}}
Do not open general support requests as GitHub issues.
Support-related questions should be directed to the [InfluxDB Community Slack](https://influxdata.com/slack)
or [InfluxData Community forum](https://community.influxdata.com/).
{{% /note %}}

### Open feature requests

Feature requests help to prioritize work. To submit a feature request:

1.  Search [Telegraf GitHub issues](https://github.com/influxdata/telegraf/issues)
    for issues related your feature request. Use the **feature request** label to
    filter issues by feature requests.
2.  If an issue related to your feature request already exists, indicate your
    support for that feature by using the
    [**thumbs up** reaction](https://github.blog/2016-03-10-add-reactions-to-pull-requests-issues-and-comments/)
    and add a comment explaining your use case for the feature. 
3.  If a feature request does not already exist,
    [create a new feature request issue](https://github.com/influxdata/telegraf/issues/new?assignees=&labels=feature+request&projects=&template=FEATURE_REQUEST.yml).
    Include the following with your feature request
4.  Include all the requested details.

### Ask or answer support questions

Post support questions to [InfluxDB Community Slack](https://influxdata.com/slack)
or [InfluxData Community forum](https://community.influxdata.com/).

## Contribute code

### Create a pull request

1.  [Sign the InfluxData CLA](https://www.influxdata.com/legal/cla/).
2.  Open a [new issue](https://github.com/influxdata/telegraf/issues/new/choose)
    to discuss the changes you would like to make.
    This is not strictly required, but it may help reduce the amount of rework
    you need to do later.
3.  Make changes or write plugins using the following plugin guidelines:

    - [Input Plugins](https://github.com/influxdata/telegraf/blob/master/docs/INPUTS.md)
    - [Processor Plugins](https://github.com/influxdata/telegraf/blob/master/docs/PROCESSORS.md)
    - [Aggregator Plugins](https://github.com/influxdata/telegraf/blob/master/docs/AGGREGATORS.md)
    - [Output Plugins](https://github.com/influxdata/telegraf/blob/master/docs/OUTPUTS.md)

4.  Include unit tests and documentation for your change.
5.  Open a new [pull request](https://github.com/influxdata/telegraf/compare).
    The pull request title needs to follow the
    [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/#summary).

{{% note %}}
If you have a pull request with only one commit, the commit message must follow
the [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/#summary),
otherwise the **Semantic Pull Request** check will fail.
For single-commit pull requests, GitHub uses the commit message as the default
pull request title.
{{% /note %}}

### Contribute an external plugin

Input, output, and processor plugins written for Telegraf can be run as
externally-compiled plugins through the
[execd input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/execd),
[execd output](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/execd),
and [execd processor](https://github.com/influxdata/telegraf/tree/master/plugins/processors/execd)
plugins without having to change the plugin code.

For more information, see:

- [Execd Go Shim](/telegraf/v1/configure_plugins/external_plugins/shim/):
  Use the Go `execd` shim to compile your plugin as a separate app and run it
  with the respective `execd` plugin.
- [Write an external plugin](/telegraf/v1/configure_plugins/external_plugins/write_external_plugin/):
  Build and set up external plugins to run with `execd`.

## Report security vulnerabilities

InfluxData takes security and our users' trust very seriously.
If you believe you have found a security issue in any of our open source
projects, please responsibly disclose it by contacting
[security@influxdata.com](mailto:security@influxdata.com).
For more information about reporting security vulnerabilities, including our
GPG key, see [How to report security vulnerabilities](https://www.influxdata.com/how-to-report-security-vulnerabilities/).

