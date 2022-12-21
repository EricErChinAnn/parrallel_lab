const express = require('express')
const router = express.Router();

const { Poster } = require('../../model');
const { createProductForm } = require('../../forms');

const productDataLayer = require('../../dal/products');
const async = require('hbs/lib/async');

// SEE ALL PRODUCTS
router.get('/', async(req,res)=>{
    res.send(await productDataLayer.findAllProduct())
})


// ADD PRODUCT
router.post('/add', async (req, res) => {
    const allCategories = await productDataLayer.getAllMediaProperties();
    const allTags = await productDataLayer.getAllTags();

    const productForm = createProductForm(allCategories, allTags);

    productForm.handle(req, {
        'success': async (form) => {                    
            let { tags, ...productData } = form.data;
            const product = new Poster(productData);
            await product.save();
    
            // save the many to many relationship
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            res.json(product.toJSON());
        },
        'error': async (form) => {
           let errors = {};
           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }
           res.send(JSON.stringify(errors));
        }
    })

})


// UPDATE PRODUCT
router.put("/update/:productId",async (req,res)=>{
    try {
        const productToEdit = await productDataLayer.findProductViaId(req.params.productId)

        const allMediaProperties = await productDataLayer.getAllMediaProperties();
        const allTags = await productDataLayer.getAllTags();
        
        const productForm = createProductForm(allMediaProperties, allTags);

        productForm.handle(req, {
            "success": async (form) => {
                let {tags, ...productData} = form.data
                productToEdit.set(productData);
                productToEdit.save();
    
                let tagsId = tags.split(",");
                let currentTagsId = await productToEdit.related("tags").pluck("id");
    
                await productToEdit.tags().detach(currentTagsId),
                await productToEdit.tags().attach(tagsId)
    
                req.flash("success_messages", 
                `Poster "${form.data.title}" has been edited`)
    
                res.status(200);
                res.json({ "message": `Poster "${form.data.title}" has been edited` })
            },
            'error': async (form) => {
                let errors = {};
                for (let key in form.fields) {
                    if (form.fields[key].error) {
                        errors[key] = form.fields[key].error;
                    }
                }
                res.send(JSON.stringify(errors));
             }
        })

    } catch (error) {

        res.status(500);
        res.json({ "error": error })
        
    }

})


// DELETE PRODUCT
router.delete("/delete/:productId",async (req,res)=>{
    try {

        const productToDelete = await productDataLayer.findProductViaId(req.params.productId)

        await productToDelete.destroy();


        res.status(200);
        res.json({ "message": "Review have been deleted" })

    } catch (error) {

        res.status(500);
        res.json({ "error": error })
        
    }

})


module.exports = router;