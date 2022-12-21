const bookshelf = require("../bookshelf");

const Poster = bookshelf.model("Poster", {
    tableName:"posters",
    media_property_id(){
        return this.belongsTo("MediaProperty")
    },
    tags() {
        return this.belongsToMany("Tag")
    }
});

const MediaProperty = bookshelf.model("MediaProperty",{
    tableName:"media_properties",
    posters(){
        return this.hasMany("Poster")
    }
})

const Tag = bookshelf.model("Tag",{
    tableName:"tags",
    posters(){
        return this.belongsToMany("Poster")
    }
})

const User = bookshelf.model("User",{
    tableName:"users"
})

const CartItem = bookshelf.model("CartItem",{
    tableName:"cart_items",
    posters(){
        return this.belongsTo("Poster")
    }
})


module.exports = { Poster , MediaProperty , Tag , User , CartItem }