---
description: "Telegraf plugin for collecting metrics from Apache Solr"
menu:
  telegraf_v1_ref:
    parent: input_plugins_reference
    name: Apache Solr
    identifier: input-solr
tags: [Apache Solr, "input-plugins", "configuration", "server"]
introduced: "v1.5.0"
os_support: "freebsd, linux, macos, solaris, windows"
related:
  - /telegraf/v1/configure_plugins/
  - https://github.com/influxdata/telegraf/tree/v1.37.1/plugins/inputs/solr/README.md, Apache Solr Plugin Source
---

# Apache Solr Input Plugin

This plugin collects statistics from [Solr](http://lucene.apache.org/solr/) instances using the
[MBean Request Handler](https://cwiki.apache.org/confluence/display/solr/MBean+Request+Handler). For additional details on
performance statistics check the [performance statistics reference](https://cwiki.apache.org/confluence/display/solr/Performance+Statistics+Reference).

> [!NOTE]
> This plugin requires Apache Solr v3.5+.

**Introduced in:** Telegraf v1.5.0
**Tags:** server
**OS support:** all

[solr]: http://lucene.apache.org/solr/
[mbean_request_handler]: https://cwiki.apache.org/confluence/display/solr/MBean+Request+Handler
[reference]: https://cwiki.apache.org/confluence/display/solr/Performance+Statistics+Reference

## Global configuration options <!-- @/docs/includes/plugin_config.md -->

Plugins support additional global and plugin configuration settings for tasks
such as modifying metrics, tags, and fields, creating aliases, and configuring
plugin ordering. See [CONFIGURATION.md](/telegraf/v1/configuration/#plugins) for more details.

[CONFIGURATION.md]: ../../../docs/CONFIGURATION.md#plugins

## Configuration

```toml @sample.conf
# Read stats from one or more Solr servers or cores
[[inputs.solr]]
  ## specify a list of one or more Solr servers
  servers = ["http://localhost:8983"]

  ## specify a list of one or more Solr cores (default - all)
  # cores = ["*"]
  
  ## Optional HTTP Basic Auth Credentials
  # username = "username"
  # password = "pa$$word"

  ## Timeout for HTTP requests
  # timeout = "5s"
```

## Metrics

- solr_core
  - tags
    - core
    - handler
  - fields
    - num_docs (integer)
    - max_docs (integer)
    - deleted_docs (integer)
- solr_queryhandler
  - tags
    - core
    - handler
  - fields
    - depends on the handler information

## Example Output

```text
solr_core,core=main,handler=searcher,host=testhost deleted_docs=17616645i,max_docs=261848363i,num_docs=244231718i 1478214949000000000
solr_core,core=main,handler=core,host=testhost deleted_docs=0i,max_docs=0i,num_docs=0i 1478214949000000000
solr_queryhandler,core=main,handler=/replication,host=testhost 15min_rate_reqs_per_second=0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000444659081257,5min_rate_reqs_per_second=0.00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014821969375,75th_pc_request_time=16.484211,95th_pc_request_time=16.484211,999th_pc_request_time=16.484211,99th_pc_request_time=16.484211,avg_requests_per_second=0.0000008443809966322143,avg_time_per_request=12.984811,errors=0i,handler_start=1474662050865i,median_request_time=11.352427,requests=3i,timeouts=0i,total_time=38.954433 1478214949000000000
solr_queryhandler,core=main,handler=/update/extract,host=testhost 15min_rate_reqs_per_second=0,5min_rate_reqs_per_second=0,75th_pc_request_time=0,95th_pc_request_time=0,999th_pc_request_time=0,99th_pc_request_time=0,avg_requests_per_second=0,avg_time_per_request=0,errors=0i,handler_start=0i,median_request_time=0,requests=0i,timeouts=0i,total_time=0 1478214949000000000
solr_queryhandler,core=main,handler=org.apache.solr.handler.component.SearchHandler,host=testhost 15min_rate_reqs_per_second=0,5min_rate_reqs_per_second=0,75th_pc_request_time=0,95th_pc_request_time=0,999th_pc_request_time=0,99th_pc_request_time=0,avg_requests_per_second=0,avg_time_per_request=0,errors=0i,handler_start=1474662050861i,median_request_time=0,requests=0i,timeouts=0i,total_time=0 1478214949000000000
solr_queryhandler,core=main,handler=/tvrh,host=testhost 15min_rate_reqs_per_second=0,5min_rate_reqs_per_second=0,75th_pc_request_time=0,95th_pc_request_time=0,999th_pc_request_time=0,99th_pc_request_time=0,avg_requests_per_second=0,avg_time_per_request=0,errors=0i,handler_start=0i,median_request_time=0,requests=0i,timeouts=0i,total_time=0 1478214949000000000
```
