# mongo-cli

CLI tool for [MongoDB](http://www.mongodb.com/)

## Install

```
npm install robertklep/mongo-cli -g
```

## Usage

```
$ mongo-cli <url> <collection> <query> [fields] [options]

url            MongoDB URL
collection     MongoDB collection to query
query          Query to run (e.g. "{ _id : ObjectId(...) }")
fields         Fields to return (e.g. "{ _id : 1 }")

Options:
   -l NUM, --limit NUM   Limit number of results
   -s NUM, --skip NUM    Skip first NUM results
   -S OBJ, --sort OBJ    Sort results
   -H OBJ, --hint OBJ    Force a specific index to be used
   -e, --explain         Return explanation of query  [false]
```

For example:

```
$ mongocli mongodb://localhost/test users '{ name : "Jack" }' '{ _id : 1 } --limit 10'
```

## Notes

* `QUERY` and `FIELDS` don't have to be valid JSON (they do have to be valid JS, though)
* You can use `ObjectId()` in `QUERY`
* Output is unformatted JSON; if you want to pretty-print or to process further, take a look at [jq](http://stedolan.github.io/jq/)
