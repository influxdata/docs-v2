---
title: InfluxDB runtime
description: >
  Learn how to collect Go runtime profiling and tracing information to help with InfluxDB performance analysis and debugging.
menu:
  influxdb_2_1_ref:
    name: Runtime
    parent: InfluxDB internals
weight: 103
influxdb/v2.1/tags: [go, internals, performance]
---

InfluxDB provides Go runtime profiles, trace, and other information
useful for analyzing and debugging the server runtime execution.

- [Analyze Go runtime profiles](#analyze-go-runtime-profiles)
- [Analyze the Go runtime trace](#analyze-the-go-runtime-trace)
- [View the command line that invoked InfluxDB](#view-the-command-line-that-invoked-influxdb)

## Analyze Go runtime profiles

A [Go runtime profile](https://pkg.go.dev/runtime/pprof) is a collection of stack traces showing call sequences that led to
instances of a particular event, such as memory allocation.

When you send a profile request to InfluxDB, the [Golang runtime pprof package](https://pkg.go.dev/runtime/pprof) samples the
current runtime to collect profiling data, and then returns the profile as a compressed protocol buffer file in
[profile.proto](https://github.com/google/pprof/blob/master/proto/profile.proto) format.

To fetch and process **profile.proto** profiles, use the [`go tool pprof` command](https://github.com/google/pprof).
`pprof` provides the following support for the **profile.proto** format:
- Read profiles from disk or HTTP.
- Aggregate and compare multiple profiles of the same type.
- Analyze and filter profile data.
- Generate visualizations and reports.

For most profiles, InfluxDB provides an alternative "legacy" plain text format with comments that translate to function calls and line numbers, but
`pprof` and the **profile.proto** format offer many advantages over plain text.

Use the `/debug/pprof` InfluxDB endpoints to download all the profiles at once or request them individually.

- [Get all runtime profiles](#get-all-runtime-profiles)
- [Profile all memory allocations](#profile-all-memory-allocations)
- [Profile blocking operations](#profile-blocking-operations)
- [Profile CPU](#profile-cpu)
- [Profile goroutines](#profile-goroutines)
- [Profile heap memory allocations](#profile-heap-memory-allocations)
- [Profile mutual exclusions](#profile-mutual-exclusions-mutexes)
- [Profile thread creation](#profile-thread-creation)

### Get all runtime profiles

To download all runtime profiles at once, use an HTTP client like `curl` or `wget` to send a `GET` request to the `/debug/pprof/all` endpoint. `go tool pprof` can't fetch profiles directly from `/debug/pprof/all`.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/all" %}}

InfluxDB returns a gzipped tar file that contains profiles in the **profile.proto** format:

- `profiles/allocs.pb.gz`: [profile all memory allocations](#profile-all-memory-allocations)
- `profiles/block.pb.gz`: [profile blocking operations](#profile-blocking-operations)
- `profiles/cpu.pb.gz`: _(Optional)_ [profile CPU](#profile-cpu).
- `profiles/goroutine.pb.gz`: [profile goroutines](#profile-goroutines)
- `profiles/heap.pb.gz`: [profile heap memory allocations](#profile-heap-memory-allocations)
- `profiles/mutex.pb.gz`: [profile mutual exclusions](#profile-mutual-exclusions-mutexes)
- `profiles/threadcreate.pb.gz`: [profile thread creation](#profile-thread-creation)

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Profile CPU | Use the `cpu` query parameter in your request URL | [duration of seconds](/influxdb/v2.1/reference/glossary/#duration) |


#### Example

```sh
# Use `curl` to download a `.tar.gz` of all profiles after 10 seconds of CPU sampling.
# Use `tar` to extract the profiles folder.

curl "http://localhost:8086/debug/pprof/all?cpu=10s" | tar -xz

# Analyze an extracted profile.

go tool pprof profiles/heap.pb.gz
```

### Profile all memory allocations

Profiles memory allocations and sets the default profile display to __alloc_space__,
the total number of bytes allocated since the program began (including garbage-collected bytes).

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/allocs" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Output plain text (mutually exclusive with `seconds`) | Use the `debug` query parameter in your request URL | `1` |
| Seconds to sample (mutually exclusive with `debug=1`) | Use the `seconds` query parameter in your request URL | [unsigned integer](/influxdb/v2.1/reference/glossary/#unsigned-integer) |

```sh
# Analyze the profile in interactive mode.

go tool pprof http://localhost:8086/debug/pprof/allocs

# `pprof` returns the following prompt:
#   Entering interactive mode (type "help" for commands, "o" for options)
#   (pprof)

# At the prompt, get the top N memory allocations.

(pprof) top10
```

### Profile blocking operations

Profiles operations that led to blocking on synchronization primitives and caused Go to suspend goroutine's execution.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/block" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Output plain text | Use the `debug` query parameter in your request URL | `1` |

```sh
# Analyze the profile in interactive mode.

go tool pprof http://localhost:8086/debug/pprof/block

# `pprof` returns the following prompt:
#   Entering interactive mode (type "help" for commands, "o" for options)
#   (pprof)

#  At the prompt, get the top N entries.

(pprof) top10
```

### Profile CPU

Profiles program counters sampled from the execution stack. To download the profile, use an HTTP client to send a `GET` request to the `/debug/pprof/profile` endpoint. (`go tool pprof` can't fetch the CPU profile directly.)

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/profile" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Seconds to sample CPU (default `30`) | Use the `seconds` query parameter in your request URL | [unsigned integer](/influxdb/v2.1/reference/glossary/#unsigned-integer) |

Use an HTTP client like `curl` or `wget` to download the profile.

#### Example

```sh
# Get the profile.

curl http://localhost:8086/debug/pprof/profile -o cpu

# Analyze the profile in interactive mode.

go tool pprof ./cpu

# At the prompt, get the top N functions most often running
# or waiting during the sample period.

(pprof) top10
```

Use the `seconds` query parameter to control the sampling duration.

{{% note %}}

`/debug/pprof/profile?seconds=SECONDS` returns the same CPU profile as `/debug/pprof/all?cpu=DURATION`.

{{% /note %}}

#### Example

```sh
# Get the CPU profile after 10 seconds of sampling.

curl "http://localhost:8086/debug/pprof/profile?seconds=10" -o cpu

# Get all profiles after 10 seconds of CPU sampling.

curl "http://localhost:8086/debug/pprof/all?cpu=10s" -o all.tar.gz
```

### Profile goroutines

Profiles all current goroutines.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/goroutine" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Output plain text (mutually exclusive with `seconds`) | Use the `debug` query parameter in your request URL | `1` |
| Seconds to sample (mutually exclusive with `debug=1`) | Use the `seconds` query parameter in your request URL | [unsigned integer](/influxdb/v2.1/reference/glossary/#unsigned-integer) |

#### Example

```sh
# Analyze the profile in interactive mode.

go tool pprof http://localhost:8086/debug/pprof/goroutine

# `pprof` returns the following prompt:
#   Entering interactive mode (type "help" for commands, "o" for options)
#   (pprof)

#  At the prompt, get the top N entries.

(pprof) top10
```

### Profile heap memory allocations

Profiles heap, or memory allocations for live objects.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/heap" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Output plain text (mutually exclusive with `seconds`) | Use the `debug` query parameter in your request URL | `1` |
| Run garbage control before sampling | Use the `gc` query parameter in your request URL | `1` |
| Seconds to sample (mutually exclusive with `debug=1`) | Use the `seconds` query parameter in your request URL | [unsigned integer](/influxdb/v2.1/reference/glossary/#unsigned-integer) |

#### Example

```sh
# Analyze the profile in interactive mode.

go tool pprof http://localhost:8086/debug/pprof/heap

# `pprof` returns the following prompt:
#   Entering interactive mode (type "help" for commands, "o" for options)
#   (pprof)

# At the prompt, get the top N memory-intensive nodes.

(pprof) top10

# pprof displays the list:
#   Showing nodes accounting for 142.46MB, 85.43% of 166.75MB total
#   Dropped 895 nodes (cum <= 0.83MB)
#   Showing top 10 nodes out of 143
```

### Profile mutual exclusions (mutexes)

Profiles holders of contended mutual exclusions (mutexes).

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/mutex" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Output plain text (mutually exclusive with `seconds`) | Use the `debug` query parameter in your request URL | `1` |
| Seconds to sample (mutually exclusive with `debug=1`) | Use the `seconds` query parameter in your request URL | [unsigned integer](/influxdb/v2.1/reference/glossary/#unsigned-integer) |

#### Example

```sh
# Analyze the profile in interactive mode.

go tool pprof http://localhost:8086/debug/pprof/mutex

# `pprof` returns the following prompt:
#   Entering interactive mode (type "help" for commands, "o" for options)
#   (pprof)

#  At the prompt, get the top N entries.

(pprof) top10
```

### Profile thread creation

Profiles operations that led to the creation of OS threads.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/threadcreate" %}}

| Option  | Include by | Value |
|:--------|:-----------|:-------|
| Output plain text (mutually exclusive with `seconds`) | Use the `debug` query parameter in your request URL | `1` |
| Seconds to sample (mutually exclusive with `debug=1`) | Use the `seconds` query parameter in your request URL | [unsigned integer](/influxdb/v2.1/reference/glossary/#unsigned-integer) |

#### Example

```sh
# Analyze the profile in interactive mode.

go tool pprof http://localhost:8086/debug/pprof/threadcreate

# `pprof` returns the following prompt:
#   Entering interactive mode (type "help" for commands, "o" for options)
#   (pprof)

#  At the prompt, get the top N entries.

(pprof) top10
```

## Analyze the Go runtime trace

To trace execution events for InfluxDB, use the `/debug/pprof/trace`
endpoint with `go tool trace`.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/trace" %}}

#### Example

```sh
# Download the trace file.

curl http://localhost:8086/debug/pprof/trace -o trace.out

# Analyze the trace.

go tool trace ./trace.out
```

#### Generate a pprof-like profile from trace

You can use `go tool trace` to generate _pprof-like_ profiles from
a trace file, and then analyze them with `go tool pprof`.

#### Example

```sh
# Generate a profile from the downloaded trace file.

go tool trace -pprof=PROFILE_TYPE ./trace.out > PROFILE_TYPE.pprof
```

Replace *`PROFILE_TYPE`* with one of the following [Golang profile types](https://pkg.go.dev/cmd/trace):

- `net`: network blocking profile
- `sync`: synchronization blocking profile
- `syscall`: syscall blocking profile
- `sched`: scheduler latency profile

## View the command line that invoked InfluxDB

To view the command, arguments, and command-line variables that invoked InfluxDB, use the `/debug/pprof/cmdline` endpoint.

{{% api-endpoint method="GET" endpoint="http://localhost:8086/debug/pprof/cmdline" %}}

`/debug/pprof/cmdline` returns the command line invocation in plain text.
