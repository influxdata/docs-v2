from datetime import datetime

import os
import urllib3
from influxdb_client import Authorization, InfluxDBClient, Permission, PermissionResource
from influxdb_client.client.query_api import QueryOptions
from influxdb_client.client.authorizations_api import AuthorizationsApi
from influxdb_client.client.bucket_api import BucketsApi

# Set up configuration file needed to reach influxdb
config = {
    "id": os.getenv("VIRTUAL_DEVICE_NAME"),
    "influx_url": os.getenv("INFLUX_URL"),
    "influx_token": os.getenv("INFLUX_TOKEN"),
    "influx_org": os.getenv("INFLUX_ORG"),
    "influx_bucket": os.getenv("BUCKET_NAME"),
    "influx_auth_bucket": os.getenv("AUTH_BUCKET_NAME")
}

# this checks if the device is already in the auth bucket
# Should probably return a device
def get_device(device_id) -> None
    influxdb_client = InfluxDBClient(url=config['influx_url'],
                                     token=config['influx_token'],
                                     org=config['influx_org'])

    query_options = QueryOptions()
    query_client = influxdb_client.query_api()

    device_filter = ''
    flux_query = ''
    return None


# TODO
# Function should return a response code
# Creates an authorization for a supplied deviceId
def create_device() -> Authorization:
    influxdb_client = InfluxDBClient(url=config['influx_url'],
                                     token=config['influx_token'],
                                     org=config['influx_org'])
    authorization_api = AuthorizationsApi(influxdb_client)

    buckets_api = BucketsApi(influxdb_client)
    bucket = buckets_api.find_bucket_by_name(config['influx_bucket']) # function returns only 1 bucket
    desc_prefix = 'IoTCenterDevice: '
    # get bucket_id from bucket
    org_resource = PermissionResource(org_id=config['influx_org'], type="orgs")
    read = Permission(action="read", resource=org_resource)
    write = Permission(action="write", resource=org_resource)
    permissions = [read, write]
    request = authorization_api.create_authorization(org_id=config['influx_org'],
                                                     permissions=permissions)

    return request





