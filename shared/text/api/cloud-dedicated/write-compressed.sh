curl --request POST "https://cluster-id.influxdb.io/api/v2/write" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --header "Content-Encoding: gzip" \
  --data-urlencode "org=ignored" \
  --data-urlencode "bucket=DATABASE_NAME" \
  --data-urlencode "precision=s" \
  --data-raw "
mem,host=host1 used_percent=23.43234543 1641024000
mem,host=host2 used_percent=26.81522361 1641027600
mem,host=host1 used_percent=22.52984738 1641031200
mem,host=host2 used_percent=27.18294630 1641034800
"
