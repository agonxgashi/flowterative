const express   = require('express');
const router    = express.Router();

const ReturnObj = require('./../../models/return-object.model');
const Board     = require('./../../db/Boards/board.repo');
const List     = require('./../../db/Boards/list.repo');
const mongoose = require('mongoose');

// • Declaring POST method to get boards from Db
router.get('/', function(req, res) {
    Board.find(function (err, allBoards) {
        if (err)
            res.status(500).send(new ReturnObj(false, "ERR_SOMETHING_WENT_WRONG", 500, null));
        res.status(200).send(new ReturnObj(true, "MSG_BOARDS_FOUNDED", 200, allBoards));
    }).select({
        Admins: 1,
        Members: 1,
        Color: 1,
        Name: 1,
        Description: 1
    });
});

// router.get('/find/:id', function(req, res) {
//     const boardId = req.params.id;
//     Board.findById({ _id: boardId}, function(err, board) {
//         if (err)
//             res.send(err);

//         res.json(new ReturnObj(true, "MSG_BOARD_FOUND", 200, board)); 
//     });
// });

router.get('/find/:id', function(req, res) {
    const boardId = req.params.id;
    Board.aggregate([
        {$match: {"_id": mongoose.Types.ObjectId(boardId)}},
        {
            "$lookup": {
                "from": "tasks",
                "localField": "Backlog._id",
                "foreignField": "ListId",
                "as": "Backlog.Tasks"
            }
        },
        {
            "$lookup": {
                "from": "tasks",
                "localField": "Lists._id",
                "foreignField": "ListId",
                "as": "listTasks"
            }
        },
        
        { "$limit": 1 }
    ]).exec(function(err, board){
        console.log(board);
        if ((err) || !board)
            res.send(err);
        res.json(new ReturnObj(true, "MSG_BOARD_FOUND", 200, board[0])); 
     })
});

// • Declaring POST method to save a blog on Db
router.post('/', function(req, res) {
    const _board = new Board(req.body);
    _board.save(err => {
        if (err) return res.status(500).send(err);
        return Board.find(function (err, allBoards) {
            if (err)
                res.status(500).send(new ReturnObj(false, "ERR_SOMETHING_WENT_WRONG", 500, null));
            res.status(200).send(new ReturnObj(true, "MSG_BOARD_SAVED", 200, allBoards));
        });
    });
});

router.post('/add-list', function(req, res){
    const _listName = req.body.Name;
    const _boardId  = req.body.BoardId;
    Board.update(
        { _id: _boardId },
        { $push: { Lists: new List({Name: _listName, OrderNo: 0}) } },
        function(err){
            if(err) res.send(new ReturnObj(false, "ERR_LIST_NOT_ADDED", 200, null));
            else res.send(new ReturnObj(true, "MSG_LIST_ADDED", 200, null));
        }
    );
})

module.exports = router;