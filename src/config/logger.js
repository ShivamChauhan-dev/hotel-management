import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  level: 'info',
    format: logFormat,
  transports: [
    new winston.transports.File({
        filename: path.join(
            dirname(fileURLToPath(import.meta.url)),
            '../logs/error.log'
        ),
        level: 'error',
    })
    ,
    new winston.transports.File({
      filename: path.join(
        dirname(fileURLToPath(import.meta.url)),
        "../logs/combined.log"
      ),
    }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;