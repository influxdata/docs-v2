---
title: Release Notes/Changelog
description: Important features and changes in the latest version of Kapacitor.
menu:
  kapacitor_1_5_ref:
    parent: About the project
---

## v1.5.6 [2020-07-17]

## Features

- Add [Microsoft Teams event handler](/kapacitor/1.5/event_handlers/microsoftteams/), thanks @mmindenhall!
- Add [Discord event handler](/kapacitor/1.5/event_handler/discord/), thanks @mattnotmitt!
- Add [support for TLS 1.3](/kapacitor/v1.5/administration/configuration/#transport-layer-security-tls-settings).

### Bug fixes

- Fix UDF agent Python 3.0 issues, thanks @elohmeier!
- Add `scraper_test` package to fix discovery service lost configuration (`discovery.Config`), thanks @flisky!
- Use `systemd` for Amazon Linux 2.
- Correct issue with `go vet` invocation in `.hooks/pre-commit` file that caused the hook to fail, thanks @mattnotmitt!
- Update `build.py` to support `arm64`, thanks @povlhp!
- Fix panic when setting a zero interval for ticker, which affected deadman and stats nodes.
- Fix a panic on int div-by-zero and return an error instead.
- Fix issue that caused Kapacitor to ignore the `pushover().userKey('')` TICKScript operation.

## v1.5.5 [2020-04-20]

## Breaking changes

- Update release checksums (used to verify release bits haven't been tampered with) from MD5 (Message Digest, 128-bit digest) to SHA-256 (Secure Hash Algorithm 2, 256-bit digest).

### Bug fixes

- Update the Kafka client to ensure errors are added to Kapacitor logs.

## v1.5.4 [2020-01-16]

## Features

- Add the ability to use templates when specifying MQTT (message queue telemetry transport) topic.
- Upgrade to support Python 3.0 for user defined functions (UDFs).

### Bug fixes

- Upgrade the Kafka library to set the timestamp correctly.
- Upgrade to Go 1.13, fixes various `go vet` issues.

## v1.5.3 [2019-06-18]

{{% warn %}}
### Authentication and shared secret
If using Kapacitor v1.5.3 or newer and InfluxDB with [authentication enabled](/influxdb/v1.7/administration/authentication_and_authorization/),
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

#### Important update [2019-07-11]
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

## v1.5.2 [2018-12-12]

### Features

- Add barrier node support to JoinNode.
- Add ability to expire groups using the BarrierNode.
- Add alert/persist-topics to config.
- Add multiple field support to the ChangeDetectNode.
- Add links to PagerDuty v2 alerts.
- Add additional metadata to Sensu alerts.

### Bug fixes

- Fix join not catching up fast enough after a pause in the data stream.

## v1.5.1 [2018-08-06]

### Bug fixes

- `pagerduty2` should use `routingKey` rather than `serviceKey`.
- Fix KafkaTopic not working from TICKscript.
- Improve Kafka alert throughput.

## v1.5.0 [2018-05-17]

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

## v1.4.1 [2018-03-13]

### Bug fixes

* Fix bug where task type was invalid when using var for stream/batch

## v1.4.0 [2017-12-08]

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
- Fixed issues with recusive symlinks on systemd systems.
- Fixed invalid default MQTT config.

## v1.3.3 [2017-08-11]

### Bug fixes

- Expose pprof without authentication, if enabled.

## v1.3.2 [2017-08-08]

### Bug fixes

- Use details field from alert node in PagerDuty.

## v1.3.1 [2017-06-02]

### Bug fixes

- Proxy from environment for HTTP request to Slack
- Fix derivative node preserving fields from previous point in stream tasks

## v1.3.0 [2017-05-22]

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
For more details on the scraping and discovery systems, see the full documentation [here](/kapacitor/v1.3/pull_metrics/scraping-and-discovery/).

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

For more details on the alerting system, see the full documentation [here](/kapacitor/v1.3/alerts).

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
- Fixed curruption of recordings list after deleting all recordings.
- Fixed missing "vars" key when listing tasks.
- Fixed bug where aggregates would not be able to change type.
- Fixed panic when the process cannot stat the data dir.

## v1.2.0 [2017-01-23]

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
See the [API docs](/kapacitor/v1.5/api/api/) for more details.
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
See the [API docs on technical preview](/kapacitor/v1.2/api/api/#technical-preview) for specifics of how this effects the API.

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

## v1.1.1 [2016-12-02]

### Release Notes

No changes to Kapacitor, only upgrading to GoLang 1.7.4 for security patches.

## v1.1.0 [2016-10-07]

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
See the [API docs](/kapacitor/v1.5/api/api/) for more details.

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

## v1.0.2 [2016-10-06]

### Bug fixes

- Fix bug where errors to save cluster/server ID files were ignored.
- Create data_dir on startup if it does not exist.

## v1.0.1 [2016-09-26]

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

## v1.0.0 [2016-09-02]

### Release Notes

First release of Kapacitor v1.0.0.
