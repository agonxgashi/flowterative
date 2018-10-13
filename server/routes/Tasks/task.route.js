const express   = require('express');
const router    = express.Router();
const ReturnObj = require('./../../models/return-object.model');

const Task     = require('./../../db/Task/task.repo');

router.post('/', (req, res) => {
    console.log(req.body);
    const _task = new Task(req.body);

    _task.save(err => {
        if (err) return res.status(500).send(err);
        res.status(200).send(new ReturnObj(true, "MSG_TASK_SAVED", 200, _task));
    });
})

router.get('/:boardId', (req, res) => {
    const boardId = req.params.projectId;
    Task.find({'projectId': boardId}, (err, tasks) => {
        if(err) res.send(new ReturnObj(false, "ERR_TASKS_NOT_LOADED", 200, null));

        res.status(200).send(new ReturnObj(true, "MSG_LISTS_FOUNDED", 200, tasks));
    })
})

module.exports = router;