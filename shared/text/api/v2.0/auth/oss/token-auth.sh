#######################################
# Use a token in the Authorization header
# to authenticate with the InfluxDB 2.x API.
#######################################

curl --get "http://localhost:8086/api/v2" \
  --header "Authorization: Token YourAuthToken" \
  --header 'Content-type: application/json' \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
