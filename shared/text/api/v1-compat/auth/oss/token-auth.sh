#######################################
# Use a token in the Authorization header
# to query the InfluxDB 1.x compatibility API.
#
# Replace INFLUX_API_TOKEN with your InfluxDB API token.
#######################################

curl --get "http://localhost:8086" \
  --header "Authorization: Token INFLUX_API_TOKEN" \
  --header 'Content-type: application/json' \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
