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
  return db.createTable("posters",{
    id:{ 
      type:"int",
      primaryKey:true,
      autoIncrement:true,
      unsigned:true 
    },
    title:{
      type:"string",
      length:100,
      notNull:true
    },
    cost:{
      type:"int",
      notNull:true,
      unsigned:true,
    },
    description:{
      type:"text",
      notNull:true
    },
    date:{
      type:"date"
    },
    stock:{
      type:"int",
      notNull:false,
      unsigned:true,
    },
    height:{
      type:"smallint",
      notNull:true,
      unsigned:true
    },
    width:{
      type:"smallint",
      notNull:true,
      unsigned:true
    }
  });
};

exports.down = function(db) {
  return db.dropTable("posters");
};

exports._meta = {
  "version": 1
};
