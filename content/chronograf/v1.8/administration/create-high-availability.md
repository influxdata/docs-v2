---
title: Create a Chronograf HA configuration
description: Create a Chronograf high-availability (HA) cluster using etcd.
menu:
  chronograf_1_8:
    weight: 10
    parent: Administration
---

To create a Chronograf high-availability (HA) configuration using an etcd cluster as a shared data store, do the following:

1. [Install and start etcd](#install-and-start-etcd)
2. Set up a load balancer for Chronograf
3. [Start Chronograf](#start-chronograf)

Have an existing Chronograf configuration store that you want to use with a Chronograf HA configuration? Learn how to [migrate your Chrongraf configuration](/chronograf/v1.8/administration/migrate-to-high-availability/) to a shared data store.

## Architecture

{{< svg "/static/img/chronograf/1-8-ha-architecture.svg" >}}

## Install and start etcd

1. Download the latest etcd release [from GitHub](https://github.com/etcd-io/etcd/releases/).
   (For detailed installation instructions specific to your operating system, see [Install and deploy etcd](http://play.etcd.io/install).)
2. Extract the `etcd` binary and place it in your system PATH.
3. Start etcd.


## Start Chronograf

Run the following command to start Chronograf using `etcd` as the storage layer. The syntax depends on whether you're using command line flags or the `ETCD_ENDPOINTS` environment variable.

##### Define etcd endpoints with command line flags
```sh
# Syntax
chronograf --etcd-endpoints=<etcd-host>
# Examples

# Add a single etcd endpoint when starting Chronograf

chronograf --etcd-endpoints=localhost:2379

# Add multiple etcd endpoints when starting Chronograf
chronograf \
  --etcd-endpoints=localhost:2379 \
  --etcd-endpoints=192.168.1.61:2379 \
  --etcd-endpoints=192.192.168.1.100:2379
```

##### Define etcd endpoints with the ETCD_ENDPOINTS environment variable
```sh

# Provide etcd endpoints in a comma-separated list
export ETCD_ENDPOINTS=localhost:2379,192.168.1.61:2379,192.192.168.1.100:2379

# Start Chronograf
chronograf
```

##### Define etcd endpoints with TLS enabled
Use the `--etcd-cert` flag to specify the path to the etcd PEM-encoded public
certificate file and the `--etcd-key` flag to specify the path to the private key
associated with the etcd certificate.

```sh
chronograf --etcd-endpoints=localhost:2379 \
  --etcd-cert=path/to/etcd-certificate.pem \
  --etcd-key=path/to/etcd-private-key.key
```

For more information, see [Chronograf etcd configuration options](/chronograf/v1.8/administration/config-options#etcd-options).
