curl --request POST \
  https://cloud2.influxdata.com/api/v2/authorizations \
  --header "Authorization: Token API_TOKEN" \
  --header 'Content-type: application/json' \
  --data '{
  "status": "active",
  "description": "AUTHORIZATION_DESCRIPTION",
  "orgID": "ORG_ID",
  "permissions": [
    {
      "action": "read",
      "resource": {
        "orgID": "ORG_ID",
        "type": "authorizations"
      }
    },
    {
      "action": "read",
      "resource": {
        "orgID": "ORG_ID",
        "type": "buckets"
      }
    },
    {
      "action": "write",
      "resource": {
        "orgID": "ORG_ID",
        "type": "buckets",
        "name": "iot-center" 
      }
    }
  ]
}'

