#######################################
# Use querystring authentication with an
# InfluxDB 1.x compatible username and password
# to query the InfluxDB 1.x compatibility API.
#
# Replace INFLUX_USERNAME with your 1.x-compatible username.
# Replace INFLUX_PASSWORD_OR_TOKEN with your InfluxDB API token
# or 1.x-compatible password.
#
# Use the default retention policy.
#######################################

curl --get "http://localhost:8086/query" \
  --data-urlencode "u=INFLUX_USERNAME" \
  --data-urlencode "p=INFLUX_PASSWORD_OR_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
