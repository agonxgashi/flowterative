const express   = require('express');
const router    = express.Router();
const ReturnObj = require('./../../models/return-object.model');
const TaskRepo  = require('./../../db/Task/task.repo');

router.post('/add-new', (req, res) => {
    const _task = new TaskRepo(req.body);

    _task.save(err => {
        if (err) return res.status(500).send(err);
        res.status(200).send(new ReturnObj(true, "MSG_TASK_SAVED", 200, _task));
    });
})

router.get('/:boardId', (req, res) => {
    const boardId = req.params.projectId;
    TaskRepo.find({'projectId': boardId}, (err, tasks) => {
        if(err) res.send(new ReturnObj(false, "ERR_TASKS_NOT_LOADED", 200, null));

        res.status(200).send(new ReturnObj(true, "MSG_LISTS_FOUNDED", 200, tasks));
    })
})

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

router.get('/add-member/:memberId/:taskId', function(req, res) {
    const memberId  = req.params.memberId;
    const taskId  = req.params.taskId;
    TaskRepo.findByIdAndUpdate(
        { "_id" : taskId },
        { $push:  { "Members" : memberId }},
        { new: true},
        (err, result) => {
            if (err) { res.send(new ReturnObj(false, "STEP_NOT_ADDED", 200, null)) }
            else {
                res.send(new ReturnObj(true, "STEP_ADDED", 200, result.Members));
            }
        }
    )
})

module.exports = router;