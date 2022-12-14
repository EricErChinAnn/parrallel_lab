const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
    tableName:"posters",
    media_property_id(){
        return this.belongsTo("MediaProperty")
    }
});

const MediaProperty = bookshelf.model("MediaProperty",{
    tableName:"media_properties",
    posters(){
        return this.hasMany("Poster")
    }
})



module.exports = { Poster , MediaProperty }