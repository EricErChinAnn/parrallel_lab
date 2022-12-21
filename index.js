const express = require("express");
const hbs = require("hbs");
const waxon = require("wax-on");
require("dotenv").config();

const session = require("express-session");
const flash = require("connect-flash");
const FileStore = require("session-file-store")(session);

const csrf = require("csurf")

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

app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized:true
}))

app.use(flash());
// app.use(csrf());
const csurfInstance = csrf();
app.use(function(req,res,next){
//   console.log("checking for csrf exclusion")
  // exclude whatever url we want from CSRF protection
  if (req.url === "/checkout/process_payment" ||
  req.url.slice(0,5)=="/api/") {
    return next();
  }
  csurfInstance(req,res,next);
})



//Global MiddleWare

app.use((req,res,next)=>{
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    res.locals.missing_messages = req.flash("missing_messages");
    next();
})

app.use((req,res,next)=>{
    res.locals.user = req.session.user;
    next();
})

app.use((req,res,next)=>{
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    
    next();
})

app.use((err,req,res,next)=>{
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
})


const landingRoutes = require("./routes/landing/landing");
const productsRoutes = require("./routes/products/products")
const userRoutes = require("./routes/users/users")
const cloudinaryRoutes = require("./routes/cloudinary/cloudinary")
const cartRoutes = require("./routes/shoppingCart/shoppingCart")
const checkoutRoutes = require('./routes/checkout/checkout')

const api = {
    products : require("./routes/api/products"),
    users : require("./routes/api/users")
}

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
app.use("/users",userRoutes);
app.use("/cloudinary", cloudinaryRoutes);
app.use("/cart", cartRoutes)
app.use('/checkout', checkoutRoutes);


app.use("/api/products", express.json() , api.products);
app.use("/api/users", express.json() , api.users);




}

main()

app.listen(3000,()=>{
    console.log("Server is live")
})