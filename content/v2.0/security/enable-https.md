---
title: Enable HTTPS with InfluxDB
description: >
  Enable Transport Layer Security (TLS) and use the HTTPS protocol to secure communication between clients and InfluxDB.
weight: 101
menu:
  v2_0:
    name: Enable HTTPS
    parent: Security & authorization
v2.0/tags: [security, authentication, tls, https, ssl]
---

Enabling HTTPS encrypts the communication between clients and the InfluxDB server.
When configured with a signed certificate, HTTPS can also verify the authenticity of the InfluxDB server to connecting clients.

{{% warn %}}
InfluxData [strongly recommends](/influxdb/v1.7/administration/security/) enabling HTTPS, especially if you plan on sending requests to InfluxDB over a network.
{{% /warn %}}

## Requirements

To enable HTTPS with InfluxDB, you need a Transport Layer Security (TLS) certificate (also known as a Secured Sockets Layer (SSL) certificate).
InfluxDB supports three types of TLS certificates:

### Single domain certificates signed by a Certificate Authority

Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
With this certificate option, every InfluxDB instance requires a unique single domain certificate.

### Wildcard certificates signed by a Certificate Authority

Wildcard certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
Wildcard certificates can be used across multiple InfluxDB instances on different servers.

### Self-signed certificates

Self-signed certificates are _not_ signed by a Certificate Authority (CA).
Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
They do not allow clients to verify the identity of the InfluxDB server.
With this certificate option, every InfluxDB instance requires a unique self-signed certificate.
You can generate a self-signed certificate on your own machine.

<!-- InfluxDB supports certificates composed of a private key file (`.key`) and a signed certificate file (`.crt`) file pair, -->
<!-- as well as certificates that combine the private key file and the signed certificate file into a single bundled file (`.pem`). -->

## Set up HTTPS with a CA-signed certificate

1. **Install the certificate**

    Place the private key file (`.key`) and the signed certificate file (`.crt`) in the `/etc/ssl/` directory.

2. **Set certificate file permissions**

    The user running InfluxDB must have read permissions on the TLS certificate.

    {{% note %}}You may opt to set up multiple users, groups, and permissions.
    Ultimately, make sure all users running InfluxDB have read permissions for the TLS certificate.
    {{% /note %}}

    Run the following command to give InfluxDB read and write permissions on the certificate files.

    ```bash
    sudo chmod 644 /etc/ssl/<CA-certificate-file>
    sudo chmod 600 /etc/ssl/<private-key-file>
    ```

3. **Run `influxd` with TLS flags**

    Start InfluxDB with TLS command line flags:

    ```bash
    influxd \
    --tls-cert "/etc/ssl/influxdb-selfsigned.crt"\
    --tls-key "/etc/ssl/influxdb-selfsigned.key"
    ```

That's it! You've successfully set up HTTPS with InfluxDB.

## Set up HTTPS with a self-signed certificate

1. **Generate a self-signed certificate**

    The following command generates a private key file (`.key`) and a self-signed
    certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.
    It outputs those files to `/etc/ssl/` and gives them the required permissions.

    ```bash
    sudo openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout /etc/ssl/influxdb-selfsigned.key \
    -out /etc/ssl/influxdb-selfsigned.crt \
    -days <NUMBER_OF_DAYS>
    ```

    When you execute the command, it will prompt you for more information.
    You can choose to fill out that information or leave it blank; both actions generate valid certificate files.

2. **Run `influxd` with TLS flags**

    Start InfluxDB with TLS command line flags:

    ```bash
    influxd \
    --tls-cert "/etc/ssl/influxdb-selfsigned.crt" \
    --tls-key "/etc/ssl/influxdb-selfsigned.key"
    ```

That's it! You've successfully set up HTTPS with InfluxDB.

## Connect Telegraf to a secured InfluxDB instance

Connecting [Telegraf](/telegraf/latest/) to an InfluxDB instance that's using
HTTPS requires some additional steps.

In the Telegraf configuration file (`/etc/telegraf/telegraf.conf`), edit the `urls`
setting to indicate `https` instead of `http`.
(Change `localhost` to the relevant domain name if necessary.)
If you're using a self-signed certificate, uncomment the `insecure_skip_verify` setting and set it to `true`.

```toml
###############################################################################
#                            OUTPUT PLUGINS                                   #
###############################################################################

# Configuration for sending metrics to InfluxDB
[[outputs.influxdb_v2]]
  ## The URLs of the InfluxDB cluster nodes.
  ##
  ## Multiple URLs can be specified for a single cluster, only ONE of the
  ## urls will be written to each interval.
  urls = ["http://127.0.0.1:9999"]

  [...]

  ## Optional TLS Config for use on HTTP connections.
  [...]
  ## Use TLS but skip chain & host verification
  insecure_skip_verify = true
```


Restart Telegraf using the updated configuration file.
