const express   = require('express');
const router    = express.Router();
const ReturnObj = require('./../../models/return-object.model');
const TaskRepo     = require('./../../db/Task/task.repo');

router.post('/add-new', (req, res) => {
    console.log(req.body);
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
    const taskId = req.params.taskId;
    const newListId = req.params.newListId;
    console.log(req.params);
    TaskRepo.update({ _id: taskId }, { $set: { ListId: newListId } }, (err) => {
        if (err) {
            if(err) res.send(new ReturnObj(false, "TASK_NOT_MOVED", 200, null));
        }
        res.send(new ReturnObj(true, "TASK_MOVED", 200, null));
    })
})

module.exports = router;