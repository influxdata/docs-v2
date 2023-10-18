#######################################
# Use Basic authentication with an
# InfluxDB 1.x compatible username and password
# to query the InfluxDB 1.x compatibility API.
#
# Replace INFLUX_USERNAME with your 1.x-compatible username.
# Replace INFLUX_PASSWORD_OR_TOKEN with your InfluxDB API token
# or 1.x-compatible password.
#######################################
# Use the default retention policy.
#######################################
# Use the --user option with `--user <username>:<password>` syntax
# or the `--user <username>` interactive syntax to ensure your credentials are
# encoded in the header.
#######################################

curl --get "http://localhost:8086/query" \
  --user "INFLUX_USERNAME":"INFLUX_PASSWORD_OR_TOKEN" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
