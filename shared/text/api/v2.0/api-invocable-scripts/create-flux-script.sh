curl -X 'POST' \
  "http://cloud2.influxdata.com/api/v2/scripts" \
  --header "Authorization: Token ${INFLUX_API_TOKEN}" \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-binary @- << EOF | jq .
  {
    "name": "getLastPoint",
    "description": "getLastPoint finds the last point in a bucket",
    "orgID": "${INFLUX_ORG_ID}",
    "script": "from(bucket:params.mybucket) \
     |> range(start: -7d) \
     |> limit(n:1)",
     "language": "flux"
  }
EOF
