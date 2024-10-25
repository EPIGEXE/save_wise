import { app } from "electron";
import path from "path";
import winston from "winston";

// 로그 파일 경로 설정
const logDir = app.getPath('userData');
const logFile = path.join(logDir, 'app.log');

// 로거 설정
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: 'electron-app' },
    transports: [
      // 파일에 로그 저장
      new winston.transports.File({ filename: logFile, level: 'info' }),
      // 개발 중 콘솔에 로그 출력
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });

  // 프로덕션 환경에서는 콘솔 로그 비활성화
if (process.env.NODE_ENV === 'production') {
    logger.remove(winston.transports.Console);
  }
  
  export { logger };