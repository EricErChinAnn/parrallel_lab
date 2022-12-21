const cartDataLayer = require('../dal/cart_items')

class CartServices {


    constructor(user_id) {
        this.user_id = user_id;
    }


    async getCart() {
        return await cartDataLayer.getCartViaUser(this.user_id);
    }



    async addToCart (posterId , quantity){
        let cartItem = await cartDataLayer
            .getCartItemByUserAndProduct(this.user_id, posterId);
        
        if(cartItem){
            return await cartDataLayer
                .updateQuantityInCart(this.user_id, posterId, cartItem.get("quantity")+1);       
        } else {
            let newCartItem = cartDataLayer
                .createCartItem(this.user_id, posterId, quantity);
            return newCartItem;
        }
    }


    async setQuantity(posterId, quantity){
        return await cartDataLayer
            .updateQuantityInCart(this.user_id, posterId, quantity);
    }


    async remove(posterId){
        return await cartDataLayer
            .removeFromCart(this.user_id, posterId);
    }

}

module.exports = CartServices;