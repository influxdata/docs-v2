# INFLUX_TOKEN=YCiJXZPXSL-3
INFLUX_TOKEN=YCiJXZPXSL-3-nsoPDvK2OfXN61DjbegKy518b0I6IOn2jwTEf-tFogqLO8Rns3mlOktGff5_S9folGNkKdwEA==
INFLUX_AUTH_ID=0772396dbb011000

# Filter results by authorization ID.

# curl --request GET \
# 	"http://localhost:8086/api/v2/authorizations?authID=${INFLUX_AUTH_ID}" \
 #  --header "Authorization: Token ${INFLUX_TOKEN}" \
 # --header 'Content-type: application/json'

######################################################
# The following example uses common command-line tools
# `curl` and `jq` with the InfluxDB API
# to find a user by name
# and create a new authorization and token for the user.
######################################################

# Find a user by name.

curl --request GET \
  "http://localhost:8086/api/v2/users?name=user2" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'Content-type: application/json' | \

# Extract user ID into a new authorization object.
jq '.users[0] | {"orgID": "48c88459ee424a04", "userID": .id, "permissions":[{"action": "read", "resource": {"type": "buckets"}}] }' | \ 

# Create the new authorization and token for the user ID.

curl --request POST \
  "http://localhost:8086/api/v2/authorizations" \
  --header "Authorization: Token ${INFLUX_TOKEN}" \
  --header 'Content-type: application/json' \
  --data-binary @- 

## Extract the new token.
#jq. '.authorizations[0] | .token'
#
#
## List all tokens for the user name.
#
#curl --request GET \
#  "http://localhost:8086/api/v2/authorizations?user=user2" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json' | \
#
#jq. '.authorizations[] | .token'


# Set the first authorization as `inactive`.
# jq '.authorizations[0].id'
#curl --request PATCH \
#  "http://localhost:8086/api/v2/authorizations/${@-}" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json' \
#  --data '{
#            "description": "Deactiving user",
#	    "status": "inactive"
#          }' | jq .
#











  

# Delete a user.
# curl --request DELETE \
#	"http://localhost:8086/api/v2/users/" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json' \
#  --data '{"name": "user2"}' \
#  | jq .
#  | jq '.[0] | {orgID: "48c88459ee424a04", "user": .userID, "permissions":[{"action": "read", "resource": {"type": "buckets"}}] }' | \

# Create a user.

# curl --request DELETE \
#	"http://localhost:8086/api/v2/users/" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json' \
#  --data '{"name": "user2"}' \
#  | jq '.[0] 
##  | jq '.[0] | {orgID: "48c88459ee424a04", "user": .userID, "permissions":[{"action": "read", "resource": {"type": "buckets"}}] }' | \

# Delete a user.
# curl --request DELETE \
#	"http://localhost:8086/api/v2/users/" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json' \
#  --data '{"name": "user2"}' \
#  | jq .
#  | jq '.[0] | {orgID: "48c88459ee424a04", "user": .userID, "permissions":[{"action": "read", "resource": {"type": "buckets"}}] }' | \
#
#
# curl --request POST \
#	"http://localhost:8086/api/v2/authorizations" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json' \
  # --data '{"orgID": "48c88459ee424a04", "user": "user1", "permissions":[{"action": "read", "resource": {"type": "buckets"}}] }'
#
#
#curl --request GET \
#	"http://localhost:8086/api/v2/authorizations?user=user1" \
#  --header "Authorization: Token ${INFLUX_TOKEN}" \
#  --header 'Content-type: application/json'
