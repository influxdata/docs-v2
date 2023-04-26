########################################################
# Use the Bearer token authentication scheme with /api/v2/write
# to write data.
########################################################

curl --post "https://cluster-id.influxdb.io/api/v2/write?bucket=DATABASE_NAME&precision=s" \
  --header "Authorization: Bearer DATABASE_TOKEN" \
  --data-binary 'home,room=kitchen temp=72 1463683075'
