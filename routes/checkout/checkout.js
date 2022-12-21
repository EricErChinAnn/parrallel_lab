const express = require('express');
const router = express.Router();

const CartServices = require('../../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.get("/", async (req,res)=>{
    const cart = new CartServices(req.session.user.id)

    let items = await cart.getCart();


    let lineItems = [];
    let meta = [];

    for(let i of items){

        const lineItem ={
            'quantity': i.get('quantity'),
            'price_data':{
                'currency':'SGD',
                'unit_amount': i.related('posters').get('cost'),
                'product_data':{
                    'name': i.related('posters').get('title'),
                    'description':i.related('posters').get('description')
                }
            }
        }


        if (i.related('posters').get('image_url')) {
            lineItem.price_data.product_data.images = [ i.related('posters').get('image_url')]
        }

        lineItems.push(lineItem);

        meta.push({
            'poster_id': i.get('poster_id'),
            'quantity': i.get('quantity')
        })

    }




    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types:["card"],
        mode:'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata:{
            'orders': metaData
        }
    }



    const stripeSession = await Stripe.checkout.sessions.create(payment);
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })


})

router.get('/success', function(req,res){
    res.render('checkout/success')
})

router.get('/cancelled', function(req,res){
    res.render("checkout/cancelled")
})

router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

    } catch (e) {
        res.send({
            'error': e.message
        })
        console.log(e.message)
    }
    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        console.log(stripeSession);
        // process stripeSession
    }
    res.send({ received: true });
})







module.exports = router;