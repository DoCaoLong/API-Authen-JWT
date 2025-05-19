export const tryParseJson = (str: any) => {
    try {
        return JSON.parse(str);
    } catch (error) {
        return {};
    }
};
export const isValidJson = (str: any) => {
    try {
        JSON.parse(str);
        return true;
    } catch (error) {
        return false;
    }
};
export const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
export const isValidPhoneNumber = (phone: string) => {
    const regex = /^\+?[1-9]\d{1,14}$/;
    return regex.test(phone);
};
export const isValidUrl = (url: string) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(url);
};
export const isValidDate = (date: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(date);
};
export const isValidObjectId = (id: string) => {
    const regex = /^[a-fA-F0-9]{24}$/;
    return regex.test(id);
};
export const isValidPassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
};
export const isValidUsername = (username: string) => {
    const regex = /^[a-zA-Z0-9_]{3,16}$/;
    return regex.test(username);
};
export const isValidName = (name: string) => {
    const regex = /^[a-zA-Z\s]{2,30}$/;
    return regex.test(name);
};

export const isValidAge = (age: number) => {
    return age >= 0 && age <= 120;
};

export const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
};
