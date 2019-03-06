**Warning: there is a possibility that the files are not up-to-date**. The latest status can
be verified by querying the Aito instance. For example:

```bash
curl -X POST \
  https://aito-grocery-store.api.aito.ai/api/v1/_search \
  -H 'content-type: application/json' \
  -H 'x-api-key: FWuBYAfGzXa2a0FUreVPL6EqS01kbVnw9ABjJjSZ' \
  -d '
  {
    "from": "products",
    "limit": 1000
  }'
```

These files are commited to the version control so that it's easier to see the contents.
Otherwise you would have to clone this repo and run the generator.
