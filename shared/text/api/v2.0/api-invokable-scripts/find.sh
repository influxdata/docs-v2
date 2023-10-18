curl -X 'GET' \
  "${INFLUX_URL}/api/v2/scripts/${SCRIPT_ID}" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json'
