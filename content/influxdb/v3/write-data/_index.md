---
title: Write data to InfluxDB 3 Core
list_title: Write data
description: >
  Collect and write time series data to InfluxDB 3 Core.
weight: 3
menu:
  influxdb_v3:
    name: Write data
influxdb/v3/tags: [write, line protocol]
# related:
#   - /influxdb/cloud/api/#tag/Write, InfluxDB API /write endpoint
#   - /influxdb/cloud/reference/syntax/line-protocol
#   - /influxdb/cloud/reference/syntax/annotated-csv
#   - /influxdb/cloud/reference/cli/influx/write
#   - /resources/videos/ingest-data/, How to Ingest Data in InfluxDB (Video)
---

Write data to {{% product-name %}} using the following tools and methods:

> [!Note]
>
> #### Choose the write endpoint for your workload
>
> Bringing existing v1 write workloads? Use the {{% product-name %}} HTTP API [`/write` endpoint](/influxdb/cloud-dedicated/guides/api-compatibility/v1/).
> Creating new write workloads? Use the HTTP API [???]


## Core

### Install InfluxDB 3 Core

```bash
~/Downloads/install_InfluxDB_OSS.sh
```

### Write line protocol using the `influxdb3` CLI

Write line protocol data using the `influxdb3` CLI
   
   ```bash
   influxdb3 write \
   --database=home \
   --file /Users/ja/Documents/github/docs-v2/static/downloads/home-sensor-data.lp
   ```
   
   Outputs the following:

   <!--pytest-codeblocks:expected-output-->
   ```
   success
   ```

### Create an authorization token

With InfluxDB 3 installed, use the `influxdb3` CLI to create an authorization **token**.

   <!--pytest.mark.skipif("influxdb3 0.1.0, revision v2.5.0-14232-gdfc853d9035efad39f09577755cd1c6397e299ba"=="influxdb3 0.1.0, revision v2.5.0-14232-gdfc853d9035efad39f09577755cd1c6397e299ba", reason="Failing with Rust error")-->
   ```bash
   influxdb3 create token
   ```

   Outputs the following error:

   ```text
   ~/Documents/github/docs-v2 | jstirnaman/monolith-clients:monolith *25 ?1 ............................ 15:35:02 
   > influxdb3 create token  
   thread 'main' panicked at influxdb3/src/commands/create.rs:84:34:
   internal error: entered unreachable code
   note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
   ```

   - Running on `host0`, `0.0.0.0:8181`
   - Installed `influxdb3 0.1.0, revision v2.5.0-14232-gdfc853d9035efad39f09577755cd1c6397e299ba` using install_InfluxDB_OSS.sh from the Dec 11 Haystack post

## Write line protocol using `curl`

Write line protocol data using `curl` and the InfluxDB HTTP API `/api/v3/write` endpoint (doesn't require a token):

   ```bash
   response=$(curl --silent --write-out "%{response_code}:-%{errormsg}" \
     "http://0.0.0.0:8181/api/v3/write?database=home&precision=s" \
     --header "Content-Type: text/plain; charset=utf-8" \
     --header "Accept: application/json" \
     --data-binary "
   home,room=Bedroom-Master temp=21.1,hum=35.9,co=0i 1735804800
   home,room=Bedroom-Master temp=21.4,hum=35.9,co=0i 1735808400
   home,room=Bedroom-Master temp=21.8,hum=36.0,co=0i 1735812000
   home,room=Bedroom-Master temp=22.2,hum=36.0,co=0i 1735815600
   home,room=Bedroom-Master temp=22.2,hum=35.9,co=0i 1735819200
   home,room=Bedroom-Master temp=22.4,hum=36.0,co=0i 1735822800
   home,room=Bedroom-Master temp=22.3,hum=36.1,co=0i 1735826400
   home,room=Bedroom-Master temp=22.3,hum=36.1,co=1i 1735830000
   home,room=Bedroom-Master temp=22.4,hum=36.0,co=4i 1735833600
   home,room=Bedroom-Master temp=22.6,hum=35.9,co=5i 1735837200
   home,room=Bedroom-Master temp=22.8,hum=36.2,co=9i 1735840800
   home,room=Bedroom-Master temp=22.5,hum=36.3,co=14i 1735844400
   home,room=Bedroom-Master temp=22.2,hum=36.4,co=17i 1735848000
   ")

   # Format the response code and error message output.
   response_code=${response%%:-*}
   errormsg=${response#*:-}

   # Remove leading and trailing whitespace from errormsg
   errormsg=$(echo "${errormsg}" | tr -d '[:space:]')

   echo "$response_code"
   if [[ $errormsg ]]; then
     echo "$errormsg"
   fi
   ```

## Write line protocol from a compressed file using curl

Write line protocol from a compressed file using `curl` and the InfluxDB HTTP API `/api/v3/write` endpoint:

   ```bash
   gzip ./static/downloads/home-sensor-data.lp home-sensor-data.gzip

   response=$(curl --silent --write-out "%{response_code}:-%{errormsg}" \
     "http://0.0.0.0:8181/api/v3/write?database=home&precision=s" \
     --form \
     --header "Content-Type: text/plain; charset=utf-8" \
     --header "Content-Encoding: gzip" \
     --header "Accept: application/json" \
     --data=@home-sensor-data.gzip
   )

   # Format the response code and error message output.
   response_code=${response%%:-*}
   errormsg=${response#*:-}

   # Remove leading and trailing whitespace from errormsg
   errormsg=$(echo "${errormsg}" | tr -d '[:space:]')

   echo "$response_code"
   if [[ $errormsg ]]; then
     echo "$errormsg"
   fi
   ```
