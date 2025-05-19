// Data Transfer Object (DTO)

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
}

export interface LoginDTO {
    email: string;
    password: string;
}
export interface loginWithCaptchaDTO {
    email: string;
    password: string;
    captchaToken: string;
}
export interface RefreshDTO {
    refreshToken: string;
    userId: string;
}
export interface LogoutDTO {
    refreshToken: string;
    userId: string;
}
export interface ForgotPasswordDTO {
    email: string;
}
export interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}
