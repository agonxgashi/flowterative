const jwt          = require('jsonwebtoken');
const apiRoutes    = require('express').Router();
const serverConfig = require('./../../config/serverConfig.json');
const ReturnObj    = require('./../../models/return-object.model')

apiRoutes.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers['authorization'] || req.headers['x-access-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp date
        jwt.verify(token, serverConfig.jwt.secret, function (err, decoded) {
            if (err) {
                return res.status(401).send(new ReturnObj(false, "ERR_NOT_AUTHORIZED", 401, err));
            } else {
                // if everything is OK, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token return 401 error
        return res.status(401).send(new ReturnObj(false, "ERR_NO_TOKEN_PROVIDED", 401, null));
    }
});

module.exports = apiRoutes;