---
title: chronoctl token
description: >
  The `token` command reads a private token file, generates and signs the nonce,
  and then returns an expiring token to be used in the `Authorization` header.
menu:
  chronograf_v1:
    name: chronoctl token
    parent: chronoctl
weight: 201
---

The `token` command reads a private token file, generates and signs the nonce,
and then returns an expiring token to be used in the `Authorization` header.
For example:

```sh
Authorization: CHRONOGRAF-SHA256 <returned-expiring-token>
```

## Usage
```
chronoctl token [flags]
```

## Flags
| Flag |                    | Description                                                   |  Env. Variable   |
| :--- | :----------------- | :------------------------------------------------------------ | :--------------: |
| `-h` | `--help`           | Output command help                                           |                  |
|      | `--chronograf-url` | Chronograf's URL _(default is `http://localhost:8888`)_       | `CHRONOGRAF_URL` |
| `-k` | `--skip-verify`    | Skip TLS certification verification                           |                  |
|      | `--priv-key-file`  | Private key file location for superadmin token authentication | `PRIV_KEY_FILE`  |

## Examples

The following example uses the RSA key used when started the Chronograf server and
returns an expiring token that can be used to gain superadmin access to Chronograf.

{{% note %}}
The private key must be correspond to the public key used when starting the
Chronograf server.
{{% /note %}}

```sh
chronoctl token --priv-key-file /path/to/chronograf-rsa
```
