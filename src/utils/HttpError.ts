import { StatusCodes } from "http-status-codes";

export class HttpError extends Error {
    statusCode: number;
    errorCode: string;
    cause?: Error;

    constructor(
        message: string,
        statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
        errorCode: string = "ERR_INTERNAL_SERVER",
        cause?: Error
    ) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.cause = cause;

        // Bảo toàn stack trace nếu có
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    // Chuyển lỗi thành đối tượng JSON để dễ phản hồi
    toJSON() {
        return {
            status: "error",
            code: this.statusCode,
            message: this.message,
            errorCode: this.errorCode,
            cause: this.cause ? this.cause.message : undefined,
        };
    }
}

// export class HttpError extends Error {
//   statusCode: number;
//   constructor(message: string, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }
