########################################################
# Use the Token authentication scheme with /api/v2/write
# to write data.
########################################################

curl --request post "https://cluster-id.influxdb.io/api/v2/write?bucket=DATABASE_NAME&precision=s" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --data-binary 'home,room=kitchen temp=72 1463683075'
