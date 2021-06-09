---
title: Configure Kapacitor
description: Configuration options and environment variables in Kapacitor.
menu:
  kapacitor_1_6:
    weight: 10
    parent: Administration
---

- [Startup](#startup)
- [Kapacitor configuration file](#kapacitor-configuration-file)
  - [TOML](#toml)
  - [Organization](#organization)
  - [Essential configuration groups](#essential-configuration-groups)
  - [Internal configuration groups](#internal-configuration-groups)
  - [Optional configuration groups](#optional-configuration-groups)
- [Kapacitor environment variables](#kapacitor-environment-variables)
- [Configuring with the HTTP API](#configuring-with-the-http-api)

Basic installation and startup of the Kapacitor service is covered in
[Getting started with Kapacitor](/kapacitor/v1.6/introduction/getting-started/).
The basic principles of working with Kapacitor described there should be understood before continuing here.
This document presents Kapacitor configuration in greater detail.

Kapacitor service properties are configured using key-value pairs organized into groups.
Any property key can be located by following its path in the configuration file (for example, `[http].https-enabled` or `[slack].channel`).
Values for configuration keys are declared in the configuration file.
On POSIX systems, this file is located by default at the following location:

```
/etc/kapacitor/kapacitor.conf
```

On Windows systems a sample configuration file can be found in the same directory as the `kapacitord.exe`.

Define a custom location for your `kapacitor.conf` at startup with the `-config` flag.
The path to the configuration file can also be declared using the environment variable `KAPACITOR_CONFIG_PATH`.
Values declared in the configuration file are overridden by environment variables beginning with `KAPACITOR_`.
Some values can also be dynamically altered using the HTTP API when the key `[config-override].enabled` is set to `true`.

#### Configuration precedence
Configure Kapacitor using one or more of the available configuration mechanisms.
Configuration mechanisms are honored in the following order of precedence.

1. Command line arguments
2. HTTP API _(for the InfluxDB connection and other optional services)_
3. Environment variables
4. Configuration file values

{{% note %}}
***Note:*** Setting the property `skip-config-overrides` in the configuration file to `true` will disable configuration overrides at startup.
{{% /note %}}

## Startup

To specify how to load and run the Kapacitor daemon, set the following command line options:

* `-config`: Path to the configuration file.
* `-hostname`: Hostname that will override the hostname specified in the configuration file.
* `-pidfile`: File where the process ID will be written.
* `-log-file`: File where logs will be written.
* `-log-level`: Threshold for writing messages to the log file. Valid values include `debug, info, warn, error`.

### Systemd

On POSIX systems, when the Kapacitor daemon starts as part of `systemd`, environment variables can be set in the file `/etc/default/kapacitor`.

1. To start Kapacitor as part of `systemd`, do one of the following:

    ```sh
    $ sudo systemctl enable kapacitor
    ```

    ```sh
    $ sudo systemctl enable kapacitor —-now
    ```

2. Define where the PID file and log file will be written:

    1. Add a line like the following into the `/etc/default/kapacitor` file:

        ```sh
        KAPACITOR_OPTS="-pidfile=/home/kapacitor/kapacitor.pid -log-file=/home/kapacitor/logs/kapacitor.log"
        ```

    2. Restart Kapacitor:

        ```sh
        sudo systemctl restart kapacitor
        ```

The environment variable `KAPACITOR_OPTS` is one of a few special variables used
by Kapacitor at startup.
For more information on working with environment variables,
see [Kapacitor environment variables](#kapacitor-environment-variables)
below.

## Kapacitor configuration file

The default configuration can be displayed using the `config` command of the Kapacitor daemon.

```bash
kapacitord config
```

A sample configuration file is also available in the Kapacitor code base.
The most current version can be accessed on [Github](https://github.com/influxdata/kapacitor/blob/master/etc/kapacitor/kapacitor.conf).

Use the Kapacitor HTTP API to get current configuration settings and values that can be changed while the Kapacitor service is running. See [Retrieving the current configuration](/kapacitor/v1.6/working/api/#retrieving-the-current-configuration).

### TOML

The configuration file is based on [TOML](https://github.com/toml-lang/toml).
Important configuration properties are identified by case-sensitive keys
to which values are assigned.
Key-value pairs are grouped into tables whose identifiers are delineated by brackets.
Tables can also be grouped into table arrays.

The most common value types found in the Kapacitor configuration file include
the following:

- **String** (declared in double quotes)
  - Examples: `host = "localhost"`, `id = "myconsul"`, `refresh-interval = "30s"`.
- **Integer**
  - Examples: `port = 80`, `timeout = 0`, `udp-buffer = 1000`.
- **Float**
  - Example: `threshold = 0.0`.
- **Boolean**
  - Examples: `enabled = true`, `global = false`, `no-verify = false`.
- **Array** –
  - Examples: `my_database = [ "default", "longterm" ]`, ` urls = ["http://localhost:8086"]`
- **Inline Table**
    - Example: `basic-auth = { username = "my-user", password = "my-pass" }`

Table grouping identifiers are declared within brackets.
For example, `[http]`, `[deadman]`,`[kubernetes]`.

An array of tables is declared within double brackets.
For example, `[[influxdb]]`. `[[mqtt]]`, `[[dns]]`.

### Organization

Most keys are declared in the context of a table grouping, but the basic properties of the Kapacitor system are defined in the root context of the configuration file.
The four basic properties of the Kapacitor service include:

   * `hostname`: String declaring the DNS hostname where the Kapacitor daemon runs.
   * `data_dir`: String declaring the file system directory where core Kapacitor data is stored.
   * `skip-config-overrides`: Boolean indicating whether or not to skip configuration overrides.
   * `default-retention-policy`: String declaring the default retention policy to be used on the InfluxDB database.

Table groupings and arrays of tables follow the basic properties and include essential and optional features,
including specific alert handlers and mechanisms for service discovery and data scraping.

### Essential configuration groups

- [HTTP](#http)
- [Transport Layer Security (TLS)](#transport-layer-security-tls)
- [Config override](#config-override)
- [Logging](#logging)
- [Load](#load)
- [Replay](#replay)
- [Task](#task)
- [Storage](#storage)
- [Deadman](#deadman)
- [InfluxDB](#influxdb)

#### HTTP

The Kapacitor service requires an HTTP connection. Important
HTTP properties, such as a bind address and the path to an HTTPS certificate,
are defined in the `[http]` table.

```toml
...
[http]
  # HTTP API Server for Kapacitor
  # This server is always on,
  # it serves both as a write endpoint
  # and as the API endpoint for all other
  # Kapacitor calls.
  bind-address = ":9092"
  log-enabled = true
  write-tracing = false
  pprof-enabled = false
  https-enabled = false
  https-certificate = "/etc/ssl/influxdb-selfsigned.pem"
  ### Use a separate private key location.
  # https-private-key = ""
...
```

#### Transport Layer Security (TLS)

If the TLS configuration settings is not specified, Kapacitor supports all of the
cipher suite IDs listed and all of the TLS versions implemented in the
[Constants section of the Go `crypto/tls` package documentation](https://golang.org/pkg/crypto/tls/#pkg-constants),
depending on the version of Go used to build InfluxDB.
Use the `SHOW DIAGNOSTICS` command to see the version of Go used to build Kapacitor.

```toml
#...

[tls]
  ciphers = [
    "TLS_AES_128_GCM_SHA256",
    "TLS_AES_256_GCM_SHA384",
    "TLS_CHACHA20_POLY1305_SHA256"
    ]
  min-version = "tls1.3"
  max-version = "tls1.3"

# ...
```

{{% note %}}
**Important:** The order of the cipher suite IDs in the `ciphers` setting
determines which algorithms are selected by priority.
The TLS `min-version` and the `max-version` settings in the example above
restrict support to TLS 1.3.
{{% /note %}}

##### ciphers

List of available TLS cipher suites. 
Default is `["TLS_AES_128_GCM_SHA256", "TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"]`.

For a list of available ciphers available with the version of Go used to build
Kapacitor, see the [Go `crypto/tls` package](https://golang.org/pkg/crypto/tls/#pkg-constants).
Use the query `SHOW DIAGNOSTICS` to see the version of Go used to build Kapacitor.

##### min-version

Minimum version of the TLS protocol that will be negotiated.
Valid values include: 

- `tls1.0`
- `tls1.1`
- `tls1.2`
- `tls1.3` _(default)_

##### max-version

Maximum version of the TLS protocol that will be negotiated. 
Valid values include: 

- `tls1.0`
- `tls1.1`
- `tls1.2`
- `tls1.3` _(default)_

{{% note %}}
#### Recommended configuration for modern compatibility
InfluxData recommends configuring your Kapacitor server's TLS settings for
"modern compatibility" to provide a higher level of security and assumes that 
backward compatibility is not required.
Our recommended TLS configuration settings for `ciphers`, `min-version`, and `max-version` are based on Mozilla's "modern compatibility" TLS server configuration described in [Security/Server Side TLS](https://wiki.mozilla.org/Security/Server_Side_TLS#Modern_compatibility).

InfluxData's recommended TLS settings for "modern compatibility" are specified
in the [configuration settings example above](#transport-layer-security-tls-settings).
{{% /note %}}

#### Config override

The `[config-override]` group contains only one key which enables or disables the ability to
override certain values through the HTTP API. It is enabled by default.

```toml
# ...

[config-override]
  # Enable/Disable the service for overridding configuration via the HTTP API.
  enabled = true

#...
```

#### Logging

The Kapacitor service uses logging to monitor and inspect its behavior.
The path to the log and the log threshold is defined in `[logging]` group.

```toml
# ...

[logging]
  # Destination for logs
  # Can be a path to a file or 'STDOUT', 'STDERR'.
  file = "/var/log/kapacitor/kapacitor.log"
  # Logging level can be one of:
  # DEBUG, INFO, WARN, ERROR, or OFF
  level = "INFO"

#...
```

#### Load

Kapacitor can load TICKscript tasks when the service starts.
Use the `[load]` group to enable this feature and specify the directory path
for TICKscripts to load.

```toml
# ...

[load]
  # Enable/Disable the service for loading tasks/templates/handlers
  # from a directory
  enabled = true
  # Directory where task/template/handler files are set
  dir = "/etc/kapacitor/load"

#...
```

#### Replay

Kapacitor can record data streams and batches for testing tasks before they are enabled.
Use the `[replay]` group specify the path to the directory where the replay files are stored.

```toml
# ...

[replay]
  # Where to store replay filess.
  dir = "/var/lib/kapacitor/replay"

# ...
```

#### Task

{{% warn %}}
Prior to Kapacitor 1.4, tasks were written to a special task database.
The `[task]` group and its associated keys are _deprecated_ and should only be used for
migration purposes.
{{% /warn %}}

#### Storage

The Kapacitor service stores its configuration and other information in [BoltDB](https://github.com/boltdb/bolt),
a file-based key-value data store.
Use the `[storage]` group to define the location of the BoltDB database file on disk.

```toml
# ...

[storage]
  # Where to store the Kapacitor boltdb database
  boltdb = "/var/lib/kapacitor/kapacitor.db"

#...
```

#### Deadman

Use the `[deadman]` group to configure Kapacitor's deadman's switch globally.
See the [Deadman](/kapacitor/v1.6/nodes/alert_node/#deadman) helper function topic in the AlertNode documentation.

```toml
# ...

[deadman]
  # Configure a deadman's switch
  # Globally configure deadman's switches on all tasks.
  # NOTE: for this to be of use you must also globally configure at least one alerting method.
  global = false
  # Threshold, if globally configured the alert will be triggered if the throughput in points/interval is <= threshold.
  threshold = 0.0
  # Interval, if globally configured the frequency at which to check the throughput.
  interval = "10s"
  # Id: the alert Id, NODE_NAME will be replaced with the name of the node being monitored.
  id = "node 'NODE_NAME' in task '{{ .TaskName }}'"
  # The message of the alert. INTERVAL will be replaced by the interval.
  message = "{{ .ID }} is {{ if eq .Level \"OK\" }}alive{{ else }}dead{{ end }}: {{ index .Fields \"collected\" | printf \"%0.3f\" }} points/INTERVAL."

#...
```

#### InfluxDB

Use the `[[influxdb]]` group to configure an InfluxDB connection.
Configure one or more `[[influxdb]]` groups configurations, one per InfluxDB connection.
Identify one of the InfluxDB groups as the `default`.

{{% note %}}
#### InfluxDB user must have admin privileges
To use Kapacitor with an InfluxDB instance that requires authentication,
the InfluxDB user must have [admin privileges](/{{< latest "influxdb" "v1" >}}/administration/authentication_and_authorization/#admin-users).
{{% /note %}}

{{< keep-url >}}
```toml
# ...

[[influxdb]]
  # Connect to an InfluxDB cluster
  # Kapacitor can subscribe, query and write to this cluster.
  # Using InfluxDB is not required and can be disabled.
  enabled = true
  default = true
  name = "localhost"
  urls = ["http://localhost:8086"]
  username = ""
  password = ""
  timeout = 0
  
  # By default, all data sent to InfluxDB is compressed in gzip format.
  # To turn off gzip compression, add the following config setting:
  compression = "none"

  # Absolute path to pem encoded CA file.
  # A CA can be provided without a key/cert pair
  #   ssl-ca = "/etc/kapacitor/ca.pem"
  # Absolutes paths to pem encoded key and cert files.
  #   ssl-cert = "/etc/kapacitor/cert.pem"
  #   ssl-key = "/etc/kapacitor/key.pem"

  # Do not verify the TLS/SSL certificate.
  # This is insecure.
  insecure-skip-verify = false

  # Maximum time to try and connect to InfluxDB during startup
  startup-timeout = "5m"

  # Turn off all subscriptions
  disable-subscriptions = false

  # Subscription mode is either "cluster" or "server"
  subscription-mode = "server"

  # Which protocol to use for subscriptions
  # one of 'udp', 'http', or 'https'.
  subscription-protocol = "http"

  # Subscriptions resync time interval
  # Useful if you want to subscribe to new created databases
  # without restart Kapacitord
  subscriptions-sync-interval = "1m0s"

  # Override the global hostname option for this InfluxDB cluster.
  # Useful if the InfluxDB cluster is in a separate network and
  # needs special configuration to connect back to this Kapacitor instance.
  # Defaults to `hostname` if empty.
  kapacitor-hostname = ""

  # Override the global http port option for this InfluxDB cluster.
  # Useful if the InfluxDB cluster is in a separate network and
  # needs special configuration to connect back to this Kapacitor instance.
  # Defaults to the port from `[http] bind-address` if 0.
  http-port = 0

  # Host part of a bind address for UDP listeners.
  # For example if a UDP listener is using port 1234
  # and `udp-bind = "hostname_or_ip"`,
  # then the UDP port will be bound to `hostname_or_ip:1234`
  # The default empty value will bind to all addresses.
  udp-bind = ""
  # Subscriptions use the UDP network protocl.
  # The following options of for the created UDP listeners for each subscription.
  # Number of packets to buffer when reading packets off the socket.
  udp-buffer = 1000
  # The size in bytes of the OS read buffer for the UDP socket.
  # A value of 0 indicates use the OS default.
  udp-read-buffer = 0

  [influxdb.subscriptions]
    # Set of databases and retention policies to subscribe to.
    # If empty will subscribe to all, minus the list in
    # influxdb.excluded-subscriptions
    #
    # Format
    # db_name = <list of retention policies>
    #
    # Example:
    # my_database = [ "default", "longterm" ]
  [influxdb.excluded-subscriptions]
    # Set of databases and retention policies to exclude from the subscriptions.
    # If influxdb.subscriptions is empty it will subscribe to all
    # except databases listed here.
    #
    # Format
    # db_name = <list of retention policies>
    #
    # Example:
    # my_database = [ "default", "longterm" ]

# ...
```

### Internal configuration groups

Kapacitor includes configurable internal services that can be enabled or disabled.

- [Reporting](#reporting)
- [Stats](#stats)
- [Alert](#alert)

#### Reporting

Kapacitor will send usage statistics back to InfluxData.
Use the `[reporting]` group to disable, enable, and configure reporting.

```toml
# ...

[reporting]
  # Send usage statistics
  # every 12 hours to Enterprise.
  enabled = true
  url = "https://usage.influxdata.com"

#...
```

#### Stats

Kapacitor can output internal Kapacitor statistics to an InfluxDB database.
Use the `[stats]` group to configure the collection frequency and the database
to store statistics in.

```toml
# ...

[stats]
  # Emit internal statistics about Kapacitor.
  # To consume these stats, create a stream task
  # that selects data from the configured database
  # and retention policy.
  #
  # Example:
  #  stream|from().database('_kapacitor').retentionPolicy('autogen')...
  #
  enabled = true
  stats-interval = "10s"
  database = "_kapacitor"
  retention-policy= "autogen"

# ...
```

#### Alert
Use the `[alert]` group to globally configure alerts created by the 
[alertNode](/kapacitor/v1.6/nodes/alert_node).

```toml
# ...

[alert]
  # Persisting topics can become an I/O bottleneck under high load.
  # This setting disables them entirely.
  persist-topics = false

# ...
```

### Optional configuration groups

Optional table groupings are disabled by default and relate to specific features that can be leveraged by TICKscript nodes or used to discover and scrape information from remote locations.
In the default configuration, these optional table groupings may be commented out or include a key `enabled` set to `false` (i.e., `enabled = false`).
A feature defined by an optional table should be enabled whenever a relevant node or a handler for a relevant node is required by a task, or when an input source is needed.

Optional features include:

- [Event handlers](#event-handlers)
- [Docker services](#docker-services)
- [User defined functions (UDFs)](#user-defined-functions-udfs)
- [Input methods](#input-methods)
- [Service discovery and metric scraping](#service-discovery-and-metric-scraping)

#### Event handlers

Event handlers manage communications from Kapacitor to third party services or
across Internet standard messaging protocols.
They are activated through chaining methods on the [AlertNode](/kapacitor/v1.6/nodes/alert_node/).

Every event handler has the property `enabled`.
They also need an endpoint to send messages to.
Endpoints may include single properties (e.g, `url` and `addr`) or property pairs (e.g., `host` and `port`).
Most include an authentication mechanism such as a `token` or a pair of properties like `username` and `password`.

For information about available event handlers and their configuration options:

<a class="btn" href="/kapacitor/v1.6/event_handlers/">View available event handlers</a>

#### Docker services

Use Kapacitor to trigger changes in Docker clusters with [SwarmAutoScale](/kapacitor/v1.6/nodes/swarm_autoscale_node/)
and [K8sAutoScale](/kapacitor/v1.6/nodes/k8s_autoscale_node/) nodes.

- [Swarm](#swarm)
- [Kubernetes](#kubernetes)

##### Swarm
```toml
# ...
[[swarm]]
  # Enable/Disable the Docker Swarm service.
  # Needed by the swarmAutoscale TICKscript node.
  enabled = false
  # Unique ID for this Swarm cluster
  # NOTE: This is not the ID generated by Swarm rather a user defined
  # ID for this cluster since Kapacitor can communicate with multiple clusters.
  id = ""
  # List of URLs for Docker Swarm servers.
  servers = ["http://localhost:2376"]
  # TLS/SSL Configuration for connecting to secured Docker daemons
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  insecure-skip-verify = false
# ...
```
{{% caption %}}
See [SwarmAutoscaleNode](/kapacitor/v1.6/nodes/swarm_autoscale_node/).
{{% /caption %}}

##### Kubernetes
```toml
# ...
[kubernetes]
  # Enable/Disable the kubernetes service.
  # Needed by the k8sAutoscale TICKscript node.
  enabled = false
  # There are several ways to connect to the kubernetes API servers:
  #
  # Via the proxy, start the proxy via the `kubectl proxy` command:
  #   api-servers = ["http://localhost:8001"]
  #
  # From within the cluster itself, in which case
  # kubernetes secrets and DNS services are used
  # to determine the needed configuration.
  #   in-cluster = true
  #
  # Direct connection, in which case you need to know
  # the URL of the API servers,  the authentication token and
  # the path to the ca cert bundle.
  # These value can be found using the `kubectl config view` command.
  #   api-servers = ["http://192.168.99.100:8443"]
  #   token = "..."
  #   ca-path = "/path/to/kubernetes/ca.crt"
  #
  # Kubernetes can also serve as a discoverer for scrape targets.
  # In that case the type of resources to discoverer must be specified.
  # Valid values are: "node", "pod", "service", and "endpoint".
  #   resource = "pod"
# ...
```
{{% caption %}}
_See [K8sAutoScaleNode](/kapacitor/v1.6/nodes/k8s_autoscale_node/)._
{{% /caption %}}

#### User defined functions (UDFs)

Use Kapacitor to run user defined functions ([UDF](/kapacitor/v1.6/nodes/u_d_f_node/)),
as chaining methods in a TICKscript.
Define a UDF configuration group in your `kapacitor.conf` using the group
identifier pattern:

```toml
[udf.functions.udf_name]
```

A UDF configuration group requires the following properties:

| Property    | Description                         |    Value type    |
| :---------- | :---------------------------------- | :--------------: |
| **prog**    | Path to the executable             |      string      |
| **args**    | Arguments to pass to the executable | array of strings |
| **timeout** | Executable response timeout         |      string      |

Include environment variables in your UDF configuration group using the group pattern:

```
[udf.functions.udf_name.env]
```

##### Example UDF configuration

```toml
# ...
[udf]
# Configuration for UDFs (User Defined Functions)
  [udf.functions]
    # ...
    # Example Python UDF.
    # Use in TICKscript:
    #   stream.pyavg()
    #           .field('value')
    #           .size(10)
    #           .as('m_average')
    #
    [udf.functions.pyavg]
       prog = "/usr/bin/python2"
       args = ["-u", "./udf/agent/examples/moving_avg.py"]
       timeout = "10s"
       [udf.functions.pyavg.env]
           PYTHONPATH = "./udf/agent/py"
# ...
```

Additional examples can be found in the
[default configuration file](https://github.com/influxdata/kapacitor/blob/master/etc/kapacitor/kapacitor.conf).

#### Input methods

Use Kapacitor to receive and process data from data sources other than InfluxDB
and then write the results to InfluxDB.

The following sources (in addition to InfluxDB) are supported:

- [Collectd](#collectd): The POSIX daemon for collecting system, network, and service performance data.
- [Opentsdb](#opentsdb): The Open Time Series Database.
- [UDP](#user-datagram-protocol-udp): User datagram protocol.

Each input source has additional properties specific to its configuration.

##### Collectd
```toml
# ...
[collectd]
  enabled = false
  bind-address = ":25826"
  database = "collectd"
  retention-policy = ""
  batch-size = 1000
  batch-pending = 5
  batch-timeout = "10s"
  typesdb = "/usr/share/collectd/types.db"
# ...
```

{{< expand-wrapper >}}
{{% expand "View collectd configuration properties" %}}
| Property         | Description                                            | Value type |
| :--------------- | :----------------------------------------------------- | :--------: |
| enabled          | Enable or disable collectd                             |  boolean   |
| bind-address     | Address where Kapacitor will receive data              |   string   |
| database         | Database to write data to                              |   string   |
| retention-policy | Retention policy to write data to                      |   string   |
| batch-size       | Number of data points to buffer before writing         |  integer   |
| batch-pending    | Maximum number of batches to hold in memory as pending |  integer   |
| batch-timeout    | Time to wait before writing a batch                    |   string   |
{{% /expand %}}
{{< /expand-wrapper >}}

##### Opentsdb

```toml
# ...
[opentsdb]
  enabled = false
  bind-address = ":4242"
  database = "opentsdb"
  retention-policy = ""
  consistency-level = "one"
  tls-enabled = false
  certificate = "/etc/ssl/influxdb.pem"
  batch-size = 1000
  batch-pending = 5
  batch-timeout = "1s"
# ...
```

{{< expand-wrapper >}}
{{% expand "View Opentsdb configuration properties" %}}
| Property         | Description                                            | Value type |
| :--------------- | :----------------------------------------------------- | :--------: |
| enabled          | Enable or disable Opentsdb                             |  boolean   |
| bind-address     | Address where Kapacitor will receive data              |   string   |
| database         | Database to write data to                              |   string   |
| retention-policy | Retention policy to write data to                      |   string   |
| batch-size       | Number of data points to buffer before writing         |  integer   |
| batch-pending    | Maximum number of batches to hold in memory as pending |  integer   |
| batch-timeout    | Time to wait before writing a batch                    |   string   |
{{% /expand %}}
{{< /expand-wrapper >}}

##### User Datagram Protocol (UDP)
Use Kapacitor to collect raw data from a UDP connection.

```toml
# ...
[[udp]]
  enabled = true
  bind-address = ":9100"
  database = "game"
  retention-policy = "autogen"
# ...
```

{{< expand-wrapper >}}
{{% expand "View UDP configuration properties" %}}
| Property         | Description                                            | Value type |
| :--------------- | :----------------------------------------------------- | :--------: |
| enabled          | Enable or disable collectd                             |  boolean   |
| bind-address     | Address where Kapacitor will receive data              |   string   |
| database         | Database to write data to                              |   string   |
| retention-policy | Retention policy to write data to                      |   string   |
{{% /expand %}}
{{< /expand-wrapper >}}

For examples of using Kapacitor to collect raw UDP data, see:

- [Live Leaderboard](/kapacitor/v1.6/guides/live_leaderboard/)
- [Scores](https://github.com/influxdb/kapacitor/tree/master/examples/scores)

#### Service discovery and metric scraping

Kapacitor service discovery and metric scrapers let you discover and scrape metrics
from data sources at runtime.
This process is known as metric **scraping and discovery**.
For more information, see [Scraping and Discovery](/kapacitor/v1.6/pull_metrics/scraping-and-discovery/).

Use the `[[scraper]]` configuration group to configure scrapers and service discovery.
One scraper can be bound to one discovery service.

###### Example scraper configuration
```toml
# ...
[[scraper]]
  enabled = false
  name = "myscraper"
  # Specify the id of a discoverer service specified below
  discoverer-id = "goethe-ec2"
  # Specify the type of discoverer service being used.
  discoverer-service = "ec2"
  db = "prometheus_raw"
  rp = "autogen"
  type = "prometheus"
  scheme = "http"
  metrics-path = "/metrics"
  scrape-interval = "1m0s"
  scrape-timeout = "10s"
  username = "schwartz.pudel"
  password = "f4usT!1808"
  bearer-token = ""
  ssl-ca = ""
  ssl-cert = ""
  ssl-key = ""
  ssl-server-name = ""
  insecure-skip-verify = false
# ...
```

##### Discovery services

Kapacitor supports the following discovery services:

- Azure
- Consul
- DNS
- EC2
- File Discovery
- GCE
- Marathon
- Nerve
- ServerSet
- Static Discovery
- Triton
- UDP

Each discovery service has an `id` property used to bind the service to a scraper.
_To see configuration properties unique to each discovery service, see the
[sample Kapacitor configuration file](https://github.com/influxdata/kapacitor/blob/master/etc/kapacitor/kapacitor.conf)._

###### Example EC2 discovery service configuration

```toml
# ...
[[ec2]]
  enabled = false
  id = "goethe-ec2"
  region = "us-east-1"
  access-key = "ABCD1234EFGH5678IJKL"
  secret-key = "1nP00dl3N01rM4Su1v1Ju5qU3ch3ZM01"
  profile = "mph"
  refresh-interval = "1m0s"
  port = 80
# ...
```

## Kapacitor environment variables

Use environment variables to set global Kapacitor configuration settings or
override properties in the configuration file.

### Environment variables not in configuration file

| Environment variable    | Description                                                                        | Value type |
| :---------------------- | :--------------------------------------------------------------------------------- | :--------: |
| `KAPACITOR_OPTS`        | Options to pass to **systemd** when the `kapacitord` process is started by systemd |   string   |
| `KAPACITOR_CONFIG_PATH` | Path to the Kapacitor configuration file                                           |   string   |
| `KAPACITOR_URL`         | Kapacitor URL used by the `kapacitor` CLI                                          |   string   |
| `KAPACITOR_UNSAFE_SSL`  | Allow the `kapacitor` CLI to skep certificate verification when using SSL          |  boolean   |

### Map configuration properties to environment variables

Kapacitor-specific environment variables begin with the token `KAPACITOR`
followed by an underscore (`_`).
Properties then follow their path through the configuration file tree with each node in the tree separated by an underscore.
Dashes in configuration file identifiers are replaced with underscores.
Table groupings in table arrays are identified by integer tokens.

##### Example environment variable mappings
{{< keep-url >}}
```sh
# Set the skip-config-overrides configuration property
KAPACITOR_SKIP_CONFIG_OVERRIDES=false

# Set the value of the first URLs in the first InfluxDB configuration group
# [infludxb][0].[urls][0]
KAPACITOR_INFLUXDB_0_URLS_0=(http://localhost:8086)

# Set the value of the [storage].boltdb configuration property
KAPACITOR_STORAGE_BOLTDB=/var/lib/kapacitor/kapacitor.db

# Set the value of the authorization header in the first httpost configuration group
# [httppost][0].headers.{authorization:"some_value"}
KAPACITOR_HTTPPOST_0_HEADERS_Authorization=some_value

# Enable the Kubernetes service – [kubernetes].enabled
KAPACITOR_KUBERNETES_ENABLED=true
```

## Configuring with the HTTP API

Use the [Kapacitor HTTP API](/kapacitor/v1.6/working/api/) to override certain configuration properties.
This is helpful when a property may contain security sensitive information or
when you need to reconfigure a service without restarting Kapacitor.

To view which properties are configurable through the API, use the `GET` request
method with the `/kapacitor/v1/config` endpoint:

```sh
curl --request GET 'http://localhost:9092/kapacitor/v1/config'
```

{{% note %}}
To apply configuration overrides through the API, set the `[config-override].enabled`
property in your Kapacitor configuration file to `true`.
{{% /note %}}

### View configuration sections
Most Kapacitory configuration groups or sections can be viewed as JSON files by using
the `GET` request method appending the group identifier to the `/kapacitor/v1/config/` endpoint.
For example, to get the table groupings of InfluxDB properties:

```sh
curl --request GET 'http://localhost:9092/kapacitor/v1/config/influxdb'
```

{{% note %}}
Sensitive fields such as passwords, keys, and security tokens are redacted when
using the `GET` request method.
{{% /note %}}

### Modify configuration sections
Modify configuration properties by using the `POST` request method to send
a JSON document to the endpoint.
The JSON document must contain a `set` field with a map of the properties to override and
their new values.

##### Enable the SMTP configuration
```sh
curl --request POST 'http://localhost:9092/kapacitor/v1/config/smtp' \
  --data '{
    "set":{
        "enabled": true
    }
}'
```


To remove a configuration override, use the `POST` request method to send a JSON
document with a the `delete` field to the configuration endpoint.

##### Remove the SMTP configuration override
```sh
curl --request POST 'http://localhost:9092/kapacitor/v1/config/smtp' \
  --data '{
    "delete":[
        "enabled"
    ]
}'
```

For detailed information about how to override configurations with the Kapacitor API, see
[Overriding configurations](/kapacitor/v1.6/working/api/#overriding-configurations).
