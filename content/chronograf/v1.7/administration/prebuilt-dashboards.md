---
title: Prebuilt dashboards in Chronograf
description: Prebuilt dashboards available to import based on Telegraf input plugins.
menu:
  chronograf_1_7:
    name: Prebuilt dashboards in Chronograf
    weight: 50
    parent: Administration
---
Chronograf lets you import a variety of prebuilt dashboards that visualize metrics collect by specific [Telegraf input plugins](/{{< latest "telegraf" >}}/plugins). The following Telegraf-related dashboards templates are available.

For details on how to import dashboards while adding a connection in Chronograf, see [Creating connections](/chronograf/v1.7/administration/creating-connections/#manage-influxdb-connections-using-the-chronograf-ui).

## Docker

The Docker dashboard displays the following information:

- nCPU
- Total Memory
- # Containers
- System Memory Usage
- System Load
- Disk I/O
- Filesystem Usage
- Block I/O per Container
- CPU Usage per Container
- Memory Usage % per Container
- Memory Usage per Container
- Net I/O per Container

### Plugins

- [`docker` plugin](/{{< latest "telegraf" >}}/plugins/#docker)
- [`disk` plugin](/{{< latest "telegraf" >}}/plugins/#disk)
- [`mem` plugin](/{{< latest "telegraf" >}}/plugins/#mem)
- [`diskio` plugin](/{{< latest "telegraf" >}}/plugins/#diskio)
- [`system` plugin](/{{< latest "telegraf" >}}/plugins/#system)
- [`cpu` plugin](/{{< latest "telegraf" >}}/plugins/#cpu)

## Kubernetes Node
The Kubernetes Node dashboard displays the following information:

- Total Nodes
- Total Pod Count
- Total Containers
- K8s - Node Millicores
- K8s - Node Memory Bytes
- K8s - Pod Millicores
- K8s - Pod Memory Bytes
- K8s - Pod TX Bytes/Second
- K8s - Pod RX Bytes/Second
- K8s - Kubelet Millicores
- K8s - Kubelet Memory Bytes

### Plugins
- [kubernetes](/{{< latest "telegraf" >}}/plugins/#kubernetes)

## Kubernetes Overview
The Kubernetes Node dashboard displays the following information:

- Total Nodes
- Total Pod Count
- Total Containers
- K8s - Node Millicores
- K8s - Node Memory Bytes
- K8s - Pod Millicores
- K8s - Pod Memory Bytes
- K8s - Pod TX Bytes/Second
- K8s - Pod RX Bytes/Second
- K8s - Kubelet Millicores
- K8s - Kubelet Memory Bytes

### Plugins

- [kubernetes](/{{< latest "telegraf" >}}/plugins/#kubernetes)

## Kubernetes Pod
The Kubernetes Pod dashboard displays the following information:

- Total Nodes
- Total Pod Count
- Total Containers
- K8s - Pod Millicores
- K8s - Pod Memory Bytes
- K8s - Pod Millicores
- K8s - Pod Memory Bytes
- K8s - Pod TX Bytes/Second

### Plugins
- [kubernetes](/{{< latest "telegraf" >}}/plugins/#kubernetes)

## Riak
The Riak dashboard displays the following information:

- Riak - Total Memory Bytes
- Riak - Object Byte Size
- Riak - Number of Siblings/Minute
- Riak - Latency (ms)
- Riak - Reads and Writes/Minute
- Riak - Active Connections
- Riak - Read Repairs/Minute

### Plugins
- [`riak` plugin](/{{< latest "telegraf" >}}/plugins/#riak)

## Consul
The Consul dashboard displays the following information:

- Consul - Number of Critical Health Checks
- Consul - Number of Warning Health Checks

### Plugins
- [`consul` plugin](/{{< latest "telegraf" >}}/plugins/#consul)

## Consul Telemetry
The Consul Telemetry dashboard displays the following information:

- Consul Agent - Number of Go Routines
- Consul Agent - Runtime Alloc Bytes
- Consul Agent - Heap Objects
- Consul - Number of Agents
- Consul - Leadership Election
- Consul - HTTP Request Time (ms)
- Consul - Leadership Change
- Consul - Number of Serf Events

### Plugins
[`consul` plugin](/{{< latest "telegraf" >}}/plugins/#consul)


## Mesos
The Mesos dashboard displays the following information:

- Mesos Active Slaves
- Mesos Tasks Active
- Mesos Tasks
- Mesos Outstanding Offers
- Mesos Available/Used CPUs
- Mesos Available/Used Memory
- Mesos Master Uptime

### Plugins
- [`mesos` plugin](/{{< latest "telegraf" >}}/plugins/#mesos)

## RabbitMQ
The RabbitMQ dashboard displays the following information:

- RabbitMQ - Overview
- RabbitMQ - Published/Delivered per Second
- RabbitMQ - Acked/Unacked per Second

### Plugins

- [`rabbitmq` plugin](/{{< latest "telegraf" >}}/plugins/#rabbitmq)

## System

The System dashboard displays the following information:

- System Uptime
- CPUs
- RAM
- Memory Used %
- Load
- I/O
- Network
- Processes
- Swap


### Plugins

- [`system` plugin](/{{< latest "telegraf" >}}/plugins/#system)
- [`mem` plugin](/{{< latest "telegraf" >}}/plugins/#mem)
- [`cpu` plugin](/{{< latest "telegraf" >}}/plugins/#cpu)
- [`disk` plugin](/{{< latest "telegraf" >}}/plugins/#disk)
- [`diskio` plugin](/{{< latest "telegraf" >}}/plugins/#diskio)
- [`net` plugin](/{{< latest "telegraf" >}}/plugins/#net)
- [`processes` plugin](/{{< latest "telegraf" >}}/plugins/#processes)
- [`swap` plugin](/{{< latest "telegraf" >}}/plugins/#swap)



## VMware vSphere Overview
The VMware vSphere Overview dashboard gives an overview of your VMware vSphere Clusters and uses metrics from the `vsphere_cluster_*` and `vsphere_vm_*` set of measurements. It displays the following information:

- Cluster Status
  - Uptime for :clustername:
  - CPU Usage for :clustername:
  - RAM Usage for :clustername:
  - Datastores - Usage Capacity
  - Network Usage for :clustername:
  - Disk Throughput for :clustername:
- VM Status
  - VM CPU Usage MHz for :clustername:
  - VM Mem Usage for :clustername:
  - VM Network Usage for :clustername:
  - VM CPU % Ready for :clustername:

### Plugins
- [`vsphere` plugin](/{{< latest "telegraf" >}}/plugins/#vmware-vsphere)

## Apache
The Apache dashboard displays the following information:

- System Uptime
- CPUs
- RAM
- Memory Used %
- Load
- I/O
- Network
- Workers
- Scoreboard
- Apache Uptime
- CPU Load
- Requests per Sec
- Throughput
- Response Codes
- Apache Log

### Plugins

- [`apache` plugin](/{{< latest "telegraf" >}}/plugins/#apache)
- [`system` plugin](/{{< latest "telegraf" >}}/plugins/#system)
- [`mem` plugin](/{{< latest "telegraf" >}}/plugins/#mem)
- [`diskio` plugin](/{{< latest "telegraf" >}}/plugins/#diskio)
- [`net` plugin](/{{< latest "telegraf" >}}/plugins/#net)
- [`logparser` plugin](/{{< latest "telegraf" >}}/plugins/#logparser)

## ElasticSearch
The ElasticSearch dashboard displays the following information:

- ElasticSearch - Query Throughput
- ElasticSearch - Open Connections
- ElasticSearch - Query Latency
- ElasticSearch - Fetch Latency
- ElasticSearch - Suggest Latency
- ElasticSearch - Scroll Latency
- ElasticSearch - Indexing Latency
- ElasticSearch - JVM GC Collection Counts
- ElasticSearch - JVM GC Latency
- ElasticSearch - JVM Heap Usage

### Plugins
- [`elasticsearch` plugin](/{{< latest "telegraf" >}}/plugins/#elasticsearch)


## InfluxDB
The InfluxDB dashboard displays the following information:

- System Uptime
- System Load
- Network
- Memory Usage
- CPU Utilization %
- Filesystems Usage
- # Measurements
- nCPU
- # Series
- # Measurements per DB
- # Series per DB
- InfluxDB Memory Heap
- InfluxDB Active Requests
- InfluxDB - HTTP Requests/Min
- InfluxDB GC Activity
- InfluxDB - Written Points/Min
- InfluxDB - Query Executor Duration
- InfluxDB - Write Errors
- InfluxDB - Client Errors
- # CQ/Minute

### Plugins

- [`influxdb` plugin](/{{< latest "telegraf" >}}/plugins/#influxdb)
- [`cpu` plugin](/{{< latest "telegraf" >}}/plugins/#cpu)
- [`system` plugin](/{{< latest "telegraf" >}}/plugins/#system)
- [`mem` plugin](/{{< latest "telegraf" >}}/plugins/#mem)
- [`diskio` plugin](/{{< latest "telegraf" >}}/plugins/#diskio)
- [`net` plugin](/{{< latest "telegraf" >}}/plugins/#net)



## Memcached
The Memcached dashboard displays the following information:

- Memcached - Current Connections
- Memcached - Get Hits/Second
- Memcached - Get Misses/Second
- Memcached - Delete Hits/Second
- Memcached - Delete Misses/Second
- Memcached - Incr Hits/Second
- Memcached - Incr Misses/Second
- Memcached - Current Items
- Memcached - Total Items
- Memcached - Bytes Stored
- Memcached - Bytes Read/Sec
- Memcached - Bytes Written/Sec
- Memcached - Evictions/10 Seconds

### Plugins
- [`memcached` plugin](/{{< latest "telegraf" >}}/plugins/#memcached)


## NSQ
The NSQ dashboard displays the following information:

- NSQ - Channel Client Count
- NSQ - Channel Messages Count
- NSQ - Topic Count
- NSQ - Server Count
- NSQ - Topic Messages
- NSQ - Topic Messages on Disk
- NSQ - Topic Ingress
- NSQ - Topic Egress

### Plugins
- [`nsq` plugin](/{{< latest "telegraf" >}}/plugins/#nsq)

## PostgreSQL
The PostgreSQL dashboard displays the following information:

- System Uptime
- nCPU
- System Load
- Total Memory
- Memory Usage
- Filesystems Usage
- CPU Usage
- System Load
- I/O
- Network
- Processes
- Swap
- PostgreSQL rows out/sec
- PostgreSQL rows in/sec
- PostgreSQL - Buffers
- PostgreSQL commit/rollback per sec
- Postgres deadlocks/conflicts

### Plugins

- [`postgresql` plugin](/{{< latest "telegraf" >}}/plugins/#postgresql)
- [`system` plugin](/{{< latest "telegraf" >}}/plugins/#system)
- [`mem` plugin](/{{< latest "telegraf" >}}/plugins/#mem)
- [`cpu` plugin](/{{< latest "telegraf" >}}/plugins/#cpu)
- [`diskio` plugin](/{{< latest "telegraf" >}}/plugins/#diskio)


## HAProxy
The HAProxy dashboard displays the following information:

- HAProxy - Number of Servers
- HAProxy - Sum HTTP 2xx
- HAProxy - Sum HTTP 4xx
- HAProxy - Sum HTTP 5xx
- HAProxy - Frontend HTTP Requests/Second
- HAProxy - Frontend Sessions/Second
- HAProxy - Frontend Session Usage %
- HAProxy - Frontend Security Denials/Second
- HAProxy - Frontend Request Errors/Second
- HAProxy - Frontend Bytes/Second
- HAProxy - Backend Average Response Time
- HAProxy - Backend Connection Errors/Second
- HAProxy - Backend Queued Requests/Second
- HAProxy - Backend Average Requests Queue Time (ms)
- HAProxy - Backend Error Responses/Second

### Plugins
- [`haproxy` plugin](/{{< latest "telegraf" >}}/plugins/#haproxy)


## NGINX
The NGINX dashboard displays the following information:

- NGINX - Client Connection
- NGINX - Client Errors
- NGINX - Client Requests
- NGINX - Active Client State

### Plugins
- [`nginx` plugin](/{{< latest "telegraf" >}}/plugins/#nginx)

## Redis
The Redis dashboard displays the following information:

- Redis - Connected Clients
- Redis - Blocked Clients
- Redis - CPU
- Redis - Memory

### Plugins
- [`redis` plugin](/{{< latest "telegraf" >}}/plugins/#redis)


## VMware vSphere VMs
The VMWare vSphere VMs dashboard gives an overview of your VMware vSphere virtual machines and includes metrics from the `vsphere_vm_*` set of measurements. It displays the following information:

- Uptime for :vmname:
- CPU Usage for :vmname:
- RAM Usage for :vmname:
- CPU Usage Average for :vmname:
- RAM Usage Average for :vmname:
- CPU Ready Average % for :vmname:
- Network Usage for:vmname:
- Total Disk Latency for :vmname:

### Plugins
- [`vsphere` plugin](/{{< latest "telegraf" >}}/plugins/#vsphere)

## VMware vSphere Hosts

The VMWare vSphere Hosts dashboard displays the following information:

- Uptime for :esxhostname:
- CPU Usage for :esxhostname:
- RAM Usage for :esxhostname:
- CPU Usage Average for :esxhostname:
- RAM Usage Average for :esxhostname:
- CPU Ready Average % for :esxhostname:
- Network Usage for :esxhostname:
- Total Disk Latency for :esxhostname:

### Plugins
- [`vsphere` plugin](/{{< latest "telegraf" >}}/plugins/#vsphere)

## PHPfpm
The PHPfpm dashboard displays the following information:

- PHPfpm - Accepted Connections
- PHPfpm - Processes
- PHPfpm - Slow Requests
- PHPfpm - Max Children Reached

### Plugins
- [`phpfpm` plugin](/{{< latest "telegraf" >}}/plugins/#nginx)

## Win System
The Win System dashboard displays the following information:

- System - CPU Usage
- System - Available Bytes
- System - TX Bytes/Second
- System - RX Bytes/Second
- System - Load

### Plugins
- [`win_services` plugin](/{{< latest "telegraf" >}}/plugins/#windows-services)


## MySQL
The MySQL dashboard displays the following information:

- System Uptime
- nCPU
- MySQL uptime
- Total Memory
- System Load
- Memory Usage
- InnoDB Buffer Pool Size
- InnoDB Buffer Usage
- Max Connections
- Open Connections
- I/O
- Network
- MySQL Connections/User
- MySQL Received Bytes/Sec
- MySQL Sent Bytes/Sec
- MySQL Connections
- MySQL Queries/Sec
- MySQL Slow Queries
- InnoDB Data

### Plugins
- [`mySQL` plugin](/{{< latest "telegraf" >}}/plugins/#mysql)
- [`system` plugin](/{{< latest "telegraf" >}}/plugins/#system)
- [`mem` plugin](/{{< latest "telegraf" >}}/plugins/#mem)

## Ping
The Ping dashboard displays the following information:

- Ping - Packet Loss Percent
- Ping - Response Times (ms)

### Plugins
- [`ping` plugin](/{{< latest "telegraf" >}}/plugins/#ping)
