# mongo-cli

CLI tool for [MongoDB](http://www.mongodb.com/)

## Install

```
npm install robertklep/mongo-cli -g
```

## Usage

```
$ mongocli MONGO_URI COLLECTION QUERY [FIELDS]
```

For example:

```
$ mongocli mongodb://localhost/test users '{ name : "Jack" }' '{ _id : 1 }'
```

## Notes

* `QUERY` and `FIELDS` don't have to be valid JSON (they do have to be valid JS, though);
* You can use `ObjectId()` in `QUERY`;
* Output is unformatted JSON; if you want to pretty-print or to process further, take a look at [jq](stedolan.github.io/jq/);
