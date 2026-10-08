---
title: Configure TLS for Telegraf plugins
description: >
  Reference for the standard TLS options that Telegraf plugins provide:
  client and server certificate configuration, mutual TLS, cipher suites,
  and TLS version constraints.
menu:
  telegraf_v1:
    name: TLS
    parent: Configure Telegraf
weight: 108
related:
  - /telegraf/v1/configuration/secrets/
  - /telegraf/v1/plugins/
---

Telegraf standardizes TLS options across plugins.
Plugins that support TLS provide the standard settings on this page.
Each plugin's sample configuration shows which settings apply.
Client settings appear on plugins that connect out to services, and server
settings appear on plugins that listen for connections.

Each setting lists its data type and default value.

- [Client configuration](#client-configuration)
  - [tls_enable](#tls_enable)
  - [tls_ca](#tls_ca)
  - [tls_cert](#tls_cert)
  - [tls_key](#tls_key)
  - [tls_key_pwd](#tls_key_pwd)
  - [insecure_skip_verify](#insecure_skip_verify)
  - [tls_server_name](#tls_server_name)
- [Server configuration](#server-configuration)
  - [tls_allowed_cacerts](#tls_allowed_cacerts)
  - [tls_allowed_dns_names](#tls_allowed_dns_names)
- [Advanced configuration](#advanced-configuration)
  - [tls_cipher_suites](#tls_cipher_suites)
  - [tls_min_version](#tls_min_version)
  - [tls_max_version](#tls_max_version)
- [Supported cipher suites](#supported-cipher-suites)
- [Supported TLS versions](#supported-tls-versions)

## Client configuration

```toml
[[inputs.http]]
  urls = ["https://server.company.org/metrics"]
  tls_ca = "/etc/telegraf/ca.pem"
  tls_cert = "/etc/telegraf/cert.pem"
  tls_key = "/etc/telegraf/key.pem"
```

### tls_enable

Enforces TLS on or off for the connection.

**Type:** boolean  
**Default:** Not set. TLS is enabled if any other TLS option is set.

### tls_ca

Path to the root certificates used to verify server certificates, encoded in
PEM format.

**Type:** string  
**Default:** Not set. The system certificate pool is used.

### tls_cert

Path to the PEM-encoded public certificate.
On client plugins, this is the client certificate.
On server plugins, this is the service certificate.
May contain intermediate certificates.

**Type:** string  
**Default:** Not set

### tls_key

Path to the PEM-encoded private key that pairs with `tls_cert`.

**Type:** string  
**Default:** Not set

### tls_key_pwd

Passphrase for an encrypted private key in PKCS#8 format.
Encrypted PKCS#1 private keys are not supported.

**Type:** string  
**Default:** Not set

### insecure_skip_verify

Skips verification of the server's certificate chain and host name.
Use only for testing. Skipping verification makes the connection vulnerable
to machine-in-the-middle attacks.

**Type:** boolean  
**Default:** `false`

### tls_server_name

Sends the specified server name via the TLS Server Name Indication (SNI)
extension instead of the name derived from the connection address.

**Type:** string  
**Default:** Not set

## Server configuration

Server plugins support TLS mutual authentication in addition to the shared
[`tls_cert`](#tls_cert), [`tls_key`](#tls_key), and
[`tls_key_pwd`](#tls_key_pwd) settings:

```toml
[[inputs.http_listener_v2]]
  service_address = ":9443"
  tls_cert = "/etc/telegraf/cert.pem"
  tls_key = "/etc/telegraf/key.pem"
  tls_allowed_cacerts = ["/etc/telegraf/clientca.pem"]
```

### tls_allowed_cacerts

Paths to one or more allowed client CA certificate files.
Setting this enables mutually authenticated TLS. Incoming client
certificates must be signed by one of these CAs.

**Type:** array of strings  
**Default:** Not set. Client certificates aren't required.

### tls_allowed_dns_names

Allowed DNS names for verifying incoming client certificates.
Telegraf checks each subject alternative name (SAN) in the certificate and
accepts the request if any of them matches.

**Type:** array of strings  
**Default:** Not set

## Advanced configuration

Plugins that use the standard server configuration also support the
following settings.
They aren't included in sample configurations for brevity.

### tls_cipher_suites

The list of allowed cipher suites. See
[Supported cipher suites](#supported-cipher-suites).

**Type:** array of strings  
**Default:** Not set. The default ciphers supported by Go are used.

### tls_min_version

The minimum acceptable TLS version. See
[Supported TLS versions](#supported-tls-versions).

**Type:** string  
**Default:** `"TLS12"`

### tls_max_version

The maximum acceptable TLS version. See
[Supported TLS versions](#supported-tls-versions).

**Type:** string  
**Default:** Not set. The maximum version supported by Go is used.

## Supported cipher suites

Use the following values with [`tls_cipher_suites`](#tls_cipher_suites):

- `TLS_RSA_WITH_RC4_128_SHA`
- `TLS_RSA_WITH_3DES_EDE_CBC_SHA`
- `TLS_RSA_WITH_AES_128_CBC_SHA`
- `TLS_RSA_WITH_AES_256_CBC_SHA`
- `TLS_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_ECDSA_WITH_RC4_128_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_RC4_128_SHA`
- `TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`
- `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA`
- `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
- `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`
- `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`
- `TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305`
- `TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305`
- `TLS_AES_128_GCM_SHA256`
- `TLS_AES_256_GCM_SHA384`
- `TLS_CHACHA20_POLY1305_SHA256`

## Supported TLS versions

Use the following values with [`tls_min_version`](#tls_min_version) or
[`tls_max_version`](#tls_max_version):

- `TLS10`
- `TLS11`
- `TLS12`
- `TLS13`
