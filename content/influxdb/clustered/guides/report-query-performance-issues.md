---
title: Report query performance issues
description: >
  A comprehensive guide on ensuring a quick turnaround when troubleshooting query performance.
menu:
  influxdb_clustered:
    name: Report query performance issues
    parent: Guides
weight: 113
related:
  - /influxdb/clustered/query-data/troubleshoot-and-optimize
---

These guidelines are intended to faciliate collaboration between InfluxDB
engineers and you. They allow us to conduct timely analyses of any performance
issues that you have not been able to resolve following our [guide on
troubleshooting and optimizing
queries guide](/influxdb/clustered/query-data//troubleshoot-and-optimize).

# Table of Contents
1. [Send Us Output Artifacts](#send-us-output-artifacts)
2. [Document Your Test Process](#document-your-test-process)
3. [Document Your Environment](#document-your-environment)
   1. [Recommended](#recommended)
4. [Document Your Data Schema](#document-your-data-schema)
5. [Establish Query Performance Degradation Conditions](#establish-query-performance-degradation-conditions)
6. [Reduce Query Noise](#reduce-query-noise)
7. [Establish Baseline Single-Query Performance](#establish-baseline-single-query-performance)
8. [Run Queries at Multiple Load Scales](#run-queries-at-multiple-load-scales)
9. [Gather Debug Info](#gather-debug-info)
   1. [Kubernetes-Specific Info](#kubernetes-specific-info)
   2. [Clustered-Specific Info](#clustered-specific-info)
   3. [Query Analysis](#query-analysis)
      1. [EXPLAIN](#explain)
      2. [EXPLAIN VERBOSE](#explain-verbose)
      3. [EXPLAIN ANALYZE](#explain-analyze)

Please note that this document may change from one support engagement to the
next as our process and tooling improves. Thanks For your patience!

### Send Us Output Artifacts

When our guidelines produce an output artifact in the form

**Outputs:**
  * `test-artifact-name.tar.gz`

Please send us these artifacts so that we may analyze them.

### Document Your Test Process

We don't currently have a baseline performance test suite that we can offer
you to run in your environment so we rely on you to document your process,
including:

* The steps you take when performance testing.
* Timing of the tests you perform so we have an idea of where to look in the
  logs bundle you provide us.

### Document Your Environment

Please provide as much detail as your organization allows about:

* Your kubernetes cluster.
* The cloud where it runs.
  * Or indicate that it's on-prem.
* The hardware it runs on.
* The types and size of disk in use.
  * eg hard disk vs SSD vs NVMe
* CPU/Memory resources set on each type of InfluxDB pod.
* The number of pods in each InfluxDB StatefulSet and Deployment.
* The type of object store used and how it is hosted
* How the Postgres database is hosted.
* Are either the object store or the database shared by more than one InfluxDB
  3.0 Clustered product instance?
  * If so, please describe the network-level topology of your setup.

#### Recommended

If you can reproduce the performance issue with a synthetic dataset and your
process and environment are well-documented enough we _may_ be able to
reproduce the issue on our end as a way to shorten the feedback cycle and
arrive at a fix (on our end if it's a code issue or on your end if it's a
configuration issue) sooner.

### Document Your Data Schema

Documenting the data schema helps us to better understand the conditions that
reproduce your issue.

### Establish Query Performance Degradation Conditions

The most effective way to investigate query performance is to have a good understanding of
the conditions in which you don't see the expected performance. Things to think about
and provide:

- Does this happen always, or only sometimes?
  - If only sometimes, is it at a consistent time of day/over a consistent period?
- Will a single query execution reproduce, or do multiple queries need to be running at the same time?
- How are you submitting the queries? (examples could be:)
  - influxctl
  - client libraries
  - other environments

### Reduce Query Noise

In order to get a sense of the baseline performance of your system without the
noise of additional queries we ask that your testing occur in an environment
that doesn't have periodic or intermittent queries running concurrently.

Additionally, when running multiple tests with different queries we recommend
letting the system quiesce between tests by waiting at least a minute between a
given query result and issuing the next query.

### Establish Baseline Single-Query Performance

In order to get a sense of the baseline performance of your system without the
noise of additional queries we prefer at least some of your testing occur as
single queries in isolation from one another.

This is may be useful for the purposes of analysis by our engineers even if a
single query in isolation isn't enough to reproduce the issue you are having.

### Run Queries at Multiple Load Scales

Once you've established baseline performance with a single query
If your performance issue can't be replicated with a single query, then we
recommend a systematic approach to identifying the scale at which it does
become a problem. This involves systematic incremental increases to your query
concurrency until you identify a threshold at which the issue can be
reproduced.

This, along with information about your kubernetes environment, can provide us
the insight necessary to recommend changes to your configuration to improve
query performance characteristis as your usage scales.

As an example, consider the following test plan outline:

* Turn off intermittent/periodic InfluxDB queries, allow cluster to quiesce.
* Run on instance of Query A
  * allow cluster to quiesce for 1 minute
* Run 5 concurrent instances of Query A
  * allow cluster to quiesce for 1 minute
* Run 10 concurrent instances of Query A
  * allow cluster to quiesce for 1 minute
* Run 20 concurrent instances of Query A
  * allow cluster to quiesce for 1 minute
* Run 40 concurrent instances of Query A
  * allow cluster to quiesce for 1 minute
* Provide us the debug information [described below](#gather-debug-info).

Keep in mind, this is just an example -- you don't have to go beyond the scale
where queries get slower but you may also need to go further than what's
outlined here.

### Gather Debug Info

This section highlights debug information that should be collected shortly
_after_ a problematic query has been tried against your InfluxDB instance.

#### Kubernetes-Specific Info

**Outputs:**
  * `${DATETIME}-cluster-info.tar.gz`

```
DATETIME="$(date -Iminutes)"
kubectl cluster-info dump --namespace influxdb --output-directory "${DATETIME}-cluster-info/"
tar -czf "${DATETIME}-cluster-info.tar.gz" "${DATETIME}-cluster-info/"
```

#### Clustered-Specific Info

**Outputs:**
  * `app-instance.yml`

* Provide a copy of your `AppInstance` manifest.

#### Query Analysis

**Outputs (InfluxQl):**
  * `explain.csv`
  * `explain-verbose.csv`
  * `explain-analyze.csv`

**Outputs (SQL):**
  * `explain.txt`
  * `explain-verbose.txt`
  * `explain-analyze.txt`

For any known long-running queries, it may be helpful to execute variations of
the `EXPLAIN` command on them.

In the example snippets below we use `<YOUR-QUERY>` as placeholder for the
long-running query you have been working with.

##### EXPLAIN

**For InfluxQL Queries**
```
curl --get "https://${HOST}/query" \
  --output "./explain.csv" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Accept: application/csv" \
  --data-urlencode "db=${DATABASE}" \
  --data-urlencode "q=EXPLAIN <YOUR-QUERY>"
```

**For SQL Queries**
```
influxctl \
  --config config.toml \
    query \
  --database ${DATABASE} \
  --format table \
  --token ${TOKEN} \
  "EXPLAIN <YOUR-QUERY>;" > explain.txt
```

##### EXPLAIN VERBOSE

**For InfluxQL Queries**
```
curl --get "https://${HOST}/query" \
  --output "./explain-verbose.csv" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Accept: application/csv" \
  --data-urlencode "db=${DATABASE}" \
  --data-urlencode "q=EXPLAIN VERBOSE <YOUR-QUERY>"
```

**For SQL Queries**
```
influxctl \
  --config config.toml \
    query \
  --database ${DATABASE} \
  --format table \
  --token ${TOKEN} \
  "EXPLAIN VERBOSE <YOUR-QUERY>;" > explain-verbose.txt
```

##### EXPLAIN ANALYZE

**For InfluxQL Queries**
```
curl --get "https://${HOST}/query" \
  --output "./explain-analyze.csv" \
  --header "Authorization: Bearer ${TOKEN}" \
  --header "Accept: application/csv" \
  --data-urlencode "db=${DATABASE}" \
  --data-urlencode "q=EXPLAIN ANALYZE <YOUR-QUERY>"
```

**For SQL Queries**
```
influxctl \
  --config config.toml \
    query \
  --database ${DATABASE} \
  --format table \
  --token ${TOKEN} \
  "EXPLAIN ANALYZE <YOUR-QUERY>;" > explain-analyze.txt
```
