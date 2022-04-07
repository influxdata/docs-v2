from datetime import datetime

import os
from influxdb_client import InfluxDBClient, WriteApi, Point, WriteOptions

# Set up configuration file needed to reach influxdb
config = {
    "id": os.getenv("VIRTUAL_DEVICE_NAME"),
    "influx_url": os.getenv("INFLUX_URL"),
    "influx_token": os.getenv("INFLUX_TOKEN"),
    "influx_org": os.getenv("INFLUX_ORG"),
    "influx_bucket": os.getenv("BUCKET_NAME")
}


def client_write() -> None:
    influxdb_client = InfluxDBClient(url=config['influx_url'],
                                     token=config['influx_token'],
                                     org=config['influx_org'])
    write_api = influxdb_client.write_api(write_options=WriteOptions(batch_size=1))

    # TODO update the hardcoded values
    """Write point into InfluxDB."""
    point = Point("environment") \
        .tag("clientId", config['id']) \
        .tag("device", "raspberrypi") \
        .tag("TemperatureSensor", "example") \
        .tag("HumiditySensor", "example") \
        .tag("PressureSensor", "example") \
        .field("Temperature", 100) \
        .field("Humidity", 100) \
        .field("Pressure", 100) \
        .field("Lat", 100) \
        .field("Lon", 100) \
        .time(datetime.utcnow())

    print(f"Writing: {point.to_line_protocol()}")
    print(write_api.write(bucket=config['influx_bucket'], record=point))

    influxdb_client.close()
