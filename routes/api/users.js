const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const {User} = require("../../model/index")
const { checkIfAuthenticatedJWT } = require("../../middlewares/index")



const generateAccessToken = (user,token,expired) => {
    return jwt.sign({
        'username': user.get('username'),
        'id': user.get('id'),
        'email': user.get('email')
    }, token , {
        expiresIn: expired
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}




router.post('/login', async (req, res) => {
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)) {

        let accessToken = generateAccessToken(user,process.env.TOKEN_SECRET,"1h");

        res.send({accessToken})

    } else {
        res.send({'error':'Invalid Login'})
    }
})



router.get('/profile', checkIfAuthenticatedJWT , async(req,res)=>{
    const user = req.user;
    res.send(user);
})











module.exports = router;
