import winston from "winston"; // Ghi log tổng quát cho ứng dụng / có tính flex Cao, tùy chỉnh được nhiều / Log lỗi, sự kiện, trạng thái

// error, warn, info
const logger = winston.createLogger({
  level: "debug",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    // new winston.transports.File({ filename: "warn.log", level: "warn" }),
    // new winston.transports.File({ filename: "combined.log" }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;