import { StatusCodes } from "http-status-codes";

export class HttpResponse {
    static paginate<T>(data: T, message = "Lấy dữ liệu thành công.") {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
            data,
        };
    }

    static created<T>(data: T, message = "Dữ liệu đã được tạo thành công.") {
        return {
            status: "success",
            code: StatusCodes.CREATED,
            message,
            data,
        };
    }

    static updated<T>(
        data: T,
        message = "Dữ liệu đã được cập nhật thành công."
    ) {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
            data,
        };
    }

    static deleted(message = "Dữ liệu đã được xóa thành công.") {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
        };
    }

    static error(
        errors: any,
        message = "Dữ liệu không hợp lệ.",
        code = StatusCodes.BAD_REQUEST
    ) {
        return {
            status: "error",
            code,
            message,
            error_code: "ERR_BAD_REQUEST",
            errors,
        };
    }

    static noContent(message = "Không có dữ liệu.") {
        return {
            status: "success",
            code: StatusCodes.NO_CONTENT,
            message,
        };
    }

    static badRequest(errors: any, message = "Dữ liệu không hợp lệ.") {
        return {
            status: "error",
            code: StatusCodes.BAD_REQUEST,
            message,
            error_code: "ERR_BAD_REQUEST",
            errors,
        };
    }

    static unauthorized(message = "Không được phép truy cập.") {
        return {
            status: "error",
            code: StatusCodes.UNAUTHORIZED,
            message,
            error_code: "ERR_UNAUTHORIZED",
        };
    }

    static forbidden(message = "Không có quyền truy cập.") {
        return {
            status: "error",
            code: StatusCodes.FORBIDDEN,
            message,
            error_code: "ERR_FORBIDDEN",
        };
    }

    static notFound(message = "Không tìm thấy dữ liệu.") {
        return {
            status: "error",
            code: StatusCodes.NOT_FOUND,
            message,
            error_code: "ERR_NOT_FOUND",
        };
    }

    static conflict(message = "Dữ liệu đã tồn tại.") {
        return {
            status: "error",
            code: StatusCodes.CONFLICT,
            message,
            error_code: "ERR_CONFLICT",
        };
    }

    static tooManyRequests(
        message = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau."
    ) {
        return {
            status: "error",
            code: StatusCodes.TOO_MANY_REQUESTS,
            message,
            error_code: "ERR_TOO_MANY_REQUESTS",
        };
    }

    static internalServerError(message = "Lỗi máy chủ.") {
        return {
            status: "error",
            code: StatusCodes.INTERNAL_SERVER_ERROR,
            message,
            error_code: "ERR_INTERNAL_SERVER",
        };
    }

    static serviceUnavailable(message = "Dịch vụ tạm thời không khả dụng.") {
        return {
            status: "error",
            code: StatusCodes.SERVICE_UNAVAILABLE,
            message,
            error_code: "ERR_SERVICE_UNAVAILABLE",
        };
    }
    static twoFactorRequired(message = "Invalid OTP") {
        return {
            status: "error",
            code: StatusCodes.UNAUTHORIZED,
            message,
            error_code: "ERR_TWO_FACTOR_REQUIRED",
        };
    }
    static twoFactorEnabled(message = "2FA đã được bật thành công.") {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
            error_code: "ERR_TWO_FACTOR_ENABLED",
        };
    }
    static twoFactorDisabled(message = "2FA đã được tắt thành công.") {
        return {
            status: "success",
            code: StatusCodes.OK,
            message,
            error_code: "ERR_TWO_FACTOR_DISABLED",
        };
    }
}
