#!/bin/bash -e

# To use this script you need
# 1. An aito.ai account, so you can provision the data into the database
#
# 2. A read-write access key to the database
#
# 3. HTTPie (https://httpie.org/), or alternatively, you can convert httpie to curl, by changing the script and
# parameter format. Please checkout httpie, though. It's cool!

command -v xz | grep -c . > /dev/null || ( echo "You seem to be missing xz compression tool" && exit 1 )
command -v http | grep -c . > /dev/null  || ( echo "You don't have httpie installed" && exit 2 )

SERVER_HOST=https://aito-grocery-store.api.aito.ai

echo "Deleting the existing schema on ${SERVER_HOST}"
echo "... in 3"
sleep 1
echo "... in 2s"
sleep 1
echo "... in 1s"
sleep 1
echo "..."
http --timeout 30000 DELETE ${SERVER_HOST}/api/v1/schema "$API_KEY"
echo "Schema deleted"

echo "Provisioning the schema"
time cat grocery/schema.json| http --timeout 30000 PUT ${SERVER_HOST}/api/v1/schema "$API_KEY"

for file in $(find grocery -type f -name \*.json -not -name schema.json); do
    collection=$(echo $file | cut -d / -f 2 | sed 's/\.json//g')

    echo "Uploading table ${collection}"
    time cat $file | http --timeout 30000 POST ${SERVER_HOST}/api/v1/data/${collection}/batch "$API_KEY"
    echo "Done"
done

