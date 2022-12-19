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

exports.up = function (db) {
  return db.createTable('posters_tags', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      poster_id: {
          type: 'int',
          notNull: true,
          unsigned: true,
          foreignKey: {
              name: 'posters_tags_posters_fk',
              table: 'posters',
              rules: {
                  onDelete: 'RESTRICT',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      },
      tag_id: {
          type: 'int',
          notNull: true,
          unsigned:true,
          foreignKey: {
              name: 'posters_tags_tags_fk',
              table: 'tags',
              rules: {
                  onDelete: 'RESTRICT',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      }
  });
};

exports.down = function(db) {
  return db.dropTable('posters_tags');
};

exports._meta = {
  "version": 1
};
