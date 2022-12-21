'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addForeignKey("posters","media_properties","media_properties_poster_fk",
  {"media_property_id":"id"},
  {
    onDelete:"CASCADE",
    onUpdate:"RESTRICT"
  }
  );
};

exports.down = function(db) {
  return db.removeForeignKey("posters","media_properties_poster_fk");
};

exports._meta = {
  "version": 1
};
