#######################################
# Use Basic authentication with a database token
# to query the InfluxDB v1 API
#######################################
# Use the --user option with `--user username:DATABASE_TOKEN` syntax
#######################################

curl --get "http://localhost:8086/query" \
  --user "username":"DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
