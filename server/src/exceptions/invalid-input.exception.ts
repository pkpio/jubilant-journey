import HttpException from "./http.exception";

class InvalidInputException extends HttpException {
    constructor(message: string) {
        super(400, message);
    }
}

export default InvalidInputException;