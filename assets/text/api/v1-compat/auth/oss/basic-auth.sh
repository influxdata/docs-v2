#######################################
# Use an InfluxDB 1.x compatible username
# and password with Basic Authentication
# to query the InfluxDB 1.x-compatibility API
#######################################
# Use default retention policy
#######################################
# Use the --user option with `--user <username>:<password>` syntax
# or the `--user <username>` interactive syntax to ensure your credentials are
# encoded in the header.
#######################################
curl --get "http://localhost:8086/query" \
  --user "OneDotXUsername":"yourPasswordOrToken" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
