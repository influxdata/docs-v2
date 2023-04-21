########################################################
# Use the Token authentication scheme with /api/v2/write
# to write data.
########################################################

curl --post "https://cloud2.influxdata.com/api/v2/write?bucket=DATABASE_NAME&precision=ns&org=ignored" \
  --header "Authorization: Token DATABASE_TOKEN" \
  --data-binary 'home,room=kitchen temp=72 1463683075'
