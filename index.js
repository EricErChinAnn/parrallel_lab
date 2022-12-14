const express = require("express");
const hbs = require("hbs");
const waxon = require("wax-on");
require("dotenv").config();

let app = express();

app.set("view engine", "hbs");

app.use(express.static("public"));

waxon.on(hbs.handlebars);
waxon.setLayoutPath("./views/layouts");

app.use(
    express.urlencoded({
        extended:false
    })
);

const landingRoutes = require("./routes/landing/landing");
const productsRoutes = require("./routes/products/products")

async function main(){

// ///Test connection
// app.get("/",(req,res)=>{
//     res.send("Hellow there")
// })

// //test landing connection
// app.get('/',(req,res)=>{
//     res.render("landing/landing")
// });

app.use("/",landingRoutes);

app.use("/products",productsRoutes);

}

main()

app.listen(4000,()=>{
    console.log("Server is live")
})