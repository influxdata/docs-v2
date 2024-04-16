---
title: Enable TLS encryption
seotitle: Enable TLS/SSL encryption
description: >
  Enable Transport Layer Security (TLS) and use the HTTPS protocol to secure communication between clients and InfluxDB.
weight: 101
menu:
  influxdb_v2:
    parent: Manage security
influxdb/v2/tags: [security, authentication, tls, https, ssl]
aliases:
  - /influxdb/v2/security/enable-tls/
---

Enabling TLS encrypts the communication between clients and the InfluxDB server.
When configured with a signed certificate, TLS also allows clients to verify the authenticity of the InfluxDB server.

To set up TLS over HTTPS, do the following:

- [Obtain requirements](#obtain-requirements)
  - [Single domain certificates signed by a Certificate Authority (CA)](#single-domain-certificates-signed-by-a-certificate-authority-ca)
  - [Wildcard certificates signed by a Certificate Authority](#wildcard-certificates-signed-by-a-certificate-authority)
  - [Self-signed certificates](#self-signed-certificates)
- [Configure InfluxDB to use TLS](#configure-influxdb-to-use-tls)
- [Connect Telegraf to a secured InfluxDB instance](#connect-telegraf-to-a-secured-influxdb-instance)
  - [Example configuration](#example-configuration)

{{% warn %}}
InfluxData **strongly recommends** enabling HTTPS, especially if you plan on sending requests to InfluxDB over a network.
{{% /warn %}}

## Obtain requirements

To enable HTTPS with InfluxDB, you need a Transport Layer Security (TLS) certificate, also known as a Secured Sockets Layer (SSL) certificate.
InfluxDB supports three types of TLS certificates:

### Single domain certificates signed by a Certificate Authority (CA)

Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
These certificates are signed and issued by a trusted, third-party [Certificate Authority (CA)](https://en.wikipedia.org/wiki/Certificate_authority).
With this certificate option, every InfluxDB instance requires a unique single domain certificate.

### Wildcard certificates signed by a Certificate Authority

Wildcard certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
Wildcard certificates can be used across multiple InfluxDB instances on different servers.

### Self-signed certificates

Self-signed certificates are _not_ signed by a trusted, third-party CA.
Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
They do not allow clients to verify the identity of the InfluxDB server.
With this certificate option, every InfluxDB instance requires a unique self-signed certificate.
You can generate a self-signed certificate on your own machine.

<!-- InfluxDB supports certificates composed of a private key file (`.key`) and a signed certificate file (`.crt`) file pair, -->
<!-- as well as certificates that combine the private key file and the signed certificate file into a single bundled file (`.pem`). -->

## Configure InfluxDB to use TLS

1. **Download or generate certificate files**

    If using a [certificate signed by a CA](#single-domain-certificates-signed-by-a-certificate-authority-ca), follow their instructions to download and install the certificate files.
    Note the location where certificate files are installed, and then continue to [set certificate file permissions](#set-certificate-file-permissions).

    {{% note %}}
 #### Where are my certificates?

 The location of your certificate files depends on your system, domain, and certificate authority.

 For example, if [Let's Encrypt](https://letsencrypt.org/) is your CA and you use [certbot](https://certbot.eff.org/) to install certificates, the default location is
 `/etc/letsencrypt/live/$domain`. For more information about Let's Encrypt certificate paths, see [Where are my certificates?](https://eff-certbot.readthedocs.io/en/latest/using.html#where-are-my-certificates)
    {{% /note %}}

    To generate [self-signed certificates](#self-signed-certificates), use the `openssl` command on your system.

    The following example shows how to generate certificates located in `/etc/ssl`.
    Files remain valid for the specified `NUMBER_OF_DAYS`.
    The `openssl` command prompts you for optional fields that you can fill out or leave blank; both actions generate valid certificate files.

    ```bash
    sudo openssl req -x509 -nodes -newkey rsa:2048 \
      -keyout /etc/ssl/influxdb-selfsigned.key \
      -out /etc/ssl/influxdb-selfsigned.crt \
      -days <NUMBER_OF_DAYS>
    ```

1. **Set certificate file permissions**
   <span id="set-certificate-file-permissions"><span>

    The user running InfluxDB must have read permissions on the TLS certificate files.

    {{% note %}}You may opt to set up multiple users, groups, and permissions.
    Ultimately, make sure all users running InfluxDB have read permissions for the TLS certificate.
    {{% /note %}}

    In your terminal, run `chmod` to set permissions on your installed certificate files--for example:

    ```bash
    sudo chmod 644 <path/to/crt>
    sudo chmod 600 <path/to/key>
    ```

    The following example shows how to set read permissions on the self-signed certificate files saved in `/etc/ssl`:

    ```bash
    sudo chmod 644 /etc/ssl/influxdb-selfsigned.crt
    sudo chmod 600 /etc/ssl/influxdb-selfsigned.key
    ```

2. **Run `influxd` with TLS flags**

    Start InfluxDB with TLS command line flags:

    ```bash
    influxd \
    --tls-cert="<path-to-crt>" \
    --tls-key="<path-to-key>"
    ```

3. **Verify TLS connection**

    To test your certificates, access InfluxDB using the `https://` protocol--for example, using cURL:

    ```bash
    curl --verbose https://localhost:8086/api/v2/ping
    ```

    If using a self-signed certificate, skip certificate verification--for example, in a cURL command,
    pass the `-k, --insecure` flag:

    ```bash
    curl --verbose --insecure https://localhost:8086/api/v2/ping
    ```

    If successful, the `curl --verbose` output shows a TLS handshake--for example:

    ```bash
    * [CONN-0-0][CF-SSL] TLSv1.3 (IN), TLS handshake
    ```

You can further configure TLS settings using
[`tls-min-version`](/influxdb/v2/reference/config-options/#tls-min-version)
and
[`tls-strict-ciphers`](/influxdb/v2/reference/config-options/#tls-strict-ciphers).

## Connect Telegraf to a secured InfluxDB instance

To connect [Telegraf](/telegraf/v1/) to an InfluxDB {{< current-version >}} instance with TLS enabled,
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
