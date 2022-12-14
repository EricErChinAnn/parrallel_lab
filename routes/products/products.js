const express = require("express");
const { redirect } = require("express/lib/response");
const async = require("hbs/lib/async");
const router = express.Router();

const { bootstrapField, createProductForm } = require("../../forms")

const { Poster, MediaProperty } = require("../../model/index");


findProductViaId = async (productId) => {
    const product = await Poster.where({
        "id": productId
    }).fetch({
        "require": true
    })

    return product
}

getAllMediaProperties = async () => {
    const mediaProperties = await MediaProperty.fetchAll().map((each)=>{
       return [each.get("id"),each.get("name")]
    })

    return mediaProperties
}


//show all post
router.get("/", async (req, res) => {
    let products = await Poster.collection().fetch({
        withRelated:["media_property_id"]
    });

    res.render("./products/index.hbs", {
        "products": products.toJSON()
    })
})


//Create new post
router.get('/create', async (req, res) => {
    const allMediaProperties = await getAllMediaProperties();
    
    const productForm = createProductForm(allMediaProperties);

    res.render('products/create', {
        "form": productForm.toHTML(bootstrapField)
    })
})

router.post("/create", async (req, res) => {

    const allMediaProperties = await getAllMediaProperties();

    const productForm = createProductForm(allMediaProperties);

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
            await productObject.save();

            res.redirect("/products")
        },
        "empty": async (form) => {
            res.render("products/create.hbs", {
                'form': form.toHTML(bootstrapField)
            })
        },
        "error": async (form) => {
            res.render("products/create.hbs", {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})


//Update a post
router.get("/update/:productId", async (req, res) => {
    const product = await findProductViaId(req.params.productId)

    const allMediaProperties = await getAllMediaProperties();

    const productForm = createProductForm(allMediaProperties);

    var dateObj = product.get("date").toISOString().slice(0,10);


    productForm.fields.title.value = product.get("title");
    productForm.fields.cost.value = product.get("cost");
    productForm.fields.description.value = product.get("description");
    productForm.fields.date.value = dateObj;
    productForm.fields.stock.value = product.get("stock");
    productForm.fields.height.value = product.get("height");
    productForm.fields.width.value = product.get("width");
    productForm.fields.media_property_id.value = product.get("media_property_id");

    res.render("products/update", {
        "form": productForm.toHTML(bootstrapField),
        "product": product.toJSON()
    })
})

router.post("/update/:productId", async (req, res) => {
    const product = await findProductViaId(req.params.productId);

    const allMediaProperties = await getAllMediaProperties();

    const productForm = createProductForm(allMediaProperties);

    productForm.handle(req, {
        "success": async (form) => {
            product.set(form.data);
            product.save();
            res.redirect("/products")
        },
        "error": async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})


//Delete a post
router.get("/delete/:productId", async (req,res)=>{
    const product = await findProductViaId(req.params.productId)
    
    res.render("products/delete",{
        "product":product.toJSON()
    })    
})

router.post("/delete/:productId", async (req,res)=>{
    const product = await findProductViaId(req.params.productId)

    await product.destroy();
    res.redirect("/products")
})

module.exports = router;