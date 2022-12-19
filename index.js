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
    secret: "keyboard cat",
    resave: false,
    saveUninitialized:true
}))

app.use(flash())
app.use(csrf());



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
    res.locals.csrfToken = req.csrfToken();
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

}

main()

app.listen(3000,()=>{
    console.log("Server is live")
})