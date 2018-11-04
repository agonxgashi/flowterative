const express   = require('express');
const router    = express.Router();
const ReturnObj = require('./../../models/return-object.model');
const TaskRepo  = require('./../../db/Task/task.repo');

// • Save a new task
router.post('/add-new', (req, res) => {
    const _task = new TaskRepo(req.body);

    _task.save(err => {
        if (err) return res.status(500).send(err);
        res.status(200).send(new ReturnObj(true, "MSG_TASK_SAVED", 200, _task));
    });
})

// • Get all tasks of a board
router.get('/:boardId', (req, res) => {
    const boardId = req.params.projectId;
    TaskRepo.find({'projectId': boardId}, (err, tasks) => {
        if(err) res.send(new ReturnObj(false, "ERR_LISTS_LOADED", 200, null));

        res.status(200).send(new ReturnObj(true, "MSG_LISTS_FOUNDED", 200, tasks));
    })
})

// • Move a task on new list by updating listId
router.get('/move/:taskId/:newListId', (req, res) => {
    const taskId    = req.params.taskId;
    const newListId = req.params.newListId;
    TaskRepo.update({ _id: taskId }, { $set: { ListId: newListId } }, (err) => {
        if (err) {
            if(err) res.send(new ReturnObj(false, "TASK_NOT_MOVED", 200, null));
        }
        res.send(new ReturnObj(true, "TASK_MOVED", 200, null));
    })
})

// • Get task details
router.get('/details/:taskId', function(req, res) {
    const taskId = req.params.taskId;
    
    TaskRepo.findById(taskId)
    .populate("Comments.CreatedBy", "Username  -_id")
    .populate("Members", "Username Name Surname")
    .exec((err, task) => {
        if (err) {
            res.send(new ReturnObj(false, "TASK_NOT_FOUND", 200, null));
        }
        else {
            res.send(new ReturnObj(true, "TASK_FOUNDED", 200, task));
        }
    });
})

// • Add a comment on task
router.post('/comment/:taskId', function(req, res) {
    const taskId  = req.params.taskId;
    const comment = req.body;
    TaskRepo.findByIdAndUpdate(
        { "_id" : taskId },
        { $push:  { "Comments" : comment }},
        { new: true},
        (err, result) => {
            if (err) { res.send(new ReturnObj(false, "COMMENT_NOT_ADDED", 200, null)) }
            else {
                res.send(new ReturnObj(true, "COMMENT_ADDED", 200, null));
            }
        }
    )
})

// • Add a step on task
router.post('/add-step/:taskId', function(req, res) {
    const taskId  = req.params.taskId;
    const step = req.body;
    TaskRepo.findByIdAndUpdate(
        { "_id" : taskId },
        { $push:  { "Steps" : step }},
        { new: true},
        (err, result) => {
            if (err) { res.send(new ReturnObj(false, "STEP_NOT_ADDED", 200, null)) }
            else {
                res.send(new ReturnObj(true, "STEP_ADDED", 200, result.Steps));
            }
        }
    )
})


// • Add a member on task
router.get('/add-member/:memberId/:taskId', function(req, res) {
    const memberId  = req.params.memberId;
    const taskId  = req.params.taskId;
    TaskRepo.findByIdAndUpdate(
        { "_id" : taskId },
        { $addToSet: { "Members": memberId} },
        { new: true},
        (err, result) => {
            if (err) { res.send(new ReturnObj(false, "MEMBER_NOT_ADDED", 200, null)) }
        }
    )
    .populate('Members', 'Name Surname Email Username')
    .exec((err, m) => {
        console.log(m)
        res.send(new ReturnObj(true, "MEMBER_ADDED", 200, m));
    })
})

// • Remove a member from task
router.get('/remove-member/:memberId/:taskId', function(req, res) {
    const memberId  = req.params.memberId;
    const taskId  = req.params.taskId;
    TaskRepo.findByIdAndUpdate(
        { "_id" : taskId },
        { $pull: { "Members": memberId} },
        { new: true},
        (err, result) => {
            if (err) { res.send(new ReturnObj(false, "MEMBER_NOT_REMOVED", 200, null)) }
        }
    )
    .populate('Members', 'Name Surname Email Username')
    .exec((err, m) => {
        console.log(m)
        res.send(new ReturnObj(true, "MEMBER_REMOVED", 200, m));
    })
})

module.exports = router;
