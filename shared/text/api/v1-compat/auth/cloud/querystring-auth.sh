#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB 1.x compatibility API
#######################################
# Use authentication query parameters:
#   ?u=INFLUX_USERNAME&p=INFLUX_API_TOKEN
# Use default retention policy.
#######################################

curl --get "http://localhost:8086/query" \
  --data-urlencode "u=exampleuser@influxdata.com" \
  --data-urlencode "p=INFLUX_API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
