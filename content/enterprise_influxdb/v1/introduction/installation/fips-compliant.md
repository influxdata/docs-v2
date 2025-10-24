---
title: FIPS-compliant InfluxDB Enterprise v1 builds
description: >
  InfluxDB Enterprise v1 1.11+ provides builds that are compliant with 
  [Federal Information Processing Standards (FIPS)](https://www.nist.gov/standardsgov/compliance-faqs-federal-information-processing-standards-fips).
menu:
  enterprise_influxdb_v1:
    name: FIPS-compliant builds
    parent: Install
weight: 101
---

InfluxDB Enterprise 1.11+ provides builds that are compliant with 
[Federal Information Processing Standards (FIPS)](https://www.nist.gov/standardsgov/compliance-faqs-federal-information-processing-standards-fips).
This page provides information on installing and using FIPS-compliant builds of
InfluxDB Enterprise.

- [Installation](#installation)
- [Caveats and known issues](#caveats-and-known-issues)
  - [You must use a local license file](#you-must-use-a-local-license-file)
  - [Flux data source restrictions](#flux-data-source-restrictions)
  - [Disabled InfluxDB Insights monitoring](#disabled-influxdb-insights-monitoring)
  - [Only amd64 (x86) architectures](#only-amd64-x86-architectures)
- [Security](#security)
  - [BoringCrypto cryptography library](#boringcrypto-cryptography-library)
  - [TLS](#tls)
  - [Digital signatures](#digital-signatures)
  - [RSA key size](#rsa-key-size)
  - [Elliptic-curve cryptography](#elliptic-curve-cryptography)

## Installation

- **For new InfluxDB Enterprise clusters**:

  - Follow the regular [InfluxDB Enterprise installation instructions](/enterprise_influxdb/v1/introduction/installation/)
    using the FIPS-compliant packages. 
  - Ensure that your meta and data node configuration files use a FIPS-compliant
    password hash that conforms to
    [NIST SP 800](https://www.nist.gov/itl/publications-0/nist-special-publication-800-series-general-information)
    and [OWASP](https://owasp.org/) guidelines.
    In both meta and data node configuration files, set `[meta].password-hash` to
    either `pbkdf2-sha256` or `pbkdf2-sha512`.
    Non-FIPS-compliant password hash configurations, like `bcrypt`, cause
    FIPS-compliant InfluxDB Enterprise builds to return an error on startup.

- **Enable FIPS on an _existing_ InfluxDB Enterprise cluster**:

  - Change the password hash from the non-FIPS-compliant default of `bcrypt` to
    a FIPS-compliant password hash (`pbkdf2-sha256` or `pbkdf2-sha512`), then
    restart all nodes.
  - Change passwords on at least one admin account.
    Any users with passwords that have not been updated will no longer work once
    FIPS-compliance is enabled.
  - Follow the process to upgrade a cluster, except use the FIPS-compliant packages.

{{% note %}}
Please report any errors encountered when upgrading from a non-FIPS-compliant
InfluxDB Enterprise build to FIPS-compliant build to [InfluxData support](https://support.influxdata.com).
{{% /note %}}

## Caveats and known issues

- [You must use a local license file](#you-must-use-a-local-license-file)
- [Flux data source restrictions](#flux-data-source-restrictions)
- [Disabled InfluxDB Insights monitoring](#disabled-influxdb-insights-monitoring)
- [Only amd64 (x86) architectures](#only-amd64-x86-architectures)

### You must use a local license file

When using a FIPS-compliant build of InfluxDB Enterprise,
**you must use a local license file**. License keys do not work in FIPS mode.
[Contact InfluxData support](https://support.influxdata.com) to request the
license file.
The `[enterprise]` section of your data and meta node configuration files
contains the settings that registered each node with the InfluxDB Enterprise
license portal.

**In your data and meta node configuration files:**

1.  Update the [`[enterprise].license-path` setting](/enterprise_influxdb/v1/administration/configure/config-data-nodes/#license-path) 
    to point to your local license file.
2.  Remove or comment out the `[enterprise].license-key` setting.

### Flux data source restrictions

Flux queries that query or write to MSSQL, SQLServer, or Snowflake using
[`sql.from`](/flux/v0/stdlib/sql/from/) or [`sql.to`](/flux/v0/stdlib/sql/to/)
are not supported.

### Disabled InfluxDB Insights monitoring

[InfluxDB Insights monitoring](https://www.influxdata.com/products/influxdb-insights/)
has not been validated as compatible with FIPS-compliance in InfluxDB Enterprise
and is not available when using a FIPS-compliant InfluxDB Enterprise build.

### Only amd64 (x86) architectures

FIPS-compliant InfluxDB Enterprise builds only support the amd64 architecture.

## Security

To comply with FIPS standards, the following security practices are applied to
FIPS-compliant InfluxDB Enterprise builds:

- [BoringCrypto cryptography library](#boringcrypto-cryptography-library)
- [TLS](#tls)
- [Digital signatures](#digital-signatures)
- [RSA key size](#rsa-key-size)
- [Elliptic-curve cryptography](#elliptic-curve-cryptography)

### BoringCrypto cryptography library

InfluxDB Enterprise FIPS-compliant builds use the FIPS-validated
[BoringCrypto cryptography library](https://boringssl.googlesource.com/boringssl/+/master/crypto/fipsmodule/FIPS.md).

### TLS

As mandated by FIPS, TLS uses a restricted set of functionality:

- TLS 1.2 only
- TLS only supports the following cipher suites:
  - ECDHE_RSA_WITH_AES_128_GCM_SHA256
  - ECDHE_RSA_WITH_AES_256_GCM_SHA384
  - ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
  - ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
  - RSA_WITH_AES_128_GCM_SHA256
  - RSA_WITH_AES_256_GCM_SHA384

### Digital signatures

As mandated by FIPS, supported digital signatures are limited to the following
signature algorithms:

- PSSWithSHA256
- PSSWithSHA384
- PSSWithSHA512
- PKCS1WithSHA256
- ECDSAWithP256AndSHA256
- PKCS1WithSHA384
- ECDSAWithP384AndSHA384
- PKCS1WithSHA512
- ECDSAWithP521AndSHA512

{{% note %}}
Digital signature restrictions apply to TLS certificates.
{{% /note %}}

### RSA key size

As mandated by FIPS, RSA keys are restricted to the following sizes:

- 2048
- 3072

{{% note %}}
RSA key size restrictions apply to TLS certificates.
{{% /note %}}

### Elliptic-curve cryptography

As mandated by FIPS, supported elliptic-curve (EC) cryptography curves are
restricted to the following:

- P-256
- P-384
- P-521

{{% note %}}
EC curve restrictions apply to TLS certificates.
{{% /note %}}
