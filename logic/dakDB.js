var Datastore = require('nedb')
var db = {}
db.activity = new Datastore({ filename: 'data/activity.json', autoload: true });
db.config = new Datastore({ filename: 'data/config.json', autoload: true });
module.exports = db;
