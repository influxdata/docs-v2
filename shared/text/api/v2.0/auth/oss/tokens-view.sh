INFLUX_TOKEN=YOUR_API_TOKEN

curl --request GET \
	"http://localhost:8086/api/v2/authorizations" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'Content-type: application/json'
