---
title: chronoctl
description: >
  The `chronoctl` command line interface (CLI) includes commands to interact with an instance of Chronograf's data store.
menu:
  chronograf_v1:
    name: chronoctl
    parent: Tools
    weight: 10
---

The `chronoctl` command line interface (CLI) includes commands to interact with an instance of Chronograf's data store.

## Usage
```
chronoctl [flags] [command]
```

## Commands

| Command                                                          | Description                                                                            |
| :--------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| [add-superadmin](/chronograf/v1/tools/chronoctl/add-superadmin/) | Create a new user with superadmin status                                               |
| [gen-keypair](/chronograf/v1/tools/chronoctl/gen-keypair)        | Generate RSA keypair in the Chronograf data store                                      |
| [list-users](/chronograf/v1/tools/chronoctl/list-users)          | List all users in the Chronograf data store                                            |
| [migrate](/chronograf/v1/tools/chronoctl/migrate)                | Migrate your Chronograf configuration store                                            |
| [token](/chronograf/v1/tools/chronoctl/token)                    | Get current token for a superadmin user (chronograf must be started with a public key) |

## Flags

| Flag |          | Description         |
| :--- | -------- | :------------------ |
| `-h` | `--help` | Output command help |
