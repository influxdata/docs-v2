#######################################
# Use an InfluxDB 1.x compatible username
# and password with Basic Authentication
# to query the InfluxDB 1.x compatibility API
#######################################
# Use default retention policy
#######################################
# Use the --user option with `--user INFLUX_USERNAME:INFLUX_API_TOKEN` syntax
# or the `--user INFLUX_USERNAME` interactive syntax to ensure your credentials are
# encoded in the header.
#######################################

curl --get "http://localhost:8086/query" \
  --user "exampleuser@influxdata.com":"INFLUX_API_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
