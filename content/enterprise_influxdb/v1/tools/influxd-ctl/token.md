---
title: influxd-ctl token
description: >
  The `influxd-ctl token` command generates a signed [JSON Web Token (JWT)](https://jwt.io/).
menu:
  enterprise_influxdb_v1:
    parent: influxd-ctl
weight: 201
---

The `influxd-ctl token` command generates a signed [JSON Web Token (JWT)](https://jwt.io/).

## Usage

```sh
influxd-ctl -auth-type jwt -secret <shared secret> token [flags]
```

{{% note %}}
#### Requires global flags

`influxd-ctl token` requires the `-auth-type` and `-secret`
[global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags).

- Set `-auth-type` to `jwt`
- Use `-secret` to provide your JWT shared secret
{{% /note %}}

## Flags {#command-flags}

| Flag   | Description                                     |
| :----- | :---------------------------------------------- |
| `-exp` | Token expiration duration _(default is `1m0s`)_ |

{{% caption %}}
_Also see [`influxd-ctl` global flags](/enterprise_influxdb/v1/tools/influxd-ctl/#influxd-ctl-global-flags)._
{{% /caption %}}

## Examples

##### Generate a JWT token that expires in 5 minutes

```sh
influxd-ctl \
  -auth-type jwt \
  -secret sHaR3dS3cRe7 \
  token -exp 5m
```
