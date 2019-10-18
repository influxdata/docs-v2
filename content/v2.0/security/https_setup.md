---
title: Enabling HTTPS with InfluxDB
description: >
  Enable HTTPS and Transport Security Layer (TLS) secure communication between clients and your InfluxDB servers.
weight: 201
menu:
  v2_0:
    name: Enabling HTTPS
    parent: Security & authorization
v2.0/tags: [security, authentication, tls]
---

Enabling HTTPS encrypts the communication between clients and the InfluxDB server.
When configured with a signed certificate, HTTPS can also verify the authenticity of the InfluxDB server to connecting clients.

InfluxData [strongly recommends](/influxdb/v1.7/administration/security/) enabling HTTPS, especially if you plan on sending requests to InfluxDB over a network.

## Requirements

To enable HTTPS with InfluxDB, you'll need an existing or new InfluxDB instance
and a Transport Layer Security (TLS) certificate (also known as a Secured Sockets Layer (SSL) certificate).

InfluxDB supports three types of TLS certificates:

* **Single domain certificates signed by a Certificate Authority**

    Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    With this certificate option, every InfluxDB instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    Wildcard certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxDB instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are _not_ signed by a Certificate Authority (CA).
    [Generate a self-signed certificate]((#step-1-generate-a-self-signed-certificate)) on your own machine.
    Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
    They do not allow clients to verify the identity of the InfluxDB server.
    With this certificate option, every InfluxDB instance requires a unique self-signed certificate.

<!-- InfluxDB supports certificates composed of a private key file (`.key`) and a signed certificate file (`.crt`) file pair, -->
<!-- as well as certificates that combine the private key file and the signed certificate file into a single bundled file (`.pem`). -->

The following two sections outline how to set up HTTPS with InfluxDB
[using a CA-signed certificate](#set-up-https-with-a-ca-signed-certificate)
and [using a self-signed certificate](#set-up-https-with-a-self-signed-certificate).

## Set up HTTPS with a CA-signed certificate

1. **Install the certificate**

    Place the private key file (`.key`) and the signed certificate file (`.crt`) in the `/etc/ssl/` directory.

2. **Set certificate file permissions**

    Users running InfluxDB must have read permissions on the TLS certificate.

    {{% note %}}You may opt to set up multiple users, groups, and permissions.
    Ultimately, make sure all users running InfluxDB have read permissions for the TLS certificate.
    {{% /note %}}

    Run the following command to give InfluxDB read and write permissions on the certificate files.

    ```bash
    sudo chmod 644 /etc/ssl/<CA-certificate-file>
    sudo chmod 600 /etc/ssl/<private-key-file>
    ```

3. **Run `influxd` with TLS flags**

    TODO

4. **Verify the HTTPS setup**

    Verify that HTTPS is working by connecting to InfluxDB with the [CLI tool](/influxdb/v1.7/tools/shell/):

    ```bash
    influx -ssl -host <domain_name>.com
    ```

    A successful connection returns the following:

    ```bash
    Connected to https://<domain_name>.com:8086 version 1.x.x
    InfluxDB shell version: 1.x.x
    >
    ```

That's it! You've successfully set up HTTPS with InfluxDB.

## Set up HTTPS with a self-signed certificate

1. **Generate a self-signed certificate**

    The following command generates a private key file (`.key`) and a self-signed
    certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.
    It outputs those files to `/etc/ssl/` and gives them the required permissions.

    ```bash
    sudo openssl req -x509 -nodes -newkey rsa:2048 -keyout /etc/ssl/influxdb-selfsigned.key -out /etc/ssl/influxdb-selfsigned.crt -days <NUMBER_OF_DAYS>
    ```

    When you execute the command, it will prompt you for more information.
    You can choose to fill out that information or leave it blank; both actions generate valid certificate files.
    
2. **Run `influxd` with TLS flags**
   
   Start InfluxDB with TLS command line flags:
   
   ```bash
   influxd --tls-cert "/etc/ssl/influxdb-selfsigned.crt" --tls-key "/etc/ssl/influxdb-selfsigned.key"
   ```
   
3. Verify the HTTPS setup

    Verify that HTTPS is working by connecting to InfluxDB with the [CLI tool](/influxdb/v1.7/tools/shell/):

    ```bash
    influx -ssl -unsafeSsl -host <domain_name>.com
    ```

    A successful connection returns the following:

    ```bash
    Connected to https://<domain_name>.com:8086 version 1.x.x
    InfluxDB shell version: 1.x.x
    >
    ```

That's it! You've successfully set up HTTPS with InfluxDB.

## Connect Telegraf to a secured InfluxDB instance

Connecting [Telegraf](/telegraf/latest/) to an InfluxDB instance that's using
HTTPS requires some additional steps.

In the Telegraf configuration file (`/etc/telegraf/telegraf.conf`), edit the `urls`
setting to indicate `https` instead of `http` and change `localhost` to the
relevant domain name.
If you're using a self-signed certificate, uncomment the `insecure_skip_verify`
setting and set it to `true`.

```toml
    ###############################################################################
    #                            OUTPUT PLUGINS                                   #
    ###############################################################################
>
    # Configuration for InfluxDB server to send metrics to
    [[outputs.influxdb]]
      ## The full HTTP or UDP endpoint URL for your InfluxDB instance.
      ## Multiple urls can be specified as part of the same cluster,
      ## this means that only ONE of the urls will be written to each interval.
      # urls = ["udp://localhost:8089"] # UDP endpoint example
      urls = ["https://<domain_name>.com:8086"]
>
    [...]
>
      ## Optional SSL Config
      [...]
      insecure_skip_verify = true # <-- Update only if you're using a self-signed certificate
```

Next, restart Telegraf and you're all set!
