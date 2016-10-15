var Datastore = require('nedb')
var db = new Datastore({ filename: 'data/activity.json', autoload: true });
module.exports = db;
