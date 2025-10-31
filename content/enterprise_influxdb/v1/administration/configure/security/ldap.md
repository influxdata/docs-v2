---
title: Configure LDAP authentication
description: >
  Configure LDAP authentication in InfluxDB Enterprise v1 and test LDAP connectivity.
menu:
  enterprise_influxdb_v1:
    name: Configure LDAP authentication
    parent: Configure security
weight: 30
aliases:
  - /enterprise_influxdb/v1/administration/ldap/
  - /enterprise_influxdb/v1/administration/manage/security/ldap/
related:
  - /enterprise_influxdb/v1/tools/influxd-ctl/ldap/
---

Configure InfluxDB Enterprise to use LDAP (Lightweight Directory Access Protocol) to:

- Validate user permissions
- Synchronize InfluxDB and LDAP so each LDAP request doesn't need to be queried

{{% note %}}
To configure InfluxDB Enterprise to support LDAP, all users must be managed in the remote LDAP service. If LDAP is configured and enabled, users **must** authenticate through LDAP, including users who may have existed before enabling LDAP.
{{% /note %}}

- [Configure LDAP for an InfluxDB Enterprise cluster](#configure-ldap-for-an-influxdb-enterprise-cluster)
- [Sample LDAP configuration](#sample-ldap-configuration)
- [Troubleshoot LDAP in InfluxDB Enterprise](#troubleshoot-ldap-in-influxdb-enterprise)

## Configure LDAP for an InfluxDB Enterprise cluster

To use LDAP with an InfluxDB Enterprise cluster, do the following:

1. [Configure data nodes](#configure-data-nodes)
2. [Configure meta nodes](#configure-meta-nodes)
3. [Create, verify, and upload the LDAP configuration file](#create-verify-and-upload-the-ldap-configuration-file)
4. [Restart meta and data nodes](#restart-meta-and-data-nodes)

### Configure data nodes

Update the following settings in each data node configuration file (`/etc/influxdb/influxdb.conf`):

1. Under `[http]`, enable HTTP authentication by setting `auth-enabled` to `true`.
   (Or set the corresponding environment variable `INFLUXDB_HTTP_AUTH_ENABLED` to `true`.)
2. If you're enabling authentication on meta nodes, you must also include the following configurations:
   - `INFLUXDB_META_META_AUTH_ENABLED` environment variable, or `[http]` configuration setting `meta-auth-enabled`, is set to `true`.
     This value must be the same value as the meta node's `meta.auth-enabled` configuration.
   - `INFLUXDB_META_META_INTERNAL_SHARED_SECRET`,
     or the corresponding `[meta]` configuration setting `meta-internal-shared-secret`,
     is set a secret value.
     This value must be the same value as the meta node's `meta.internal-shared-secret`.

### Configure meta nodes

Update the following settings in each meta node configuration file (`/etc/influxdb/influxdb-meta.conf`):

1. Configure the meta node META shared secret to validate requests using JSON web tokens (JWT) and sign each HTTP payload with the username and shared secret.
2. Set the `[meta]` configuration setting `internal-shared-secret` to `"<internal-shared-secret>"`.
   (Or set the `INFLUXDB_META_INTERNAL_SHARED_SECRET` environment variable.)
3. Set the `[meta]` configuration setting `meta.ldap-allowed` to `true` on all meta nodes in your cluster.
   (Or set the `INFLUXDB_META_LDAP_ALLOWED`environment variable.)

### Authenticate your connection to InfluxDB

To authenticate your InfluxDB connection, run the following command, replacing `username:password` with your credentials:

{{< keep-url >}}
```bash
curl -u username:password -XPOST "http://localhost:8086/..."
```

For more detail on authentication, see [Authentication and authorization in InfluxDB](/enterprise_influxdb/v1/administration/authentication_and_authorization/).

### Create, verify, and upload the LDAP configuration file

1. To create a sample LDAP configuration file, run the following command:

    ```bash
    influxd-ctl ldap sample-config
    ```

2. Save the sample file and edit as needed for your LDAP server.
   For detail, see the [sample LDAP configuration file](#sample-ldap-configuration) below.

    > To use fine-grained authorization (FGA) with LDAP, you must map InfluxDB Enterprise roles to key-value pairs in the LDAP database.
    For more information, see [Fine-grained authorization in InfluxDB Enterprise](/enterprise_influxdb/v1/guides/fine-grained-authorization/).
    The InfluxDB admin user doesn't include permissions for InfluxDB Enterprise roles.

3. Restart all meta and data nodes in your InfluxDB Enterprise cluster to load your updated configuration.

   On each **meta** node, run:

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [sysvinit](#)
   [systemd](#)
   {{% /code-tabs %}}
   {{% code-tab-content %}}
   ```sh
   service influxdb-meta restart
   ```
   {{% /code-tab-content %}}
   {{% code-tab-content %}}
   ```sh
   sudo systemctl restart influxdb-meta
   ```
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}

   On each **data** node, run:

   {{< code-tabs-wrapper >}}
   {{% code-tabs %}}
   [sysvinit](#)
   [systemd](#)
   {{% /code-tabs %}}
   {{% code-tab-content %}}
   ```sh
   service influxdb restart
   ```
   {{% /code-tab-content %}}
   {{% code-tab-content %}}
   ```sh
   sudo systemctl restart influxdb
   ```
   {{% /code-tab-content %}}
   {{< /code-tabs-wrapper >}}


4. To verify your LDAP configuration, run:

    ```bash
    influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
    ```

5. To load your LDAP configuration file, run the following command:

    ```bash
    influxd-ctl ldap set-config /path/to/ldap.toml
    ```


## Sample LDAP configuration

The following is a sample configuration file that connects to a publicly available LDAP server.

A `DN` ("distinguished name") uniquely identifies an entry and describes its position in the directory information tree (DIT) hierarchy.
The DN of an LDAP entry is similar to a file path on a file system.
`DNs` refers to multiple DN entries.

{{% truncate %}}
```toml
enabled = true

[[servers]]
  host = "ldap.example.com"
  port = 389

  # Security mode for LDAP connection to this server.
  # Valid settings: none, starttls, starttls+insecure, ldaps, ldaps+insecure.
  # The recommended security is "starttls", which is the default. This uses
  # an initial unencrypted connection and upgrades to TLS as the first action
  # against the server, per the LDAPv3 standard.
  # Another secure option is "ldaps", which starts the connection over
  # TLS instead of upgrading like "starttls". This generally requires a
  # dedicated port (usually 636).  "starttls" is generally preferred
  # to "ldaps".
  # Other options are "starttls+insecure" and "ldaps+insecure" which behave
  # the same as "starttls" and and "ldaps" respectively, except they ignore
  # server certificate verification errors.
  # Finally, "none" does not use TLS. This is not recommended for
  # production systems.
  security = "starttls"
  
  # Client certificates to present to the LDAP server are supported with
  # "client-tls-certificate" and  "client-tls-private-key" configurations.
  # These are paths to the X.509 client certificate and corresponding private
  # key, respectively. If "client-tls-certificate" is set but 
  # "client-tls-private-key" is not, then "client-tls-certificate" is assumed
  # to bundle both the certificate and private key.
  # The LDAP server may request and require valid client certificates
  # even when InfluxDB is configured with an insecure TLS mode that ignores
  # LDAP server certificate errors.
  # Not all LDAP servers will request a client certificate. It is not
  # necessary to set "client-tls-certificate" and "client-tls-private-key"
  # if the LDAP server does not require client certificates.
  client-tls-certificate = "/var/run/secrets/ldapClient.pem"
  client-tls-private-key = "/var/run/secrets/ldapClient.key"

  # Client certificates to present to the LDAP server are supported with
  # "client-tls-certificate" and  "client-tls-private-key" configurations.
  # These are paths to the X.509 client certificate and corresponding private
  # key, respectively. If "client-tls-certificate" is set but 
  # "client-tls-private-key" is not, then "client-tls-certificate" is assumed
  # to bundle both the certificate and private key.
  # The LDAP server may request and require valid client certificates
  # even when InfluxDB is configured with an insecure TLS mode that ignores
  # LDAP server certificate errors.
  # Not all LDAP servers will request a client certificate. It is not
  # necessary to set "client-tls-certificate" and "client-tls-private-key"
  # if the LDAP server does not require client certificates.
  client-tls-certificate = "/var/run/secrets/ldapClient.pem"
  client-tls-private-key = "/var/run/secrets/ldapClient.key"

  # Credentials to use when searching for a user or group.
  bind-dn = "cn=read-only-admin,dc=example,dc=com"
  bind-password = "read-only-admin's password"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "dc=example,dc=com",
  ]

  # LDAP filter to discover a user's DN.
  # %%s will be replaced with the provided username.
  search-filter = "(uid=%%s)"
  # On Active Directory you might use "(sAMAccountName=%%s)".

  # Base DNs to use when searching for groups.
  group-search-base-dns = ["ou=groups,dc=example,dc=com"]

  # LDAP filter to identify groups that a user belongs to.
  # %%s will be replaced with the user's DN.
  group-membership-search-filter = "(&(objectClass=groupOfUniqueNames)(uniqueMember=%%s))"
  # On Active Directory you might use "(&(objectClass=group)(member=%%s))".

  # Attribute to use to determine the "group" in the group-mappings section.
  group-attribute = "ou"
  # On Active Directory you might use "cn".

  # LDAP filter to search for groups during cache warming.
  # %%s will be replaced with the "group" value in the group-mappings section.
  group-search-filter = "(&(objectClass=groupOfUniqueNames)(ou=%%s))"

  # Attribute on group objects indicating membership.
  # Used during cache warming, should be same as part of the group-membership-search-filter.
  group-member-attribute = "uniqueMember"

  # Groups whose members have admin privileges on the influxdb servers.
  admin-groups = ["influx-admins"]

  # Mappings of LDAP groups to Influx roles.
  # All Influx roles need to be manually created to take effect.
  [[servers.group-mappings]]
    group = "app-developers"
    role = "app-metrics-rw"

  [[servers.group-mappings]]
    group = "web-support"
    role = "web-traffic-ro"
```
{{% /truncate %}}

## Troubleshoot LDAP in InfluxDB Enterprise

- [InfluxDB Enterprise does not recognize a new LDAP server](#influxdb-enterprise-does-not-recognize-a-new-ldap-server)
- [User cannot log in after updating their password in the LDAP server](#user-cannot-log-in-after-updating-their-password-in-the-ldap-server)

### InfluxDB Enterprise does not recognize a new LDAP server

If you ever replace an LDAP server with a new one, you need to update your
InfluxDB Enterprise LDAP configuration file to point to the new server.
However, InfluxDB Enterprise may not recognize or honor the updated configuration.

For InfluxDB Enterprise to recognize an LDAP configuration pointing to a new
LDAP server, do the following:

{{% warn %}}
#### Not recommended in production InfluxDB Enterprise clusters

Performing the following process on a production cluster may have unintended consequences.
Moving to a new LDAP server constitutes and infrastructure change and may better
be handled through a cluster migration.
For assistance, reach out to [InfluxData support](https://support.influxdata.com/s/contactsupport).
{{% /warn %}}

1.  On each meta node, update the `auth-enabled` setting to `false` in your
    `influxdb-meta.conf` configuration file to temporarily disable authentication.

    ```toml
    [meta]
      auth-enabled = false
    ```

2.  Restart all meta nodes to load the updated configuration.
    On each meta node, run:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
service influxdb-meta restart
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
sudo systemctl restart influxdb-meta
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

3.  On each meta node, [create, verify, and upload the _new_ LDAP configuration file](#create-verify-and-upload-the-ldap-configuration-file).

4.  On each meta node, update the `auth-enabled` setting to `true` in your `influxdb-meta.conf`
    configuration file to reenable authentication.

    ```toml
    [meta]
      auth-enabled = true
    ```

5.  Restart all meta nodes to load the updated configuration.
    On each meta node, run:

    {{< code-tabs-wrapper >}}
{{% code-tabs %}}
[sysvinit](#)
[systemd](#)
{{% /code-tabs %}}
{{% code-tab-content %}}
```sh
service influxdb-meta restart
```
{{% /code-tab-content %}}
{{% code-tab-content %}}
```sh
sudo systemctl restart influxdb-meta
```
{{% /code-tab-content %}}
    {{< /code-tabs-wrapper >}}

### User cannot log in after updating their password in the LDAP server

LDAP credentials are cached on InfluxDB Enterprise data nodes. If credentials
change in the LDAP server, the cached credentials need to be purged and the
cache refreshed to add the updated credentials.

1.  Use the [`influxd-ctl ldap purge-cache` command](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/purge-cache/)
    to purge LDAP credential caches on data nodes.

    ```sh
    influxd-ctl ldap purge-cache
    ```

2.  Use the [`influxd-ctl ldap warm-cache` command](/enterprise_influxdb/v1/tools/influxd-ctl/ldap/warm-cache/)
    to warm LDAP credential caches on data nodes.

    ```sh
    influxd-ctl ldap warm-cache
    ```
