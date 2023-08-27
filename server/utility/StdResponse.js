class StdResponse{
    result;
    origin;
    body;
    constructor(result, origin, body) {
        this.result = result;
        this.origin = origin;
        this.body = body;
    }
}

module.exports = StdResponse;