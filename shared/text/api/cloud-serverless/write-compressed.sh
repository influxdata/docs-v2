curl --request POST "http://cloud2.influxdata.com/api/v2/write?org=ORG_NAME&bucket=BUCKET_NAME&precision=s" \
  --header "Authorization: Token API_TOKEN" \
  --header "Content-Encoding: gzip" \
  --data-raw "
mem,host=host1 used_percent=23.43234543 1556896326
mem,host=host2 used_percent=26.81522361 1556896326
mem,host=host1 used_percent=22.52984738 1556896336
mem,host=host2 used_percent=27.18294630 1556896336
"
