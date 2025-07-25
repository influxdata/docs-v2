---
title: Kapacitor release notes
description: Important features and changes in the latest version of Kapacitor.
menu:
  kapacitor_v1:
    parent: About the project
    name: Release notes
aliases:
  - /kapacitor/v1/about_the_project/releasenotes-changelog/
---

## v1.8.0 {date="2025-06-26"}

> [!Warning]
> 
> Python 2-based UDFs are deprecated as of Kapacitor 1.7.7 and are removed in this release. If you are using Python 2
> with your User-Defined Functions (UDFs), upgrade them to be Python 3-compatible **before** installing this version of Kapacitor.
> This required change aligns with modern security practices and ensures your custom functions will continue to work after upgrading.

### Dependency updates

- Upgrade Go to 1.23.9.
- Upgrade go-lang `JWT library` to 4.5.2

## v1.7.7 {date="2025-05-27"}

> [!Warning]
> #### Python 2 UDFs deprecated
>
> Python 2-based UDFs are deprecated** as of Kapacitor 1.7.7 and will be removed in **Kapacitor 1.8.0**.
>
> In preparation for Kapacitor 1.8.0, update your User-Defined Functions (UDFs) to be Python 3-compatible.
> This required change aligns with modern security practices and ensures your custom functions will continue to work after upgrading.

### Dependency updates

- Upgrade Go to 1.22.12.

---

## v1.7.6 {date="2024-10-28"}

### Features

- Kafka Handler set and send SASL extensions.
- Kafka Handler SASL OAUTH token refreshing.

### Bug Fixes

- Using UTC timezone for alert levels.

### Dependency updates

- Upgrade Go to 1.22.7.

---

## v1.7.5 {date="2024-06-12"}

### Dependency updates

- Upgrade Go to 1.21.10.

---

## v1.7.4 {date="2024-04-22"}

### Dependency updates

- Upgrade `aws-sdk-go` to 1.51.12.
- Upgrade Go to 1.21.9.
- Upgrade `golang.org/x/net` from 0.17.0 to 0.23.0.

---

## v1.7.3 {date="2024-03-22"}

### Bug Fixes

- Do not migrate events with empty ID.

### Others

- Upgrade Go to 1.21.8
- Upgrade `google.golang.org/protobuf` to 1.33.0
- Upgrade `github.com/docker/docker` to 24.0.9

---

## v1.7.2 {date="2024-02-26"}

- Upgrade Go to 1.20.13
- Upgrade `google.golang.org/grpc` to 1.56.3
- Upgrade `github.com/docker/docker` to 24.0.7

---

## v1.7.1 {date="2023-10-20"}

### Bug Fixes

- Security fix: (CVE-2023-44487: HTTP/2 Rapid Reset attack)

---

## v1.7.0 {date="2023-08-18"}

### Features

- Update topic store to allow incremental updates.

---

## v1.6.6 {date="2023-04-12"}

### Features

- Add JWT meta API authentication using the `[auth] meta-internal-shared-secret`
  configuration parameter.

### Bug Fixes

- Support InfluxDB 1.9.6 and OpenTSB by implementing `WritePointsPrivileged`

---

## v1.6.5 {date="2022-08-18"}

### Features

- Ability to generate random numbers for `TICKScript` lambdas.
- Update `InfluxQL` for v.1.9.x compatibility.

### Bug fixes

- Update the `Kafka` client to fix a bug regarding write latency.
- Update to [Flux v0.171.0](/flux/v0/release-notes/#v01710) to fix "interface {} is nil, not string" issue.

---

## v1.6.4 {date="2022-03-15"}

### Features

- Add `SASL` support to `Kafka` alerts.

### Bug fixes

- Fully deprecate DES based ciphers, RC4 based ciphers and TLS 1.1 and 1.0 ciphers. 
- Adjust `Flux` injected dependencies so that large data sets can be downloaded without issue.

---

## v1.6.3 {date="2022-01-25"}

### Features

- Add support for custom `attributes` field in [Alerta event handler](/kapacitor/v1/reference/event_handlers/alerta/).
- Add `host` and `attribute` options to [BigPanda event handler](/kapacitor/v1/reference/event_handlers/bigpanda/):
  - `host`: Identifies the main object that caused the alert.
  - `attribute`: Adds additional attribute(s) to the alert payload.
- Add new `auto-attributes` configuration option to BigPanda node.
- Ability to add new headers to HTTP posts directly in `env var` config. 
- `Topic queue length` is now configurable. This allows you to set a `topic-buffer-length` parameter in the Kapacitor config file in the
[alert](https://docs.influxdata.com/kapacitor/v1/administration/configuration/#alert) section. The default is 5000. Minimum length
is 1000.
- Add new `address template` to email alert. Email addresses no longer need to be hardcoded; can be derived directly from data.

### Bug fixes

- Deprecated ciphers identified as "weak" in response to the [sweet32](https://sweet32.info/) attack.
- Add additional detail to the error message `missing flux data`. This error is generated when issues occur when running a **Flux** query within a batch TICKscript.

---

## v1.6.2 {date="2021-09-24"}

### Features

- Add the `template-id` property to the `GET /kapacitor/v1/tasks` request response. Adding this property helps to identify tasks that were created from a [template](/kapacitor/v1/working/template_tasks/).
- For alert templates, row templates, and details templates, add support for third-party services that reject standard `json` (terminated by a new line character) by compacting `json` in templates. To do this, replace `{{ json . }}` with `{{ jsonCompact . }}` in your templates. (This change also compacts Big Panda alert details to avoid Panda service error.)

### Bug fixes

- Implement `expvar` string json encoding to correctly handle special characters in measurement strings, thanks @prashanthjbabu!
- Correctly validate that connected InfluxDB instances are running when`disable-subscriptions` is set to `true` in the [InfluxDB section of the Kapacitor configuration file](/kapacitor/v1/administration/configuration/#influxdb). If InfluxDB is not available, Kapacitor does not start.
- Update `jwt` dependencies and switch to `github.com/golang-jwt/jwt` to remediate the [CVE-2020-26160 vulnerability](https://nvd.nist.gov/vuln/detail/CVE-2020-26160).
- Switch task service to use Flux formatter that preserves comments.

---

## v1.6.1 {date="2021-07-22"}

### Features

- Add flag for restricting CIDR ranges for certain event handlers and nodes.
- Add flag for disabling alert handlers for additional security (such as
  disabling the `exec` alert handler on a shared machine).

### Bug fixes

- Align `DeleteGroupMessage` with `GroupInfo` interface.
- Fix payload serialization for BigPanda.

---

## v1.6.0 {date="2021-06-28"}

{{% warn %}}
Kapacitor 1.6.0 includes a defect that could result in a memory leak and expose
sensitive information.
If you installed this release, upgrade to **Kapacitor v1.6.1**.
{{% /warn %}}

**Kapacitor 1.6** introduces Flux task support.
Use the Flux task to schedule and run Flux tasks against InfluxDB 1.x databases
or offload the Flux query load from InfluxDB (1.x, 2.x, and Cloud).
For more information, see [Use Flux tasks](/kapacitor/v1/working/flux/).

User authentication and authorization (previously only supported in Kapacitor Enterprise)
is now available in Kapacitor 1.6. Require user authentication for interactions
with the Kapacitor API.

{{% warn %}}
### Breaking changes

Kapacitor 1.6+ no longer supports 32-bit operating systems.
If you are using a 32-bit operating system, continue using Kapacitor 1.5.x.
{{% /warn %}}

### Features

- Provide ARM 64-bit builds. 
- Add Kapacitor [Flux task commands](/kapacitor/v1/working/cli_client/#flux-tasks) to the `kapacitor` CLI.
- Add built-in Flux engine to support [Flux tasks in Kapacitor](/kapacitor/v1/working/flux/).
- Add [QueryFluxNode](/kapacitor/v1/reference/nodes/query_flux_node/) for querying with Flux in batch tasks.
- Add [Zenoss event handler](/kapacitor/v1/reference/event_handlers/zenoss/). 
- Route [Kafka alerts](/kapacitor/v1/reference/event_handlers/kafka/) to partitions by
  message ID and support hashing strategy configuration.
- Add user-based authentication.
- Add [TrickleNode](/kapacitor/v1/reference/nodes/trickle_node/) to convert batches to streams. 
- Update [Slack event handler](/kapacitor/v1/reference/event_handlers/slack/) to support new-style Slack applications.
- Handle Delete messages in [joinNode](/kapacitor/v1/reference/nodes/join_node/).

### Bug fixes

- Fix a panic in the scraper handler when debug mode is enabled. 

---

## v1.5.9 {date="2021-04-01"}

### Features

#### New event handler

- Add new [BigPanda event handler](/kapacitor/v1/reference/event_handlers/bigpanda).

#### New configuration options

- Add support for the `correlate` option in the [Alerta event handler](/kapacitor/v1/reference/event_handlers/alerta/), thanks @nermolaev!
- Add the `details` option to the [OpsGenie v2 event handler](/kapacitor/v1/reference/event_handlers/opsgenie/v2/); set this option to `true` to use the Kapacitor alert details as OpsGenie description text, thanks @JamesClonk!

#### Support for HTTP sources in SideLoadNode

- Add support for HTTP [sources](/kapacitor/v1/reference/nodes/sideload_node/#source) in `SideloadNode` configuration, thanks @jregovic!

#### Performance and security improvements

- Add the InfluxDB `subscription-path` option to allow Kapacitor to run behind a reverse proxy, thanks @aspring!
  For more information, see the example in [Kapacitor to InfluxDB TLS configuration over HTTP API](/kapacitor/v1/administration/security/#secure-influxdb-and-kapacitor).
- Send data to InfluxDB compressed as `gzip` by default. Although, this default configuration does not appear in the Kapacitor configuration file, you can add `compression = "none"` to the [InfluxDB section](/kapacitor/v1/administration/configuration/#influxdb) of your Kapacitor configuration file.
- Preallocate `GroupIDs` to increase performance by reducing allocations.

#### Miscellaneous event updates

- Send the full event payload to [Pagerduty](/kapacitor/v1/reference/event_handlers/pagerduty/v2/) when the `eventAction` is `resolve`, thanks @asvinours!
- Add the default color theme to [Microsoft Teams](/kapacitor/v1/reference/event_handlers/microsoftteams/) alerts, thanks @NoamShaish!
- Add barrier handling to [FlattenNode](/kapacitor/v1/reference/nodes/flatten_node/) to ensure points are successfully emitted.

### Bug fixes

- Ensure large batch writes with `influx` gzip are completely written to InfluxDB.
- Update function node name `ServiceNow` handler to camelcase.
- Fix memory leaks in `JoinNode` and `UnionNode`.
- Avoid infinite hang when closing Kafka writer and prevent the timeout error that occurred when updating the Kafka configuration file (`kapacitor.conf`) via http.
- Remove support for `darwin/386` builds (Go no longer supports).
- Rename the alert-handler match function `duration()` to `alertDuration()` to avoid name collision with the type conversion function of the same name.

---

## v1.5.8 {date="2020-01-27"}

{{% warn %}}
If you’ve installed this release, please roll back to v1.5.7 as soon as possible. This release introduced a defect wherein large batch tasks will not completely write all points back to InfluxDB. This primarily affects downsampling tasks where information is written to another retention policy. If the source retention policy is short there is the potential for the source data to age out and the downsample to have never been fully written.
{{% /warn %}}

---

## v1.5.7 {date="2020-10-26"}

### Features

- Add the `.recoveryaction()` method to support overriding the OpsGenieV2 alert recovery action in a TICKscript, thanks @zabullet!
- Add support for templating URLs in the [`httpPost` node](/kapacitor/v1/reference/nodes/http_post_node/) and [`alert` node](/kapacitor/v1/reference/nodes/alert_node/). To set up an template:
  - For the `alert` node, see [alert templates](/kapacitor/v1/reference/event_handlers/post/#alert-templates).
  - For the `http post` node, see [row templates](/kapacitor/v1/reference/event_handlers/post/#row-templates).
- Upgrade `github.com/gorhill/cronexpr`, thanks @wuguanyu!
- Add the [ServiceNow event handler](/kapacitor/v1/reference/event_handlers/servicenow/) to support ServiceNow integration and provide proxy support.

### Bug fixes

- Add error check when the system fails to read the replay file, thanks @johncming!
- Add missing `.Details` to the alert template.

---

## v1.5.6 {date="2020-07-17"}

### Features

- Add [Microsoft Teams event handler](/kapacitor/v1/reference/event_handlers/microsoftteams/), thanks @mmindenhall!
- Add [Discord event handler](/kapacitor/v1/reference/event_handlers/discord/), thanks @mattnotmitt!
- Add [support for TLS 1.3](/kapacitor/v1/administration/configuration/#transport-layer-security-tls).

### Bug fixes

- Fix UDF agent Python 3.0 issues, thanks @elohmeier!
- Add `scraper_test` package to fix discovery service lost configuration (`discovery.Config`), thanks @flisky!
- Use `systemd` for Amazon Linux 2.
- Correct issue with `go vet` invocation in `.hooks/pre-commit` file that caused the hook to fail, thanks @mattnotmitt!
- Update `build.py` to support `arm64`, thanks @povlhp!
- Fix panic when setting a zero interval for ticker, which affected deadman and stats nodes.
- Fix a panic on int div-by-zero and return an error instead.
- Fix issue that caused Kapacitor to ignore the `pushover().userKey('')` TICKScript operation.

---

## v1.5.5 {date="2020-04-20"}

### Breaking changes

- Update release checksums (used to verify release bits haven't been tampered with) from MD5 (Message Digest, 128-bit digest) to SHA-256 (Secure Hash Algorithm 2, 256-bit digest).

### Bug fixes

- Update the Kafka client to ensure errors are added to Kapacitor logs.

---

## v1.5.4 {date="2020-01-16"}

### Features

- Add the ability to use templates when specifying MQTT (message queue telemetry transport) topic.
- Upgrade to support Python 3.0 for user defined functions (UDFs).

### Bug fixes

- Upgrade the Kafka library to set the timestamp correctly.
- Upgrade to Go 1.13, fixes various `go vet` issues.

---

## v1.5.3 {date="2019-06-18"}

{{% warn %}}
### Authentication and shared secret
If using Kapacitor v1.5.3 or newer and InfluxDB with [authentication enabled](/influxdb/v1/administration/authentication_and_authorization/),
set the `[http].shared-secret` option in your `kapacitor.conf` to the shared secret of your InfluxDB instances.

```toml
# ...
[http]
  # ...
  shared-secret = "youramazingsharedsecret"
```

If not set, set to an empty string, or does not match InfluxDB's shared-secret,
the integration with InfluxDB will fail and Kapacitor will not start.
Kapacitor will output an error similar to:

```
kapacitord[4313]: run: open server: open service *influxdb.Service: failed to link subscription on startup: signature is invalid
```
{{% /warn %}}

#### Important update {date="2019-07-11"}
- Some customers have reported a high number of CLOSE_WAIT connections.
  Upgrade to this release to resolve this issue.

### Features
- Add ability to skip SSL verification with an alert post node.
- Add TLS configuration options.

### Bug fixes

- Use default transport consistently.
- Fix deadlock in barrier node when delete is used.
- Make RPM create files with correct ownership on install.
- Delete group stats when a group is deleted.
- Avoid extra allocation when building GroupID.

---

## v1.5.2 {date="2018-12-12"}

### Features

- Add barrier node support to JoinNode.
- Add ability to expire groups using the BarrierNode.
- Add alert/persist-topics to config.
- Add multiple field support to the ChangeDetectNode.
- Add links to PagerDuty v2 alerts.
- Add additional metadata to Sensu alerts.

### Bug fixes

- Fix join not catching up fast enough after a pause in the data stream.

---

## v1.5.1 {date="2018-08-06"}

### Bug fixes

- `pagerduty2` should use `routingKey` rather than `serviceKey`.
- Fix KafkaTopic not working from TICKscript.
- Improve Kafka alert throughput.

---

## v1.5.0 {date="2018-05-17"}

### Features

- Add alert inhibitors that allow an alert to suppress events from other matching alerts.
- Config format updated to allow for more than one slack configuration.  
- Added a new Kapacitor node changeDetect that emits a value for each time a series field changes.
- Add recoverable field to JSON alert response to indicate whether the alert will auto-recover.
- Update OpsGenie integration to use the v2 API.
  To upgrade to using the new API simply update your configuration and TICKscripts to use opsgenie2 instead of opsgenie.
  If your `opsgenie` configuration uses the `recovery_url` option, for `opsgenie2` you will need to change it to the `recovery_action` option.
  This is because the new v2 API is not structured with static URLs, and so only the action can be defined and not the entire URL.
- Add https-private-key option to httpd config.
- Add `.quiet` to all nodes to silence any errors reported by the node.
- Add Kafka event handler.

### Bug fixes

- Kapacitor ticks generating a hash instead of their actual given name.
- Fix deadlock in load service when task has an error.
- Support PagerDuty API v2.
- Fix bug where you could not delete a topic handler with the same name as its topic.
- Adjust PagerDuty v2 service-test names and capture detailed error messages.
- Fix Kafka configuration.

---

## v1.4.1 {date="2018-03-13"}

### Bug fixes

* Fix bug where task type was invalid when using var for stream/batch

---

## v1.4.0 {date="2017-12-08"}

### Release notes

Kapacitor v1.4.0 adds many new features, highlighted here:

- Load directory service for adding topic handlers, tasks, and templates from `dir`.
- Structured logging with logging API endpoints that can be used to tail logs for specified tasks.
- Autoscale support for Docker Swarm and AWS EC2.
- Sideload data into your TICKscript streams from external sources.
- Fully-customizable HTTP Post body for the alert Post handler and the HTTP Post node.

### Breaking changes

#### Change over internal API to use message passing semantics.

The `Combine` and `Flatten` nodes previously operated (erroneously) across batch boundaries: this has been fixed.

### Features

- Added service for loading topic handlers, tasks, and templates from `dir`.
- Topic handler file format modified to include TopicID and HandlerID.
- TICKscript now allows task descriptions exclusively through a TICKscript.
- Task types (batch or stream) no longer must be specified.
- `dbrp` expressions were added to TICKscript.
- Added support for AWS EC2 autoscaling services.
- Added support for Docker Swarm autoscaling services.
- Added `BarrierNode` to emit `BarrierMessage` periodically.
- Added `Previous` state.
- Added support to persist replay status after it finishes.
- Added `alert.post` and `https_post` timeouts to ensure cleanup of hung connections.
- Added subscriptions modes to InfluxDB subscriptions.
- Added linear fill support for `QueryNode`.
- Added MQTT alert handler.
- Added built-in functions for converting timestamps to integers.
- Added `bools` field types to UDFs.
- Added stateless `now()` function to get the current local time.
- Added support for timeout, tags, and service templates in the Alerta AlertNode.
- Added support for custom HTTP Post bodies via a template system.
- Added support allowing for the addition of the HTTP status code as a field when using HTTP Post.
- Added `logfmt` support and refactor logging.
- Added support for exposing logs via the API. API is released as a technical preview.
- Added support for `{{ .Duration }}` on Alert Message property.
- Added support for [JSON lines](https://en.wikipedia.org/wiki/JSON_Streaming#Line-delimited_JSON) for steaming HTTP logs.
- Added new node `Sideload` that allows loading data from files into the stream of data. Data can be loaded using a hierarchy.
- Promote Alert API to stable v1 path.
- Change `WARN` level logs to `INFO` level.
- Updated Go version to 1.9.2.

### Bug fixes

- Fixed issues where log API checked the wrong header for the desired content type.
- Fixed VictorOps "data" field being a string instead of actual JSON.
- Fixed panic with `MQTT.toml` configuration generation.
- Fix oddly-generated TOML for MQTT & HTTPpost.
- Address Idle Barrier dropping all messages when source has clock offset.
- Address crash of Kapacitor on Windows x64 when starting a recording.
- Allow for `.yml` file extensions in `define-topic-handler`.
- Fix HTTP server error logging.
- Fixed bugs with stopping a running UDF agent.
- Fixed error messages for missing fields which are arguments to functions are not clear.
- Fixed bad PagerDuty test the required server info.
- Added SNMP sysUpTime to SNMP Trap service.
- Fixed panic on recording replay with HTTPPostHandler.
- Fixed Kubernetes incluster master API DNS resolution.
- Remove the pidfile after the server has exited.
- Logs API writes multiple HTTP headers.
- Fixed missing dependency in RPM package.
- Force tar owner/group to be `root`.
- Fixed install/remove of Kapacitor on non-systemd Debian/Ubuntu systems.
- Fixed packaging to not enable services on RHEL systems.
- Fixed issues with recursive symlinks on systemd systems.
- Fixed invalid default MQTT config.

---

## v1.3.3 {date="2017-08-11"}

### Bug fixes

- Expose pprof without authentication, if enabled.

---

## v1.3.2 {date="2017-08-08"}

### Bug fixes

- Use details field from alert node in PagerDuty.

---

## v1.3.1 {date="2017-06-02"}

### Bug fixes

- Proxy from environment for HTTP request to Slack
- Fix derivative node preserving fields from previous point in stream tasks

---

## v1.3.0 {date="2017-05-22"}

### Release Notes

This release has two major features.

1. Addition of scraping and discovering for Prometheues style data collection.
2. Updates to the Alert Topic system.

Here is a quick example of how to configure Kapacitor to scrape discovered targets.
First, configure a discoverer, here we use the file-discovery discoverer.
Next, configure a scraper to use that discoverer.

```
# Configure file discoverer
[[file-discovery]]
 enabled = true
 id = "discover_files"
 refresh-interval = "10s"
 ##### This will look for prometheus json files
 ##### File format is here https://prometheus.io/docs/operating/configuration/#%3Cfile_sd_config%3E
 files = ["/tmp/prom/*.json"]

# Configure scraper
[[scraper]]
 enabled = true
 name = "node_exporter"
 discoverer-id = "discover_files"
 discoverer-service = "file-discovery"
 db = "prometheus"
 rp = "autogen"
 type = "prometheus"
 scheme = "http"
 metrics-path = "/metrics"
 scrape-interval = "2s"
 scrape-timeout = "10s"
```

Add the above snippet to your `kapacitor.conf` file.

Create the below snippet as the file `/tmp/prom/localhost.json`:

```
[{
 "targets": ["localhost:9100"]
}]
```

Start the Prometheues `node_exporter` locally.

Now, startup Kapacitor and it will discover the `localhost:9100` `node_exporter` target and begin scrapping it for metrics.
For more details on the scraping and discovery systems, see the full documentation [here](/kapacitor/v1/working/scraping-and-discovery/).

The second major feature with this release are changes to the alert topic system.
The previous release introduced this new system as a technical preview and with this release the alerting service has been simplified.
Alert handlers now only have a single action and belong to a single topic.

The handler definition has been simplified as a result.
Here are some example alert handlers using the new structure:

```yaml
id: my_handler
kind: pagerDuty
options:
  serviceKey: XXX
```

```yaml
id: aggregate_by_1m
kind: aggregate
options:
  interval: 1m
  topic: aggregated
```

```yaml
id: publish_to_system
kind: publish
options:
  topics: [ system ]
```

To define a handler now you must specify which topic the handler belongs to.
For example, to define the above aggregate handler on the system topic, use this command:

```sh
kapacitor define-handler system aggregate_by_1m.yaml
```

For more details on the alerting system, see the full documentation [here](/kapacitor/v1/working/alerts/).

### Breaking Change

#### Fixed inconsistency with JSON data from alerts.

    The alert handlers Alerta, Log, OpsGenie, PagerDuty, Post and VictorOps allow extra opaque data to beattached to alert notifications.
    That opaque data was inconsistent and this change fixes that.
    Depending on how that data was consumed this could result in a breaking change, since the original behavior
    was inconsistent we decided it would be best to fix the issue now and make it consistent for all future builds.
    Specifically in the JSON result data the old key `Series` is always `series`, and the old key `Err` is now
    always `error` instead of for only some of the outputs.

#### Refactor the Alerting service.

    The change is completely breaking for the technical preview alerting service, a.k.a. the new alert topic
    handler features. The change boils down to simplifying how you define and interact with topics.
    Alert handlers now only ever have a single action and belong to a single topic.
    An automatic migration from old to new handler definitions will be performed during startup.
    See the updated API docs.

#### Add generic error counters to every node type.

    Renamed `query_errors` to `errors` in batch node.
    Renamed `eval_errors` to `errors` in eval node.

#### The UDF agent Go API has changed.

    The changes now make it so that the agent package is self contained.

#### A bug was fixed around missing fields in the derivative node.

    The behavior of the node changes slightly in order to provide a consistent fix to the bug.
    The breaking change is that now, the time of the points returned are from the right hand or current point time,
    instead of the left hand or previous point time.

### Features

- Allow Sensu handler to be specified.
- Added type signatures to Kapacitor functions.
- Added `isPresent` operator for verifying whether a value is present (part of [#1284](https://github.com/influxdata/kapacitor/pull/1284)).
- Added Kubernetes scraping support.
- Added `groupBy exclude` and added `dropOriginalFieldName` to `flatten`.
- Added KapacitorLoopback node to be able to send data from a task back into Kapacitor.
- Added headers to alert POST requests.
- TLS configuration in Slack service for Mattermost compatibility.
- Added generic HTTP Post node.
- Expose server specific information in alert templates.
- Added Pushover integration.
- Added `working_cardinality` stat to each node type that tracks the number of groups per node.
- Added StateDuration node.
- Default HipChat URL should be blank.
- Add API endpoint for performing Kapacitor database backups.
- Adding source for sensu alert as parameter.
- Added discovery and scraping services for metrics collection (pull model).
- Updated Go version to 1.7.5.

### Bug fixes

- Fixed broken ENV var configuration overrides for the Kubernetes section.
- Copy batch points slice before modification, fixes potential panics and data corruption.
- Use the Prometheus metric name as the measurement name by default for scrape data.
- Fixed possible deadlock for scraper configuration updating.
- Fixed panic with concurrent writes to same points in state tracking nodes.
- Simplified static-discovery configuration.
- Fixed panic in InfluxQL node with missing field.
- Fixed missing working_cardinality stats on stateDuration and stateCount nodes.
- Fixed panic in scraping TargetManager.
- Use ProxyFromEnvironment for all outgoing HTTP traffic.
- Fixed bug where batch queries would be missing all fields after the first nil field.
- Fix case-sensitivity for Telegram `parseMode` value.
- Fix pprof debug endpoint.
- Fixed hang in configuration API to update a configuration section.
    Now if the service update process takes too long the request will timeout and return an error.
    Previously the request would block forever.
- Make the Alerta auth token prefix configurable and default it to Bearer.
- Fixed logrotate file to correctly rotate error log.
- Fixed bug with alert duration being incorrect after restoring alert state.
- Fixed bug parsing dbrp values with quotes.
- Fixed panic on loading replay files without a file extension.
- Fixed bug in Default Node not updating batch tags and groupID.
    Also empty string on a tag value is now a sufficient condition for the default conditions to be applied.
    See [#1233](https://github.com/influxdata/kapacitor/pull/1233) for more information.
- Fixed dot view syntax to use xlabels and not create invalid quotes.
- Fixed corruption of recordings list after deleting all recordings.
- Fixed missing "vars" key when listing tasks.
- Fixed bug where aggregates would not be able to change type.
- Fixed panic when the process cannot stat the data dir.

---

## v1.2.0 {date="2017-01-23"}

### Release Notes

A new system for working with alerts has been introduced.
This alerting system allows you to configure topics for alert events and then configure handlers for various topics.
This way alert generation is decoupled from alert handling.

Existing TICKscripts will continue to work without modification.

To use this new alerting system remove any explicit alert handlers from your TICKscript and specify a topic.
Then configure the handlers for the topic.

```
stream
    |from()
      .measurement('cpu')
      .groupBy('host')
    |alert()
      // Specify the topic for the alert
      .topic('cpu')
      .info(lambda: "value" > 60)
      .warn(lambda: "value" > 70)
      .crit(lambda: "value" > 80)
      // No handlers are configured in the script, they are instead defined on the topic via the API.
```

The API exposes endpoints to query the state of each alert and endpoints for configuring alert handlers.
See the [API docs](/kapacitor/v1/working/api/) for more details.
The kapacitor CLI has been updated with commands for defining alert handlers.

This release introduces a new feature where you can window based off the number of points instead of their time.
For example:

```
stream
    |from()
        .measurement('my-measurement')
    // Emit window for every 10 points with 100 points per window.
    |window()
        .periodCount(100)
        .everyCount(10)
    |mean('value')
    |alert()
         .crit(lambda: "mean" > 100)
         .slack()
         .channel('#alerts')
```


With this change alert nodes will have an anonymous topic created for them.
This topic is managed like all other topics preserving state etc. across restarts.
As a result existing alert nodes will now remember the state of alerts after restarts and disiabling/enabling a task.

>NOTE: The new alerting features are being released under technical preview.
This means breaking changes may be made in later releases until the feature is considered complete.
See the [API docs on technical preview](/kapacitor/v1/api/api/#technical-preview) for specifics of how this effects the API.

### Features

- Add new query property for aligning group by intervals to start times.
- Add new alert API, with support for configuring handlers and topics.
- Move alerta api token to header and add option to skip TLS verification.
- Add SNMP trap service for alerting.
- Add fillPeriod option to Window node, so that the first emit waits till the period has elapsed before emitting.
- Now when the Window node every value is zero, the window will be emitted immediately for each new point.
- Preserve alert state across restarts and disable/enable actions.
- You can now window based on count in addition to time.
- Enable markdown in slack attachments.


### Bug fixes

- Fix issue with the Union node buffering more points than necessary.
- Fix panic during close of failed startup when connecting to InfluxDB.
- Fix panic during replays.
- logrotate.d ignores kapacitor configuration due to bad file mode.
- Fix panic during failed aggregate results.

---

## v1.1.1 {date="2016-12-02"}

### Release Notes

No changes to Kapacitor, only upgrading to GoLang 1.7.4 for security patches.

---

## v1.1.0 {date="2016-10-07"}

### Release Notes

New K8sAutoscale node that allows you to auotmatically scale Kubernetes deployments driven by any metrics Kapacitor consumes.
For example, to scale a deployment `myapp` based off requests per second:

```
// The target requests per second per host
var target = 100.0

stream
    |from()
        .measurement('requests')
        .where(lambda: "deployment" == 'myapp')
    // Compute the moving average of the last 5 minutes
    |movingAverage('requests', 5*60)
        .as('mean_requests_per_second')
    |k8sAutoscale()
        .resourceName('app')
        .kind('deployments')
        .min(4)
        .max(100)
        // Compute the desired number of replicas based on target.
        .replicas(lambda: int(ceil("mean_requests_per_second" / target)))
```


New API endpoints have been added to be able to configure InfluxDB clusters and alert handlers dynamically without needing to restart the Kapacitor daemon.
Along with the ability to dynamically configure a service, API endpoints have been added to test the configurable services.
See the [API docs](/kapacitor/v1/api/api/) for more details.

>NOTE: The `connect_errors` stat from the query node was removed since the client changed, all errors are now counted in the `query_errors` stat.

### Features

- Add a Kubernetes autoscaler node. You can now autoscale your Kubernetes deployments via Kapacitor.
- Add new API endpoint for dynamically overriding sections of the configuration.
- Upgrade to using GoLang 1.7
- Add API endpoints for testing service integrations.
- Add support for Slack icon emojis and custom usernames.
- Bring Kapacitor up to parity with available InfluxQL functions in 1.1.

### Bug fixes

- Fix bug where keeping a list of fields that where not referenced in the eval expressions would cause an error.
- Fix the number of subscriptions statistic.
- Fix inconsistency with InfluxDB by adding configuration option to set a default retention policy.
- Sort and dynamically adjust column width in CLI output.
- Adds missing strLength function.

---

## v1.0.2 {date="2016-10-06"}

### Bug fixes

- Fix bug where errors to save cluster/server ID files were ignored.
- Create data_dir on startup if it does not exist.

---

## v1.0.1 {date="2016-09-26"}

### Features

- Add TCP alert handler
- Add ability to set alert message as a field
- Add `.create` property to InfluxDBOut node, which when set will create the database and retention policy on task start.
- Allow duration / duration in TICKscript.
- Add support for string manipulation functions.
- Add ability to set specific HTTP port and hostname per configured InfluxDB cluster.

### Bug fixes

- Fixed typo in the default configuration file
- Change |log() output to be in JSON format so its self documenting structure.
- Fix issue with TMax and the Holt-Winters method.
- Fix bug with TMax and group by time.

---

## v1.0.0 {date="2016-09-02"}

### Release Notes

First release of Kapacitor v1.0.0.
