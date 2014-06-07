var vm          = require('vm');
var JSONStream  = require('JSONStream');
var mongoskin   = require('mongoskin');
var ObjectId    = mongoskin.ObjectID;

module.exports.run = function() {
  var opts = require('nomnom').options({
    url : {
      position: 0,
      required: true,
      help    : 'MongoDB URL'
    },
    collection: {
      position: 1,
      required: true,
      help    : 'MongoDB collection to query'
    },
    query : {
      position  : 2,
      required  : true,
      help      : 'Query to run (e.g. "{ _id : ObjectId(...) }")',
    },
    fields : {
      position  : 3,
      help      : 'Fields to return (e.g. "{ _id : 1 }")',
    },
    limit : {
      abbr    : 'l',
      metavar : 'NUM',
      help    : 'Limit number of results'
    },
    skip : {
      abbr    : 's',
      metavar : 'NUM',
      help    : 'Skip first NUM results'
    },
    sort : {
      abbr    : 'S',
      metavar : 'OBJ',
      help    : 'Sort results'
    },
    hint : {
      abbr    : 'H',
      metavar : 'OBJ',
      help    : 'Force a specific index to be used'
    },
    explain : {
      abbr    : 'e',
      flag    : true,
      default : false,
      help    : 'Return explanation of query'
    }
  }).parse();

  // Setup MongoDB connection.
  var MongoClient   = mongoskin.MongoClient;
  var db            = MongoClient.connect(opts.url);
  var collection    = db.bind(opts.collection);

  // JSON stream for output.
  var jsonwriter = JSONStream.stringify('[', ',', ']');
  jsonwriter.on('data', function(data) {
    process.stdout.write(data);
  });

  // Setup query and options.
  var query   = evaluate(opts.query,  {});
  var options = {
    fields  : evaluate(opts.fields, {}),
    sort    : evaluate(opts.sort,   {}),
    hint    : evaluate(opts.hint,   null),
    explain : opts.explain,
    limit   : opts.limit  || null,
    skip    : opts.skip   || null,
  };

  // Create cursor and process results.
  collection.find(query, options).each(function(err, result) {
    if (err) {
      throw err;
    } else if (! result) {
      jsonwriter.end();
      db.close();
    } else {
      jsonwriter.write(result);
    }
  });
};

function evaluate(s, def) {
  if (! s || ! s.length) {
    return def;
  }
  var evaluated = vm.runInNewContext('x = ' + s, {
    ObjectId  : ObjectId,
    ObjectID  : ObjectId,
  });
  return evaluated;
}
