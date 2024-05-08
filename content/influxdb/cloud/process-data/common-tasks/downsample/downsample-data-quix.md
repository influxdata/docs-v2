---
title: Downsample data with Quix Streams
seotitle: Downsample data with Python and Quix Streams
description: >
  How to create Python service that downsamples data with Quix Streams.
menu:
  influxdb_cloud:
    name: Quix
    parent: Downsample data
    identifier: influxdb_cloud-downsample-quix
weight: 202
influxdb/v2/tags: [tasks]
---

Use [Quix Streams](https://github.com/quixio/quix-streams) to query time series
data stored in InfluxDB and written to Kafka at regular intervals, continuously
downsample it, and then write the downsampled data back to InfluxDB.
Quix Streams is an open source Python library for building containerized stream
processing applications with Apache Kafka. It is designed to run as a service
that continuously processes a stream of data while streaming the results to a
Kafka topic. You can try it locally, with a local Kafka installation, or run it
in [Quix Cloud](https://quix.io/) with a free trial.
A common practice when processing high volume data is to downsample it before comitting 
it to InfluxDB to reduce the overall disk usage as data collects over time.

This guide walks through the process of creating a series of Python services that ingest from InfluxDB v2, downsample and publish
data to InfluxDB v3. By aggregating data within windows of time, then storing the aggregate values back to InfluxDB, you can reduce 
disk usage and costs over time.

The guide uses Python and InfluxDB v2 and v3 Python client libraries and can be run locally or deployed within Quix Cloud with a free trial. It assumes you have setup a Python project and virtual environment.

## Pipeline architecture
The following diagram illustrates how data is passed between processes as it is downsampled:

{{< html-diagram/quix-downsample-pipeline >}}

{{% note %}}
It is usually more efficient to write raw data directly to Kafka rather than
writing raw data to InfluxDB first (essentially starting the Quix Streams
pipeline with the "influxv2-data" topic). However, this guide assumes that you
already have raw data in InfluxDB that you want to downsample. We also write the 
downsampled data to InfluxDB v3, however you could write it back to a different 
InfluxDB v2 bucket with some additional coding.
{{% /note %}}

---

1.  [Set up prerequisites](#set-up-prerequisites)
2.  [Install dependencies](#install-dependencies)
3.  [Prepare InfluxDB buckets](#prepare-influxdb-buckets)
4.  [Create the downsampling logic](#create-the-downsampling-logic)
5.  [Create the producer and consumer clients](#create-the-producer-and-consumer-clients)
    1. [Create the producer](#create-the-producer)
    2. [Create the consumer](#create-the-consumer)
6.  [Run the machine data generator](#run-the-machine-data-generator)
7.  [Get the full downsampling code files](#get-the-full-downsampling-code-files)


## Set up prerequisites

The process described in this guide requires the following:

- InfluxDB v2 with data ready for downsampling. [Use the machine data generator code](#run-the-machine-data-generator) below.
- InfluxDB v3 ready to receive data.
- A [Quix Cloud](https://portal.platform.quix.io/self-sign-up/) account or a
  local Apache Kafka or Red Panda installation.
- Familiarity with basic Python and Docker concepts.

## Install dependencies

Use `pip` to install the following dependencies:

- `influxdb-client` (InfluxDB v2 client library)
- `influxdb3-python` (InfluxDB v3 client library)
- `quixstreams<2.5` (Quixstreams client library)
- `pandas` (data analysis and manipulation tool)


```sh
pip install influxdb-client influxdb3-python pandas quixstreams<2.5 
```

## Prepare InfluxDB buckets

The downsampling process involves two InfluxDB buckets.
Each bucket has a [retention period](/influxdb/cloud-serverless/reference/glossary/#retention-period)
that specifies how long data persists before it expires and is deleted.
By using two buckets, you can store unmodified, high-resolution data in a bucket
with a shorter retention period and then downsampled, low-resolution data in a
bucket with a longer retention period.

Ensure you have a bucket for each of the following:

- One to query unmodified data from in your InfluxDB v2 cluster
- The other to write downsampled data to in your InfluxDB v3 cluster

## Create the downsampling logic

This process reads the raw data from the input Kafka topic that stores data streamed from the InfluxDB v2 bucket,
downsamples it, and then sends it to an output topic which is later written back to an InfluxDB v3 bucket.

1.  Use the Quix Streams library's `Application` class to initialize a connection to the  Kafka topics.

    ```py
    from quixstreams import Application

    app = Application(consumer_group="downsampling-process", auto_offset_reset="earliest")
    input_topic = app.topic("input")
    output_topic = app.topic("output")
    # ...
    ```

2.  Configure the Quix Streams built-in windowing function to create a tumbling
    window that continously downsamples the data into 1-minute buckets. 

    ```py
    # ...
    target_field = "temperature" # The field that you want to downsample.

    def custom_ts_extractor(value):
        # ...
        # truncated for brevity - custom code that defines the "time_recorded"
        # field as the timestamp to use for windowing...

    topic = app.topic(input_topic, timestamp_extractor=custom_ts_extractor)

    sdf = (
        sdf.apply(lambda value: value[target_field])  # Extract temperature values
        .tumbling_window(timedelta(minutes=1))        # 1-minute tumbling windows
        .mean()                                       # Calculate average temperature
        .final()                                      # Emit results at window completion
    )

    sdf = sdf.apply(
        lambda value: {
            "time": value["end"],                  # End of the window
            "temperature_avg": value["value"],     # Average temperature
        }
    )

    sdf.to_topic(output_topic) # Output results to the "downsampled" topic
    # ...
    ```

The results are streamed to the Kafka topic, `downsampled`.

{{% note %}}
Note: "sdf" stands for "Streaming Dataframe".
{{% /note %}}

You can find the full code for this process in the
[Quix GitHub repository](https://github.com/quixio/template-invluxdbv2-tsm-downsampling/blob/tutorial/Downsampler/main.py).

## Create the producer and consumer clients

Use the `influxdb_client`, `influxdb3-python` and `quixstreams` modules to instantiate two clients that interact with InfluxDB (v2 and v3) and Kafka:

- A **producer** client configured to read from your InfluxDB bucket with _unmodified_ data and _produce_ that data to Kafka.
- A **consumer** client configured to _consume_ data from Kafka and write the _downsampled_ data to the corresponding InfluxDB bucket.

### Create the producer

Provide the following credentials for the producer:

- **INFLUXDB_HOST**: [{{< product-name >}} region URL](/influxdb/cloud-serverless/reference/regions)
  _(without the protocol)_
- **INFLUXDB_ORG**: InfluxDB organization name
- **INFLUXDB_TOKEN**: InfluxDB API token with read and write permissions on the buckets you
  want to query and write to.
- **INFLUXDB_BUCKET**: InfluxDB bucket name

The producer queries for fresh data from InfluxDB at specific intervals. It writes the raw data to a Kafka topic called `influxv2-data`.

{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}
```py
from quixstreams import Application
import influxdb_client
# Create a Quix Application
app = Application(consumer_group="influxdbv2_migrate", auto_create_topics=True)
# Define the topic using the "output" environment variable
topic = app.topic(os.getenv("output", "influxv2-data"))
# Create an InfluxDB v2 client
influxdb2_client = influxdb_client.InfluxDBClient(token=os.environ["INFLUXDB_TOKEN"],
                        org=os.environ["INFLUXDB_ORG"],
                        url=os.environ["INFLUXDB_HOST"])

## ... remaining code trunctated for brevity ...

# Function to fetch data from InfluxDB
# It runs in a continuous loop, periodically fetching data based on the interval.
def get_data():
    # Run in a loop until the main thread is terminated
    while run:
        try:            
            # Query InfluxDB 2.0 using flux
            flux_query = f'''
            from(bucket: "{bucket}")
                |> range(start: -{interval})
                |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
            '''
            logger.info(f"Sending query: {flux_query}")

## ... remaining code trunctated for brevity ...

# Create a pre-configured Producer object.
with app.get_producer() as producer:
    for res in get_data():
        # Get the data from InfluxDB
        records = json.loads(res)
        for index, obj in enumerate(records):
            logger.info(f"Produced message with key:{message_key}, value:{obj}")
            # Publish the data to the Kafka topic
            producer.produce(
                topic=topic.name,
                key=message_key,
                value=obj,
            ) 
```
{{% /code-placeholders %}}

You can find the full code for this process in the
[Quix GitHub repository](https://github.com/quixio/template-invluxdbv2-tsm-downsampling/blob/tutorial/InfluxDB%20V2%20Data%20Source/main.py).

### Create the consumer

As before, provide the following credentials for the consumer:

- **INFLUXDB_HOST**: [{{< product-name >}} region URL](/influxdb/cloud-serverless/reference/regions)
  _(without the protocol)_ 
- **INFLUXDB_ORG**: InfluxDB organization name
- **INFLUXDB_TOKEN**: InfluxDB API token with read and write permissions on the buckets you
  want to query and write to.
- **INFLUXDB_BUCKET**: InfluxDB bucket name

{{% note %}}
Note: These will be your InfluxDB v3 credentials.
{{% /note %}}

This process reads messages from the Kafka topic `downsampled-data` and writes each message as a point dictionary back to InfluxDB.

{{% code-placeholders "(API|(RAW|DOWNSAMPLED)_BUCKET|ORG)_(NAME|TOKEN)" %}}
```py
# import vendor-specific modules
from quixstreams import Application
from influxdb_client_3 import InfluxDBClient3
# Create a Quix Application
app = Application(consumer_group=consumer_group_name,
                       auto_offset_reset="earliest")
# Create the input topic object, this uses json serialization by default.
input_topic = app.topic(os.environ["input"])
# Create the InfluxDB v3 client using details in environment variables.
influx3_client = InfluxDBClient3(token=os.environ["INFLUXDB_TOKEN"],
                         host=os.environ["INFLUXDB_HOST"],
                         org=os.environ["INFLUXDB_ORG"],
                         database=os.environ["INFLUXDB_DATABASE"])

## ... remaining code trunctated for brevity ...

def send_data_to_influx(message):
    logger.info(f"Processing message: {message}")
    try:
        # This code uses the current time as the timestamp for writing to the bucket

        ## ... code trunctated for brevity ...

        # Construct the points dictionary
        # tags and fields are configured using 
        # environment variables passed to the service
        points = {
            "measurement": measurement_name,
            "tags": tags,
            "fields": fields,
            "time": writetime
        }
        # Write the points to InfluxDB
        influx3_client.write(record=points, write_precision="ms")

## ... code trunctated for brevity ...

# We use QuixStreams StreamingDataframe (SDF) to handle every message
# in the Kafka topic by writing it to InfluxDB
sdf = app.dataframe(input_topic)
sdf = sdf.update(send_data_to_influx)
```
{{% /code-placeholders %}}

You can find the full code for this process in the
[Quix GitHub repository](https://github.com/quixio/template-invluxdbv2-tsm-downsampling).

## Run the Machine data generator

Now it's time to run the machine data generator code which will populate your source 
bucket with data which will be read by the [producer](#create-the-consumer).

Run `main.py` from the `Machine data to InfluxDB` folder in the GitHub repository.

## Get the full downsampling code files

To get the complete set of files referenced in this tutorial, clone the Quix "downsampling" repository.

### Clone the downsampling template repository

To clone the downsampling template, enter the following command in the command line:

```sh
git clone https://github.com/quixio/template-invluxdbv2-tsm-downsampling.git
```

This repository contains the following folders which store different parts of the whole pipeline:

- **Machine Data to InfluxDB**: A script that generates synthetic machine data
  and writes it to InfluxDB. This is useful if you dont have your own data yet,
  or just want to work with test data first.

  - It produces a reading every 250 milliseconds. 
  - This script originally comes from the
    [InfluxCommunity repository](https://github.com/InfluxCommunity/Arrow-Task-Engine/blob/master/machine_simulator/src/machine_generator.py)
    but has been adapted to write directly to InfluxDB rather than using an MQTT broker.
    
- **InfluxDB v2 Data Source**: A service that queries for fresh data from
  InfluxDB at specific intervals. It's configured to look for the measurement
  produced by the previously-mentioned synthetic machine data generator.
  It writes the raw data to a Kafka topic called "influxv2-data".
- **Downsampler**: A service that performs a 1-minute tumbling window operation
  on the data from InfluxDB and emits the mean of the "temperature" reading
  every minute. It writes the output to a "downsampled" Kafka topic.
- **InfluxDB v3 Data Sink**: A service that reads from the "downsampled"
  topic and writes the downsampled records as points back into InfluxDB.

