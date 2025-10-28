---
title: influxd-ctl ldap sample-config
description: >
  The `influxd-ctl ldap sample-config` command prints a sample InfluxDB Enterprise v1
  LDAP configuration to stdout.
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl ldap
---

The `influxd-ctl ldap sample-config` command prints a sample InfluxDB Enterprise
LDAP configuration to stdout.

## Usage

```sh
influxd-ctl ldap sample-config
```

{{< expand-wrapper >}}
{{% expand "View sample LDAP configuration" %}}
```toml
# Sample TOML for ldap config.
# First, save this file and edit it for your LDAP server.
# Then test the config with: influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
# Finally, upload the config to the cluster with: influxd-ctl ldap set-config /path/to/ldap.toml
#
# Note: the meta nodes must be configured with meta.ldap-allowed = true
# and the data nodes must be configured with http.auth-enabled = true

enabled = true

[[servers]]
  host = "ldap.example.com"
  port = 389

  # Credentials to use when searching for a user or group.
  bind-dn = "cn=read-only-admin,dc=example,dc=com"
  bind-password = "read-only-admin password"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "dc=example,dc=com",
  ]

  # LDAP filter to discover a user's DN.
  # %s will be replaced with the provided username.
  search-filter = "(uid=%s)"
  # On Active Directory you might use "(sAMAccountName=%s)".

  # Base DNs to use when searching for groups.
  group-search-base-dns = ["ou=groups,dc=example,dc=com"]

  # LDAP filter to identify groups that a user belongs to.
  # %s will be replaced with the user's DN.
  group-membership-search-filter = "(&(objectClass=groupOfUniqueNames)(uniqueMember=%s))"
  # On Active Directory you might use "(&(objectClass=group)(member=%s))".

  # Attribute to use to determine the "group" in the group-mappings section.
  group-attribute = "ou"
  # On Active Directory you might use "cn".

  # LDAP filter to search for groups during cache warming.
  # %s will be replaced with the "group" value in the group-mappings section.
  group-search-filter = "(&(objectClass=groupOfUniqueNames)(ou=%s))"

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
meta1:/# influxd-ctl ldap sample-config -h
# Sample TOML for ldap config.
# First, save this file and edit it for your LDAP server.
# Then test the config with: influxd-ctl ldap verify -ldap-config /path/to/ldap.toml
# Finally, upload the config to the cluster with: influxd-ctl ldap set-config /path/to/ldap.toml
#
# Note: the meta nodes must be configured with meta.ldap-allowed = true
# and the data nodes must be configured with http.auth-enabled = true

enabled = true

[[servers]]
  host = "ldap.example.com"
  port = 389

  # Credentials to use when searching for a user or group.
  bind-dn = "cn=read-only-admin,dc=example,dc=com"
  bind-password = "read-only-admin password"

  # Base DNs to use when applying the search-filter to discover an LDAP user.
  search-base-dns = [
    "dc=example,dc=com",
  ]

  # LDAP filter to discover a user's DN.
  # %s will be replaced with the provided username.
  search-filter = "(uid=%s)"
  # On Active Directory you might use "(sAMAccountName=%s)".

  # Base DNs to use when searching for groups.
  group-search-base-dns = ["ou=groups,dc=example,dc=com"]

  # LDAP filter to identify groups that a user belongs to.
  # %s will be replaced with the user's DN.
  group-membership-search-filter = "(&(objectClass=groupOfUniqueNames)(uniqueMember=%s))"
  # On Active Directory you might use "(&(objectClass=group)(member=%s))".

  # Attribute to use to determine the "group" in the group-mappings section.
  group-attribute = "ou"
  # On Active Directory you might use "cn".

  # LDAP filter to search for groups during cache warming.
  # %s will be replaced with the "group" value in the group-mappings section.
  group-search-filter = "(&(objectClass=groupOfUniqueNames)(ou=%s))"

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
{{% /expand %}}
{{< /expand-wrapper >}}
