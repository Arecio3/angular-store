const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;

    return expressJwt({
        // passes in secret to create token and checks
        secret,
        algorithms: ['HS256'] 
    }).unless({
        // Excluding API from being authenticated 
        path: [
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
}

module.exports = authJwt;