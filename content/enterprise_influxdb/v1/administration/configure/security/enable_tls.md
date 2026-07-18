---
title: Configure HTTPS over TLS
description: >
  Enabling HTTPS over TLS encrypts the communication between clients and the InfluxDB Enterprise v1 server, and between nodes in the cluster.
menu:
  enterprise_influxdb_v1:
    name: Configure TLS for cluster
    parent: Configure security
weight: 20
aliases:
  - /enterprise_influxdb/v1/guides/https_setup/
  - /enterprise_influxdb/v1/guides/enable_tls/
  - /enterprise_influxdb/v1/guides/enable-tls/
---

Enabling HTTPS over TLS encrypts the communication between clients and the InfluxDB Enterprise server, and between nodes in the cluster.
When configured with a signed certificate, HTTPS over TLS can also verify the authenticity of the InfluxDB Enterprise server to connecting clients.

This pages outlines how to set up HTTPS with InfluxDB Enterprise using either a signed or self-signed certificate.
It also describes how to enable [mutual TLS (mTLS)](#enable-mutual-tls-mtls) so that both ends of each connection authenticate each other.

{{% warn %}}
InfluxData **strongly recommends** enabling HTTPS, especially if you plan on sending requests to InfluxDB Enterprise over a network.
{{% /warn %}}

{{% note %}}
These steps have been tested on Debian-based Linux distributions.
Specific steps may vary on other operating systems.
{{% /note %}}

## Requirements

To enable HTTPS with InfluxDB Enterprise, you need a Transport Layer Security (TLS) certificate, also known as a Secured Sockets Layer (SSL) certificate.
InfluxDB supports three types of TLS certificates:

* **Single domain certificates signed by a [Certificate Authority](https://en.wikipedia.org/wiki/Certificate_authority)**

    Single domain certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    These certificates are signed and issued by a trusted, third-party Certificate Authority (CA).
    With this certificate option, every InfluxDB instance requires a unique single domain certificate.

* **Wildcard certificates signed by a Certificate Authority**

    These certificates provide cryptographic security to HTTPS requests and allow clients to verify the identity of the InfluxDB server.
    Wildcard certificates can be used across multiple InfluxDB Enterprise instances on different servers.

* **Self-signed certificates**

    Self-signed certificates are _not_ signed by a trusted, third-party CA.
    Unlike CA-signed certificates, self-signed certificates only provide cryptographic security to HTTPS requests.
    They do not allow clients to verify the identity of the InfluxDB server.
    With this certificate option, every InfluxDB Enterprise instance requires a unique self-signed certificate.
    You can generate a self-signed certificate on your own machine.

Regardless of your certificate's type, InfluxDB Enterprise supports certificates composed of
a private key file (`.key`) and a signed certificate file (`.crt`) file pair, as well as certificates
that combine the private key file and the signed certificate file into a single bundled file (`.pem`).

In general, each node should have its own certificate, whether signed or unsigned.

## Set up HTTPS in an InfluxDB Enterprise cluster

1. **Download or generate certificate files.**

    If using a certificate provided by a CA, follow their instructions to download the certificate files.

    {{% note %}}
If using one or more self-signed certificates, use the `openssl` utility to create a certificate.
The following command generates a private key file (`.key`) and a self-signed
certificate file (`.crt`) which remain valid for the specified `NUMBER_OF_DAYS`.

```sh
sudo openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout influxdb-selfsigned.key \
  -out influxdb-selfsigned.crt \
  -days <NUMBER_OF_DAYS>
```

The command will prompt you for more information.
You can choose to fill out these fields or leave them blank; both actions generate valid certificate files.

In subsequent steps, you will need to copy the certificate and key (or `.pem` file) to each node in the cluster.
    {{% /note %}}

2. **Install the SSL/TLS certificate in each node.**

    Place the private key file (`.key`) and the signed certificate file (`.crt`)
    or the single bundled file (`.pem`)
    in the `/etc/ssl/` directory of each meta node and data node.

    {{% note %}}
Some Certificate Authorities provide certificate files with other extensions.
Consult your CA if you are unsure about how to use these files.
    {{% /note %}}

3. **Ensure file permissions for each node.**

    Certificate files require read and write access by the `influxdb` user.
    Ensure that you have the correct file permissions in each meta node and data node by running the following commands:

    ```sh
    sudo chown influxdb:influxdb /etc/ssl/
    sudo chmod 644 /etc/ssl/<CA-certificate-file>
    sudo chmod 600 /etc/ssl/<private-key-file>
    ```

4. **Enable HTTPS within the configuration file for each meta node.**

    Enable HTTPS for each meta node within the `[meta]` section of the meta node configuration file (`influxdb-meta.conf`) by setting:

    ```toml
    [meta]

     [...]

      # Determines whether HTTPS is enabled.
      https-enabled = true

      # The SSL certificate to use when HTTPS is enabled.
      https-certificate = "influxdb-meta.crt"

      # Use a separate private key location.
      https-private-key = "influxdb-meta.key"

      # If using a self-signed certificate:
      https-insecure-tls = true

      # Use TLS when communicating with data notes
      data-use-tls = true
      data-insecure-tls = true

    ```

5. **Enable HTTPS within the configuration file for each data node.**

    Make the following sets of changes in the configuration file (`influxdb.conf`) on each data node:
    1. Enable HTTPS for each data node within the `[http]` section of the configuration file by setting:
       ```toml
       [http]

         [...]

          # Determines whether HTTPS is enabled.
          https-enabled = true

          [...]

          # The SSL certificate to use when HTTPS is enabled.
          https-certificate = "influxdb-data.crt"

          # Use a separate private key location.
          https-private-key = "influxdb-data.key"
       ```
    2. Configure the data nodes to use HTTPS when communicating with other data nodes.
       In the `[cluster]` section of the configuration file, set the following:
       ```toml
       [cluster]

         [...]

         # Determines whether data nodes use HTTPS to communicate with each other.
         https-enabled = true

         # The SSL certificate to use when HTTPS is enabled.
         https-certificate = "influxdb-data.crt"

         # Use a separate private key location.
         https-private-key = "influxdb-data.key"

         # If using a self-signed certificate:
         https-insecure-tls = true
       ```
    3. Configure the data nodes to use HTTPS when communicating with the meta nodes.
       In the `[meta]` section of the configuration file, set the following:
       ```toml
       [meta]

         [...]
           meta-tls-enabled = true

           # If using a self-signed certificate:
           meta-insecure-tls = true
       ```
6. **Restart InfluxDB Enterprise.**

    Restart the InfluxDB Enterprise processes for the configuration changes to take effect:

    ```sh
    sudo systemctl restart influxdb-meta
    ```

    Restart the InfluxDB Enterprise data node processes for the configuration changes to take effect:

    ```sh
    sudo systemctl restart influxdb
    ```

7. **Verify the HTTPS setup.**

    Verify that HTTPS is working on the meta nodes by using `influxd-ctl`.

    ```sh
    influxd-ctl -bind-tls show
    ```

    If using a self-signed certificate, use:

    ```sh
    influxd-ctl -bind-tls -k show
    ```

    {{% warn %}}
Once you have enabled HTTPS, you must use `-bind-tls` in order for `influxd-ctl` to connect to the meta node.
With a self-signed certificate, you must also use the `-k` option to skip certificate verification.
    {{% /warn %}}

    A successful connection returns output which should resemble the following:

    ```
    Data Nodes
    ==========
    ID   TCP Address               Version
    4    enterprise-data-01:8088   1.x.y-c1.x.y
    5    enterprise-data-02:8088   1.x.y-c1.x.y

    Meta Nodes
    ==========
    TCP Address               Version
    enterprise-meta-01:8091   1.x.y-c1.x.z
    enterprise-meta-02:8091   1.x.y-c1.x.z
    enterprise-meta-03:8091   1.x.y-c1.x.z
    ```

    Next, verify that HTTPS is working by connecting to InfluxDB Enterprise with the [`influx` command line interface](/enterprise_influxdb/v1/tools/influx-cli/use-influx/):

    ```sh
    influx -ssl -host <domain_name>.com
    ```

    If using a self-signed certificate, use

    ```sh
    influx -ssl -unsafeSsl -host <domain_name>.com
    ```

    A successful connection returns the following:

    ```sh
    Connected to https://<domain_name>.com:8086 version 1.x.y
    InfluxDB shell version: 1.x.y
    >
    ```

    That's it! You've successfully set up HTTPS with InfluxDB Enterprise.

## Enable mutual TLS (mTLS) {metadata="v1.13.0+"}

With standard HTTPS, only the server presents a certificate and the client verifies it.
**Mutual TLS (mTLS)** additionally requires the _client_ to present a certificate that the _server_ verifies, so both ends of every connection authenticate each other.

In an InfluxDB Enterprise cluster, you can require mTLS on:

- **Inter-node connections**: meta-to-meta, meta-to-data, and data-to-data traffic.
- **HTTP API connections**: clients such as the [`influx` CLI](/enterprise_influxdb/v1/tools/influx-cli/use-influx/), `influxd-ctl`, and Telegraf connecting to the data node or meta node API.

{{% note %}}
mTLS options require **InfluxDB Enterprise v1.13.0+** and build on the HTTPS
configuration described above.
Complete [Set up HTTPS](#set-up-https-in-an-influxdb-enterprise-cluster) before
enabling mTLS.

Creating the certificates, private keys, and CA files needed for mTLS is outside
the scope of this guide.
The following steps assume you already have a CA certificate (for example,
`/etc/ssl/cluster-ca.crt`) that signed each node's certificate, plus the server
certificate and key installed on each node.
{{% /note %}}

### How mTLS settings map to connections

Each node acts as both a **server** (accepting connections) and a **client**
(dialing other nodes), so configure mTLS from both perspectives.

| Role              | Purpose                                                        | Settings                                          |
| :---------------- | :------------------------------------------------------------ | :------------------------------------------------ |
| Server (listener) | Require and verify certificates from connecting clients       | `*-client-auth-type`, `*-client-ca`               |
| Client (dialer)   | Present a certificate to the servers this node dials          | `*-client-certificate`, `*-client-private-key`    |
| Client (dialer)   | Verify the server certificates of the servers this node dials | `*-root-ca` (`meta-root-ca` for meta connections) |

{{% note %}}
If you don't set a separate client certificate (`*-client-certificate`), the node
presents its server certificate (`https-certificate`) when dialing peers.
Set a separate client certificate only if you use distinct certificates for the
client and server roles.
{{% /note %}}

Set `*-client-auth-type` to one of the following:

| Value                        | Behavior                                                             |
| :--------------------------- | :------------------------------------------------------------------ |
| `NoClientCert`               | Don't request a client certificate (mTLS disabled).                 |
| `RequestClientCert`          | Request a certificate, but don't require or verify it.              |
| `RequireAnyClientCert`       | Require a certificate, but don't verify it against a CA.            |
| `VerifyClientCertIfGiven`    | Verify the certificate against the CA only if one is presented.     |
| `RequireAndVerifyClientCert` | Require and verify a certificate against the CA (enforced mTLS).    |

The CA settings (`*-client-ca` and `*-root-ca`) are inline tables:

- `paths`: list of PEM files whose certificates are trusted
- `include-system` _(optional)_: if `true`, also trust the host's system CA pool (default is `false`)

### Configure mTLS on meta nodes

In the `[meta]` section of each meta node configuration file (`influxdb-meta.conf`),
add the following to the [HTTPS settings you already configured](#set-up-https-in-an-influxdb-enterprise-cluster):

```toml
[meta]

  [...]

  # Require and verify a certificate from peers that connect to this meta node
  # (applies to both the HTTP API and raft/data listeners).
  https-client-auth-type = "RequireAndVerifyClientCert"

  # CA used to verify certificates presented by connecting peers.
  https-client-ca = { paths = ["/etc/ssl/cluster-ca.crt"] }

  # CA used to verify the server certificates of the peers this meta node dials
  # (other meta nodes and data nodes).
  https-root-ca = { paths = ["/etc/ssl/cluster-ca.crt"] }

  # Optional: present a separate client certificate when dialing peers.
  # If unset, the meta node presents `https-certificate` and `https-private-key`.
  # https-client-certificate = "/etc/ssl/influxdb-meta-client.crt"
  # https-client-private-key = "/etc/ssl/influxdb-meta-client.key"
```

{{% note %}}
When you verify peer server certificates with `https-root-ca`, you no longer need
`https-insecure-tls` or `data-insecure-tls` to skip verification.
Remove those settings (or leave them `false`) to keep server verification enabled.
{{% /note %}}

### Configure mTLS on data nodes

In the data node configuration file (`influxdb.conf`), configure mTLS for each
type of connection.

#### Inter-data-node connections `[cluster]`

```toml
[cluster]

  [...]

  # Require and verify a certificate from peer data nodes that connect to this
  # node's cluster listener.
  https-client-auth-type = "RequireAndVerifyClientCert"

  # CA used to verify certificates presented by connecting peer data nodes.
  https-client-ca = { paths = ["/etc/ssl/cluster-ca.crt"] }

  # CA used to verify the server certificates of peer data nodes this node dials.
  https-root-ca = { paths = ["/etc/ssl/cluster-ca.crt"] }

  # Optional: present a separate client certificate when dialing peers.
  # If unset, the data node presents `https-certificate` and `https-private-key`.
  # https-client-certificate = "/etc/ssl/influxdb-data-client.crt"
  # https-client-private-key = "/etc/ssl/influxdb-data-client.key"
```

#### Data-node-to-meta-node connections `[meta]`

```toml
[meta]

  [...]

  meta-tls-enabled = true

  # Client certificate this data node presents to meta nodes (mTLS).
  # If unset, no client certificate is presented.
  meta-client-certificate = "/etc/ssl/influxdb-data.crt"
  meta-client-private-key  = "/etc/ssl/influxdb-data.key"

  # CA used to verify the server certificates of the meta nodes this data node dials.
  meta-root-ca = { paths = ["/etc/ssl/cluster-ca.crt"] }
```

#### HTTP API connections `[http]`

To require client certificates from clients that connect to the data node HTTP API
(for example, the `influx` CLI and Telegraf), configure the `[http]` section:

```toml
[http]

  [...]

  # Require and verify a client certificate for HTTP API connections.
  https-client-auth-type = "RequireAndVerifyClientCert"

  # CA used to verify client certificates.
  https-client-ca = { paths = ["/etc/ssl/client-ca.crt"] }
```

{{% warn %}}
Requiring client certificates on the HTTP API (`[http] https-client-auth-type`)
means **every** HTTP API client must present a valid certificate.
Before enabling this setting, ensure all clients&mdash;including the `influx` CLI,
Telegraf, and your applications&mdash;are configured to present a client certificate.
{{% /warn %}}

### Apply the configuration

If you're enabling HTTPS and mTLS at the same time, restart each node as described
in [Set up HTTPS](#set-up-https-in-an-influxdb-enterprise-cluster):

```sh
sudo systemctl restart influxdb-meta
sudo systemctl restart influxdb
```

If HTTPS is already enabled and you're only adding or changing mTLS settings
(client authentication type, CA pools, or certificates), you can apply the
changes without a restart by reloading each process with `SIGHUP`:

```sh
sudo systemctl reload influxdb-meta
sudo systemctl reload influxdb
```

{{% note %}}
Enabling or disabling HTTPS (`https-enabled`) always requires a restart.
Only certificate, CA pool, and client-authentication changes can be applied with
`SIGHUP`.
{{% /note %}}

### Verify mTLS

After you require client certificates on the meta node listeners, `influxd-ctl`
must present a client certificate to connect:

```sh
influxd-ctl -bind-tls \
  -cert /etc/ssl/influxd-ctl-client.crt \
  -key /etc/ssl/influxd-ctl-client.key \
  -ca-cert /etc/ssl/cluster-ca.crt \
  show
```

- `-cert` and `-key`: the client certificate and private key `influxd-ctl` presents
  (use `-client-cert` and `-client-key` to present a separate client identity).
- `-ca-cert`: the CA used to verify the meta node's server certificate.

If you require client certificates on the data node HTTP API, connect with the
`influx` CLI by passing the client certificate and key:

```sh
influx -ssl -host <domain_name>.com \
  -cert /etc/ssl/influx-client.crt \
  -key /etc/ssl/influx-client.key
```

You can also set the `INFLUX_CERT` and `INFLUX_KEY` environment variables instead
of the `-cert` and `-key` flags.

## Connect Telegraf to a secured InfluxDB Enterprise instance

Connecting [Telegraf](/telegraf/v1/)
to an HTTPS-enabled InfluxDB Enterprise instance requires some additional steps.

In Telegraf's configuration file (`/etc/telegraf/telegraf.conf`), under the OUTPUT PLUGINS section,
edit the `urls` setting to indicate `https` instead of `http`.
Also change `localhost` to the relevant domain name.

The best practice in terms of security is to transfer the certificate to the client and make it trusted
(either by putting in the operating system's trusted certificate system or using the `ssl_ca` option).
The alternative is to sign the certificate using an internal CA and then trust the CA certificate.
Provide the file paths of your key and certificate to the InfluxDB output plugin as shown below.

If you're using a self-signed certificate,
uncomment the `insecure_skip_verify` setting and set it to `true`.

```toml
###############################################################################
#                            OUTPUT PLUGINS                                   #
###############################################################################

# Configuration for influxdb server to send metrics to
[[outputs.influxdb]]
  ## The full HTTP or UDP endpoint URL for your InfluxDB Enterprise instance.
  ## Multiple urls can be specified as part of the same cluster,
  ## this means that only ONE of the urls will be written to each interval.
  # urls = ["udp://localhost:8089"] # UDP endpoint example
  urls = ["https://<domain_name>.com:8086"]

[...]

  ## Optional SSL Config
  tls_cert = "/etc/telegraf/cert.pem"
  tls_key = "/etc/telegraf/key.pem"
  insecure_skip_verify = true # <-- Update only if you're using a self-signed certificate
```

Next, restart Telegraf and you're all set!

```sh
sudo systemctl restart telegraf
```
