---
title: Contribute to Telegraf
description:
menu:
  telegraf_1_22_ref:
    name: Contribute to Telegraf
    weight: 80
---

## Opening Issues

### Bug reports

Before you file an issue, please search existing issues in case it has already been filed, or perhaps even fixed. If you file an issue, please ensure you include all the requested details (e.g. Telegraf config and logs, platform, etc.)

Please note that issues are not the place to file general support requests such as "How do I use the mongoDB plugin?" Questions of this nature should be sent to the [Community Slack](https://influxdata.com/slack) or [Community Page](https://community.influxdata.com/), not filed as issues.

### Feature requests

We really like to receive feature requests as it helps us prioritize our work. Before you file a feature request, please search existing issues, you can filter issues that have the label `feature request`. Please be clear about your requirements and goals, help us to understand what you would like to see added to Telegraf with examples and the reasons why it is important to you. If you find your feature request already exists as a Github issue please indicate your support for that feature by using the "thumbs up" reaction.

### Support questions

We recommend posting support questions in our [Community Slack](https://influxdata.com/slack) or [Community Page](https://community.influxdata.com/), we have a lot of talented community members there who could help answer your question more quickly.

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

We have two kinds of releases: patch releases, which happen every few weeks, and feature releases, which happen once a quarter. If your fix is a bug fix, it will be released in the next patch release after it is merged to master. If your release is a new plugin or other feature, it will be released in the next quarterly release after it is merged to master. Quarterly releases are on the third Wednesday of March, June, September, and December.

### Contributing an External Plugin

Input, output, and processor plugins written for internal Telegraf can be run as externally-compiled plugins through the [Execd Input](https://github.com/influxdata/telegraf/tree/master/plugins/inputs/execd), [Execd Output](https://github.com/influxdata/telegraf/tree/master/plugins/outputs/execd), and [Execd Processor](https://github.com/influxdata/telegraf/tree/master/plugins/processors/execd) Plugins without having to change the plugin code.

Follow the guidelines of how to integrate your plugin with the [Execd Go Shim](https://docs.influxdata.com/telegraf/latest/configure_plugins/external_plugins/shim/) to easily compile it as a separate app and run it with the respective `execd` plugin.
Check out our [guidelines](https://docs.influxdata.com/telegraf/latest/configure_plugins/external_plugins/write_external_plugin/) on how to build and set up your external plugins to run with `execd`.

## Security Vulnerability Reporting

InfluxData takes security and our users' trust very seriously. If you believe you have found a security issue in any of our
open source projects, please responsibly disclose it by contacting security@influxdata.com. More details about
security vulnerability reporting,
including our GPG key, [can be found here](https://www.influxdata.com/how-to-report-security-vulnerabilities/).
