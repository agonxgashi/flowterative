
function ReturnObj(_success, _msg, _status, _data) {
    this.success = _success;
    this.message = _msg;
    this.status  = _status;
    this.data    = _data
}

module.exports = ReturnObj;