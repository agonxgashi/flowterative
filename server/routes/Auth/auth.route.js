const AppUser = require('./../../db/Auth/auth.repo');
const server_config = require('./../../config/serverConfig.json')
const ReturnObj = require('./../../models/return-object.model')
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/register', function (req, res) {
    const _appUser = new AppUser(req.body);
    _appUser.save(err => {
        if (err) return res.status(500).send(err);
        return AppUser.find(function (err, user) {
            if (err)
                res.status(500).send(new ReturnObj(false, "ERR_SOMETHING_WENT_WRONG", 500, null));
            res.status(200).send(new ReturnObj(true, "MSG_SUCCESS_REGISTER", 200, user));
        });
    });
});

router.post('/login', function (req, res) {
    const _username = req.body.Username;
    const _password = req.body.Password;

    AppUser.findOne({
        Username: _username
    }, function (err, user) {
        if (err) throw err;
        if (user) {
            // test a matching password
            user.comparePassword(_password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    var payload = {
                        _id: user._id,
                        Username: _username
                    }
                    var token = jwt.sign(payload, server_config.jwt.secret, {
                        expiresIn: server_config.jwt.expireTime
                    });
                    res.status(200).send(new ReturnObj(true, "MSG_SUCCESS_LOGIN", 200, token));
                } else {
                    res.status(200).send(new ReturnObj(false, "ERR_INVALID_CREDENTIALS", 401, null));
                }
            });
        } else {
            res.status(200).send(new ReturnObj(false, "ERR_INVALID_CREDENTIALS", 401, null));
        }
    })
});

module.exports = router;