curl -X 'GET' \
  "${INFLUX_URL}/api/v2/scripts" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-urlencode "org=${INFLUX_ORG}&limit=10"
