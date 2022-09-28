---
title: Enable TLS encryption
seotitle: Enable TLS/SSL encryption
description: >
  Enable Transport Layer Security (TLS) and use the HTTPS protocol to secure communication between clients and InfluxDB.
weight: 101
menu:
  influxdb_2_0:
    parent: Security & authorization
influxdb/v2.0/tags: [security, authentication, tls, https, ssl]
products: [oss]
---

Enabling TLS encrypts the communication between clients and the InfluxDB server.
When configured with a signed certificate, TLS also allows clients to verify the authenticity of the InfluxDB server.

To set up TLS over HTTPS, do the following:

- [Obtain requirements](#obtain-requirements)
- [Configure InfluxDB to use TLS](#configure-influxdb-to-use-tls)

{{% warn %}}
InfluxData **strongly recommends** enabling HTTPS, especially if you plan on sending requests to InfluxDB over a network.
{{% /warn %}}

## Obtain requirements

To enable HTTPS with InfluxDB, you need a Transport Layer Security (TLS) certificate, also known as a Secured Sockets Layer (SSL) certificate.
InfluxDB supports three types of TLS certificates:

* **Single domain certificates signed by a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority)**

    Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    These certificates are signed and issued by a trusted, third-party Certificate Authority (CA).
    With this certificate option, every InfluxDB instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    Wildcard certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxDB instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are _not_ signed by a trusted, third-party CA.
    Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
    They do not allow clients to verify the identity of the InfluxDB server.
    With this certificate option, every InfluxDB instance requires a unique self-signed certificate.
    You can generate a self-signed certificate on your own machine.

<!-- InfluxDB supports certificates composed of a private key file (`.key`) and a signed certificate file (`.crt`) file pair, -->
<!-- as well as certificates that combine the private key file and the signed certificate file into a single bundled file (`.pem`). -->

## Configure InfluxDB to use TLS

1. **Download or generate certificate files**

    If using a certificate provided by a CA, follow their instructions to download the certificate files.

    If using a self-signed certificate, use the `openssl` utility to create a certificate.

    The following command generates a private key file (.key) and a self-signed certificate file (.crt) with required permissions
    and saves them to `/etc/ssl/`.
    (Other paths will also work.)
    Files remain valid for the specified `NUMBER_OF_DAYS`.

    ```sh
    sudo openssl req -x509 -nodes -newkey rsa:2048 \
      -keyout /etc/ssl/influxdb-selfsigned.key \
      -out /etc/ssl/influxdb-selfsigned.crt \
      -days <NUMBER_OF_DAYS>
    ```

    The command will prompt you for more information.
    You can choose to fill out these fields or leave them blank; both actions generate valid certificate files.

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
    --tls-cert="<path-to-crt>" \
    --tls-key="<path-to-key>"
    ```

4. **Verify TLS connection**


    Ensure you can connect over HTTPS by running

    ```
    curl -v https://localhost:8086/api/v2/ping
    ```

    If using a self-signed certificate, use the `-k` flag to skip certificate verification:

    ```
    curl -vk https://localhost:8086/api/v2/ping
    ```

    With this command, you should see output confirming a succussful TLS handshake.

You can further configure TLS settings using 
[`tls-min-version`](/influxdb/v2.0/reference/config-options/#tls-min-version)
and
[`tls-strict-ciphers`](/influxdb/v2.0/reference/config-options/#tls-strict-ciphers).

## Connect Telegraf to a secured InfluxDB instance

To connect [Telegraf](/{{< latest "telegraf" >}}/) to an InfluxDB 2.0 instance with TLS enabled,
update the following `influxdb_v2` output settings in your Telegraf configuration file:

- Update URLs to use HTTPS instead of HTTP.
- If using a self-signed certificate, uncomment and set `insecure_skip_verify` to `true`.

### Example configuration

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
  urls = ["https://127.0.0.1:8086"]

  [...]

  ## Optional TLS Config for use on HTTP connections.
  [...]
  ## Use TLS but skip chain & host verification
  insecure_skip_verify = true
```

Restart Telegraf using the updated configuration file.
