---
description: "Telegraf plugin for collecting metrics from HTTP Response"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: HTTP Response
    identifier: input-http_response
tags: [HTTP Response, "input-plugins", "configuration", "server"]
introduced: "v0.12.1"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.36.3/plugins/inputs/http_response/README.md, HTTP Response Plugin Source
---

# HTTP Response Input Plugin

This plugin generates metrics from HTTP responses including the status code and
response statistics.

**Introduced in:** Telegraf v0.12.1
**Tags:** server
**OS support:** all

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

In addition to the plugin-specific configuration settings, plugins support
additional global and plugin configuration settings. These settings are used to
modify metrics, tags, and field or create aliases and configure ordering, etc.
See the [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Secret-store support

This plugin supports secrets from secret-stores for the `username` and
`password` option.
See the [secret-store documentation](/telegraf/v1/configuration/#secret-store-secrets) for more details on how
to use them.

[SECRETSTORE]: ../../../docs/CONFIGURATION.md#secret-store-secrets

## Configuration

```toml @sample.conf
# HTTP/HTTPS request given an address a method and a timeout
[[inputs.http_response]]
  ## List of urls to query.
  # urls = ["http://localhost"]

  ## Set http_proxy.
  ## Telegraf uses the system wide proxy settings if it's is not set.
  # http_proxy = "http://localhost:8888"

  ## Set response_timeout (default 5 seconds)
  # response_timeout = "5s"

  ## HTTP Request Method
  # method = "GET"

  ## Whether to follow redirects from the server (defaults to false)
  # follow_redirects = false

  ## Optional file with Bearer token
  ## file content is added as an Authorization header
  # bearer_token = "/path/to/file"

  ## Optional HTTP Basic Auth Credentials
  # username = "username"
  # password = "pa$$word"

  ## Optional HTTP Request Body
  # body = '''
  # {'fake':'data'}
  # '''

  ## Optional HTTP Request Body Form
  ## Key value pairs to encode and set at URL form. Can be used with the POST
  ## method + application/x-www-form-urlencoded content type to replicate the
  ## POSTFORM method.
  # body_form = { "key": "value" }

  ## Optional name of the field that will contain the body of the response.
  ## By default it is set to an empty String indicating that the body's
  ## content won't be added
  # response_body_field = ''

  ## Maximum allowed HTTP response body size in bytes.
  ## 0 means to use the default of 32MiB.
  ## If the response body size exceeds this limit a "body_read_error" will
  ## be raised.
  # response_body_max_size = "32MiB"

  ## Optional substring or regex match in body of the response (case sensitive)
  # response_string_match = "\"service_status\": \"up\""
  # response_string_match = "ok"
  # response_string_match = "\".*_status\".?:.?\"up\""

  ## Expected response status code.
  ## The status code of the response is compared to this value. If they match,
  ## the field "response_status_code_match" will be 1, otherwise it will be 0.
  ## If the expected status code is 0, the check is disabled and the field
  ## won't be added.
  # response_status_code = 0

  ## Optional TLS Config
  # tls_ca = "/etc/telegraf/ca.pem"
  # tls_cert = "/etc/telegraf/cert.pem"
  # tls_key = "/etc/telegraf/key.pem"
  ## Use TLS but skip chain & host verification
  # insecure_skip_verify = false
  ## Use the given name as the SNI server name on each URL
  # tls_server_name = ""
  ## TLS renegotiation method, choose from "never", "once", "freely"
  # tls_renegotiation_method = "never"

  ## HTTP Request Headers (all values must be strings)
  # [inputs.http_response.headers]
  #   Host = "github.com"

  ## Optional setting to map response http headers into tags
  ## If the http header is not present on the request, no corresponding tag will
  ## be added. If multiple instances of the http header are present, only the
  ## first value will be used.
  # http_header_tags = {"HTTP_HEADER" = "TAG_NAME"}

  ## Interface to use when dialing an address
  # interface = "eth0"

  ## Optional Cookie authentication
  # cookie_auth_url = "https://localhost/authMe"
  # cookie_auth_method = "POST"
  # cookie_auth_username = "username"
  # cookie_auth_password = "pa$$word"
  # cookie_auth_body = '{"username": "user", "password": "pa$$word", "authenticate": "me"}'
  ## cookie_auth_renewal not set or set to "0" will auth once and never renew the cookie
  # cookie_auth_renewal = "5m"
```

## Metrics

- http_response
  - tags:
    - server (target URL)
    - method (request method)
    - status_code (response status code)
    - result (see below
    - result_code (int, see below will trigger this error. Or the option `response_body_field` was used and the content of the response body was not a valid utf-8. Or the size of the body of the response exceeded the `response_body_max_size` |
|connection_failed             | 3                       |Catch all for any network error not specifically handled by the plugin|
|timeout                       | 4                       |The plugin timed out while awaiting the HTTP connection to complete|
|dns_error                     | 5                       |There was a DNS error while attempting to connect to the host|
|response_status_code_mismatch | 6                       |The option `response_status_code_match` was used, and the status code of the response didn't match the value.|

## Example Output

```text
http_response,method=GET,result=success,server=http://github.com,status_code=200 content_length=87878i,http_response_code=200i,response_time=0.937655534,result_code=0i,result_type="success" 1565839598000000000
```

## Optional Cookie Authentication Settings

The optional Cookie Authentication Settings will retrieve a cookie from the
given authorization endpoint, and use it in subsequent API requests.  This is
useful for services that do not provide OAuth or Basic Auth authentication,
e.g. the [Tesla Powerwall API](https://www.tesla.com/support/energy/powerwall/own/monitoring-from-home-network), which uses a Cookie Auth Body to retrieve
an authorization cookie.  The Cookie Auth Renewal interval will renew the
authorization by retrieving a new cookie at the given interval.

[tesla]: https://www.tesla.com/support/energy/powerwall/own/monitoring-from-home-network
