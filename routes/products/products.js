const express = require("express");
const { redirect } = require("express/lib/response");
const async = require("hbs/lib/async");
const router = express.Router();
const { checkIfAuthenticated } = require("../../middlewares")

const { bootstrapField, createProductForm , createSearchForm } = require("../../forms")

const { Poster, MediaProperty, Tag } = require("../../model/index");
const dataLayer = require('../../dal/products')

//show all post
router.get("/", async (req, res) => {

    const alltags = await dataLayer.getAllTags();
    const allMediaProperties = await dataLayer.getAllMediaProperties();

    //Add ["", 'Any category'] in to the array of category ((unshift add to front))
    allMediaProperties.unshift(["", 'Any category'])

    let searchForm = createSearchForm(allMediaProperties,alltags);
    let searchResult = Poster.collection();

    //search filtering
    searchForm.handle(req, {
        "success": async (form) =>{


            if(form.data.title){
                searchResult.where("title", "like",`%${form.data.title}%`)
            }

            if(form.data.min_cost){
                searchResult.where("cost" ,">=",form.data.min_cost)
            }

            if(form.data.max_cost){
                searchResult.where("cost" ,"<=",form.data.max_cost)
            }

            if(form.data.min_height){
                searchResult.where("height" ,">=",form.data.min_height)
            }

            if(form.data.max_height){
                searchResult.where("height" ,"<=",form.data.max_height)
            }

            if(form.data.min_width){
                searchResult.where("width" ,">=",form.data.min_width)
            }

            if(form.data.max_width){
                searchResult.where("width" ,"<=",form.data.max_width)
            }

            if(form.data.media_property_id){
                searchResult.where("media_property_id","like",form.data.media_property_id)
            }

            if(form.data.tags){
                searchResult.query("join","posters_tags","posters.id","poster_id")
                .where("tag_id","in",form.data.tags.split(','))
            }



            let products = await searchResult.fetch({
                withRelated:["media_property_id", "tags"]
            })

            res.render("products/index",{
                "products":products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })
        
        
        },
        "error": async (form)=>{

            let products = await searchResult.fetch({
                withRelated:["media_property_id", "tags"]
            })

            res.render("products/index",{
                "products":products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        },
        "empty": async (form)=>{

            let products = await searchResult.fetch({
                withRelated:["media_property_id", "tags"]
            })

            res.render("products/index",{
                "products":products.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        }

    })
})



//Create new post
router.get('/create',checkIfAuthenticated, async (req, res) => {
    const allMediaProperties = await dataLayer.getAllMediaProperties();
    const allTags = await dataLayer.getAllTags();
    
    const productForm = createProductForm(allMediaProperties, allTags);

    res.render('products/create', {
        "form": productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/create",checkIfAuthenticated, async (req, res) => {

    const allMediaProperties = await dataLayer.getAllMediaProperties();
    const allTags = await dataLayer.getAllTags();

    const productForm = createProductForm(allMediaProperties, allTags);

    productForm.handle(req, {
        "success": async (form) => {
            const productObject = new Poster();
            productObject.set("title", form.data.title);
            productObject.set("cost", form.data.cost);
            productObject.set("description", form.data.description);
            productObject.set("date", form.data.date);
            productObject.set("stock", form.data.stock);
            productObject.set("height", form.data.height);
            productObject.set("width", form.data.width);
            productObject.set("media_property_id", form.data.media_property_id);
            productObject.set("image_url", form.data.image_url);
            
            await productObject.save();

            let tags = form.data.tags
            if(tags){
                await productObject.tags().attach(tags.split(","));
            }

            req.flash("success_messages", 
            `New Poster "${form.data.title}" has been created`)

            res.redirect("/products")
        },
        "empty": async (form) => {

            req.flash("missing_messages", 
            `Please fill in the required fields`)

            res.render("products/create.hbs", {
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        "error": async (form) => {

            req.flash("error_messages", 
            `Please fill in the required fields`)

            res.render("products/create.hbs", {
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})



//Update a post
router.get("/update/:productId",checkIfAuthenticated, async (req, res) => {
    const product = await dataLayer.findProductViaId(req.params.productId)

    const allMediaProperties = await dataLayer.getAllMediaProperties();
    const allTags = await dataLayer.getAllTags();

    const productForm = createProductForm(allMediaProperties, allTags);

    let selectedTags = await product.related("tags").pluck("id")

    var dateObj = product.get("date").toISOString().slice(0,10);


    productForm.fields.title.value = product.get("title");
    productForm.fields.cost.value = product.get("cost");
    productForm.fields.description.value = product.get("description");
    productForm.fields.date.value = dateObj;
    productForm.fields.stock.value = product.get("stock");
    productForm.fields.height.value = product.get("height");
    productForm.fields.width.value = product.get("width");
    productForm.fields.media_property_id.value = product.get("media_property_id");
    productForm.fields.image_url.value = product.get("image_url")

    productForm.fields.tags.value = selectedTags;

    res.render("products/update", {
        "form": productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
        "product": product.toJSON()
    })
})

router.post("/update/:productId",checkIfAuthenticated, async (req, res) => {
    const product = await dataLayer.findProductViaId(req.params.productId);

    const allMediaProperties = await dataLayer.getAllMediaProperties();
    const allTags = await dataLayer.getAllTags();

    const productForm = createProductForm(allMediaProperties, allTags);

    productForm.handle(req, {
        "success": async (form) => {
            let {tags, ...productData} = form.data
            product.set(productData);
            product.save();

            let tagsId = tags.split(",");
            let currentTagsId = await product.related("tags").pluck("id");

            await product.tags().detach(currentTagsId),
            await product.tags().attach(tagsId)

            req.flash("success_messages", 
            `Poster "${form.data.title}" has been edited`)

            res.redirect("/products")
        },
        "error": async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
                'product': product.toJSON()
            })
        }
    })
})



//Delete a post.gitpod.io/api/products/delete/33
router.get("/delete/:productId",checkIfAuthenticated, async (req,res)=>{
    const product = await dataLayer.findProductViaId(req.params.productId)
    console.log("get deee")
    res.render("products/delete",{
        "product":product.toJSON()
    })    
})

router.post("/delete/:productId", async (req,res)=>{
    const product = await dataLayer.findProductViaId(req.params.productId)
    
    req.flash("success_messages", 
    `Poster has been deleted`)

    await product.destroy();
    res.redirect("/products")
})

module.exports = router;