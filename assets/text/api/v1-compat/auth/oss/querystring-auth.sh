#######################################
# Use an InfluxDB 1.x compatible username and password
# to query the InfluxDB 1.x-compatibility API
#######################################
# Use authentication query parameters:
#   ?u=<username>&p=<password>
# Use default retention policy.
#######################################

curl --get "http://localhost:8086/query" \
  --data-urlencode "u=OneDotXUsername" \
  --data-urlencode "p=yourPasswordOrToken" \
  --data-urlencode "db=mydb" \
  --data-urlencode "q=SELECT * FROM cpu_usage"
