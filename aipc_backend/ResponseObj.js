class ResponseObj {
    constructor(success, message, data) {
        this.Success = success;
        this.Message = message;
        this.Data = data;
    }

    static success(message, data) {
        return new ResponseObj(1, message, data);
    }

    static fail(message) {
        return new ResponseObj(0, message, null);
    }
}

global.ResponseObj = ResponseObj;