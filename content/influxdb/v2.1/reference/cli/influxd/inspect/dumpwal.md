---
title: influxd inspect dumpwal
description: >
  The `influxd inspect dumpwal` command outputs data from WAL files.
influxdb/v2.1/tags: [wal, inspect]
menu:
  influxdb_2_1_ref:
    parent: influxd inspect
weight: 301
draft: true
---

The `influxd inspect dumpwal` command outputs data from Write Ahead Log (WAL) files.
Given a list of file path globs (patterns that match `.wal` file paths),
the command parses and prints out entries in each file.

## Usage
```sh
influxd inspect dumpwal [flags] <globbing-patterns>
```

## Output details
The `--find-duplicates` flag determines the `influxd inspect dumpwal` output.

**Without `--find-duplicates`**, the command outputs the following for each file
that matches the specified [globbing patterns](#globbing-patterns):

- The file name
- For each entry in a file:
	  - The type of the entry (`[write]` or `[delete-bucket-range]`)
	  - The formatted entry contents

**With `--find-duplicates`**, the command outputs the following for each file
that matches the specified [globbing patterns](#globbing-patterns):

- The file name
- A list of keys with timestamps in the wrong order

## Arguments

### Globbing patterns
Globbing patterns provide partial paths used to match file paths and names.

##### Example globbing patterns
```sh
# Match any file or folder starting with "foo"
foo*

# Match any file or folder starting with "foo" and ending with .txt
foo*.txt

# Match any file or folder ending with "foo"
*foo

# Match foo/bar/baz but not foo/bar/bin/baz
foo/*/baz

# Match foo/baz and foo/bar/baz and foo/bar/bin/baz
foo/**/baz

# Matches cat but not can or c/t
/c?t
```

## Flags
| Flag |                     | Description                                                                |
|:---- |:---                 |:-----------                                                                |
|      | `--find-duplicates` | Ignore dumping entries; only report keys in the WAL that are out of order. |
| `-h` | `--help`            | Help for the `dumpwal` cinnabd.                                            |
