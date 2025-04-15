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
export const isValidZipCode = (zip: string) => {
    const regex = /^\d{5}(-\d{4})?$/;
    return regex.test(zip);
};
export const isValidCreditCard = (card: string) => {
    const regex =
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9]{2})[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|7[0-9]{15})$/;
    return regex.test(card);
};
export const isValidIpAddress = (ip: string) => {
    const regex =
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(ip);
};
export const isValidHexColor = (color: string) => {
    const regex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
    return regex.test(color);
};
export const isValidBase64 = (str: string) => {
    const regex = /^(data:image\/[a-zA-Z]+;base64,)?([A-Za-z0-9+/=]+)$/;
    return regex.test(str);
};
export const isValidLatitude = (lat: number) => {
    return lat >= -90 && lat <= 90;
};
export const isValidLongitude = (lon: number) => {
    return lon >= -180 && lon <= 180;
};
export const isEmpty = (obj: any) => {
    return Object.keys(obj).length === 0;
};
