const express = require('express')
const router = express.Router()

const ReturnObj = require('./../../models/return-object.model')
const Board = require('./../../db/Boards/board.repo')
const List = require('./../../db/Boards/list.repo')
const User = require('./../../db/Auth/auth.repo')
const mongoose = require('mongoose')

// • Declaring POST method to save a board on Db
router.post('/', function (req, res) {
  const _board = new Board(req.body)
  _board.save(err => {
    if (err) return res.status(500).send(err)
    return Board.find({
      // Created by or is a member
      $or: [{ 'CreatedBy': _board.CreatedBy }, { 'Members': _board.CreatedBy }] },
    function (err, allBoards) {
      if (err) { res.status(500).send(new ReturnObj(false, 'ERR_SOMETHING_WENT_WRONG', 500, null)) }
      res.status(200).send(new ReturnObj(true, 'MSG_BOARD_SAVED', 200, allBoards))
    })
  })
})

// • Declaring POST method to get boards from Db
router.get('/:user', function (req, res) {
  const userId = req.params.user
  Board.find({
    // Created by or is a member
    $or: [{ 'CreatedBy': userId }, { 'Members': userId }] },
  function (err, allBoards) {
    if (err) { res.status(500).send(new ReturnObj(false, 'ERR_SOMETHING_WENT_WRONG', 500, null)) }
    res.status(200).send(new ReturnObj(true, 'MSG_BOARDS_FOUNDED', 200, allBoards))
  }).select({
    Admins: 1,
    Members: 1,
    Color: 1,
    Name: 1
  })
})

router.post('/update/:boardId', (req, res) => {
  const _bId = req.params.boardId
  const _name = req.body.Name
  const _desc = req.body.Description

  Board.findByIdAndUpdate(_bId, { Name: _name, Description: _desc }, { new: true },
    (err, result) => {
      if (err) {
        res.status(500).send(new ReturnObj(false, 'MSG_BOARD_NOT_UPDATED', 500, null))
      } else {
        res.send(new ReturnObj(true, 'MSG_BOARD_UPDATED', 200, result))
      }
    }
  )
})

// • Get a project with all its details
router.get('/find/:id', function (req, res) {
  const boardId = req.params.id
  Board.aggregate([
    { $match: { '_id': mongoose.Types.ObjectId(boardId) } },
    {
      // Get backlog tasks
      $lookup: {
        'from': 'tasks',
        'localField': 'Backlog._id',
        'foreignField': 'ListId',
        'as': 'Backlog.Tasks'
      }
    },
    { $unwind: { 'path': '$Lists', preserveNullAndEmptyArrays: true } },
    {
      // Populate each list with it's tasks
      '$lookup': {
        'from': 'tasks',
        'localField': 'Lists._id',
        'foreignField': 'ListId',
        'as': 'Lists.Tasks'
      }
    },
    {
      // Get needed fields by performing a group command
      $group: {
        '_id': '$_id',
        Name: { '$first': '$Name' },
        Description: { '$first': '$Description' },
        Backlog: { '$first': '$Backlog' },
        Color: { '$first': '$Color' },
        CreateDate: { '$first': '$CreateDate' },
        Backlog: { '$first': '$Backlog' },
        Members: { '$first': '$Members' },
        Lists: { $push: '$Lists' }

      }
    },
    { '$limit': 1 }
  ])
    .exec(function (err, board) {
      if ((err) || !board) {
        res.send(res.status(500).send(new ReturnObj(false, 'ERR_SOMETHING_WENT_WRONG', 500, null)))
      } else {
        Board.populate(board, { path: 'Members' }, function (err, p_boards) {
          console.log(p_boards[0].Lists)
          res.json(new ReturnObj(true, 'MSG_BOARD_FOUND', 200, p_boards[0]))
        })
      }
    })
})

// • Add a list on board
router.post('/add-list', function (req, res) {
  const _listName = req.body.Name
  const _boardId = req.body.BoardId
  const _wip = req.body.Wip

  Board.update(
    { _id: _boardId },
    { $push: { Lists: new List({ Name: _listName, OrderNo: 0, Wip: _wip }) } },
    function (err) {
      if (err) res.send(new ReturnObj(false, 'ERR_LIST_NOT_ADDED', 200, null))
      else res.send(new ReturnObj(true, 'MSG_LIST_ADDED', 200, null))
    }
  )
})

// • Add member on board
router.post('/add-new-member', function (req, res) {
  const _username = req.body.Username
  const _boardId = req.body.BoardId
  User.findOne({ Username: _username }, (err, user) => {
    if (err || !user) {
      // If given username is not registred as a user
      res.send(new ReturnObj(false, 'ERR_USER_DOESNT_EXIST', 200, null))
    } else {
      Board.findByIdAndUpdate({ _id: _boardId },
        { $addToSet: { 'Members': user._id } },
        { new: true },
        (err, result) => {
          if (err) res.send(new ReturnObj(false, 'ERR_MEMBER_NOT_ADDED', 200, null))
        })
        .populate('Members', 'Name Surname Email Username')
        .exec((err, b) => {
          res.send(new ReturnObj(true, 'MSG_USER_ADDED_ON_BOARD', 200, b.Members))
        })
    }
  })
})

// • Remove user from board
router.get('/remove-member/:memberId/:boardId', function (req, res) {
  const _boardId = req.params.boardId
  const _memberId = req.params.memberId
  Board.findByIdAndUpdate({ _id: _boardId },
    { $pull: { 'Members': _memberId } },
    { new: true },
    (err, result) => {
      if (err) res.send(new ReturnObj(false, 'ERR_MEMBER_NOT_REMOVED', 200, null))
    })
    .populate('Members', 'Name Surname Email Username')
    .exec((err, b) => {
      res.send(new ReturnObj(true, 'MSG_USER_ADDED_ON_BOARD', 200, b.Members))
    })
})

// • Get all members of a board
router.get('/all-members/:boardId', function (req, res) {
  const _boardId = req.params.boardId
  Board.findById(_boardId)
    .populate('Members', 'Username Name Surname')
    .select('Members -_id')
    .exec(function (err, members) {
      if (err) {
        res.status(500).send(new ReturnObj(false, 'ERR_SOMETHING_WENT_WRONG', 500, null))
      } else {
        res.send(new ReturnObj(true, 'MSG_MEMBERS_RETURNED', 200, members))
      }
    })
})

module.exports = router
