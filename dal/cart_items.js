const { CartItem } = require("../model/index");

const getCartViaUser = async (userId)=>{
    return await CartItem.collection()
        .where({
            'user_id': userId
        }).fetch({
            require: false,
            withRelated: ['posters' , 'posters.media_property_id' , "posters.tags"]
        });
}


const getCartItemByUserAndProduct = async (userId, posterId) => {
    return await CartItem.where({
        'user_id': userId,
        'poster_id': posterId
    }).fetch({
        require: false
    });
}


async function createCartItem(userId, posterId, quantity) {

    let cartItem = new CartItem({
        'user_id': userId,
        'poster_id': posterId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}


async function removeFromCart(userId, posterId) {
    let cartItem = await getCartItemByUserAndProduct(userId, posterId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    } else {
        return false;
    }
}


async function updateQuantityInCart(userId, posterId, newQuantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, posterId);
    if (cartItem) {
        console.log("newQuantity =", newQuantity);
        cartItem.set('quantity', newQuantity);
        await cartItem.save();
        return cartItem;
    } else {
        return false;
    }
}

module.exports = { 
    getCartViaUser ,
    getCartItemByUserAndProduct ,
    createCartItem,
    removeFromCart,
    updateQuantityInCart 
}