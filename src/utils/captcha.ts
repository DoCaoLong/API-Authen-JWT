import axios from "axios";
import { ConfigEnvironment } from "~/config/env";

export const verifyCaptcha = async (token: string): Promise<boolean> => {
    if (!token) {
        console.warn("❌ CAPTCHA token is missing");
        return false;
    }

    const RECAPTCHA_SECRET = ConfigEnvironment.RECAPTCHA_SECRET;

    try {
        const res = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            `secret=${RECAPTCHA_SECRET}&response=${token}`,
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        if (res.data.success) {
            console.log("✅ CAPTCHA verified successfully");
            return true;
        } else {
            console.warn(
                `❌ CAPTCHA verification failed: ${res.data["error-codes"]}`
            );
            return false;
        }
    } catch (error: any) {
        console.error("❌ Error during CAPTCHA verification:", error.message);
        return false;
    }
};
