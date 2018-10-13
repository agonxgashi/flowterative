const BlogPost  = require('./../../db/Blog/blog-post');
const ReturnObj = require('./../../models/return-object.model');
const express   = require('express');
const router    = express.Router();

// • Declaring POST method to get blogs from Db
router.get('/', function(req, res) {
    BlogPost.find(function(err, posts) {
        if (err)
            res.send(err);

        res.json(new ReturnObj(true, "MSG_BLOG_LIST", 200, posts));
    });
});

// • Declaring POST method to get a blog from Db by Id
router.get('/:id', function(req, res) {
    const blogId = req.params.id;
    BlogPost.find({ _id: blogId}, function(err, posts) {
        if (err)
            res.send(err);

        res.json(new ReturnObj(true, "MSG_BLOG_FOUND", 200, posts)); 
    });
});

// • Declaring POST method to save a blog on Db
router.post('/', function(req, res) {
    BlogPost.create({
        Title  : req.body.title,
        Content: req.body.content
    }, function(err, examples) {
        if (err)
            res.send(err);

        res.status(200).send(new ReturnObj(true, "MSG_BLOG_POSTED", 200, {}));
    });
});

module.exports = router;