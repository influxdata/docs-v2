curl -X 'POST' \
  "http://localhost:8086/api/v2/functions" \
  --header "Authorization: Token ${INFLUX_API_TOKEN}" \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-binary @- << EOF | jq .
  {
    "name": "getLastPoint",
    "description": "getLastPoint finds the last point in a bucket",
    "orgID": "${INFLUX_ORG}",
    "script": "from(bucket:params.mybucket) \
     |> range(start: -7d) \
     |> limit(n:2)",
     "language": "flux"
  }
