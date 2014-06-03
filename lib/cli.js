var vm = require('vm');

module.exports.run = function() {
  var opts = require('nomnom').option('mongo-url', {
                                abbr    : 'm',
                                metavar : 'mongodb://...',
                                default : 'mongodb://localhost/test',
                                help    : 'MongoDB URL'
                              }).option('collection', {
                                abbr    : 'c',
                                metavar : 'COLLECTION',
                                required: true,
                                help    : 'MongoDB collection to query'
                              }).parse();

  // Setup MongoDB connection.
  var mongoskin     = require('mongoskin');
  var MongoClient   = mongoskin.MongoClient;
  var db            = MongoClient.connect(opts['mongo-url']);
  var collection    = db.bind(opts.collection);

  // Perform query.
  var query         = evaluate(opts[0], {});
  var fields        = evaluate(opts[1], {});
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
