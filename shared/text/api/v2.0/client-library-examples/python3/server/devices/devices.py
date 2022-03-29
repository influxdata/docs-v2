from datetime import datetime

import os
import urllib3
from influxdb_client import InfluxDBClient, WriteApi, Point, WriteOptions

# Set up configuration file needed to reach influxdb
config = {
    "id": os.getenv("VIRTUAL_DEVICE_NAME"),
    "influx_url": os.getenv("INFLUX_URL"),
    "influx_token": os.getenv("INFLUX_TOKEN"),
    "influx_org": os.getenv("INFLUX_ORG"),
    "influx_bucket": os.getenv("BUCKET_NAME")
}


