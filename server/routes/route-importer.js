const router        = require('express').Router()
const jwtMiddleware = require('./../services/auth/jwt.middleware');
const auth_route    = require('./Auth/auth.route')
const blog_route    = require('./Blog/blog.route')
const boards_route  = require('./Board/board.route')
const task_route    = require('./Tasks/task.route')
const ReturnObj     = require('./../models/return-object.model');

// Allow anonymous
router.use('/auth', auth_route);

// Protected routes
router.use(jwtMiddleware);
router.use('/blog', blog_route);
router.use('/boards', boards_route);
router.use('/task', task_route);


// API 404
router.use('/*', (req, res) => {
    res.send(new ReturnObj(false, "API_ROUTE_NOT_FOUNT", 404, null));
});

module.exports = router;