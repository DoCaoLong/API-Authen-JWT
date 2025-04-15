import axios from 'axios';

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  const secret = process.env.RECAPTCHA_SECRET;
  const res = await axios.post(
    'https://www.google.com/recaptcha/api/siteverify',
    `secret=${secret}&response=${token}`,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return res.data.success;
};
