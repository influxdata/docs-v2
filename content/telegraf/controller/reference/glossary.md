---
title: Telegraf Controller glossary
description: >
  Definitions of terms used in {{% product-name %}} and the broader Telegraf
  ecosystem.
menu:
  telegraf_controller:
    name: Glossary
    parent: Reference
weight: 108
related:
  - /telegraf/controller/reference/architecture/
  - /telegraf/controller/reference/agent-status-eval/
  - /telegraf/controller/configs/dynamic-values/
  - /telegraf/v1/glossary/
---

This glossary defines terms you encounter when working with {{% product-name %}}.
Some terms describe {{% product-name %}} concepts such as labels, reporting
rules, and the heartbeat protocol. Others describe Telegraf concepts that
{{% product-name %}} surfaces in its UI and API.
For deeper background on Telegraf agent internals, see the
[Telegraf glossary](/telegraf/v1/glossary/).

[A](#a) | <span style="opacity:.35;font-weight:500">B</span> | [C](#c) | <span style="opacity:.35;font-weight:500">D</span> | [E](#e) | [F](#f) | <span style="opacity:.35;font-weight:500">G</span> | [H](#h) | [I](#i) | <span style="opacity:.35;font-weight:500">J</span> | <span style="opacity:.35;font-weight:500">K</span> | [L](#l) | [M](#m) | <span style="opacity:.35;font-weight:500">N</span> | [O](#o) | [P](#p) | <span style="opacity:.35;font-weight:500">Q</span> | [R](#r) | [S](#s) | [T](#t) | <span style="opacity:.35;font-weight:500">U</span> | <span style="opacity:.35;font-weight:500">V</span> | <span style="opacity:.35;font-weight:500">W</span> | <span style="opacity:.35;font-weight:500">X</span> | <span style="opacity:.35;font-weight:500">Y</span> | <span style="opacity:.35;font-weight:500">Z</span>

## A

### agent

In {{% product-name %}}, an agent is a Telegraf process that is registered with
Controller and periodically sends a [heartbeat](#heartbeat) reporting its
status, version, hostname, and the configurations it is running. Each agent is
identified by an `agent_id` set in the Telegraf configuration. Agents appear in
the {{% product-name %}} UI and can be grouped with [labels](#label) and
governed by [reporting rules](#reporting-rule).

Related entries: [heartbeat](#heartbeat), [instance](#instance), [label](#label), [reporting rule](#reporting-rule), [reporting status](#reporting-status), Telegraf [agent](/telegraf/v1/glossary/#agent)

### aggregator plugin

A Telegraf plugin that receives metrics from input plugins and produces
aggregate metrics (such as sums, averages, or histograms) over a configurable
time window before passing them to output plugins. Aggregator plugins appear as
a configurable category in the {{% product-name %}} configuration builder.

Related entries: [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin), Telegraf [aggregator plugin](/telegraf/v1/glossary/#aggregator-plugin)

## C

### collection interval

The frequency at which a Telegraf input plugin collects metrics from its
source, for example every 10 seconds. The global collection interval is set in
the `[agent]` section of a Telegraf configuration and can be overridden per
input plugin.

Related entries: [flush interval](#flush-interval), [input plugin](#input-plugin), Telegraf [collection interval](/telegraf/v1/glossary/#collection-interval)

### configuration

A TOML document that defines which inputs, outputs, processors, aggregators,
and secret stores a Telegraf agent should run, along with the settings for
each. {{% product-name %}} stores configurations centrally and delivers them
to agents that request them. The terms _config_ and _configuration_ are used
interchangeably in the {{% product-name %}} UI and API.

Related entries: [configuration parameter](#configuration-parameter), [environment variable](#environment-variable), [plugin](#plugin), [secret](#secret), [TOML](#toml)

### configuration parameter

A placeholder of the form `&{param_name[:default_value]}` embedded in a
configuration's TOML. When an agent requests a configuration, {{% product-name %}}
substitutes parameter values from the request's URL query string before
returning the rendered TOML. Parameters let you deliver one configuration to
many agents with per-agent values. Parameters are a {{% product-name %}}
feature and are not part of the Telegraf project.

Related entries: [configuration](#configuration), [environment variable](#environment-variable), [secret](#secret)

## E

### environment variable

A placeholder of the form `${VAR}` or `${VAR:-default}` in a Telegraf
configuration. Environment variables are resolved by the Telegraf agent from
its own runtime environment when the agent starts, after {{% product-name %}}
has rendered any [configuration parameters](#configuration-parameter). Use
environment variables for values supplied by the host running Telegraf, such
as credentials or host-specific identifiers.

Related entries: [configuration](#configuration), [configuration parameter](#configuration-parameter), [secret](#secret)

## F

### field

A key-value pair in a Telegraf metric that holds a measured value, for example
`usage_idle=98.2`. Fields carry the data; they are typically not used as
filterable dimensions. Use [tags](#tag) for filterable dimensions.

Related entries: [measurement](#measurement), [metric](#metric), [tag](#tag)

### flush interval

The frequency at which a Telegraf output plugin sends batched metrics to its
destination. The flush interval is set in the `[agent]` section of a Telegraf
configuration and applies globally to all output plugins. It should not be
smaller than the [collection interval](#collection-interval).

Related entries: [collection interval](#collection-interval), [output plugin](#output-plugin), Telegraf [flush interval](/telegraf/v1/glossary/#flush-interval)

## H

### heartbeat

A periodic HTTP request that a Telegraf agent sends to {{% product-name %}} to
report that it is alive, what version it is running, and which configurations
it is using. {{% product-name %}} processes heartbeats through a dedicated
high-performance server and uses them to maintain each agent's
[reporting status](#reporting-status). A heartbeat may also include Telegraf
runtime statistics that drive
[agent status evaluation](/telegraf/controller/reference/agent-status-eval/).

Related entries: [agent](#agent), [reporting rule](#reporting-rule), [reporting status](#reporting-status)

## I

### input plugin

A Telegraf plugin that collects metrics from a source system, such as CPU,
memory, disk, an HTTP endpoint, or a message broker. Input plugins appear as a
configurable category in the {{% product-name %}} configuration builder.

Related entries: [aggregator plugin](#aggregator-plugin), [collection interval](#collection-interval), [output plugin](#output-plugin), [processor plugin](#processor-plugin), Telegraf [input plugin](/telegraf/v1/glossary/#input-plugin)

### instance

The word _instance_ has two meanings in {{% product-name %}} documentation,
depending on context:

- **Telegraf agent instance**: a running Telegraf process. Each agent
  registered with {{% product-name %}} is one Telegraf instance. When multiple
  Telegraf processes run on the same host, each is a separate instance with
  its own `agent_id`.
- **{{% product-name %}} instance**: a running {{% product-name %}} server.
  An instance is the deployed application that manages a fleet of Telegraf
  agents, including the web UI, API server, and heartbeat server.

Related entries: [agent](#agent), [architecture](/telegraf/controller/reference/architecture/)

## L

### label

The word _label_ has two meanings, depending on context:

- **{{% product-name %}} label**: a user-defined tag that you attach to
  agents and configurations to group, filter, and find them in the UI.
  {{% product-name %}} labels can have a color for visual distinction and
  are unrelated to Telegraf metric [tags](#tag).
- **Telegraf agent label**: a marker placed on a plugin in a Telegraf
  configuration that lets you enable or disable that plugin from the
  Telegraf command line using selectors. Use Telegraf agent labels to
  toggle plugins on or off without editing the configuration.

Related entries: [agent](#agent), [configuration](#configuration), [plugin](#plugin), [tag](#tag)

## M

### measurement

The name of a Telegraf metric, for example `cpu` or `mem`. A measurement
groups related [fields](#field) and [tags](#tag) and typically becomes the
table or series name in the destination system.

Related entries: [field](#field), [metric](#metric), [tag](#tag)

### metric

A data point produced by a Telegraf input plugin. A metric has a
[measurement](#measurement) name, one or more [fields](#field), zero or more
[tags](#tag), and a timestamp.

Related entries: [field](#field), [input plugin](#input-plugin), [measurement](#measurement), [tag](#tag)

## O

### output plugin

A Telegraf plugin that sends collected metrics to a destination, such as
InfluxDB, Kafka, or a file. Output plugins appear as a configurable category
in the {{% product-name %}} configuration builder.

Related entries: [aggregator plugin](#aggregator-plugin), [flush interval](#flush-interval), [input plugin](#input-plugin), [processor plugin](#processor-plugin), Telegraf [output plugin](/telegraf/v1/glossary/#output-plugin)

## P

### plugin

A modular component of Telegraf that performs one job in the metric pipeline:
[input plugins](#input-plugin) collect metrics, [processor plugins](#processor-plugin)
transform them, [aggregator plugins](#aggregator-plugin) summarize them, and
[output plugins](#output-plugin) send them to a destination. [Secret stores](#secret-store)
are a related plugin type for managing sensitive values. {{% product-name %}}
exposes plugins as the building blocks of the configuration builder.

Related entries: [aggregator plugin](#aggregator-plugin), [configuration](#configuration), [input plugin](#input-plugin), [output plugin](#output-plugin), [processor plugin](#processor-plugin), [secret store](#secret-store)

### processor plugin

A Telegraf plugin that modifies, filters, or enriches metrics in the pipeline
between collection and output. Processor plugins appear as a configurable
category in the {{% product-name %}} configuration builder.

Related entries: [aggregator plugin](#aggregator-plugin), [input plugin](#input-plugin), [output plugin](#output-plugin), Telegraf [processor plugin](/telegraf/v1/glossary/#processor-plugin)

## R

### reporting rule

A {{% product-name %}} policy that defines how often an agent is expected to
send heartbeats and how long Controller waits before marking the agent as
not reporting. A reporting rule can also configure automatic deletion of
agents that have not reported for a specified period. You can assign reporting
rules to agents individually or by label.

Related entries: [agent](#agent), [heartbeat](#heartbeat), [label](#label), [reporting status](#reporting-status), [reporting rules](/telegraf/controller/agents/reporting-rules/)

### reporting status

The health state that {{% product-name %}} assigns to each agent based on its
heartbeats and (optionally) the runtime statistics those heartbeats carry. The
status takes one of six values:

- **Ok**: the agent is reporting normally and any configured status
  evaluation passes.
- **Warn**: status evaluation indicates a non-critical issue.
- **Fail**: status evaluation indicates a critical issue.
- **Error**: the agent is reporting but is itself in an error state.
- **Not reporting**: the agent has not sent a heartbeat within the threshold
  defined by its [reporting rule](#reporting-rule).
- **Undefined**: no status has been determined yet, typically because the
  agent has just registered.

The `Warn`, `Fail`, and `Ok` values are driven by
[agent status evaluation](/telegraf/controller/reference/agent-status-eval/)
expressions defined in the Telegraf `outputs.heartbeat` plugin.

Related entries: [agent](#agent), [heartbeat](#heartbeat), [reporting rule](#reporting-rule)

## S

### secret

A sensitive value, such as an API token or password, that a Telegraf plugin
needs at runtime. Secrets are referenced from a configuration using the
syntax `@{store_id:key}` and resolved by a [secret store](#secret-store).
Using a secret keeps the sensitive value out of the configuration TOML and
out of {{% product-name %}}.

Related entries: [configuration parameter](#configuration-parameter), [environment variable](#environment-variable), [secret store](#secret-store)

### secret store

A Telegraf plugin type that supplies sensitive values to other plugins on
demand. Secret stores include OS keyrings, files, and external secret
managers. {{% product-name %}} lets you declare secret stores in a
configuration; the resolution happens entirely on the Telegraf agent at
runtime.

Related entries: [configuration](#configuration), [plugin](#plugin), [secret](#secret)

## T

### tag

A key-value pair attached to a Telegraf [metric](#metric) that is used as a
dimension for grouping and filtering, for example `host=server-1` or
`region=us-east`. Tags are part of the Telegraf metric model and are distinct
from {{% product-name %}} [labels](#label).

Related entries: [field](#field), [label](#label), [measurement](#measurement), [metric](#metric)

### TOML

Tom's Obvious, Minimal Language, the file format Telegraf uses for its
configuration. {{% product-name %}}'s configuration builder produces TOML, and
the API can return any configuration as a rendered TOML document.

Related entries: [configuration](#configuration)

### token

A credential issued by {{% product-name %}} that authenticates API requests
and agent communications. Tokens are scoped by role and can be revoked or
reassigned. For details, see
[Authorization](/telegraf/controller/reference/authorization/).

Related entries: [agent](#agent), [authorization](/telegraf/controller/reference/authorization/)
