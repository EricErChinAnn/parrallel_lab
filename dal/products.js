const async = require("hbs/lib/async");
const { Poster, MediaProperty, Tag } = require("../model/index");

findAllProduct = async ()=>{
    const product = await Poster.fetchAll({
        withRelated:['tags', 'media_property_id']
    })

    return product
}

findProductViaId = async (productId) => {
    const product = await Poster.where({
        "id": productId
    }).fetch({
        "require": true,
        withRelated:['tags', 'media_property_id']
    })

    return product
}

getAllMediaProperties = async () => {
    const mediaProperties = await MediaProperty.fetchAll().map((each)=>{
       return [each.get("id"),each.get("name")]
    })

    return mediaProperties
}

getAllTags = async ()=>{
    const allTags = await Tag.fetchAll().map((e)=>{
        return [e.get("id"), e.get("name")]
    })
    return allTags
}



module.exports = { 
    findAllProduct,
    findProductViaId,
    getAllMediaProperties,
    getAllTags
}