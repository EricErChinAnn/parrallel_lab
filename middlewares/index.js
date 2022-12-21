const jwt = require('jsonwebtoken');

const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash("error_messages", "Login required to access this page");
        res.redirect('/users/login');
    }
}



const checkIfAuthenticatedJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
            if (err) {

                return res.sendStatus(403);

            }

            req.user = payload;
            next();
        });
    } else {

        res.sendStatus(401);
        
    }
};




module.exports = {
    checkIfAuthenticated,
    checkIfAuthenticatedJWT
}