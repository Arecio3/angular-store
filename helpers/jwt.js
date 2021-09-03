const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.secret;
    const api = process.env.API_URL;

    return expressJwt({
        // passes in secret to create token and checks
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        // Excluding API paths from HAVING to being authenticated 
        path: [
            // targets anything after products (regex)
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`
        ]
    })
}

async function isRevoked(req, payload, done) {
    if(!payload.isAdmin) {
        // reject if user is not admin 
        done(null, true)
    }

    done();
}

module.exports = authJwt;