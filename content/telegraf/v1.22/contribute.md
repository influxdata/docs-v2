---
title: Contribute to Telegraf
description:
menu:
  telegraf_1_22_ref:
    name: Contribute to Telegraf
    weight: 80
---

There are many ways InfluxData encourages it's community to contribute to it's open source products. Whether you want to report a bug, write a plugin, or answer support questions the following sections will guide you on the process. 

## Opening Issues

### File bug reports

1. Search existing GitHub issues for an issue that was already filed or even fixed. 
2. If an existing issue does not exist, file an issue.
3. Ensure all the requested details are included (ex: Telegraf configuration and logs, platform, etc.)

**Note:** Do not open general support requests as GitHub issues (ex: "How do I use the MongoDB plugin?"). Any questions should be directed to the [Community Slack](https://influxdata.com/slack) or [Community Page](https://community.influxdata.com/).

### Open feature requests

We really like to receive feature requests as it helps us prioritize our work.

1. Search existing GitHub issues for to see if your feature request has already been requested and filed. Feature requests can be filtered with the `feature request` label.
  2. If your feature request already exists as a Github issue please indicate your support for that feature by using the "thumbs up" reaction and comment your use case for the feature in a comment on the issue. 
3. If an existing feature request does not exist, open and issue.
4. In the issue, ensure clarity for the feature requests with specific requirements and goals. Provide clear understanding what you would like to see added to Telegraf with use case examples and why it is important to you.

### Ask or answer support questions

Post support questions in InfluxData's [Community Slack](https://influxdata.com/slack) or [Community Page](https://community.influxdata.com/). There are InfluxData employees and talented community members to quickly answer questions.

## Contributing code

### Creating a pull request

1. [Sign the CLA](https://www.influxdata.com/legal/cla/).
2. Open a [new issue](https://github.com/influxdata/telegraf/issues/new/choose) to discuss the changes you would like to make.  This is
   not strictly required but it may help reduce the amount of rework you need
   to do later.
3. Make changes or write plugin using the guidelines in the following GitHub documents:
   - [Input Plugins](https://github.com/influxdata/telegraf/blob/master/docs/INPUTS.md)
   - [Processor Plugins](https://github.com/influxdata/telegraf/blob/master/docs/PROCESSORS.md)
   - [Aggregator Plugins](https://github.com/influxdata/telegraf/blob/master/docs/AGGREGATORS.md)
   - [Output Plugins](https://github.com/influxdata/telegraf/blob/master/docs/OUTPUTS.md)
4. Ensure you have added proper unit tests and documentation.
5. Open a new [pull request](https://github.com/influxdata/telegraf/compare).
6. The pull request title needs to follow [conventional commit format](https://www.conventionalcommits.org/en/v1.0.0/#summary)

**Note:** If you have a pull request with only one commit, then that commit needs to follow the conventional commit format or the `Semantic Pull Request` check will fail. This is because github will use the pull request title if there are multiple commits, but if there is only one commit it will use it instead.

### When will your contribution get released?
Telegraf currently has two kinds of releases: patch releases, which happen every few weeks, and feature releases, which happen once a quarter. If your pull request is a bug fix, it will be released in the next patch release after it is merged to master. If your contribution is a new plugin or other feature, it will be released in the next quarterly release after it is merged to master.

### Contributing an External Plugin

Input, output, and processor plugins written for internal Telegraf can be run as externally-compiled plugins through the [Execd Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/execd), [Execd Output](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/execd), and [Execd Processor](https://github.com/influxdata/telegraf/tree/master/plugins/processors/execd) Plugins without having to change the plugin code.

Follow the guidelines of how to integrate your plugin with the [Execd Go Shim](https://docs.influxdata.com/telegraf/latest/configure_plugins/external_plugins/shim/) to easily compile it as a separate app and run it with the respective `execd` plugin.
Check out our [guidelines](https://docs.influxdata.com/telegraf/latest/configure_plugins/external_plugins/write_external_plugin/) on how to build and set up your external plugins to run with `execd`.

## Security Vulnerability Reporting

InfluxData takes security and our users' trust very seriously. If you believe you have found a security issue in any of our
open source projects, please responsibly disclose it by contacting security@influxdata.com. More details about
security vulnerability reporting,
including our GPG key, [can be found here](https://www.influxdata.com/how-to-report-security-vulnerabilities/).
