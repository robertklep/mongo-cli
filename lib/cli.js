var vm = require('vm');

module.exports.run = function() {
  var opts = require('nomnom').option('mongo-url', {
                                position: 0,
                                required: true,
                                help    : 'MongoDB URL'
                              }).option('collection', {
                                position: 1,
                                required: true,
                                help    : 'MongoDB collection to query'
                              }).option('QUERY', {
                                position  : 2,
                                required  : true,
                                help      : 'Query to run',
                              }).option('FIELDS', {
                                position  : 3,
                                help      : 'Fields to return',
                              }).parse();

  // Setup MongoDB connection.
  var mongoskin     = require('mongoskin');
  var MongoClient   = mongoskin.MongoClient;
  var db            = MongoClient.connect(opts['mongo-url']);
  var collection    = db.bind(opts.collection);

  // Perform query.
  var query         = evaluate(opts.QUERY,  {});
  var fields        = evaluate(opts.FIELDS, {});
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
  var evaluated = vm.runInThisContext('x = ' + s);
  return evaluated;
}
