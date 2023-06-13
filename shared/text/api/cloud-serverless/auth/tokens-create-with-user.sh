######################################################
# The example below uses common command-line tools 
# `curl`, `jq` with the InfluxDB API to do the following:
# 1. Create a user.
# 2. Find the new or existing user by name.
# 3. If the user exists:
#   a. Build an authorization object with the user ID.
#   b. Create the new authorization.
#   c. Return the new token.
######################################################

function create_token_with_user() {
  curl --request POST \
    "https://cloud2.influxdata.com/api/v2/users/" \
    --header "Authorization: Bearer API_TOKEN" \
    --header 'Content-type: application/json' \
    --data "{\"name\": \"$1\"}"
  
  curl --request GET \
    "https://cloud2.influxdata.com/api/v2/users?name=$1" \
    --header "Authorization: Bearer API_TOKEN" \
    --header 'Content-type: application/json' | \
  
  jq --arg USER $1 '.users[0] // error("User missing")
    | {
        "orgID": "ORG_ID",
        "userID": .id,
        "description": $USER,
        "permissions": [
           {"action": "read", "resource": {"type": "buckets"}}
         ]
      }' | \
  
  curl --request POST \
    "https://cloud2.influxdata.com/api/v2/authorizations" \
    --header "Authorization: Bearer API_TOKEN" \
    --header 'Content-type: application/json' \
    --data @- | \
  
  jq '.token'
}

create_token_with_user 'iot_user_1'
