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
  - [Example Telegraf configuration](#example-telegraf-configuration)
- [Troubleshoot TLS](#troubleshoot-tls)

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

1. [Download or generate certificate files](#1-download-or-generate-certificate-files)
2. [Set certificate file permissions](#2-set-certificate-file-permissions)
3. [Run `influxd` with TLS flags](#3-run-influxd-with-tls-flags)
4. [Verify TLS connection](#4-verify-tls-connection)

### 1. Download or generate certificate files

If using a [certificate signed by a CA](#single-domain-certificates-signed-by-a-certificate-authority-ca), follow their instructions to download and install the certificate files.
Note the location where certificate files are installed, and then continue to [set certificate file permissions](#set-certificate-file-permissions).

{{% note %}}
#### Where are my certificates?

The location of your certificate files depends on your system, domain, and certificate authority.

For example, if [Let's Encrypt](https://letsencrypt.org/) is your CA and you use [certbot](https://certbot.eff.org/) to install certificates, the default location is
`/etc/letsencrypt/live/$domain`. For more information about Let's Encrypt certificate paths, see [Where are my certificates?](https://eff-certbot.readthedocs.io/en/latest/using.html#where-are-my-certificates)
{{% /note %}}

To generate [self-signed certificates](#self-signed-certificates), use the `openssl` command on your system.

The following example shows how to generate certificates located in `/etc/ssl`
on Unix-like systems and Windows.
_For example purposes only, the code creates an unencrypted private key._

{{% warn %}}
#### Encrypt private keys

Use encrypted keys to enhance security.
If you must use an unencrypted key, ensure it's stored securely and has appropriate file permissions.
{{% /warn %}}

```bash
# Create a temporary configuration file that defines properties for
# the Subject Alternative Name (SAN) extension
cat > san.cnf <<EOF
   [req]
   distinguished_name = req_distinguished_name
   req_extensions = v3_req
   prompt = no

   [req_distinguished_name]
   C = US
   ST = California
   L = San Francisco
   O = Example Company
   OU = IT Department
   CN = example.com

   [v3_req]
   keyUsage = keyEncipherment, dataEncipherment
   extendedKeyUsage = serverAuth
   subjectAltName = @alt_names

   [alt_names]
   DNS.1 = example.com
   DNS.2 = www.example.com
   IP.1 = 10.1.2.3
EOF

# Generate a private key and certificate signing request (CSR)
# using the configuration file 
openssl req -new -newkey rsa:2048 -nodes \
  -keyout /etc/ssl/influxdb-selfsigned.key \
  -out /etc/ssl/influxdb-selfsigned.csr \
  -config san.cnf

# Generate the self-signed certificate
openssl x509 -req -in /etc/ssl/influxdb-selfsigned.csr \
  -signkey /etc/ssl/influxdb-selfsigned.key \
  -out /etc/ssl/influxdb-selfsigned.crt \
  -days NUMBER_OF_DAYS \
  -extensions v3_req -extfile san.cnf

# Remove the temporary configuration file
rm san.cnf
```

Replace the following with your own values:

- {{% code-placeholder-key %}}`NUMBER_OF_DAYS`{{% /code-placeholder-key %}}: the number of days for files to remain valid 
- {{% code-placeholder-key %}}`/etc/ssl`{{% /code-placeholder-key %}}: the SSL configurations directory for your system
- Configuration field values in `req_distinguished_name` and `alt_names`

### 2. Set certificate file permissions

The user running InfluxDB must have read permissions on the TLS certificate files.

{{% note %}}You may opt to set up multiple users, groups, and permissions.
Ultimately, make sure all users running InfluxDB have read permissions for the TLS certificate.
{{% /note %}}

In your terminal, run `chmod` to set permissions on your installed certificate files--for example:
The following example shows how to set read permissions on the self-signed
certificate and key files generated in [the preceding step](#1-download-or-generate-certificate-files):

```bash
sudo chmod 644 /etc/ssl/influxdb-selfsigned.crt
sudo chmod 600 /etc/ssl/influxdb-selfsigned.key
```

### 3. Verify certificate and key files

To ensure that the certificate and key files are correct and match each other,
enter the following commands in your terminal:

```bash
openssl x509 -noout -modulus -in /etc/ssl/influxdb-selfsigned.crt | openssl md5
openssl rsa -noout -modulus -in /etc/ssl/influxdb-selfsigned.key | openssl md5
```

### 4. Run `influxd` with TLS flags

To start InfluxDB with TLS command line flags, enter the following command with
paths to your key and certificate files:

```bash
influxd \
  --tls-cert="/etc/ssl/influxdb-selfsigned.crt" \
  --tls-key="/etc/ssl/influxdb-selfsigned.key" > /var/log/influxdb.log 2>&1 &
```

If successful, InfluxDB runs in the background and logs to `influxdb.log`.

### 4. Verify TLS connection

To test your certificates, access InfluxDB using the `https://` protocol--for example, using cURL:

<!--pytest-codeblocks:cont-->

<!--test:nextblock
```bash
# Wait...
sleep 1 && curl --verbose --insecure https://localhost:8086/api/v2/ping
```
-->

<!--pytest.mark.skip-->

```bash
curl --verbose https://localhost:8086/api/v2/ping
```

If using a self-signed certificate, skip certificate verification--for example, in a cURL command,
pass the `-k, --insecure` flag:

<!--pytest.mark.skip-->

```bash
curl --verbose --insecure https://localhost:8086/api/v2/ping
```

If successful, the `curl --verbose` output shows a TLS handshake--for example:

<!--pytest.mark.skip-->

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

### Example Telegraf configuration

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

## Troubleshoot TLS

Identify and resolve issues after activating TLS.

- [Check InfluxDB logs](#check-influxdb-logs)
- [Verify certificate and key files](#verify-certificate-and-key-files)
- [Test with OpenSSL](#test-with-openssl)
- [Check file permissions](#check-file-permissions)
- [Verify TLS configuration](#verify-tls-configuration)
- [Update OpenSSL and InfluxDB](#update-openssl-and-influxdb)

### Check InfluxDB logs

Review the InfluxDB logs for any error messages or warnings about the issue.

#### Example TLS error

```text
msg="http: TLS handshake error from [::1]:50476:
remote error: tls: illegal parameter" log_id=0rqN8H_0000 service=http
```

### Verify certificate and key Files

To ensure that the certificate and key files are correct and match each other,
enter the following command in your terminal:

```bash
openssl x509 -noout -modulus -in /etc/ssl/influxdb-selfsigned.crt | openssl md5
openssl rsa -noout -modulus -in /etc/ssl/influxdb-selfsigned.key | openssl md5
```

### Test with OpenSSL

Use OpenSSL to test the server's certificate and key--for example, enter the
following command in your terminal:

```bash
openssl s_client -connect localhost:8086 -CAfile /etc/ssl/influxdb-selfsigned.crt
```

### Check file permissions

Ensure that the InfluxDB process has read access to the certificate and key
files--for example, enter the following command to set file permissions:

```bash
sudo chmod 644 /etc/ssl/influxdb-selfsigned.crt
sudo chmod 600 /etc/ssl/influxdb-selfsigned.key
```

### Verify TLS configuration

Ensure that the TLS configuration in InfluxDB is correct.
Check the paths to the certificate and key files in the InfluxDB configuration
or command line flags.

### Update OpenSSL and InfluxDB

Ensure that you are using the latest versions of OpenSSL and InfluxDB, as
updates may include fixes for TLS-related issues.
