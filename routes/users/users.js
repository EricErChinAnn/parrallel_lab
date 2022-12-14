const express = require("express");
const router = express.Router();
const crypto = require("crypto")
const { checkIfAuthenticated } = require("../../middlewares")

const getHashedPassword = (password)=>{
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { User } = require("../../model");

const {createRegistrationForm, bootstrapField, createLoginForm} = require("../../forms");
const async = require("hbs/lib/async");

router.get("/register",(req,res)=>{
    const registerForm = createRegistrationForm();
    res.render("users/register",{
        "form":registerForm.toHTML(bootstrapField)
    })
})

router.post("/register",(req,res)=>{
    const registerForm = createRegistrationForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new User({
                'username': form.data.username,
                'password': getHashedPassword(form.data.password),
                'email': form.data.email
            });
            await user.save();
            req.flash("success_messages", `User successfully created!`);
            res.redirect('/users/login')
        },
        'error': (form) => {
            res.render('users/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})



router.get("/login",(req,res)=>{
    const loginForm = createLoginForm();
    res.render('users/login',{
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post("/login", async (req,res)=>{
    const loginForm = createLoginForm();
    loginForm.handle(req,{
        "success": async(form)=>{
            let user = await User.where({
                "email":form.data.email
            }).fetch({
                require:false
            });
            
            if(!user){
                req.flash("error_messages", "Authentication details are incorrect")
                res.redirect("/users/login")
            } else {
                if(user.get("password") === getHashedPassword(form.data.password)){
                    req.session.user = {
                        id: user.get('id'),
                        username: user.get('username'),
                        email: user.get('email')
                    }
                    req.flash("success_messages", `Welcome back ${user.get("username")}`);
                    res.redirect('/users/profile');
                } else {
                    req.flash("error_messages", "Authentication details are incorrect")
                    res.redirect("/users/login")
                }
            }
        },
        "error":async(form)=>{
            req.flash("error_messages", "Authentication details are incorrect")
            res.render("users/login",{
                "form":form.toHTML(bootstrapField)
            })
        },
        "empty":async(form)=>{
            req.flash("error_messages", "Enter your Authentication details")
            res.render("users/login",{
                "form":form.toHTML(bootstrapField)
            })
        }
    })
})



router.get("/profile", checkIfAuthenticated ,(req,res)=>{
    const user = req.session.user;
    if(!user){
        req.flash('error_messages', 'Permission denied to access page');
        res.redirect('/users/login');
    } else {
        res.render('users/profile',{
            'user': user
        })
    }
})


router.get("/logout",(req,res)=>{
    req.session.user = null;
    req.flash('success_messages', "Successful logout");
    res.redirect('/users/login');
})



module.exports = router;