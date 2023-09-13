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
chronoctl [command]
chronoctl [flags]
```

## Commands

| Command                                          | Description                                       |
|:-------                                          |:-----------                                       |
| [add-superadmin](/chronograf/v1/tools/chronoctl/add-superadmin/) | Create a new user with superadmin status |
| [list-users](/chronograf/v1/tools/chronoctl/list-users)   | List all users in the Chronograf data store                    |
| [migrate](/chronograf/v1/tools/chronoctl/migrate)   | Migrate your Chronograf configuration store  |
