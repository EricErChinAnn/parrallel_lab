const express = require("express");
const router = express.Router();

const CartServices = require("../../services/cart_services");

router.get("/", async(req, res)=>{
    let cart = new CartServices(req.session.user.id);
    // console.log((await cart.getCart()).toJSON())
    res.render("cart/index",{
        "shoppingCart": (await cart.getCart()).toJSON()
    })
})

router.get("/add/:product_id", async (req,res)=>{
    let cart = new CartServices(req.session.user.id);
    await cart.addToCart(req.params.product_id, 1);
    req.flash('success_messages', 'Successfully added to cart')
    res.redirect('/products')
})

router.get('/remove/:product_id', async(req,res)=>{
    let cart = new CartServices(req.session.user.id);
    await cart.remove(req.params.product_id);
    req.flash("success_messages", "Item has been removed");
    res.redirect('/cart/');
})

router.post('/:product_id/quantity/update', async(req,res)=>{
    let cart = new CartServices(req.session.user.id);
    await cart.setQuantity(req.params.product_id, req.body.newQuantity);
    req.flash("success_messages", "Quantity updated")
    res.redirect('/cart/');
  })


module.exports = router;