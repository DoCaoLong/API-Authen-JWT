import Joi from "joi";

interface ValidationResult {
    valid: boolean;
    error?: Joi.ValidationError;
    message?: string;
}

export const validateEmail = (email: string): ValidationResult => {
    const schema = Joi.string().email().required().messages({
        "string.email": "Email không hợp lệ",
        "any.required": "Email là bắt buộc",
        "string.empty": "Email không được để trống",
    });

    const { error } = schema.validate(email, { abortEarly: false });

    if (!error) return { valid: true };

    const message = error.details.map((detail) => detail.message).join("; ");

    return {
        valid: false,
        error,
        message,
    };
};

export const validatePassword = (password: string): ValidationResult => {
    const schema = Joi.string()
        .min(8)
        .message("Tối thiểu 8 ký tự")
        .max(32)
        .message("Tối đa 32 ký tự")
        .pattern(/[a-zA-Z]/)
        .message("Phải chứa ít nhất 1 chữ cái")
        .pattern(/[0-9]/)
        .message("Phải chứa ít nhất 1 số")
        .pattern(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"'<>,.?~`-]+$/)
        .message("Chỉ cho phép ký tự hợp lệ")
        .pattern(/^(?!.*\s).*$/)
        .message("Không chứa khoảng trắng")
        .required()
        .messages({
            "any.required": "Mật khẩu là bắt buộc",
            "string.empty": "Mật khẩu không được để trống",
        });

    const { error } = schema.validate(password, { abortEarly: false });

    if (!error) return { valid: true };

    const message = error.details.map((detail) => detail.message).join("; ");

    return {
        valid: false,
        error,
        message,
    };
};
