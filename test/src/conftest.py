# Test setup fixtures

import pytest
import requests
import os

def v3_management_api():
  return {
    'url': os.getenv('INFLUX_HOST') + '/api/v0/accounts/' + os.getenv('ACCOUNT_ID') + '/clusters/' + os.getenv('CLUSTER_ID'),
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + os.getenv('MANAGEMENT_TOKEN')
    }
  }


@pytest.fixture
def create_v3_token():
  api = v3_management_api()
  url = api['url'] + '/databases/' + os.getenv('INFLUX_DATABASE')
  headers = api['headers'] 
  data = {
    "description": "v3 read token",
    "permissions": [
      {
        "action": "read",
        "resource": os.getenv('INFLUX_DATABASE')
      },
      {
        "action": "write",
        "resource": os.getenv('INFLUX_DATABASE')
      },
    ]
  }
  response = requests.post(url, data=data, headers=headers)
  return response.json()['token']

# Example test function using the setup_v3_db fixture:
# def test_setup(setup_v3_db):
  # database, token = setup_v3_db
  # assert database
  # assert token
@pytest.fixture
def set_token():
  try:
    token = create_v3_token()
    os.environ.update({'INFLUX_TOKEN': token})
    yield token
  except Exception as e:
    print(e)
    assert False

@pytest.fixture
def delete_v3_database():
  api = v3_management_api()
  url = api['url'] + '/databases/' + os.getenv('INFLUX_TEMP_DATABASE')
  headers = api['headers'] 
  response = requests.delete(url, headers=headers)
  return response.json()['name']