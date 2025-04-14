# JWT Authentication API (Node.js + TypeScript)

## 🔐 Features

- Register new users
- Login and receive Access + Refresh Token
- Refresh expired access token
- Logout current device
- Logout from all devices
- Forgot and Reset password via email (Gmail SMTP)

---

## 📁 Project Structure

- Controller → Service → Repository pattern
- MongoDB with Mongoose
- Email via nodemailer (Gmail)

---

## 🧪 Tech Stack

- Node.js, Express
- TypeScript
- MongoDB (via Mongoose)
- JWT
- Nodemailer
- ts-node-dev for dev

---

## ⚙️ Setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/jwt-auth-ts.git
cd jwt-auth-ts
npm install
```

### 2. Configure `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/authdb
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
SMTP_USER=your_gmail@gmail.com
SMTP_PASSWORD=your_gmail_app_password
CLIENT_URL=http://localhost:3000
```

💡 Tạo App Password trong [Google Account Security](https://myaccount.google.com/security) nếu bật 2FA.

---

### 3. Run server

```bash
npm run dev
```

Server runs on: `http://localhost:5000`

---

## 📬 API Endpoints

| Method | Endpoint                 | Auth Required | Description                  |
|--------|--------------------------|----------------|------------------------------|
| POST   | `/api/auth/register`     | ❌             | Register user                |
| POST   | `/api/auth/login`        | ❌             | Login & receive tokens       |
| POST   | `/api/auth/refresh`      | ❌             | Get new access token         |
| POST   | `/api/auth/logout`       | ❌             | Logout current device        |
| POST   | `/api/auth/logout-all`   | ✅             | Logout all sessions          |
| POST   | `/api/auth/forgot-password` | ❌           | Send reset link via email    |
| POST   | `/api/auth/reset-password`  | ❌           | Reset password using token   |

---

## 🧪 Postman Collection

1. Import the included file: `postman_collection.json`
2. Set `{{BASE_URL}} = http://localhost:5000`
3. Update `{{accessToken}}` in auth header after login for protected routes