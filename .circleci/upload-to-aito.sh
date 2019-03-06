#!/bin/bash

set -e

# To use this script you need
# 1. An aito.ai account, so you can provision the data into the database
#
# 2. A read-write access key to the database
command -v xz | grep -c . > /dev/null || ( echo "You seem to be missing xz compression tool" && exit 1 )

if [[ -z "${API_KEY}" ]]; then
  echo "API_KEY environment variable missing. Exiting.."
  exit 1
fi

SERVER_HOST=https://aito-grocery-store.api.aito.ai

echo "Deleting the existing schema on ${SERVER_HOST}"
echo "... in 3"
sleep 1
echo "... in 2"
sleep 1
echo "... in 1"
sleep 1
echo "..."
curl -X DELETE -H"x-api-key: $API_KEY" "${SERVER_HOST}/api/v1/schema"
echo "Schema deleted"

echo "Provisioning the schema"
time curl -X PUT -H"x-api-key: $API_KEY" -H"content-type: application/json" -d@src/data/schema.json "${SERVER_HOST}/api/v1/schema"

for file in $(find src/data/aito -type f -name \*.json); do
    echo "$file"
    collection=$(basename -s ".json" $file)

    echo "Uploading table ${collection}"
    time curl -X POST -H"x-api-key: $API_KEY" -H"content-type: application/json" -d"@${file}" ${SERVER_HOST}/api/v1/data/${collection}/batch
    echo "Done"
done

