var vm        = require('vm');
var mongoskin = require('mongoskin');
var ObjectId  = mongoskin.ObjectID;

module.exports.run = function() {
  var opts = require('nomnom').option('url', {
                                position: 0,
                                required: true,
                                help    : 'MongoDB URL'
                              }).option('collection', {
                                position: 1,
                                required: true,
                                help    : 'MongoDB collection to query'
                              }).option('query', {
                                position  : 2,
                                required  : true,
                                help      : 'Query to run (e.g. "{ _id : ObjectId(...) }")',
                              }).option('fields', {
                                position  : 3,
                                help      : 'Fields to return (e.g. "{ _id : 1 }")',
                              }).parse();

  // Setup MongoDB connection.
  var MongoClient   = mongoskin.MongoClient;
  var db            = MongoClient.connect(opts.url);
  var collection    = db.bind(opts.collection);

  // Perform query.
  var query         = evaluate(opts.query,  {});
  var fields        = evaluate(opts.fields, {});
  collection.find(query, { fields : fields }).toArray(function(err, results) {
    if (err) throw err;
    console.log('%j', results);
    db.close();
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
