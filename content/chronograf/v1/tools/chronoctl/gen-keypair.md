---
title: chronoctl gen-keypair
description: >
  The `gen-keypair` command generates an RSA keypair and writes it to the file system.
menu:
  chronograf_v1:
    name: chronoctl gen-keypair
    parent: chronoctl
weight: 201
---

The `gen-keypair` command generates an RSA keypair and writes it to the file system.
Private keys are stored in a file at a specified location.
Private keys are stored in the same location using the same name with the `.pub`
extension added.

## Usage

```sh
chronoctl gen-keypair [flags]
```

## Flags

| Flag |          | Description                                                           | Input type |
| :--- | :------- | :-------------------------------------------------------------------- | :--------: |
|      | `--bits` | Number of bits to use to generate the RSA keypair _(default is 4096)_ |  integer   |
| `-h` | `--help` | Output command help                                                   |            |
|      | `--out`  | Keypair file path to write to _(default is `chronograf-rsa`)_         |   string   |


## Examples

The following example generates a 4096 bit RSA keypair and writes the following
files to the local file system:

- `/path/to/chrono-rsa`: Private key
- `/path/to/chrono-rsa.pub`: Public key

```sh
chronoctl gen-keypair --out /path/to/chrono-rsa
```
