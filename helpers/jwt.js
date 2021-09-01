const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;

    return expressJwt({
        // passes in secret to create token and checks
        secret,
        algorithms: ['HS256'] 
    })
}

module.exports = authJwt;