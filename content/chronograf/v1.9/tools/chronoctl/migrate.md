---
title: chronoctl migrate
description: >
  The `migrate` command allows you to migrate your Chronograf configuration store.
menu:
  chronograf_1_9:
    name: chronoctl migrate
    parent: chronoctl
    weight: 40
---

The `migrate` command lets you migrate your Chronograf configuration store.

By default, Chronograf is delivered with BoltDB as a data store. For information on migrating from BoltDB to an etcd cluster as a data store,
see [Migrating to a Chronograf HA configuration](/chronograf/v1.9/administration/migrate-to-high-availability).

## Usage
```
chronoctl migrate [flags]
```

## Flags
| Flag |          | Description                                                                                                                                       | Input type  |
|:---- |:---      |:-----------                                                                                                                                       |:----------: |
| `-f` | `--from` | Full path to BoltDB file or etcd (e.g. `bolt:///path/to/chronograf-v1.db` or `etcd://user:pass@localhost:2379` (default: `chronograf-v1.db`)      | string      |
| `-t` | `--to`   | Full path to BoltDB file or etcd (e.g. `bolt:///path/to/chronograf-v1.db` or `etcd://user:pass@localhost:2379` (default: `etcd://localhost:2379`) | string      |

#### Provide etcd authentication credentials
If authentication is enabled on `etcd`, use the standard URI basic
authentication format to define a username and password. For example:

```sh
etcd://username:password@localhost:2379
```

#### Provide etcd TLS credentials
If TLS is enabled on `etcd`, provide your TLS certificate credentials using
the following query parameters in your etcd URL:

- **cert**: Path to client certificate file or PEM file
- **key**: Path to client key file
- **ca**: Path to trusted CA certificates

```sh
etcd://127.0.0.1:2379?cert=/tmp/client.crt&key=/tst/client.key&ca=/tst/ca.crt
```
