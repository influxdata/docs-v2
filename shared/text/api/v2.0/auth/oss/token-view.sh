INFLUX_TOKEN=YCiJXZPXSL-3
TOKEN_ID=0772396dbb011000

curl --request GET \
	"http://localhost:8086/api/v2/authorizations/${TOKEN_ID}" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'Content-type: application/json'

