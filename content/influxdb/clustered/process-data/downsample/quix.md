---
title: Downsample data stored in InfluxDB using Quix Streams
description: >
  Use [Quix Streams](https://github.com/quixio/quix-streams) to query time series
  data stored in InfluxDB and written to Kafka at regular intervals, continuously
  downsample it, and then write the downsampled data back to InfluxDB.
menu:
  influxdb_clustered:
    name: Use Quix
    parent: Downsample data
    identifier: downsample-quix
weight: 202
related:
  - /influxdb/clustered/query-data/sql/aggregate-select/, Aggregate or apply selector functions to data (SQL)
---

Use [Quix Streams](https://github.com/quixio/quix-streams) to query time series
data stored in InfluxDB and written to Kafka at regular intervals, continuously
downsample it, and then write the downsampled data back to InfluxDB.
Quix Streams is an open source Python library for building containerized stream
processing applications with Apache Kafka. It is designed to run as a service
that continuously processes a stream of data while streaming the results to a
Kafka topic. You can try it locally, with a local Kafka installation, or run it
in [Quix Cloud](https://quix.io/) with a free trial.

This guide uses [Python](https://www.python.org/) and the
[InfluxDB v3 Python client library](https://github.com/InfluxCommunity/influxdb3-python),
but you can use your runtime of choice and any of the available
[InfluxDB v3 client libraries](/influxdb/cloud-serverless/reference/client-libraries/v3/).
This guide also assumes you have already
[setup your Python project and virtual environment](/influxdb/cloud-serverless/query-data/execute-queries/client-libraries/python/#create-a-python-virtual-environment).

## Pipeline architecture

The following diagram illustrates how data is passed between processes as it is downsampled:

{{< html-diagram/quix-downsample-pipeline >}}

{{% note %}}
It is usually more efficient to write raw data directly to Kafka rather than
writing raw data to InfluxDB first (essentially starting the Quix Streams
pipeline with the "raw-data" topic). However, this guide assumes that you
already have raw data in InfluxDB that you want to downsample.
{{% /note %}}

---

1.  [Set up prerequisites](#set-up-prerequisites)
2.  [Install dependencies](#install-dependencies)
3.  [Prepare InfluxDB buckets](#prepare-influxdb-buckets)
4.  [Create the downsampling logic](#create-the-downsampling-logic)
5.  [Create the producer and consumer clients](#create-the-producer-and-consumer-clients)
    1. [Create the producer](#create-the-producer)
    2. [Create the consumer](#create-the-consumer)
6.  [Get the full downsampling code files](#get-the-full-downsampling-code-files)

## Set up prerequisites

The process described in this guide requires the following:

- An InfluxDB cluster with data ready for downsampling.
- A [Quix Cloud](https://portal.platform.quix.io/self-sign-up/) account or a
  local Apache Kafka or Red Panda installation.
- Familiarity with basic Python and Docker concepts.

## Install dependencies

Use `pip` to install the following dependencies:

- `influxdb_client_3`
- `quixstreams<2.5`
- `pandas`

```sh
pip install influxdb3-python pandas quixstreams<2.5
```

## Prepare InfluxDB buckets

The downsampling process involves two InfluxDB databases.
Each database has a [retention period](/influxdb/clustered/reference/glossary/#retention-period)
that specifies how long data persists before it expires and is deleted.
By using two databases, you can store unmodified, high-resolution data in a database
with a shorter retention period and then downsampled, low-resolution data in a
database with a longer retention period.

Ensure you have a database for each of the following:

- One to query unmodified data from
- The other to write downsampled data to

For information about creating databases, see
[Create a bucket](/influxdb/clustered/admin/databases/create/).

## Create the downsampling logic

This process reads the raw data from the input Kafka topic that stores data streamed from InfluxDB,
downsamples it, and then sends it to an output topic that is used to write back to InfluxDB.

1.  Use the Quix Streams library's `Application` class to initialize a connection to Apache Kafka.

    ```py
    from quixstreams import Application
    from quixstreams.models.serializers.quix import JSONDeserializer, JSONSerializer

    app = Application(consumer_group='downsampling-process', auto_offset_reset='earliest')
    input_topic = app.topic('raw-data', value_deserializer=JSONDeserializer())
    output_topic = app.topic('downsampled-data', value_serializer=JSONSerializer())

    # ...
    ```

2.  Configure the Quix Streams built-in windowing function to create a tumbling
    window that continously downsamples the data into 1-minute buckets. 

    ```py
    # ...
    target_field = 'temperature' # The field that you want to downsample.

    def custom_ts_extractor(value):
        # ...
        # truncated for brevity - custom code that defines the 'time_recorded'
        # field as the timestamp to use for windowing...

    topic = app.topic(input_topic, timestamp_extractor=custom_ts_extractor)

    sdf = (
        sdf.apply(lambda value: value[target_field])  # Extract temperature values
        .tumbling_window(timedelta(minutes=1))   # 1-minute tumbling windows
        .mean()                                  # Calculate average temperature
        .final()                                 # Emit results at window completion
    )

    sdf = sdf.apply(
        lambda value: {
            'time': value['end'],                  # End of the window
            'temperature_avg': value['value'],     # Average temperature
        }
    )

    sdf.to_topic(output_topic) # Output results to the 'downsampled-data' topic
    # ...
    ```

The results are streamed to the Kafka topic, `downsampled-data`.

{{% note %}}
Note: "sdf" stands for "Streaming Dataframe".
{{% /note %}}

You can find the full code for this process in the
[Quix GitHub repository](https://github.com/quixio/template-influxdbv3-downsampling/blob/dev/Downsampler/main.py).

## Create the producer and consumer clients

Use the `influxdb_client_3` and `quixstreams` modules to  instantiate two clients that interact with InfluxDB and Apache Kafka:

- A **producer** client configured to read from your InfluxDB database with _unmodified_ data and _produce_ that data to Kafka.
- A **consumer** client configured to _consume_ data from Kafka and write the _downsampled_ data to the corresponding InfluxDB database.

### Create the producer client

Provide the following credentials for the producer:

- **host**: {{< product-name omit=" Clustered">}} cluster URL
  _(without the protocol)_
- **org**: An arbitrary string. {{< product-name >}} ignores the organization.
- **token**: InfluxDB database token with read and write permissions on the databases you
  want to query and write to.
- **database**: InfluxDB database name

The producer queries for fresh data from InfluxDB at specific intervals. It's configured to look for a specific measurement defined in a variable. It writes the raw data to a Kafka topic called 'raw-data'

{{% code-placeholders "(RAW|DOWNSAMPLED)_DATABASE_(NAME|TOKEN)" %}}
```py
from influxdb_client_3 import InfluxDBClient3
from quixstreams import Application
from quixstreams.models.serializers.quix import JSONSerializer, SerializationContext
import pandas

# Instantiate an InfluxDBClient3 client configured for your unmodified database
influxdb_raw = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='DATABASE_TOKEN',
    database='RAW_DATABASE_NAME'
)

# os.environ['localdev'] = 'true' # Uncomment if you're using local Kafka rather than Quix Cloud

# Create a Quix Streams producer application that connects to a local Kafka installation
app = Application(
  broker_address=os.environ.get('BROKER_ADDRESS','localhost:9092'),
  consumer_group=consumer_group_name,
  auto_create_topics=True
)

# Override the app variable if the local development env var is set to false or is not present.
# This causes Quix Streams to use an application configured for Quix Cloud
localdev = os.environ.get('localdev', 'false')

if localdev == 'false':
    # Create a Quix platform-specific application instead (broker address is in-built)
    app = Application(consumer_group=consumer_group_name, auto_create_topics=True)

serializer = JSONSerializer()
topic = app.topic(name='raw-data', value_serializer='json')

## ... remaining code trunctated for brevity ...

# Query InfluxDB for the raw data and store it in a Dataframe
def get_data():
    # Run in a loop until the main thread is terminated
    while run:
        try:
            myquery = f'SELECT * FROM "{measurement_name}" WHERE time >= {interval}'
            print(f'sending query {myquery}')
            # Query InfluxDB 3.0 using influxql or sql
            table = influxdb_raw.query(
                                    query=myquery,
                                    mode='pandas',
                                    language='influxql')

#... remaining code trunctated for brevity ...

# Send the data to a Kafka topic for the downsampling process to consumer 
def main():
    """
    Read data from the Query and publish it to Kafka
    """
    #... remaining code trunctated for brevity ...

            for index, obj in enumerate(records):
                print(obj) # Obj contains each row in the table includimng temperature
                # Generate a unique message_key for each row
                message_key = obj['machineId']
                logger.info(f'Produced message with key:{message_key}, value:{obj}')

                serialized = topic.serialize(
                    key=message_key, value=obj, headers={'uuid': str(uuid.uuid4())}
                    )

                # publish each row returned in the query to the topic 'raw-data'
                producer.produce(
                    topic=topic.name,
                    headers=serialized.headers,
                    key=serialized.key,
                    value=serialized.value,
                )

```
{{% /code-placeholders %}}

You can find the full code for this process in the
[Quix GitHub repository](https://github.com/quixio/template-influxdbv3-downsampling/blob/dev/InfluxDB%20V3%20Data%20Source/main.py).

### Create the consumer

As before, provide the following credentials for the consumer:

- **host**: {{< product-name omit=" Clustered">}} cluster URL
  _(without the protocol)_
- **org**: An arbitrary string. {{< product-name >}} ignores the organization.
- **token**: InfluxDB database token with read and write permissions on the databases you
  want to query and write to.
- **database**: InfluxDB database name

This process reads messages from the Kafka topic `downsampled-data` and writes each message as a point dictionary back to InfluxDB.

{{% code-placeholders "(RAW|DOWNSAMPLED)_DATABASE_(NAME|TOKEN)" %}}
```py
# Instantiate an InfluxDBClient3 client configured for your downsampled database.
# When writing, the org= argument is required by the client (but ignored by InfluxDB).
influxdb_downsampled = InfluxDBClient3(
    host='{{< influxdb/host >}}',
    token='DATABASE_TOKEN',
    database='DOWNSAMPLED_DATABASE_NAME',
    org=''
)

# os.environ['localdev'] = 'true' # Uncomment if you're using local Kafka rather than Quix Cloud

# Create a Quix Streams consumer application that connects to a local Kafka installation
app = Application(
  broker_address=os.environ.get('BROKER_ADDRESS','localhost:9092'),
  consumer_group=consumer_group_name,
  auto_create_topics=True
)

# Override the app variable if the local development env var is set to false or is not present.
# This causes Quix Streams to use an application configured for Quix Cloud
localdev = os.environ.get('localdev', 'false')

if localdev == 'false':
    # Create a Quix platform-specific application instead (broker address is in-built)
    app = Application(consumer_group=consumer_group_name, auto_create_topics=True)

input_topic = app.topic('downsampled-data', value_deserializer=JSONDeserializer())

## ... remaining code trunctated for brevity ...

def send_data_to_influx(message):
    logger.info(f'Processing message: {message}')
    try:

        ## ... remaining code trunctated for brevity ...

        # Construct the points dictionary
        points = {
            'measurement': measurement_name,
            'tags': tags,
            'fields': fields,
            'time': message['time']
        }

        influxdb_downsampled.write(record=points, write_precision='ms')

sdf = app.dataframe(input_topic)
sdf = sdf.update(send_data_to_influx) # Continuously apply the 'send_data' function to each message in the incoming stream

## ... remaining code trunctated for brevity ...
```
{{% /code-placeholders %}}

You can find the full code for this process in the
[Quix GitHub repository](https://github.com/quixio/template-influxdbv3-downsampling/blob/dev/InfluxDB%20V3%20Data%20Sink/main.py).

## Get the full downsampling code files

To get the complete set of files referenced in this tutorial, clone the Quix "downsampling template" repository or use an interactive version of this tutorial saved as a Jupyter Notebook.

### Clone the downsampling template repository

To clone the downsampling template, enter the following command in the command line:

```sh
git clone https://github.com/quixio/template-influxdbv3-downsampling.git
```

This repository contains the following folders which store different parts of the whole pipeline:

- **Machine Data to InfluxDB**: A script that generates synthetic machine data
  and writes it to InfluxDB. This is useful if you dont have your own data yet,
  or just want to work with test data first.

  - It produces a reading every 250 milliseconds. 
  - This script originally comes from the
    [InfluxCommunity repository](https://github.com/InfluxCommunity/Arrow-Task-Engine/blob/master/machine_simulator/src/machine_generator.py)
    but has been adapted to write directly to InfluxDB rather than using an MQTT broker.
    
- **InfluxDB V3 Data Source**: A service that queries for fresh data from
  InfluxDB at specific intervals. It's configured to look for the measurement
  produced by the previously-mentioned synthetic machine data generator.
  It writes the raw data to a Kafka topic called "raw-data".
- **Downsampler**: A service that performs a 1-minute tumbling window operation
  on the data from InfluxDB and emits the mean of the "temperature" reading
  every minute. It writes the output to a "downsampled-data" Kafka topic.
- **InfluxDB V3 Data Sink**: A service that reads from the "downsampled-data"
  topic and writes the downsample records as points back into InfluxDB.

### Use the downsampling Jupyter Notebook

You can use the interactive notebook ["Continuously downsample data using InfluxDB and Quix Streams"](https://github.com/quixio/tutorial-code/edit/main/notebooks/Downsampling_viaKafka_Using_Quix_Influx.ipynb) to try downsampling code yourself. It is configured to install Apache Kafka within the runtime environment (such as Google Colab). 

Each process is also set up to run in the background so that a running cell does not block the rest of the tutorial.

<a target="_blank" href="https://colab.research.google.com/github/quixio/tutorial-code/blob/main/notebooks/Downsampling_viaKafka_Using_Quix_Influx.ipynb"><img src="https://colab.research.google.com/assets/colab-badge.svg" alt="Open In Colab"/></a>
