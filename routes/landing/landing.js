const express = require("express");
const router = express.Router();


router.get("/",(req,res)=>{
    res.render("./landing/landing.hbs");
})

router.get("/about",(req,res)=>{
    res.render("./landing/about.hbs")
})

router.get("/contact",(req,res)=>{
    res.render("./landing/contact.hbs")
})

module.exports = router;