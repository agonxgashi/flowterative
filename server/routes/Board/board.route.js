const express   = require('express');
const router    = express.Router();

const ReturnObj = require('./../../models/return-object.model');
const Board     = require('./../../db/Boards/board.repo');
const List     = require('./../../db/Boards/list.repo');


// • Declaring POST method to get boards from Db
router.get('/', function(req, res) {
    Board.find(function (err, allBoards) {
        if (err)
            res.status(500).send(new ReturnObj(false, "ERR_SOMETHING_WENT_WRONG", 500, null));
        res.status(200).send(new ReturnObj(true, "MSG_BOARDS_FOUNDED", 200, allBoards));
    });
});

router.get('/find/:id', function(req, res) {
    console.log('Board', req.params.id, 'requested!')
    const boardId = req.params.id;
    Board.findById({ _id: boardId}, function(err, board) {
        if (err)
            res.send(err);

        res.json(new ReturnObj(true, "MSG_BOARD_FOUND", 200, board)); 
    });
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