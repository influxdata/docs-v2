---
description: "Telegraf plugin for collecting metrics from AWS Data Firehose"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: AWS Data Firehose
    identifier: input-firehose
tags: [AWS Data Firehose, "input-plugins", "configuration", "cloud", "messaging"]
introduced: "v1.34.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/inputs/firehose/README.md, AWS Data Firehose Plugin Source
---

# AWS Data Firehose Input Plugin

This plugin listens for metrics sent via HTTP from [AWS Data Firehose](https://aws.amazon.com/de/firehose/)
in one of the supported [data formats](/telegraf/v1/data_formats/input).
The plugin strictly follows the request-response schema as describe in the
official [documentation](https://docs.aws.amazon.com/firehose/latest/dev/httpdeliveryrequestresponse.html).

**Introduced in:** Telegraf v1.34.0
**Tags:** cloud, messaging
**OS support:** all

[firehose]: https://aws.amazon.com/de/firehose/
[data_formats]: /docs/DATA_FORMATS_INPUT.md
[response_spec]: https://docs.aws.amazon.com/firehose/latest/dev/httpdeliveryrequestresponse.html

## Service Input <!-- @/docs/includes/service_input.md -->

This plugin is a service input. Normal plugins gather metrics determined by the
interval setting. Service plugins start a service to listen and wait for
metrics or events to occur. Service plugins have two key differences from
normal plugins:

1. The global or plugin specific `interval` setting may not apply
2. The CLI options of `--test`, `--test-wait`, and `--once` may not produce
   output for this plugin

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# AWS Data Firehose listener
[[inputs.firehose]]
  ## Address and port to host HTTP listener on
  service_address = ":8080"

  ## Paths to listen to.
  # paths = ["/telegraf"]

  ## maximum duration before timing out read of the request
  # read_timeout = "5s"
  ## maximum duration before timing out write of the response
  # write_timeout = "5s"

  ## Set one or more allowed client CA certificate file names to
  ## enable mutually authenticated TLS connections
  # tls_allowed_cacerts = ["/etc/telegraf/clientca.pem"]

  ## Add service certificate and key
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"

  ## Minimal TLS version accepted by the server
  # tls_min_version = "TLS12"

  ## Optional access key to accept for authentication.
  ## AWS Data Firehose uses "x-amz-firehose-access-key" header to set the access key.
  ## If no access_key is provided (default), authentication is completely disabled and
  ## this plugin will accept all request ignoring the provided access-key in the request!
  # access_key = "foobar"

  ## Optional setting to add parameters as tags
  ## If the http header "x-amz-firehose-common-attributes" is not present on the
  ## request, no corresponding tag will be added. The header value should be a
  ## json and should follow the schema as describe in the official documentation:
  ## https://docs.aws.amazon.com/firehose/latest/dev/httpdeliveryrequestresponse.html#requestformat
  # parameter_tags = ["env"]

  ## Data format to consume.
  ## Each data format has its own unique set of configuration options, read
  ## more about them here:
  ## https://github.com/influxdata/telegraf/blob/master/docs/DATA_FORMATS_INPUT.md
  # data_format = "influx"
```

## Metrics

Metrics are collected from the `records.[*].data` field in the request body.
The data must be base64 encoded and may be sent in any supported
[data format](/telegraf/v1/data_formats/input).

## Example Output

When run with this configuration:

```toml
[[inputs.firehose]]
  service_address = ":8080"
  paths = ["/telegraf"]
  data_format = "value"
  data_type = "string"
```

the following curl command:

```sh
curl -i -XPOST 'localhost:8080/telegraf' \
--header 'x-amz-firehose-request-id: ed4acda5-034f-9f42-bba1-f29aea6d7d8f' \
--header 'Content-Type: application/json' \
--data '{
    "requestId": "ed4acda5-034f-9f42-bba1-f29aea6d7d8f",
    "timestamp": 1578090901599,
    "records": [
        {
          "data": "aGVsbG8gd29ybGQK" // "hello world"
        }
    ]
}'
```

produces:

```text
firehose,firehose_http_path=/telegraf value="hello world" 1725001851000000000
```
