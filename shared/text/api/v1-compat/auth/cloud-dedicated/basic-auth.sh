#######################################
# Use Basic Authentication with a Database Token
# to query the InfluxDB v1 API
#######################################
# Use default retention policy
#######################################
# Use the --user option with `--user username:DATABASE_TOKEN` syntax
#######################################

curl --get "https://cloud2.influxdata.com/query" \
  --user "":"DATABASE_TOKEN" \
  --data-urlencode "db=DATABASE_NAME" \
  --data-urlencode "q=SELECT * FROM MEASUREMENT"
