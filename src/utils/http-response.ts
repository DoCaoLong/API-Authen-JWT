import { StatusCodes } from "http-status-codes";

type ResponseData<T = any> = {
    status: "success" | "error";
    code: number;
    message: string;
    data?: T;
    error_code?: string;
    errors?: any;
};

export class HttpResponse {
    // Success responses
    static success<T>(
        data: T,
        message = "Thao tác thành công."
    ): ResponseData<T> {
        return { status: "success", code: StatusCodes.OK, message, data };
    }

    static created<T>(
        data: T,
        message = "Dữ liệu đã được tạo thành công."
    ): ResponseData<T> {
        return { status: "success", code: StatusCodes.CREATED, message, data };
    }

    static noContent(message = "Không có dữ liệu."): ResponseData {
        return { status: "success", code: StatusCodes.NO_CONTENT, message };
    }

    // Error responses
    private static errorResponse(
        code: number,
        message: string,
        errorCode: string,
        errors?: any
    ): ResponseData {
        return {
            status: "error",
            code,
            message,
            error_code: errorCode,
            errors,
        };
    }

    static badRequest(
        errors: any,
        message = "Dữ liệu không hợp lệ."
    ): ResponseData {
        return this.errorResponse(
            StatusCodes.BAD_REQUEST,
            message,
            "ERR_BAD_REQUEST",
            errors
        );
    }

    static unauthorized(
        message = "Truy cập không hợp lệ.",
        errorCode = "ERR_UNAUTHORIZED_ACCESS"
    ): ResponseData {
        return this.errorResponse(
            StatusCodes.UNAUTHORIZED,
            message,
            errorCode
        );
    }

    static forbidden(message = "Không có quyền truy cập."): ResponseData {
        return this.errorResponse(
            StatusCodes.FORBIDDEN,
            message,
            "ERR_FORBIDDEN"
        );
    }

    static notFound(message = "Không tìm thấy dữ liệu."): ResponseData {
        return this.errorResponse(
            StatusCodes.NOT_FOUND,
            message,
            "ERR_NOT_FOUND"
        );
    }

    static conflict(message = "Dữ liệu đã tồn tại."): ResponseData {
        return this.errorResponse(
            StatusCodes.CONFLICT,
            message,
            "ERR_CONFLICT"
        );
    }

    static tooManyRequests(
        message = "Quá nhiều yêu cầu. Thử lại sau."
    ): ResponseData {
        return this.errorResponse(
            StatusCodes.TOO_MANY_REQUESTS,
            message,
            "ERR_TOO_MANY_REQUESTS"
        );
    }

    static internalServerError(message = "Lỗi máy chủ."): ResponseData {
        return this.errorResponse(
            StatusCodes.INTERNAL_SERVER_ERROR,
            message,
            "ERR_INTERNAL_SERVER"
        );
    }

    static serviceUnavailable(
        message = "Dịch vụ tạm thời không khả dụng."
    ): ResponseData {
        return this.errorResponse(
            StatusCodes.SERVICE_UNAVAILABLE,
            message,
            "ERR_SERVICE_UNAVAILABLE"
        );
    }



    // Two-Factor Authentication responses
    static twoFactorRequired(
        message = "Yêu cầu xác minh hai yếu tố."
    ): ResponseData {
        return this.errorResponse(
            StatusCodes.UNAUTHORIZED,
            message,
            "ERR_TWO_FACTOR_REQUIRED"
        );
    }

    static twoFactorEnabled(
        message = "Xác thực hai yếu tố đã được bật."
    ): ResponseData {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
            error_code: "ERR_TWO_FACTOR_ENABLED",
        };
    }

    static twoFactorDisabled(
        message = "Xác thực hai yếu tố đã được tắt."
    ): ResponseData {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
            error_code: "ERR_TWO_FACTOR_DISABLED",
        };
    }
}
